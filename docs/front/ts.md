# TS相关

## TS的优缺点和使用场景

::: details 详情
优点

- 静态类型，减少类型错误
- 有错误会在编译时提醒，而非运行时报错 —— 解释“编译时”和“运行时”
- 智能提示，提高开发效率

缺点

- 学习成本高
- 某些场景下，类型定义会过于混乱，可读性不好
- 使用不当会变成 anyscript

适用场景

- 大型项目，业务复杂，维护人员多
- 逻辑性比较强的代码，依赖类型更多
- 组内要有一个熟悉 TS 的架构人员，负责代码规范和质量

:::

## TS基础类型有哪些

::: details 详情

- boolean
- number
- string
- symbol
- bigint
- Enum 枚举
- Array 数组
- Tuple 元祖
- Object 对象
- undefined
- null
- any、void、never、unknown

**注意**：元组是固定长度、固定类型的数组，数组是长度可变、类型统一的集合。

```ts
// 数组：长度可变，元素类型相同
const arr: number[] = [1, 2, 3]
arr.push(4) // ✅ 可以添加
arr[0] = 'hello' // ❌ 报错，必须是 number

// 元组：固定长度，类型可不同
const tuple: [string, number, boolean] = ['Alice', 25, true]
tuple[0] = 'Bob' // ✅ string
tuple[1] = 30 // ✅ number
tuple[2] = false // ✅ boolean
tuple[0] = 123 // ❌ 报错，必须是 string
```

:::

## keyof 和 typeof 有什么区别

::: details 详情

`typeof` 是 JS 基础用法，用于获取类型，这个很简单。

`keyof` 是 TS 语法，用于获取所有 key 的类型，例如

```ts
interface Person {
  name: string
  age: number
  location: string
}

type PersonType = keyof Person
// 等价于 type PersonType = 'name' | 'age' | 'location'
```

:::

## any void never unknown 有什么区别

::: details 详情

主要区别：

- `any` 任意类型（不进行类型检查）
- `void` 没有任何类型，和 `any` 相反
- `never` 永不存在的值的类型
- `unknown` 未知类型（一个更安全的 any）

代码示例

```ts
// void 一般定义函数返回值
function fn(): void {}

// never 函数永远抛异常，不会正常返回
function throwError(msg: string): never {
  throw new Error(msg)
}
// never 函数死循环，永远不会结束
function infiniteLoop(): never {
  while (true) {}
}

// unknown 比直接使用 any 更安全
const a: any = 'abc'
console.log(a.toUpperCase()) // 不会报错，但不安全

const b: unknown = 'abc'
// console.log( b.toUpperCase() ) // 会报错！！！
// 使用 as 转换类型，意思是告诉 TS 编译器：“我知道 b 的类型，我对安全负责”
console.log((b as string).toUpperCase())
```

:::

## TS 访问修饰符 public protected private

::: details 详情

- public 公开的，谁都能用 （默认）
- protected 受保护的，只有自己和子类可以访问
- private 私有的，仅自己可以访问

```ts
class Person {
  name: string = ''
  protected age: number = 0
  private girlfriend = '小美'

  // public protected private 也可以修饰方法、getter 等

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}
```

:::

## type 和 interface 共同和区别

**共同点**
::: details 详情

- 都能描述一个对象结构
- 都能被 class 实现
- 都能被扩展

```ts
// 接口
interface User {
  name: string
  age: number
  getName: () => string
}

// 自定义类型
type UserType = {
  name: string
  age: number
  getName: () => string
}

// class UserClass implements User {
class UserClass implements UserType {
  name = 'x'
  age = 20
  getName() {
    return this.name
  }
}
```

:::

**区别**
::: details 详情

- type 可以声明基础类型
- type 有联合类型和交差类型
- type 可以被 `typeof` 赋值

```ts
// type 基础类型
type name = string
type list = Array<string>

// type 联合类型
type info = string | number

type T1 = { name: string }
type T2 = { age: number }
type T3 = T1 | T2 // T1类型或者T2类型
const a: T3 = { name: 'x' }

// type 交叉类型
type T4 = T1 & T2 // 交叉类型 = { name: string; age: number }
const b: T4 = { age: 20, name: 'x' }

// typeof 获取类型
type T5 = typeof b // { age: number; name: string }

//【补充】还有个 keyof ，它和 typeof 完全不同，它是获取 key 类型的
type K1 = keyof T5 // "name" | "age"
const k: K1 = 'name'
```

:::

**注意**：一般我们能使用interface，就尽量使用interface

## 泛型的使用

泛型 Generics 即通用类型，可以灵活的定义类型而无需写死

::: details 详情

1. 用于函数

```ts
// Type 一般可简写为 T
function fn<T>(arg: T): T {
  return arg
}
const x1 = fn<string>('xxx')

// 可以有多个泛型，名称自己定义
function fn<T, K>(a: T, b: K) {
  console.log(a, b)
}
fn<string, number>('x', 10)
```

2. 用于class

```ts
class SomeClass<T> {
  name: T
  constructor(name: T) {
    this.name = name
  }
  getName(): T {
    return this.name
  }
}
const s1 = new SomeClass<String>('xx')
```

3. 用于 type

```ts
type Box<T> = {
  value: T
}
const stringBox: Box<string> = { value: 'hello' }
const numberBox: Box<number> = { value: 123 }

type MyFn<T, R> = (arg: T) => R
const toString: MyFn<number, string> = (n) => String(n)
const parse: MyFn<string, number> = (s) => parseInt(s)
```

4. 用于 interface

```ts
interface 接口名<T, U, R> {
  属性: T
  方法(arg: U): R
}

interface Box<T> {
  value: T
}
const stringBox: Box<string> = { value: 'hello' }
const numberBox: Box<number> = { value: 123 }

interface Calculator<T> {
  add(a: T, b: T): T
  subtract(a: T, b: T): T
}
const numCalc: Calculator<number> = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
}
```

:::

## 一些工具类

Pick：从类型中选取指定的属性，组成新类型

用途：创建精简版类型，如列表展示、公开接口
::: details 详情

```ts
interface User {
  id: number
  name: string
  age: number
  email: string
  password: string
}

// 只选取 id 和 name
type UserPreview = Pick<User, 'id' | 'name'>
// { id: number; name: string }

const preview: UserPreview = {
  id: 1,
  name: 'Alice'
}
```

:::

Omit：从类型中排除指定的属性，组成新类型。

用途：创建安全版本类型，如隐藏敏感字段、排除自动生成字段。
::: details 详情

```ts
interface User {
  id: number
  name: string
  age: number
  email: string
  password: string
}

// 排除 password，其他都保留
type PublicUser = Omit<User, 'password'>
// { id: number; name: string; age: number; email: string }

const publicUser: PublicUser = {
  id: 1,
  name: 'Alice',
  age: 25,
  email: 'alice@example.com'
}

type UserCreateDto = Omit<User, 'id' | 'createdAt'>
```

:::
