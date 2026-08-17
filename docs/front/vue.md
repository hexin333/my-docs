# Vue相关

## Vue2和Vue3的主要区别

::: details 详情

1. 响应式系统
   | | Vue2 | Vue3 |
   | -------- | -------------- | ------------ |
   | **实现方式** | `Object.defineProperty` | `Proxy` |
   | **局限性** | 无法检测对象属性的新增/删除、数组索引和长度的变化 | 原生支持动态属性的增删，数组操作更完善 |
   | **性能** | 需要递归遍历所有属性进行劫持 | 惰性代理，性能更好 |

2. API 风格

- Vue2：选项式 API（Options API），逻辑按 data、methods、computed 等选项组织。
- Vue3：引入组合式 API（Composition API），通过 setup() 或 `<script setup>` 按功能逻辑组织代码，更适合复杂组件和逻辑复用。当然，Vue3 也完全兼容 Options API

3. 性能提升

- 包体积更小：Vue3 核心约 10KB（gzip），比 Vue2 减少约 41%。
- 渲染更快：重写虚拟 DOM，编译时优化（静态提升、PatchFlag 标记等）。
- Tree-shaking 友好：按需引入 API，未使用的功能不会打包。

4. TypeScript 支持

- Vue2：对 TS 支持较弱，类型推断不完善。
- Vue3：源码用 TypeScript 重写，原生提供完整的类型支持，开发体验大幅提升。

5. 模板与组件特性
   | 特性 | Vue2 | Vue3 |
   | --------------- | --------------- | ------------ |
   | **多根节点（Fragments）** | ❌ 模板只能有一个根元素 | ✅ 支持多个根节点 |
   | **Teleport** | ❌ 无 | ✅ 可将组件渲染到 DOM 其他位置（如弹窗挂载到 body） |
   | **Suspense** | ❌ 无 | ✅ 内置异步组件加载状态处理 |
   | **v-model** | 一个组件只能有一个 | 支持多个 `v-model`，语法改为 `v-model:xxx` |
   | **自定义指令** | 生命周期名：`bind/inserted/update/unbind` | 改为 `mounted/updated/unmounted`，与组件生命周期对齐 |

6. 生命周期钩子变化
   | Vue2 | Vue3 (Options API) | Vue3 (Composition API) |
   | --------------- | ------------------ | ---------------------- |
   | `beforeCreate` 组件实例刚被创建，数据观测和事件/监听器设置之前。此时无法访问 data 、 computed 和 methods 等 | `beforeCreate` | `setup()` 本身 |
   | `created` 组件实例已创建，数据观测、事件/监听器设置完成，此时可以访问 data 、 computed 和 methods 等，通常用于数据初始化。 | `created` | `setup()` 本身 |
   | `beforeMount` 在挂载开始之前，模板已编译， el 和 template 已经确定，但尚未渲染。 | `beforeMount` | `onBeforeMount` |
   | `mounted` 组件实例挂载到 DOM 上之后，此时可以访问和操作 DOM。 | `mounted` | `onMounted` |
   | `beforeUpdate` 数据发生变化，DOM 尚未更新。可以在这里做一些数据处理，避免不必要的渲染。 | `beforeUpdate` | `onBeforeUpdate` |
   | `updated` 数据变化，DOM 更新后调用。此时组件的 DOM 已经更新，可以访问和操作新的 DOM。 | `updated` | `onUpdated` |
   | `beforeDestroy` 组件实例销毁之前。可以在此阶段进行清理工作，例如移除事件监听器、定时器等。 | `beforeUnmount` | `onBeforeUnmount` |
   | `destroyed` 组件实例销毁之后。此时，所有的事件监听器和子组件已被销毁。 | `unmounted` | `onUnmounted` |

:::

## watch 和 watchEffect 的区别

::: details 详情
`watch`：需要显式声明依赖，监听指定的数据源；可以监听多个数据源或进行深度监听。 在监听的响应式数据变化后立即执行。

```ts
import { watch, reactive } from 'vue'
const state = reactive({
  count: 0
})
watch(
  () => state.count, // 显式声明监听的依赖
  (newCount, oldCount) => {
    console.log(`新值 ${newCount} 老值 ${oldCount}`)
  }
)
```

`watchEffect`：会自动追踪 作用域内所有的响应式依赖，不需要显式声明依赖。在**组件挂载时**执行一次副作用，并在 依赖发生变化时 再次执行

```ts
import { watchEffect, reactive } from 'vue'
const state = reactive({
  count: 0
})
watchEffect(() => {
  console.log(`Count 变化了: ${state.count}`) // 自动追踪 `state.count`
})
```

:::

## Vue 组件初始化的各个阶段都做了什么

::: details 详情
从组件的创建到挂载到页面，再到组件的更新和销毁，每个阶段都有特定的任务和职责。

- 组件实例创建
  当我们第一次访问页面时，Vue创建组件实例，解析props、data、methods等属性方法，在组合式API中，执行 setup()。

- 响应式系统建立
  基于 Proxy 实现 reactive、ref，建立依赖收集和触发更新机制，props 传递时自动响应式处理。

- 模板编译与渲染
  将 template 编译为渲染函数，Vue 3 通过 静态提升等方式优化性能，Vite 预编译 SFC（单文件组件）。

- DOM 挂载
  执行渲染函数生成 VNode，通过 Patch 算法 转换为真实 DOM 并插入页面，同时初始化子组件。mounted（Options API）或 onMounted（Composition API）触发，可进行 DOM 操作

- 响应式更新
  状态变更触发 Diff 算法 计算最小 DOM 更新，beforeUpdate、updated（Options API）或 onBeforeUpdate、onUpdated（Composition API）执行相应逻辑。

- 组件销毁
  移除 DOM，清理副作用（解绑事件、销毁 watcher、清理 effect），递归卸载子组件，触发 beforeUnmount、unmounted（Options API）或 onBeforeUnmount、onUnmounted（Composition API）。

:::

## Vue 模板编译的过程

::: details 详情
Vue 的模板编译过程是将开发者编写的模板语法（例如 和 v-bind 等）转换为 JavaScript 代码的过程。它主要分为三个阶段：模板解析、AST优化 和 代码生成

- 模板解析
  Vue 使用其解析器将 HTML 模板转换为 抽象语法树（AST）。在这个阶段，Vue 会分析模板中的标签、属性和指令，生成一颗树形结构。每个节点表示模板中的一个元素或属性

- AST优化
  Vue 在生成渲染函数前，会对 AST 进行优化。优化的核心目标是标记 静态节点，在渲染时，Vue 可以跳过这些静态节点，提升性能。

- 代码生成
  生成渲染函数是编译的最终阶段，这个阶段会将优化后的 AST 转换成 JavaScript 渲染函数。

:::

## 为什么 v-for 需要使用 key

::: details 详情

- 提高性能
  当 Vue 更新视图时，它会根据 key 来识别哪些元素被修改、添加或移除。如果没有 key，Vue 会依赖其默认的算法（基于元素的位置）来比较元素，这样可能导致不必要的 DOM 操作。使用 key 后，Vue 能精确地找到每个项，从而减少不必要的 DOM 重排和重绘，提升性能。

- 保持组件状态
  如果渲染的是一个组件（而不是普通的 DOM 元素），使用 key 可以确保组件在渲染更新时保持正确的状态。例如，如果列表中有表单输入框，每个输入框都有自己的状态，使用 key 可以确保输入框状态不会因列表排序或元素移除而丢失。

- 避免渲染错误
  key 的存在可以帮助 Vue 确保在列表更新时，元素的顺序和内容保持稳定，避免出现不稳定的渲染或顺序错乱。

:::

## Vue 父子组件生命周期调用顺序

Vue 父子组件的生命周期调用顺序遵循"由外到内，再由内到外"的原则——即父组件先开始，子组件先结束。
::: details 详情

- 挂载阶段

```
父 beforeCreate
    ↓
父 created
    ↓
父 beforeMount
    ↓
    ┌─────────────────────────────┐
    │      子 beforeCreate        │
    │         ↓                   │
    │      子 created             │
    │         ↓                   │
    │      子 beforeMount         │
    │         ↓                   │
    │      子 mounted  ←─────────┼── 子组件 DOM 挂载完成
    └─────────────────────────────┘
         ↓
父 mounted  ←────────────────────── 父组件 DOM 挂载完成
```

- 更新阶段

```
父 beforeUpdate
    ↓
    ┌─────────────────────────────┐
    │      子 beforeUpdate        │
    │         ↓                   │
    │      子 updated  ←─────────┼── 子组件 DOM 更新完成
    └─────────────────────────────┘
         ↓
父 updated  ←────────────────────── 父组件 DOM 更新完成
```

- 销毁 / 卸载阶段

```
父 beforeDestroy
    ↓
    ┌─────────────────────────────┐
    │      子 beforeDestroy       │
    │         ↓                   │
    │      子 destroyed  ←───────┼── 子组件销毁完成
    └─────────────────────────────┘
         ↓
父 destroyed  ←──────────────────── 父组件销毁完成
```

:::

## Vuex和Pinia有什么区别

Vuex 是"规定你怎么做"（mutations 必须同步、模块必须命名空间），Pinia 是"相信你知道怎么做"（直接修改 state、扁平化 Store），同时给你最好的 TypeScript 体验。

::: details 详情
| 对比维度 | Vuex | Pinia |
| ------------------- | ------------------ | -------------------- |
| **官方定位** | Vue2/Vue3 通用状态管理库 | Vue3 官方推荐状态管理方案（Vue2 兼容） |
| **维护状态** | Vuex 5 不再独立开发，进入维护模式 | 官方唯一活跃维护的状态管理库 |
| **设计思想** | 受 Flux/Redux 影响，强调严格规范 | 为 Composition API 时代重新设计，更灵活 |
| **核心 API** | State / Getters / Mutations / Actions | State / Getters / Actions（无 Mutations） |
| **修改 State** | 必须通过同步 `mutation` 提交 | 直接在 `action` 或组件中修改 `state` |
| **模块化** | 单一 Store + `modules` + `namespaced` | 扁平化多 Store，天然去中心化 |
| **TypeScript 支持** | 弱，需大量类型声明和辅助函数 | 原生完美支持，自动类型推导 |
| **Composition API** | 兼容但融合感差，依赖 `mapXXX` 辅助函数 | 深度契合 `<script setup>`，直接调用 |
| **包体积** | ~1.5KB (gzip) | ~1KB (gzip)，更轻量 |
| **Tree-shaking** | 不支持 | 天然支持 |
| **SSR 支持** | 配置较繁琐 | 原生支持，API 简洁 |
| **调用方式** | `this.$store.commit('module/mutation')` | `useStore()` 获取实例后直接调用 |
| **响应式解构** | 需 `mapState` 或手动 `computed` | `storeToRefs()` 直接解构保持响应式 |
| **插件生态** | 丰富但较旧 | 更现代（如持久化、数据流插件） |
| **适用场景** | 维护中的老项目、需要强制规范约束的超大型团队 | 所有新项目，尤其是 Vue3 + TypeScript 项目 |

**vuex使用**

```js
// stroe/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { app }
})

// stroe/modules/app.js
export default {
  namespaced: true,
  state: {
    // 导航栏显示方式
    isPhoneMenuShow: false,
    // 测试用
    themeModel: 'light'
  },
  mutations: {
    // 设置导航栏显示方式
    setPhoneMenuShow(state, val) {
      state.isPhoneMenuShow = val
    },
    // 测试用
    setThemeModel(state, val) {
      state.themeModel = val
    }
  },
  // 为了确保状态变更的可追踪性和可预测性，在actions中进行异步操作，也是方便调试找问题
  actions: {
    setThemeModelAsync({ commit }, val) {
      setTimeout(() => {
        commit('setThemeModel', val)
      }, 1000)
    }
  }
}

// 使用
<div>主题：{{ $store.state.app.themeModel }}</div>
this.$store.commit('app/setThemeModel', 'dark')

```

**Pinia使用**

```js
// store/index.ts
import { createPinia } from 'pinia'
import type { App } from 'vue'

export function setupStore(app: App<Element>) {
  app.use(createPinia())
}

// store/modules/app.ts
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 导航栏显示方式
    isPhoneMenuShow: false,
    // 测试用
    themeModel: 'light'
  }),
  actions: {
    // 设置导航栏显示方式
    setPhoneMenuShow(val: boolean) {
      this.isPhoneMenuShow = val
    },
    setThemeModel(val: 'dark' | 'light') {
      this.themeModel = val
    },
    setThemeModelAsync(val: 'dark' | 'light') {
      setTimeout(() => {
        this.themeModel = val
      }, 2000)
    }
  }
})

// 使用
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

<div>主题：{{ appStore.themeModel }}</div>
appStore.setThemeModel('dark')
```

:::

## Vue和React的区别

::: details 详情

- 核心设计理念对比
  | 维度 | Vue | React |
  | ----------- | --------------------- | ---------------------- |
  | **设计哲学** | **渐进式框架**：核心轻量，按需叠加（路由、状态管理等官方生态） | **UI 库**：专注视图层，生态由社区驱动（Next.js、Redux 等） |
  | **封装粒度** | **组件 + 指令**：模板语法（`v-if`、`v-for`）降低样板代码 | **纯 JavaScript**：一切皆 JS，逻辑通过 Hooks/函数组合 |
  | **响应式心智模型** | **自动追踪依赖**：修改数据即更新视图，开发者无感知 | **显式状态管理**：通过 `setState` 或 Hooks 触发重新渲染 |
  | **学习曲线** | 平缓：HTML/CSS/JS 分离，模板直观 | 陡峭：JSX、Hooks 规则、函数式编程思维 |

  **Vue3 Composition API**

  ```js
  import { ref, computed, watch } from 'vue'

  const count = ref(0)
  const double = computed(() => count.value * 2)

  watch(count, (newVal) => {
    console.log('count changed:', newVal)
  })

  count.value++ // 直接修改，自动触发更新
  ```

  **React Hooks 示例**

  ```js
  import { useState, useEffect, useMemo } from 'react'

  function Counter() {
    const [count, setCount] = useState(0)
    const double = useMemo(() => count * 2, [count])

    useEffect(() => {
      console.log('count changed:', count)
    }, [count])

    return <button onClick={() => setCount(count + 1)}>{count}</button>
  }
  ```

- 模板 vs JSX  
  **模板**：接近原生 HTML，指令（v-if、v-for）简洁直观，适合设计师和新手。  
  **编译优化**：Vue 在编译阶段分析模板，做静态提升、PatchFlag 靶向更新。

  **JSX**: JS 的完整表达能力（条件渲染、循环都是原生 JS），逻辑和视图高度融合。  
  **灵活性**：可以在 JSX 中写任意 JS 表达式，但样板代码相对较多。

- 渲染机制对比
  | 维度 | Vue | React |
  | ----------- | ---------------- | ------------------ |
  | **虚拟 DOM** | 有，但编译时做大量优化（静态提升、PatchFlag） | 有，运行时 Diff，React 18 引入并发渲染 |
  | **更新粒度** | **组件级自动追踪**：精确到具体属性/子树 | **组件级重新渲染**：默认整个组件重执行，需 `memo`/`useMemo` 优化 |
  | **编译优化** | 强（模板编译时生成靶向更新代码） | 弱（JSX 编译为 `React.createElement`，运行时难以静态分析） |
  | **并发/异步渲染** | Vue 3.2+ 支持 `<Suspense>`，但非核心 | React 18 核心特性：Concurrent Features、Time Slicing |

:::
