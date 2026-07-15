# JS相关

## JS数据类型有哪些

::: details 详情
**基本**  
 `undefined`、`null`、`boolean`、`number`、`string`、`symbol`(每个symbol（）函数返回的值都是唯一的，注意symbol函数不能使new)，`bigint`（大于2^53 – 1，不能使用new）

```js
const sym1 = Symbol()
const sym2 = Symbol('foo')
const sym3 = Symbol('foo')
Symbol('foo') === Symbol('foo') // false

const bigint1 = 9007199254740991n
const bigint2 = BigInt(9007199254740991)
```

**引用**  
 `Object`，通过构造函数new出来的对象，函数、数组、日期等
:::

## typeof能判断哪些类型

::: details 详情
| **类型** | **返回值** | **备注** |
| ----------------- | ------------- | ------------------------ |
| **Undefined** | `"undefined"` | 当变量未被定义或未赋值时，返回此值。 |
| **Null** | `"object"` | 历史遗留问题，`null` 被错误地识别为对象。 |
| **Boolean** | `"boolean"` | 适用于 `true` 或 `false` 值。 |
| **Number** | `"number"` | 适用于整数和浮点数（包括特殊值 `NaN` 和 `Infinity` 无穷大）。 |
| **String** | `"string"` | 适用于字符串（例如 `"hello"`）。 |
| **BigInt** | `"bigint"` | 适用于任意大的整数（例如 `10n`）。 |
| **Symbol** | `"symbol"` | 适用于 `Symbol` 类型。 |
| **Function** | `"function"` | 适用于可调用的对象（如函数和类定义）。 |
| **其他对象** | `"object"` | 包括数组、普通对象、日期对象、正则表达式等非函数对象。 |

**关于null的问题**  
null 被定义为 全 0 的机器码空指针（0x00），而 object 的类型标签也是 000。所以 typeof 检查低位时把 null 误判成了 object。

```js
// 不修复的原因
// 无数人这么写：
if (typeof x === "object" && x !== null) { ... }
// 如果改成 typeof null === "null"，上面代码行为会变，一个会进入&&后面的代码，一个不会
// 万一有人没写&& x !== null，整个逻辑都会发生改变
```

**重写typeof方法**

```js
/**
 * 新的typeof方法，能识别object、array、null、NaN、date等类型
 * @param value 任意值
 * @returns GetType 类型
 */
export type GetType = 'number' | 'string' | 'boolean' | 'null' | 'undefined' | 'array' | 'object' | 'function' | 'date' | 'regexp' | 'symbol' | 'bigint' | 'NaN'
export const getType = (value: any): GetType => {
  // 注意：NaN需要特别判断，这里不推荐使用isNaN()，isNaN()会将传入的参数转换为数字类型，然后再进行比较
  // 例如：isNaN('abc') => true，isNaN('123') => false
  if (Number.isNaN(value)) return 'NaN'
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase() as GetType
}
```

:::

## Array的一些常见方法

::: details 详情

- `Array.slice`：返回的是一个提取出来的数组，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。
- `Array.splice`：（start，移除个数count，增加内容item）通过删除或替换现有元素或者原地添加新的元素来修改数组，并以数组形式返回被修改的内容。此方法会改变原数组。
- `Array.contact`：方法用于合并两个或多个数组，参数可以是值，也可以是数组，最后返回一个新数组
- `Array.join`: 数组转字符串
- `Array.unshift` 和 `Array.push` 添加首;添加尾
- `Array.shift` 和 `Array.pop` 删除首;删除尾
- `Array.isArray`：静态方法用于确定传递的值是否是一个数组
- `Array.of`：静态方法通过可变数量的参数创建一个新的 Array 实例，而不考虑参数的数量或类型
- `Array.from`：静态方法从可迭代或类数组对象创建一个新的浅拷贝的数组实例

```js
console.log(Array.of('foo', 2, 'bar', true))
// Expected output: Array ["foo", 2, "bar", true]
console.log(Array.of())
// Expected output: Array []

console.log(Array.from('foo'))
// Expected output: Array ["f", "o", "o"]
console.log(Array.from([1, 2, 3], (x) => x + x))
// Expected output: Array [2, 4, 6]
console.log(Array.from({ length: 10 }, (ite, idx) => idx + 1)) // {length: 10} 可以被类数组对象api识别
// Expected output: Array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

:::

## 箭头函数和普通函数的区别

::: details 详情
| 特性 | 箭头函数 | 普通函数 |
| ------------- | ------------- | ------------------- |
| 语法 | 简洁，使用 `=>` 定义 | 使用 `function` 定义 |
| `this` 绑定 | 词法绑定，继承定义时所在环境的 `this` | 动态绑定，调用时决定 |
| `arguments` 对象 | 没有，需要使用 `...args` | 有自己的 `arguments` 对象 |
| 是否能作为构造函数 | 不能 | 可以 |
| 是否有 `prototype` 属性 | 没有 | 有 |
| 是否支持 `call/bind/apply` | 不支持 | 支持 |
| 适用场景 | 用于回调函数、闭包、需要继承外层 `this` 的场景 | 需要动态绑定 `this`，或用作构造函数时 |
:::

## 箭头函数的加深理解

::: details 详情

```js
const obj = {
  f1() {
    const fn = () => {
      console.log('this1', this)
    }
    fn()
    fn.call(window)
  },
  f2: () => {
    function fn() {
      console.log('this2', this)
    }
    fn()
    fn.call(this)
  }
}
obj.f1() // this1 obj 和 this1 obj
obj.f2() // this2 window（严格模式下是 undefined） 和 this2 window
```

- 对于普通函数来说，内部的 this 指向函数运行时所在的对象，但是这一点对箭头函数不成立。它没有自己的 this 对象，内部的 this 就是定义时上层作用域中的 this。也就是说，箭头函数内部的 this 指向是固定的，相比之下，普通函数的 this 指向是可变的，比如通过 call 来改变。
- obj.f1() 时，fn 是箭头函数，内部的 this 是定义时上层作用域中的 this，也就是 obj。箭头函数修改不了 this，所以 fn.call(window) 不会修改 this 指向。
- obj.f2() 时，fn 是普通函数，但 f2 是箭头函数，如果 f2 是普通函数，该方法内部的 this 指向 obj，但是写成箭头函数，this 指向全局对象，这是因为对象不构成单独的作用域，导致箭头函数定义时的作用域就是全局作用域。所以都是 windows（在非严格模式下）。

:::

## JS运行时的堆栈内存模型

::: details 详情
在 JS 运行时，内存管理主要依赖于堆（Heap）和栈（Stack）两种数据结构

栈（Stack）

- 特点：栈是一种后进先出（LIFO）的数据结构，用于存储函数调用和原始数据类型
- 用途：当函数被调用时，相关的执行上下文（包括局部变量，函数参数）会被压入栈中，当函数执行完毕后，栈顶的执行上下文会被弹出栈
- 限制：栈内存的空间大小通常十分有限，适合存储生命周期短，大小固定的数据（比如无限递归不断创建栈帧，会导致爆栈）

堆（Heap）

- 特点：堆是一种动态内存分配的，无序的数据结构，用于存储对象和复杂数据类型
- 用途：堆用于存储动态分配的内存，比如对象，数组，函数等
- 限制：堆内存的分配和释放速度较慢，容易导致内存碎片化
  :::

## 值类型和引用类型的区别

::: details 详情
特性 | 值类型 | 引用类型 |
| ---------- | -------------- | -------------------- |
| **存储内容** | 数据值本身 | 数据的引用（地址） |
| **存储位置** | 栈内存 | 栈存引用，堆存实际数据 |
| **赋值方式** | 拷贝值 | 拷贝引用（地址） |
| **变量之间独立性** | 互相独立，互不影响 | 指向同一数据，互相影响 |
| **常见数据类型** | 基本数据类型（如 `number，string，boolean，undefined，null，symbol`） | 复杂数据类型（如 `Object，Array，Function`） |
:::

## JS的垃圾回收

垃圾回收（Garbage Collection, GC）是自动管理内存的过程。JavaScript 引擎会自动检测不再使用的对象，并释放它们所占用的内存。当垃圾无法回收时，就会产生内存泄露

::: details 详情

常用算法

**引用计数法：无法解决互相引用的问题**

- 当一个对象被引用时（如赋值给其他变量或作为函数参数传递），它的引用计数增加。
- 当一个引用被销毁时（如局部变量超出作用域或赋值为 null），该对象的引用计数减少。
- 计数减少为0时，则对象被回收。

```js
let obj1 = { name: 'Object 1' } // 引用计数为 1
let obj2 = obj1 // 引用计数为 2，因为 obj2 引用了 obj1
let obj3 = { ref: obj1 } // 引用计数为 3，因为 obj3 引用了 obj1
obj2 = null // 引用计数为 2，obj1 的引用计数减少 1
obj3 = null // 引用计数为 1，obj1 的引用计数再次减少 1
obj1 = null // 此时，obj1 的引用计数变为 0，垃圾回收器可以回收 obj1

// 互相引用如下：
function createCircularReference() {
  let obj1 = { name: 'Object 1' }
  let obj2 = { name: 'Object 2' }
  obj1.ref = obj2 // obj1 引用 obj2
  obj2.ref = obj1 // obj2 引用 obj1
  return [obj1, obj2]
}
let circularObj = createCircularReference()
circularObj = null // 即使没有其他引用，obj1 和 obj2 依然互相引用，它们无法被回收
```

**标记清除法：最常用的垃圾回收算法**

- 标记阶段：垃圾回收器从根对象（例如，函数调用栈、全局对象）开始，遍历所有活动对象。如果 obj1 和 obj2 是活动的，它们会被标记为“活跃”对象
- 清除阶段：由于 obj1 和 obj2 已经被断开引用，它们不再可达，因此垃圾回收器会认为这些对象是垃圾并释放它们占用的内存。

```js
function test() {
  var a = 10 // 被标记 ，进入环境
  var b = 20 // 被标记 ，进入环境
}
test() // 执行完毕 之后 a、b又被标离开环境，被回收。
```

:::

## 对于闭包的理解

闭包是 JS 函数作用域的副产品，内层函数使用了外层函数的变量，就构成了一个闭包

::: details 详情

```js
const n = 10
function print() {
  console.log(n)
}
function f1(fn) {
  const n = 20
  fn()
}
f1(print) // 10
// JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域。
// 换句话说，说函数的作用域在函数定义的时候就决定了。
// 所以当调用 print 的时候，它会根据定义的位置向外查找变量，也就是 n = 10。
```

防抖节流也算闭包的一个应用了

**防抖**：函数只执行最后一次，一般用于onscroll事件中获取滚动条位置之类的

```js
//防抖：函数只执行最后一次
window.onscroll = debounce(function (age = 18, name = 'xixi') {
  console.log('调用了1次', name)
}, 500)

function debounce(func, delay = 300) {
  let timer
  return function () {
    const that = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(that, args) // 改变定时器中的this指向
    }, delay)
  }
}
```

**节流**：函数在一定的时间里只能执行一次

```js
//节流：数在一定的时间里只能执行一次，点击后等500毫秒触发，只能500毫秒触发一次
const btn = document.getElementsByTagName('button')[0]
btn.onclick = throttle(function () {
  console.log('调用了1次')
}, 500)

function throttle(func, wait) {
  const timer
  return function () {
    const that = this
    const args = arguments
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(that, args) // 改变定时器中的this指向
        timer = null
      }, wait)
    }
  }
}
```

:::

## JS中的Promise

Promise 是 JavaScript 处理异步操作的一种方式，用于解决回调地狱（Callback Hell）问题。 它表示一个未来才会完成（或失败）的异步操作，并提供 .then()、.catch()、.finally() 方法进行处理。
::: details 详情
一个 `Promise` 必然处于以下几种状态之一：

- 待定（pending）：初始状态，既没有被兑现，也没有被拒绝。
- 已兑现（fulfilled）：意味着操作成功完成。
- 已拒绝（rejected）：意味着操作失败。

注意：Promise.prototype.then 返回新的 Promise，所以可以链式调用。如果有返回值，下一个.then会拿到这个值，如果没有，下一个.then拿到undefined
:::

## JS中的async和await

async 和 await 是 ES2017 引入的异步编程语法糖，基于 Promise，让异步代码看起来像同步代码。

- async 修饰函数，使其自动返回 Promise
- await 暂停 async 函数执行，等待 Promise 完成

::: details 详情
async 函数返回值
| 返回 | 实际结果 |
| ---------------- | --------------------- |
| `return value` | `Promise.resolve(value)` |
| `return Promise` | 原 Promise |
| `throw error` | `Promise.reject(error)` |
| 无 return | `Promise.resolve(undefined)` |

```js
async function test() {
  return 42
}
test() // Promise {<fulfilled>: 42}

async function err() {
  throw new Error('fail')
}
err() // Promise {<rejected>: Error}
```

与 Promise 对比
| 场景 | Promise | async/await |
| ---- | ----------- | ------------ |
| 链式调用 | `.then().catch()` | 像同步代码 |
| 错误处理 | `.catch()` | `try/catch` |
| 条件分支 | 嵌套复杂 | `if/else` 直观 |
| 调试 | 堆栈不清晰 | 可以单步调试 |

注意：async 如果要捕捉promise中的reject，需要使用`try/catch`
:::

## JS作用域和作用域链

::: details 详情

- **作用域**：变量的可访问范围，分为 **全局作用域、函数作用域、块级作用域**。
- **作用域链**：变量查找机制，从当前作用域 **逐级向上查找**，直到全局作用域或 `ReferenceError`。
- **ES6 关键点**：
  - `let` / `const` **具有块级作用域**，避免 `var` 变量提升带来的问题。
  - **闭包** 利用作用域链，保留外部作用域的变量。

```js
var a = 'global'
function outer() {
  var b = 'outer'
  function inner() {
    var c = 'inner'
    console.log(a, b, c) // ✅ global outer inner
  }
  inner()
}

outer()
console.log(b) // ❌ ReferenceError: b is not defined
```

:::

## JS原型和原型链

::: details 详情
**原型（Prototype）**

- 每个 **函数**（构造函数）都有一个 `prototype` 属性，指向其 **原型对象**。
- 每个 **对象** 都有一个 `__proto__` 指向其构造函数的 `prototype`，形成继承关系。

**原型链（Prototype Chain）**

- 访问对象属性时，先查找自身属性，找不到则沿 `__proto__` 逐级向上查找，直到 `null` 终止。
- `Object.prototype.__proto__ === null`，原型链的顶端是 `Object.prototype`。

```js
function Person(name) {
  this.name = name
}
Person.prototype.sayHello = function () {
  console.log('Hello!')
}

const p = new Person('xixi')
console.log(p.__proto__ === Person.prototype) // true
console.log(Person.prototype.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__ === null) // true
```

:::

## JS的继承

::: details 详情

1. **原型链继承**  
   **核心思路：** 让子类的 `prototype` 指向父类实例。

```js
function Parent() {
  this.name = 'Parent'
}
Parent.prototype.sayHello = function () {
  console.log('Hello from Parent')
}

function Child() {}
Child.prototype = new Parent() // 继承 Parent
Child.prototype.constructor = Child // 找回子类的构造函数

const child = new Child()
console.log(child.name) // "Parent"
child.sayHello() // "Hello from Parent"
```

✅ **优点：** 父类方法可复用  
❌ **缺点：** 1. 共享引用类型属性（如 `arr = []` 会被多个实例共享），2. 无法向父类构造函数传参

2. **借用构造函数继承**  
   **核心思路：** 在子类构造函数中使用 `call` 继承父类属性。

```js
function Parent(name) {
  this.name = name
}
function Child(name, age) {
  Parent.call(this, name) // 继承 Parent
  this.age = age
}
const child = new Child('Rain', 18)
console.log(child.name, child.age) // "Rain", 18
```

✅ **优点：** 1. 解决原型链继承共享问题，2. 可传参  
❌ **缺点：** 无法继承父类原型上的方法

3. **组合继承（原型链 + 构造函数继承，最常用）**  
   **核心思路：** 结合前两种方式，**继承属性用构造函数，继承方法用原型链**。

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.sayHello = function () {
  console.log('Hello from Parent')
}

function Child(name, age) {
  Parent.call(this, name) // 第 1 次调用 Parent
  this.age = age
}

Child.prototype = new Parent() // 第 2 次调用 Parent
Child.prototype.constructor = Child

const child = new Child('Rain', 18)
console.log(child.name, child.age) // "Rain", 18
child.sayHello() // "Hello from Parent"
```

✅ **优点：** 解决了前两种方法的缺陷  
❌ **缺点：** 调用两次 `Parent` 构造函数（一次 `call`，一次 `Object.create()`）

4. **ES6 class 继承（最现代化的方式）**  
   **核心思路：** `class` 语法糖，实际仍然基于原型继承。

```js
class Parent {
  constructor(name) {
    this.name = name
  }
  sayHello() {
    console.log('Hello from Parent')
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name) // 继承属性
    this.age = age
  }
}

const child = new Child('Rain', 18)
console.log(child.name, child.age) // "Rain", 18
child.sayHello() // "Hello from Parent"
```

✅ **优点：** 语法更清晰，易读易用  
❌ **缺点：** 本质仍是 `prototype` 继承
:::
