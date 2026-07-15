# CSS相关

## 什么是BFC

BFC（Block Formatting Context，块级格式化上下文）是 CSS 中一个重要的布局概念，它是页面中的一块独立的渲染区域，内部元素的布局不会影响到外部，外部也不会影响内部。  
**可以理解为**：给元素加了一个"结界"，结界里面的布局规则和外面隔离。
::: details 详情
满足以下任一条件即可触发：  
| 方式 | 常用度 |
| ------------------------------- | -------- |
| `float: left/right` | ⭐⭐⭐ |
| `position: absolute/fixed` | ⭐⭐⭐ |
| `display: inline-block` | ⭐⭐ |
| `display: flex/inline-flex` | ⭐⭐⭐ |
| `display: grid/inline-grid` | ⭐⭐⭐ |
| `overflow: hidden/auto/scroll` | ⭐⭐⭐⭐ 最常用 |
:::

## 常见的CSS选择器有哪些

注意区分伪类和伪元素选择器：伪类选择元素的某种状态，伪元素创建文档树中不存在的抽象元素

::: details 详情
| 选择器类型 | 示例 | 说明 |
| ------------- | ------------- | -------------------- |
| **元素选择器** | `p` | 选择所有 `<p>` 元素 |
| **类选择器** | `.button` | 选择所有 `class="button"` 的元素 |
| **ID 选择器** | `#header` | 选择 `id="header"` 的元素 |
| **通用选择器** | `*` | 选择页面中的所有元素 |
| **后代选择器** | `div p` | 选择 `div` 内的所有 `<p>` 元素 |
| **子元素选择器** | `div > p` | 选择 `div` 的直接子元素 `<p>` |
| **相邻兄弟选择器** | `h1 + p` | 选择紧接在 `<h1>` 后面的 `<p>` 元素 |
| **通用兄弟选择器** | `h1 ~ p` | 选择所有紧跟在 `<h1>` 后面的 `<p>` 元素 |
| **属性选择器** | `a[href]` | 选择具有 `href` 属性的所有 `<a>` 元素 |
| **`:hover`** | `a:hover` | 选择鼠标悬停时的 `<a>` 元素 |
| **`:first-child`** | `p:first-child` | 选择父元素中的第一个 `<p>` 元素 |
| **`:nth-child(n)`** | `li:nth-child(odd)` | 选择父元素中所有奇数位置的 `<li>` 元素 |
| **`::before`** | `p::before { content: "Note: "; }` | 在每个 `<p>` 元素的前面插入 "Note: " |
| **`::after`** | `p::after { content: "."; }` | 在每个 `<p>` 元素的后面插入一个句点 |
| **`:not()`** | `p:not(.highlight)` | 选择所有不具有 `highlight` 类的 `<p>` 元素 |
:::

## position定位

::: details 详情
| 定位 | 参照物 | 脱离文档流 | 常用场景 |
| ---------- | ----------- | -------- | ------------- |
| `static` | 无（正常位置） | ❌ 否 | 默认，不定位 |
| `relative` | 自身原位置 | ❌ 否 | 微调位置、作为 `absolute` 的容器 |
| `absolute` | 最近的非 `static` 祖先 | ✅ 是 | 弹窗、气泡、下拉菜单 |
| `fixed` | 视口（viewport） | ✅ 是 | 导航栏、回到顶部按钮 |
| `sticky` | 最近的可滚动的容器（overflow: scroll/auto/overlay） + 阈值 | ❌ 否（滚动前） | 表头吸顶、侧边栏跟随 |

注意：absolute 如果找不到非`static`祖先元素，参照的是 initial containing block（初始包含块），而不是 html 或 body 元素本身。  
注意：对于sticky，如果祖先元素都不可滚动， `viewport`（视口）有隐含的滚动机制，可以看作是可滚动容器。
:::

## overflow有哪些属性，分别有什么区别

visible 默认溢出显示；hidden 裁剪无滚动；scroll 始终有滚动条；auto 溢出才出滚动条。非 visible 值创建 BFC，影响 sticky 定位。

::: details 详情
| 值 | 作用 | 是否创建滚动机制 |
| --------- | ------------- | ----------- |
| `visible` | **默认**，内容溢出显示，不裁剪 | ❌ 否 |
| `hidden` | 溢出内容**裁剪隐藏**，不可滚动 | ✅ 是（影响 sticky 定位） |
| `scroll` | 溢出裁剪，**始终显示滚动条** | ✅ 是 |
| `auto` | 溢出时**自动显示滚动条**，不溢出不显示 | ✅ 是 |

:::

## `overflow: hidden` `display：none` 和 `visibility: hidden` 有什么区别

::: details 详情

- `overflow: hidden` 溢出内容不可见，未溢出的部分正常可见
- `display：none` 隐藏内容，不占用任何空间，内容变化不会重新渲染
- `visibility: hidden` 隐藏元素，但保留其占据的空间，内容变化会重新渲染

:::

## 关于flex-grow、flex-shrink、flex-basis

::: details 详情
| 属性 | 作用 | 默认值 |
| ------------- | ---------------------- | --------- |
| `flex-grow` | **放大**：分配容器的**剩余空间** | `0`（不放大） |
| `flex-shrink` | **缩小**：容器空间不足时**压缩自身** | `1`（允许压缩） |
| `flex-basis` | **基础尺寸**：元素在分配前的默认大小 | `auto` 或者长度单位（1px、1rem、等）或者百分比 |

- `flex-grow` 放大是**剩余空间**（总空间减去每个`flex-basis`计算得到的空间）**乘以** `flex-grow` 的比例系数。默认是0不放大。
- `flex-shrink` 缩小是**超出空间**（每个`flex-basis`计算得到的空间减去总空间）**乘以** 真正缩放比例（(元素A的`flex-shrink` \* `flex-basis` / 所有元素的 `flex-basis` \* `flex-basis`相加) \* 超出空间 ）。默认是1要缩小。
- `flex-basis` 的值设置为auto时，所占大小就是元素的宽度或者高度
- 当一个元素同时被设置了 `flex-basis` (除值为 auto 外) 和 `width` (或者在 flex-direction: column 情况下设置了height) , `flex-basis` 具有更高的优先级。
:::
