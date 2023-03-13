import EventEmitter from "events";

export default class Time extends EventEmitter{
    constructor() {
        super();
        //获取当前时间（毫秒数：1678623074715）
        this.start = Date.now();
        this.current = this.start;
        //消逝
        this.elapsed = 0;
        //时间分析
        this.delta = 16;

        this.update();
    }

    update() {
        //获取当前时间
        const currentTime = Date.now();
        //时间戳 （最新时间 - 上一次时间）
        this.delta = currentTime - this.current;
        //更新时间
        this.current = currentTime;
        //（最新时间 - 第一次开始时间）
        this.elapsed = this.current - this.start;
        //创建更新时间给experience监听（update）
        this.emit("update");
        //定时器  每个大约60ms调用一次update
        window.requestAnimationFrame(() => this.update());
    }
}