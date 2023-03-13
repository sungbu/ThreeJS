import EventEmitter from "events";
import Experience from "../Experience";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";


export default class Resources extends EventEmitter{
    constructor(assets) {
        super();
        this.experience = new Experience();

        //渲染器
        this.renderer = this.experience.renderer;

        //静态资源管理
        this.assets = assets;
        
        //解码加载好的对象列表
        this.items = {};
        //静态资源管理列表个数（需加载的资源总个数）
        this.queue = this.assets.length;
        //加载完的资源个数
        this.loaded = 0;
        
        this.setLoders();
        this.startLoding();
    }

    //设置加载器
    setLoders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader(); //用于载入glTF 2.0资源的加载器。
        this.loaders.dracoLoader = new DRACOLoader();//一种压缩3D几何数据的编码器，可以大大减小3D模型的文件大小，并且在加载和渲染时可以提供更快的性能。
        this.loaders.dracoLoader.setDecoderPath("/draco/");//Google Draco编码器使用自己的二进制格式来压缩3D模型数据，因此需要在客户端（如浏览器）上使用解码器来将压缩的数据解码为three.js中可用的几何体和材质。在使用DRACOLoader时，需要将解码器文件下载到客户端，并告诉DRACOLoader解码器文件的路径。
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader); // GLTF格式的3D模型解码
    }

    startLoding() {
        for(const asset of this.assets) {
            if(asset.type === "glbModel"){
                //解码加载glb文件
                this.loaders.gltfLoader.load(asset.path,(file) => {
                    //解码加载后执行监控函数
                    this.singleAssetLoade(asset,file);
                });

            }else if(asset.type === "videoTexture"){
                this.video = {};
                this.videoTexture = {};

                this.video[asset.name] = document.createElement('video');
                this.video[asset.name].src = asset.path;
                this.video[asset.name].muted = true;
                this.video[asset.name].playInline = true;
                this.video[asset.name].autoplay = true;
                this.video[asset.name].loop = true;
                this.video[asset.name].width = 360;
                this.video[asset.name].height = 460;
                this.video[asset.name].loop = true;
                this.video[asset.name].play();

                //创建一个使用视频来作为贴图的纹理对象。
                this.videoTexture[asset.name] = new THREE.VideoTexture(this.video[asset.name]);
                this.videoTexture[asset.name].flipY = true;
                this.videoTexture[asset.name].minFilter = THREE.NearestFilter; //当一个纹素覆盖小于一个像素时，贴图将如何采样。 
                this.videoTexture[asset.name].mageFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].generateMipmaps = false;
                this.videoTexture[asset.name].encodung = THREE.sRGBEncoding;

                //解码加载后执行监控函数
                this.singleAssetLoade(asset,this.videoTexture[asset.name]);
            }
        }
    }

    singleAssetLoade(asset,file) {
        //将解码数据放置items已解码对象中
        this.items[asset.name] = file;
        console.log("assets is loding")
        //已加载数量+1
        this.loaded ++;
        if(this.loaded === this.queue){
            console.log("all assets are done")
            //全部加在完出发事件（ready）
            this.emit("ready");
        }
    }
}