import * as THREE from 'three';
import Sizes from './Utils/Sizes';
import Camera from './Camera';
import Renderer from './Renderer';
import Time from './Utils/Time';

import Resources from './Utils/Resources';

import World from './World/World';
import assets from './Utils/assets';
export default class Experience {
    static instance;
    constructor(canvas) {
        //单例模式
        if(Experience.instance){
            return Experience.instance;
        }
        Experience.instance = this;


        //获取canvas
        this.canvas = canvas;
        //创建一个场景
        this.scene = new THREE.Scene();
        //场景大小控制类
        this.sizes = new Sizes();

        //相机类
        this.camera = new Camera();
        //渲染器类
        this.renderer = new Renderer();
        //创建定时器类
        this.time = new Time();

        //资源列表加载类（glb文件，视频）
        this.resources = new Resources(assets);


        this.world = new World();

        //监听time的update时间（每60ms触发一次）
        this.time.on('update',() => {
            //更新
            this.update();
        })

        //sizes里监听到视窗大小有改变触发事件
        this.sizes.on('resize',() => {
            this.resize(); 
        })
    }
    //每60ms触发一次更新
    update() {
        //更新相机类里的更新函数
        this.camera.update();
        //更新渲染器类里的更新函数
        this.renderer.update();
        //更新world中房子的动画
        this.world.update();

    }

    //监听到视窗改变执行代码
    resize() {
        //更新相机参数
        this.camera.resize();
        //更新渲染器参数（画布大小等）
        this.renderer.resize();
        // this.world.resize();
    }
}