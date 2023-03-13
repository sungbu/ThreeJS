import Experience from "./Experience";
import * as THREE from "three";
export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.setRenderer();

        //设置辅助网格
        this.setHelper();
       
    }
    setRenderer() {
        //创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            canvas : this.canvas,//一个供渲染器绘制其输出的canvas 它和下面的domElement属性对应。 如果没有传这个参数，会创建一个新canvas
            antialias : true,//是否执行抗锯齿。默认为false
        });

        this.renderer.physicallyCorrectLights = true;//是否使用物理上正确的光照模式。 默认是false。
        this.renderer.outputEncoding = THREE.sRGBEncoding; //定义渲染器的输出编码。默认为THREE.LinearEncoding
        this.renderer.toneMapping = THREE.CineonToneMapping;//色调映射
        this.renderer.toneMappingExposure = 1.75; //色调映射的曝光级别。默认是1
        this.renderer.shadowMap.enabled = true;//如果设置开启，允许在场景中使用阴影贴图。默认是 false。

        // 定义阴影贴图类型 (未过滤, 关闭部分过滤, 关闭部分双线性过滤), 可选值有:

        // THREE.BasicShadowMap
        // THREE.PCFShadowMap (默认)
        // THREE.PCFSoftShadowMap
        // THREE.VSMShadowMap
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //将输出canvas的大小调整为(width, height)并考虑设备像素比
        this.renderer.setSize(this.sizes.width,this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);//设置设备像素比。通常用于避免HiDPI设备上绘图模糊

    }
    //网格
    setHelper() {
        const size = 10;
        const divisions = 10;
        //坐标格辅助对象
        const gridHelper = new THREE.GridHelper(size, divisions);
        this.scene.add(gridHelper);

        //用于简单模拟3个坐标轴的对象.
        //红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
        const axesHelper = new THREE.AxesHelper( 10 );
        this.scene.add( axesHelper );
    }
    //在页面分辨率发生改变时触发
    resize() {
        //设置渲染器大小
        this.renderer.setSize(this.sizes.width,this.sizes.height);
        //设置像素比
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }
    //每60ms触发一次
    update() {
        //渲染和重新渲染canvas内容
        this.renderer.render(this.scene,this.camera.perspectiveCamera);
    }
}