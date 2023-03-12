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
        if(Experience.instance){
            return Experience.instance;
        }
        Experience.instance = this;
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.sizes = new Sizes();
        
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.time = new Time();

        this.resources = new Resources(assets);
        this.World = new World();

        this.time.on('update',() => {
            this.update();
        })
        this.sizes.on('resize',() => {
            this.resize();
        })
    }

    update() {
        this.camera.update();
        this.renderer.update();

    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }
}