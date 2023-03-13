import './style.css'

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Pathfinding, PathfindingHelper} from "three-pathfinding";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.y = 10;
camera.position.z = 10;
camera.position.x = 33;

const renderer = new THREE.WebGLRenderer(
    {
        antialias : true,
    }
)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

const orbitControls = new OrbitControls(camera,renderer.domElement);
orbitControls.mouseButtons = {
    MIDDLE: THREE.MOUSE.ROTATE,
    RIGHT: THREE.MOUSE.PAN,
}
orbitControls.enableDamping = true;
orbitControls.enablePan = true;
orbitControls.minDistance = 5;
orbitControls.maxDistance = 60;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControls.minPolarAngle = Math.PI / 4;
orbitControls.update();

const dLight = new THREE.DirectionalLight('white',0.8);
dLight.position.x = 20;
dLight.position.y = 30;
dLight.castShadow = true;
dLight.shadow.mapSize.width = 4096;
dLight.shadow.mapSize.height = 4096;
const d = 35;
dLight.shadow.camera.left = -d;
dLight.shadow.camera.right = d;
dLight.shadow.camera.top = d;
dLight.shadow.camera.bottom = -d;
scene.add(dLight);

const aLight = new THREE.AmbientLight('white',0.5);
scene.add(aLight);

document.body.appendChild(renderer.domElement);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

window.addEventListener('resize',onWindowResize);


const agentHeight = 1.0;
const agentRadius = 0.25;
const agent = new THREE.Mesh(new THREE.CylinderGeometry(agentRadius, agentRadius,agentHeight), new THREE.MeshPhongMaterial({color: 'green'}));
agent.position.y = agentHeight / 2;
const agentGroup = new THREE.Group();
agentGroup.add(agent);
agentGroup.position.z = 0;
agentGroup.position.x = 0;
agentGroup.position.y = 1;
scene.add(agentGroup);




const loader = new GLTFLoader();
loader.load("./public/models/road.glb",(gltf) => {
    scene.add(gltf.scene)
});

const pathfinding = new Pathfinding();
const pathfindingHelper = new PathfindingHelper();
scene.add(pathfindingHelper);
const ZONE = 'level1';
let navmesh;
let groupId;
let navPath;
loader.load("./public/models/road-navmesh.glb",(gltf) => {
    scene.add(gltf.scene);
    //导入的 GLTF 模型进行遍历，查找其中的导航网格对象，然后使用该对象的几何数据创建一个路径规划区域，即一个 Pathfinding 区域。
    gltf.scene.traverse(node => { //对 GLTF 模型场景进行遍历
        if(!navmesh && node.isObject3D && node.children && node.children.length > 0){
            navmesh = node.children[0];
            //使用导航网格对象的几何数据创建一个 Pathfinding 区域，并将其添加到 Pathfinding 中。
            //ZONE 是一个字符串，表示当前区域的名称。
            // 返回一个 Zone 对象，其中包含了该几何体的路径规划数据。然后使用 pathfinding.setZoneData 将该 Zone 对象添加到 Pathfinding 中。
            pathfinding.setZoneData(ZONE,Pathfinding.createZone(navmesh.geometry))
        }
    })
})

const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
window.addEventListener('click',event => {
    //(event.clientX / window.innerWidth) 和 (event.clientY / window.innerHeight) 将窗口坐标系中的坐标归一化为范围在 [0, 1] 内的标准设备坐标系中的坐标。
    // *2 - 1 将标准设备坐标系中的坐标变换为范围在 [-1, 1] 内的坐标，以便后续进行射线投射检测。
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(clickMouse,camera); //使用相机和之前计算出的鼠标位置来更新 raycaster 对象。
    const found = raycaster.intersectObjects(scene.children,true); //将场景中的所有对象与 raycaster 相交，并将结果存储在 found 变量中。
    if(found.length > 0){
        let target = found[0].point; //将相交的对象的位置作为目标点。
        // console.log(target)
        groupId = pathfinding.getGroup(ZONE,agentGroup.position); //获取当前位置所在的导航网格组的 ID。
        const closest = pathfinding.getClosestNode(agentGroup.position,ZONE,groupId); //获取导航网格中距离当前位置最近的节点。
        navPath = pathfinding.findPath(closest.centroid,target,ZONE,groupId); //寻找从当前位置到目标位置的最短路径。

        //路径线路显示
        if(navPath){
            pathfindingHelper.reset();
            pathfindingHelper.setPlayerPosition(agentGroup.position);
            pathfindingHelper.setTargetPosition(target);
            pathfindingHelper.setPath(navPath)
        }
    }
})

function move(delta) {
    if(!navPath || navPath.length <= 0)return;

    let targetPosition = navPath[0];
    const distance = targetPosition.clone().sub(agentGroup.position);

    if(distance.lengthSq() > 0.5 * 0.05){
        distance.normalize();
        agentGroup.position.add(distance.multiplyScalar(delta * 5));
    }else{
        navPath.shift();

    }
}




const clock = new THREE.Clock();
let gameLoop = () => {
    move(clock.getDelta() * 1);
    orbitControls.update();
    renderer.render(scene,camera);
    requestAnimationFrame(gameLoop);
}
gameLoop();