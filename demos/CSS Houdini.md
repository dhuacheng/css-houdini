# CSS Houdini 入门

#
#
#

# 目录
- CSS Houdini 是什么
- CSS Properties and Values API
- CSS Typed OM API
    - 读取和设置css样式
        - attributeStyleMap
    - CSS 数值 (CSSUnitValue/CSSMathValue)
        - 单位值
        - 数学值
        - 算术运算
        - transform 值
- CSS Paint API
- CSS Layout API
- Worklets
- CSS Houdini 被调用的环节
- 浏览器兼容性

# CSS Houdini 是什么
CSS Houdini 是由一群來自 Mozilla, Apple, Opera, Microsoft, HP, Intel, IBM, Adobe 与 Google 的工程师所组成的工作小组（W3C），制定的一系列CSS API。使开发者得以自定义扩展CSS，并把这些样式直接放入浏览器的渲染引擎中渲染出来。

# 1、CSS Properties and Values API
允许给css定义变量，且能在样式中直接引用。
### 1.1、变量的声明
声明变量，在变量名前面要加“- -”则可。
 ```
    :root{
        --s-fs: 12px;
        --m-fs: 14px;
        --l-fs: 16px;
        --xl-fs: 18px;

        --bg: #EBEEF5;
        --color-gray: #909399;
        --color-danger: #F56C6C;
        --color-success: #67C23A;
        --color-warning: #E6A23C;
        --color-default: #303133;
        
        --s-space: 5px;
        --m-space: 10px;
        --l-space: 15px;
        --xl-space: 20px;
    }
```

### 1.2、var() 函数
var()函数用于读取变量。var()函数接受两个参数，第一个表示要读取的变量名、第二个默认值。如果没有可用的变量，则使用默认值。
```
.div1 {
    width: 200px;
    height: 200px;
    background: var(--bg);
    font-size: var(--l-fs);
    color: var(--color-danger,  #000);
}

定义一个变量，可用引用另外一个变量作为值。
.div2 {
    --color: var(--color-success);
    color: var(--color);
}
```
### 1.3、 优先级
跟css选择器的优先级一致。
```
<div class="div1"> yellow </div>
<div class="div2"> green </div>

:root { 
    --color: red;
}
body {
    --color: yellow
}
.div1 {
    color: var(--color);
}
.div2 {
    --color: green;
    color: var(--color);
}
```
div1 的颜色为yellow， div2的颜色为green。

### 1.4 、结合媒体查询，开发响应式页面

```
@media screen and (max-width: 1200px) {
    body {
        --columns: 4;
        --padding: 15;
    }
}
@media screen and (max-width: 900px) {
    body {
        --columns: 3;
        --padding: 10;
    }
}
@media screen and (max-width: 600px) {
    body {
        --columns: 2;
        --padding: 5;
    }
}
```
使用变量，可用大大减少代码量。

### 1.5、浏览器兼容性
![avatar](https://image.zhangxinxu.com/image/blog/201611/2016-11-26_195612.png)

# 2、CSS Typed OM
旧的CSS OM,通过js获得dom 的css属性，返回的值都是字符串，要进行一些数学运算时，需先转换。
```
    el.style.opacity
    el.style.width
```
新的CSS类型对象模型（CSS Typed Object Model），是CSS OM的升级版。CSS Typed OM提供的css属性值是javaScript 对象，用于提升 CSS 的性能和更加合理的操作。
### 2.1、attributeStyleMap
attributeStyleMap对象。用于获取和设置css属性值，有如下几个方法。
- attributeStyleMap.set()
    ```
        div.attributeStyleMap.set('background', 'red');
        div.attributeStyleMap.set('opacity', .5);
        div.attributeStyleMap.set('width', CSS.px(500));
        div.attributeStyleMap.set('width', CSS.em(500));
    ```
 - attributeStyleMap.get()
    ```
    div.attributeStyleMap.get('width');
    
    获取到的对象（CSSUnitValue）：
    { value: 500, unit: "px" }
    ```
 - el.attributeStyleMap.has()
 - el.attributeStyleMap.delete() 
 - el.attributeStyleMap.clear()
 
### 2.2、 CSS单位值(CSSUnitValue)
window.CSS对象，提供一系列的方法来声明一些单位值
```
    const {value, unit} = CSS.number('10');
    // value === 10, unit === 'number'
    const {value, unit} = CSS.px(42);
    // value === 42, unit === 'px'
    const {value, unit} = CSS.vw('100');
    // value === 100, unit === 'vw'
    const {value, unit} = CSS.percent('10');
    // value === 10, unit === 'percent'
    const {value, unit} = CSS.deg(45);
    // value === 45, unit === 'deg'
    const {value, unit} = CSS.ms(300);
    // value === 300, unit === 'ms'
```
>>  注意：如示例所示，这些方法可以传递一个 Number 或 String 类型的数字。

### 2.3、CSS数学值(CSSMathValue)
CSSMathValue 对象表示数学表达式并且通常包含多个值/单位。在常见的例子是创建一个 CSS calc() 表达，但也有一些方法对应所有的 CSS 函数： calc()，min()，max()。
```
new CSSMathSum(CSS.vw(100), CSS.px(-10)).toString(); // "calc(100vw + -10px)"
new CSSMathNegate(CSS.px(42)).toString() // "calc(-42px)"
new CSSMathInvert(CSS.s(10)).toString() // "calc(1 / 10s)"
new CSSMathProduct(CSS.deg(90), CSS.number(Math.PI/180)).toString();
// "calc(90deg * 0.0174533)"
new CSSMathMin(CSS.percent(80), CSS.px(12)).toString(); // "min(80%, 12px)"
new CSSMathMax(CSS.percent(80), CSS.px(12)).toString(); // "max(80%, 12px)"
```

### 2.4、CSS算术运算
 - 基本操作（add/sub/mul/div/min/max）
    ```
    CSS.deg(45).mul(2) // {value: 90, unit: "deg"}
    CSS.percent(50).max(CSS.vw(50)).toString() // "max(50%, 50vw)"
    // Can Pass CSSUnitValue:
    CSS.px(1).add(CSS.px(2)) // {value: 3, unit: "px"}
    // multiple values:
    CSS.s(1).sub(CSS.ms(200), CSS.ms(300)).toString() // "calc(1s + -200ms + -300ms)"
    // or pass a `CSSMathSum`:
    const sum = new CSSMathSum(CSS.percent(100), CSS.px(20)));
    CSS.vw(100).add(sum).toString() // "calc(100vw + (100% + 20px))"
    ```
 - 转变
    绝对长度单位可以转换为其他单位长度：
    ```
    // Convert px to other absolute/physical lengths.
    el.attributeStyleMap.set('width', '500px');
    const width = el.attributeStyleMap.get('width');
    width.to('mm'); // CSSUnitValue {value: 132.29166666666669, unit: "mm"}
    width.to('cm'); // CSSUnitValue {value: 13.229166666666668, unit: "cm"}
    width.to('in'); // CSSUnitValue {value: 5.208333333333333, unit: "in"}
    
    CSS.deg(200).to('rad').value // "3.49066rad"
    CSS.s(2).to('ms').value // 2000
    ```
### 2.5、CSS transform 值
使用 CSSTransformValue 可以创建 CSS 变换，参数为 transform 值组成的数组（例如 CSSRotate，CSScale，CSSSkew，CSSSkewX， CSSSkewY）。 要实现如下CSS：
```
transform: rotateZ(45deg) scale(0.5) translate3d(10px,10px,10px);
}
```
这样定义：
```
const transform =  new CSSTransformValue([
  new CSSRotate(CSS.deg(45)),
  new CSSScale(CSS.number(0.5), CSS.number(0.5)),
  new CSSTranslate(CSS.px(10), CSS.px(10), CSS.px(10))
]);
el.attributeStyleMap.set('transform', transform);
```

## 3、CSS Paint API

CSS Paint API是用来绘制图像功的方法。它提供了一个 registerPaint 方法，接收两个参数。
-  1、PainName：所绘制图片的名称，在 CSS 中使用的属性值
- 2、class：包含绘制图片逻辑的JavaScript 类。
```
class Shape {
    static get inputProperties() {
        return ['--border-color'];
    }
    paint(ctx, geom, properties) {
        // console.log(ctx);
        // console.log(geom);
        console.log(properties, properties.get('--border-color').toString());
        const color = properties.get('--border-color').toString();
        const x = geom.width / 2;
        const y = geom.height / 2;
        ctx.strokeStyle = color || 'red';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
}
registerPaint('awesomePattern', Shape);
```

引用
```
CSS.paintWorklet.addModule('js/patternWorklet.js');
```
CSS中使用
```
.section {
    background-image: paint(awesomePattern);
}
```
## 4、CSS Layout API
开发者可以通过 CSS Layout API 实现自己的布局模块（layout module），这里的“布局模块”指的是display 的属性值。

### 4.1、重要概念
- **Parent Layout**
    父布局对象
![avatar](https://houdini.glitch.me/layout/layout.svg)
- **LayoutChild**
    子布局对象
![avatar](https://houdini.glitch.me/layout/LayoutChild.svg)
    - styleMap。此属性用来获取LayoutChild的自定义属性。
    - ayoutNextFragment()。LayoutChild 调用layoutNextFragment方法，返回一个Fragment对象。
- **Fragment**
Fragment对象，记录Child Layout的一些布局信息。用户可获取和设置这些信息。
![avatar](https://houdini.glitch.me/layout/Fragment.svg)
### 4.1、使用
CSS Layout API 提供了一个 registerLayout 方法，接收两个参数。
-  1、LayoutName：布局名称，在 CSS display 中使用的属性值；
- 2、class：包含布局逻辑的的JavaScript 类。

```
 registerLayout('masonry', class {
  static get inputProperties() {
    return ['width', 'height']
  }
  static get childrenInputProperties() {
    return ['x', 'y']
  }
  *intrinsicSizes(children, edges, styleMap) {
    // Intrinsic sizes code goes here.
  }
  *layout(children, constraintSpace, styleMap, breakToken) {
    // Layout logic goes here.
  }
}
```
CSS中使用
```
body {
  display: layout('masonry');
}
```
## 5、Worklets
Layout API 与 Paint API 中，我们都编写来一个 JS文件，定义一个css属性，在css中直接引用。而这个js文件就是通过Worklets来载入。
```
    CSS.paintWorklet.addModule('js/patternWorklet.js');
    CSS.layoutWorklet.addModule('js/layoutWroklet.js');
``` 
Worklets 的概念和 web worker 类似，它们允许在主线程之外，创建一个独立线程，引入一个js文件并执行代码。
worklets有两个特点：
1、独立于主线程；
2、能被主线程调用。

## 6、CSS Houdini被调用的环节
下图是一个HTML 文档从被浏览器接收到显示在屏幕上的全过程。蓝色部分，是能够通过 JavaScript来操作的dom的节点：
![avatar](http://top-css88.b0.upaiyun.com/top-css88/2018/10/c70ef1964451a8017713ddfda8349ba7_b.png)

js操作DOM/CSSOM，可能会导致的页面重新布局、绘制、合成。操作频繁会导致性能问题。

Houdini标准，给了开发者提供另外几个可介入浏览器渲染环节的权限。下张展示的是每个环节对应的新标准，开发者可以用这些标准来控制对应的环节。（注意：灰色区块是还在实现中的标准，目前暂时无法使用。）
![avatar](http://top-css88.b0.upaiyun.com/top-css88/2018/10/0db067c50c48093ba1857dad8ff9e963_b.png)

# 7、浏览器兼容性
[![avatar](https://www.w3cplus.com/sites/default/files/blogs/2018/1803/houdini-support-grid.png)](https://ishoudinireadyyet.com/)

# 参考资料
https://houdini.glitch.me/layout
https://segmentfault.com/a/1190000005876983
https://www.w3cplus.com/css/css-houdini.html




