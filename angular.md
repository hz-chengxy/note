# 搭建环境
npm install -g @angular/cli  安装cli

ng new my-app  创建项目

# 自定义组件
`ng g component components/news` 
在app目录下创建一个组件，路径是在components文件夹下创建news组件，若没有components文件夹，则会新创建出来.
通过命令创建好的组件，会自动在app.modules.ts中配置好
想在哪里调用就直接写组件名称

# 模板使用
## 绑定属性
在组件中的ts或者js中直接
```ts
export class NewsComponent implements OnInit {
  public title=""   
  //这就定义好了一个title，可以直接在该组件的html中{{title}}使用,public可以省略

  title1="" // 默认是public

  title2:string="ss"
  /* 
  public 共有(默认)  可以在这个类里使用、也可以在类外使用
  protected 保护  他只有在当前类和它的子类里面可以访问
  private  私有  只有在当前类可以访问
  */
  constructor() { 
      this.title="title赋值"
   }

  ngOnInit(): void {
  }

}
```

## 标签上引用变量 [变量名]
```html
<div [msg]="title"></div> //这里msg承接的就是变量title，和vue的:一个意思

```

## 模板绑定html [innerHtml]
定义一个富文本 `str = "<div>富文本</div>"`
```html
<span [innerHtml] = "str"></span>
```

## 模板运算 1+2={{1+2}}

## 引入图片路径
### 本地图片
`<img src="assets/images/01.png">`

### 变量图片
imgSrc=""
`<img [src]="imgSrc">`

# api
arr = [1,2,3]
## *ngFor
`*ngFor="let item of arr"`
类似v-for  item就是数组中的每一项

`*ngFor="let item of arr;index as i;`
`*ngFor="let item of arr;let i=index"`

其中item是数组的每一项，index是索引下标,还有：

index: number：可迭代对象中当前条目的索引。

count: number：可迭代对象的长度。

first: boolean：如果当前条目是可迭代对象中的第一个条目则为 true。

last: boolean：如果当前条目是可迭代对象中的最后一个条目则为 true。

even: boolean：如果当前条目在可迭代对象中的索引号为偶数则为 true。

odd: boolean：如果当前条目在可迭代对象中的索引号为奇数则为 true。

```html
<li *ngFor="let user of users; index as i; first as isFirst">
   {{i}}/{{users.length}}. {{user}} <span *ngIf="isFirst">default</span>
</li>
```

## *ngIf 与v-if同理
`<div *ngIf="flag">`

## *ngSwitch
a=0
```html
<div [ngSwitch]="a">
    <p *ngSwitchCase="0">未支付</p>
    <p *ngSwitchCase="1">已支付，未发货</p>
    <p *ngSwitchCase="2">已发货</p>
    <p *ngSwitchCase="3">已确认收货</p>
    <p *ngSwitchDefault>订单关闭</p>
</div>
```

## ngClass ngStyle
### ngClass动态改变class
```html
<div [ngClass]="{'className1':true,'className2':false}"></div>  //添加className2这个class名
```
### ngStyle动态改变行内样式
```html
<p [ngStyle]="{'color':'red'}"></p>
```

## 管道 类似vue的筛选
最常用的angular自带方法：转为标准日期
{{ new Date | date:'yyyy-MM-dd HH:mm:ss'}}

## 事件
### 点击事件
`<button (click) = run()>`
```ts
export class NewsComponent implements OnInit {
  constructor() { 
   }

  ngOnInit() {
  },
  run(){
      console.log(1)
  }

}
```

### 表单事件
`<input type="text" (keydown)="keydown($event)">`
参数$event包含了当前触发事件所需的一些信息

```js
keydown(e){
    console.log(e.target)  //angular竟然有原生的e.target!!  e.target.value就是表单内的值
}
```

## 双向数据绑定
在app.module.ts中引入FormsModule
import {FormsModule} from "@angular/forms";
在imports声明:[FormsModule]

之后在表单中：`<input [(ngModel)]="keywords">` 与keywords变量绑定