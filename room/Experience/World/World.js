import Experience from "../Experience";
import * as THREE from "three";
import Environment from "./Environment";
import Room from "./Room";
export default class World {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;

        //监听到资源解码加载完后
        this.resources.on('ready', () => {
            //实例化环境类（灯光、阴影）
            this.environment = new Environment();
            //实例化主体（房子）
            this.room = new Room();
            console.log("created room");
        })
    }
    resize() {
    }
    update() {
        if(this.room){
            //更新room里的动画
            this.room.update();
        }
    }
}