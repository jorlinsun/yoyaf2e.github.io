CSS3属性中有关于制作动画的三个属性：Transform、Transition、Animation
=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=·=
Transform：变换
针对所有块级元素及某些内联元素
transform的属性有：rotate(旋转) / skew(倾斜) / scale(比例) / translate(位移) / matrix(矩阵变形)
.class {
    transform: rotate(<angle>)=(0deg);
    transform: skew(<angle> [, <angle>])=(0deg,0deg);
    transform: scale(<number>[, <number>])=(0,0.0);
    transform: translate(<translation-value>[, <translation-value>])=(0px,0px);
    transform: matrix(<number>, <number>, <number>, <number>, <number>, <number>)=?;
}
-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-
Transition：过渡
所有元素，包含伪对象:after和:before
.class {
    style: style;
    transtition: style,0.9s,ease-in-out,.5s;
    transition: [transitiotn-property] [transition-duration] [transition-timing-function] [ransition-delay];
}
* ：[ transition-property ]：检索或设置对象中的参与过渡的属性
* ：[ transition-duration ]：检索或设置对象过渡的持续时间
* ：[ transition-timing-function ]：检索或设置对象中过渡的动画类型
* ：[ transition-delay ]：检索或设置对象延迟过渡的时间
-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-
Animation：动画
所有元素，包含伪对象:after和:before
.class {
    sytle:style;
    transition: animation;
}
@-webkit-keyframes 'animation' {
    0% {}
    100% {}
    from {}
    to {}
}
-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-