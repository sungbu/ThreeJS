import './style.css'

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Pathfinding, PathfindingHelper} from "three-pathfinding";
import Navmesh from '../navmesh/Navmesh';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.y = 30;
camera.position.z = 25;
camera.position.x = 0;

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
agentGroup.position.z = 1;
agentGroup.position.x = 2;
agentGroup.position.y = 1;
scene.add(agentGroup);



const agent2 = new THREE.Mesh(new THREE.CylinderGeometry(agentRadius, agentRadius,agentHeight), new THREE.MeshPhongMaterial({color: 'red'}));
agent2.position.y = agentHeight / 2;
const agentGroup2 = new THREE.Group();
agentGroup2.add(agent2);
agentGroup2.position.z = 1;
agentGroup2.position.x = 4;
agentGroup2.position.y = 1;
scene.add(agentGroup2);

const agent3 = new THREE.Mesh(new THREE.CylinderGeometry(agentRadius, agentRadius,agentHeight), new THREE.MeshPhongMaterial({color: 'pink'}));
agent3.position.y = agentHeight / 2;
const agentGroup3 = new THREE.Group();
agentGroup3.add(agent3);
agentGroup3.position.z = 1;
agentGroup3.position.x = 5;
agentGroup3.position.y = 1;
scene.add(agentGroup3);


const agent4 = new THREE.Mesh(new THREE.CylinderGeometry(agentRadius, agentRadius,agentHeight), new THREE.MeshPhongMaterial({color: 'blue'}));
agent4.position.y = agentHeight / 2;
const agentGroup4 = new THREE.Group();
agentGroup4.add(agent4);
agentGroup4.position.z = 1;
agentGroup4.position.x = -4;
agentGroup4.position.y = 1;
scene.add(agentGroup4);



let mainNode;
const loader = new GLTFLoader();
loader.load("./public/models/test-road.glb",(gltf) => {
    scene.add(gltf.scene);
    mainNode = gltf;
});





let navmesh;
const navmesh1 = new Navmesh(scene,"Level1",camera,renderer,agentGroup);
const navmesh2 = new Navmesh(scene,"Level2",camera,renderer,agentGroup4);
const navmesh3 = new Navmesh(scene,"Level3",camera,renderer,agentGroup2);
const navmesh4 = new Navmesh(scene,"Level4",camera,renderer,agentGroup3);





loader.load("./public/models/test-road-navmesh.glb",(gltf) => {
    scene.add(gltf.scene);
    //导入的 GLTF 模型进行遍历，查找其中的导航网格对象，然后使用该对象的几何数据创建一个路径规划区域，即一个 Pathfinding 区域。
    gltf.scene.traverse(node => { //对 GLTF 模型场景进行遍历
        if(!navmesh && node.isObject3D && node.children && node.children.length > 0){
            navmesh = node.children[0];
            //使用导航网格对象的几何数据创建一个 Pathfinding 区域，并将其添加到 Pathfinding 中。
            //ZONE 是一个字符串，表示当前区域的名称。
            // 返回一个 Zone 对象，其中包含了该几何体的路径规划数据。然后使用 pathfinding.setZoneData 将该 Zone 对象添加到 Pathfinding 中。
            // pathfinding.setZoneData(ZONE,Pathfinding.createZone(navmesh.geometry))
            // getPath(navmesh);
            navmesh1.createPath(navmesh,mainNode);
            navmesh2.createPath(navmesh,mainNode);
            navmesh3.createPath(navmesh,mainNode);
            navmesh4.createPath(navmesh,mainNode);
        }
    })
})




// setInterval(() => {
//     navmesh1.createPath(navmesh,mainNode);
//     navmesh2.createPath(navmesh,mainNode);
//     navmesh3.createPath(navmesh,mainNode);
//     navmesh4.createPath(navmesh,mainNode);
// },3000)






const clock = new THREE.Clock();
let gameLoop = () => {
    let delta = clock.getDelta();
    navmesh1.move(delta * 3)
    navmesh2.move(delta * 3)
    navmesh3.move(delta * 3)
    navmesh4.move(delta * 3)
    // move(clock.getDelta() * 5);
    orbitControls.update();
    renderer.render(scene,camera);
    requestAnimationFrame(gameLoop);
}


gameLoop();
