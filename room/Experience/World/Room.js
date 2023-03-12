import Experience from "../Experience";
import * as THREE from "three";
export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;
        this.room = this.resources.items.house;

        this.actulRoom = this.room.scene;
        
        this.setModel();
    }
    setModel() {
        this.actulRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;
            if(child instanceof THREE.Group){
                child.children.forEach((groupChild) => {
                    groupChild.castShadow = true;
                    groupChild.receiveShadow = true;
                })
            }
        })
        this.scene.add(this.actulRoom)
        this.actulRoom.scale.set(0.11,0.11,0.11)
        this.actulRoom.rotation.y = Math.PI;
    }
    resize() {
    }
    update() {
    }
}