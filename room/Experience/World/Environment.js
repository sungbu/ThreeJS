import Experience from "../Experience";
import * as THREE from "three";
export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        
        this.setSunlight();
    }
    setSunlight() {
        this.sunlight = new THREE.DirectionalLight("#ffffff",3); //平行光
        this.sunlight.castShadow = true; //如果设置为 true 该平行光会产生动态阴影。
        this.sunlight.shadow.camera.far = 20;
        this.sunlight.shadow.mapSize.set(2048,2048);
        this.sunlight.shadow.normalBias = 0.05;
        this.sunlight.position.set(-1.5,7,3); //假如这个值设置等于 Object3D.DEFAULT_UP (0, 1, 0),那么光线将会从上往下照射。
        this.scene.add(this.sunlight); //将光添加到场景

        //环境光会均匀的照亮场景中的所有物体。
        this.ambientLight = new THREE.AmbientLight("#ffffff",1);
        this.scene.add(this.ambientLight); //将环境光添加到场景

    }
    resize() {
    }
    update() {
    }
}