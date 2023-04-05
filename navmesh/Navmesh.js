
import * as THREE from "three";
import { Pathfinding, PathfindingHelper} from "three-pathfinding";

export default class Navmesh{
    
    constructor(scene,ZONE,camera,renderer,agentGroup,mainNode) {
        this.agentGroup = agentGroup;
        this.mainNode = mainNode;
        this.ZONE = ZONE;
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
        this.pathfinding = new Pathfinding();
        this.pathfindingHelper = new PathfindingHelper();


        this.scene.add(this.pathfindingHelper);
        this.raycaster = new THREE.Raycaster();
        this.clickMouse = new THREE.Vector2();


    }

    createPath(navmesh,mainNode) {
        this.navmesh = navmesh;
        this.mainNode = mainNode;
        this.pathfinding.setZoneData(this.ZONE,Pathfinding.createZone(this.navmesh.geometry))
        const screenPosition = new THREE.Vector3();
        this.mainNode.scene.children[Math.floor(Math.random() * this.mainNode.scene.children.length)].getWorldPosition(screenPosition);
        screenPosition.project(this.camera);
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const x = ((screenPosition.x + 1) * width / 2) + 50;
        const y = (-screenPosition.y + 1) * height / 2;
        this.clickMouse.x = (x / window.innerWidth) * 2 - 1;
        this.clickMouse.y = -(y / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.clickMouse,this.camera); //使用相机和之前计算出的鼠标位置来更新 raycaster 对象。
        const found = this.raycaster.intersectObjects(this.scene.children); //将场景中的所有对象与 raycaster 相交，并将结果存储在 found 变量中。
        if(found.length > 0){
            let target = found[0].point; //将相交的对象的位置作为目标点。
            this.groupId = this.pathfinding.getGroup(this.ZONE,this.agentGroup.position); //获取当前位置所在的导航网格组的 ID。
            const closest = this.pathfinding.getClosestNode(this.agentGroup.position,this.ZONE,this.groupId); //获取导航网格中距离当前位置最近的节点。
            this.navPath = this.pathfinding.findPath(closest.centroid,target,this.ZONE,this.groupId); //寻找从当前位置到目标位置的最短路径。
            //路径线路显示
            if(this.navPath){
                this.pathfindingHelper.reset();
                this.pathfindingHelper.setPlayerPosition(this.agentGroup.position);
                this.pathfindingHelper.setTargetPosition(target);
                this.pathfindingHelper.setPath(this.navPath)
            }
        }
    }
    move(delta) {
        console.log(this.navPath,this.navmesh)
        if(!this.navPath && this.navmesh){
            console.log(111)
            this.createPath(this.navmesh,this.mainNode);
        }
        if(!this.navPath || this.navPath.length <= 0){
            return;
        }
        
        let targetPosition = this.navPath[0];
        const distance = targetPosition.clone().sub(this.agentGroup.position);
    
        if(distance.lengthSq() > 0.5 * 0.05){
            distance.normalize();
            this.agentGroup.position.add(distance.multiplyScalar(delta * 1));
        }else{
            this.navPath.shift();
            if(this.navPath.length < 1 ){
                this.createPath(this.navmesh,this.mainNode);
            }
        }


        

       
    }
}