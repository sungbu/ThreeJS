WebGLRenderer( parameters : Object )
一、属性
parameters - (可选) 该对象的属性定义了渲染器的行为。也可以完全不传参数。在所有情况下，当缺少参数时，它将采用合理的默认值。 以下是合法参数：
canvas - 设置画布；一个供渲染器绘制其输出的canvas 它和下面的domElement属性对应。 如果没有传这个参数，会创建一个新canvas
context - 可用于将渲染器附加到已有的渲染环境(RenderingContext)中。默认值是null
precision - 着色器精度. 可以是 "highp"（高精度）, "mediump" （中精度）或者 "lowp"（低精度）. 如果设备支持，默认为"highp" .
alpha -是否包含透明度，默认rgb没有a.
premultipliedAlpha - 需不需要颜色叠加 renderer是否假设颜色有 premultiplied alpha. 默认为true
antialias - 是否物体有锯齿显示 是否执行抗锯齿。默认为false（有锯齿）.
stencil - 绘图缓存是否有一个至少8位的模板缓存(stencil buffer)。默认为true
preserveDrawingBuffer -是否保留缓直到手动清除或被覆盖。 默认false.
powerPreference - 提示用户代理怎样的配置更适用于当前WebGL环境。 可能是"high-performance", "low-power" 或 "default"。默认是"default". 详见WebGL spec
failIfMajorPerformanceCaveat - 检测渲染器是否会因性能过差而创建失败。默认为false。详见 WebGL spec for details.
depth - 绘图缓存是否有一个至少6位的深度缓存(depth buffer )。 默认是true.
logarithmicDepthBuffer - 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。 Note that this setting uses gl_FragDepth if available which disables the Early Fragment Test optimization and can cause a decrease in performance. 默认是false。 示例：camera / logarithmicdepthbuffer

二、方法
.clear ( color : Boolean, depth : Boolean, stencil : Boolean ) : undefined
告诉渲染器清除颜色、深度或模板缓存. 此方法将颜色缓存初始化为当前颜色。参数们默认都是true
.getPixelRatio () : number
返回当前使用设备像素比
.setPixelRatio ( value : number ) : undefined
设置设备像素比。通常用于避免HiDPI设备上绘图模糊
.setSize ( width : Integer, height : Integer, updateStyle : Boolean ) : undefined
将输出canvas的大小调整为(width, height)并考虑设备像素比，且将视口从(0, 0)开始调整到适合大小 将updateStyle设置为false以阻止对canvas的样式做任何改变。