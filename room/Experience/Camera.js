import Experience from "./Experience";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
export default class Camera {
    constructor() {
        this.experience = new Experience();
        //获取experience管理者的初始化属性
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.createPerspectiveCamera();
        this.createOrthographicCamera();

        //设置界面可进行手势操作
        this.setOrbitControls();
    }
    //创建远景相机
    createPerspectiveCamera() {
        this.perspectiveCamera = new THREE.PerspectiveCamera(35, this.sizes.aspect, 0.1, 100);
        //将相机添加到场景
        this.scene.add(this.perspectiveCamera);
        //相机距离
        this.perspectiveCamera.position.z = 5;
    }
    //创建正交相机
    createOrthographicCamera() {
        this.frustum = 5;
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustum) / 2,
            (this.sizes.aspect * this.sizes.frustum) / 2,
            this.sizes.frustum / 2,
            -this.sizes.frustum / 2.
            - 100,
            100
        );
        this.scene.add(this.orthographicCamera);
    }

    //手势操作
    setOrbitControls() {
        //开启手势操作
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
        //将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。默认值为false。
        //请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。
        this.controls.enableDamping = true;
        //启用或禁用摄像机的缩放。
        this.controls.enableZoom = true;
    }
    resize() {
        //Update Perspective Camera on resize
        this.perspectiveCamera.aspect = this.sizes.aspect; //更新相机视椎体宽高比
        this.perspectiveCamera.updateProjectionMatrix(); //更新摄像机投影矩阵。在相机任何参数被改变以后必须被调用。

        //Update orthographic Camera on resize
        this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustum) / 2
        this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustum) / 2
        this.orthographicCamera.top = this.sizes.frustum / 2
        this.orthographicCamera.bottom = -this.sizes.frustum / 2
        this.orthographicCamera.updateProjectionMatrix();
    }
    update() {
        //在你的动画循环里调用.update()  this.controls.enableDamping需要使用才有效
        this.controls.update();
    }
}