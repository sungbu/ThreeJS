import Experience from "../Experience";
import * as THREE from "three";
export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;
        this.time = this.experience.time;

        //获取房间解码数据文件
        this.room = this.resources.items.house;

        //获取房间场景
        this.actulRoom = this.room.scene;
        
        this.setModel();
        this.setAnimation();
    }
    //设置房子模型
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
            //水缸材质设置
            // if(child.name == "water"){
            //     child.material = new THREE.MeshBasicMaterial();
            //     child.material.roughness = 0;
            //     child.material.color.set(0x549dd2);
            //     child.material.ior = 3;
            //     child.material.transmission = 0.5;
            //     child.material.opacity = 1;
            // }

            //屏幕视频设置
            if(child.name == "screen"){
                child.material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,

                })
            }
        })
        //将房子模型设置到场景中
        this.scene.add(this.actulRoom)
        //设置缩放大小
        this.actulRoom.scale.set(0.11,0.11,0.11)
        //设置旋转角度
        this.actulRoom.rotation.y = Math.PI;
    }
    setAnimation() {
        //鱼动画设置
        this.mixer = new THREE.AnimationMixer(this.actulRoom);
        this.swim = this.mixer.clipAction(this.room.animations[4]);
        this.swim.play();
    }
    resize() {
    }
    //每60ms出发一次
    update() {
        //重新渲染动画帧
        this.mixer.update(this.time.delta * 0.0009);
    }
}