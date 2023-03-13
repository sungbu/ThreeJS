import EventEmitter from "events";

export default class Sizes extends EventEmitter{
    constructor() {
        super();
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        //相机视椎体宽高比
        this.aspect = this.width / this.height;
        //像素比率
        this.pixelRatio = Math.min(window.devicePixelRatio,2);

        //当用户概念浏览器视窗大小时触发
        window.addEventListener('resize',() => {
            //重新设置一些sizes值
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.aspect = this.width / this.height;
            this.pixelRatio = Math.min(window.devicePixelRatio,2);
            //创建resize事件 给experience
            this.emit('resize');
        })
    }
}