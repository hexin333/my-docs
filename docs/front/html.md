# HTML相关

## DOCTYPE 是什么

DOCTYPE 是 Document Type Declaration，文档类型声明，告诉浏览器当前 HTML 文档使用哪个版本的标准来解析。
::: details 详情
历史版本对比：  
| HTML 版本 | DOCTYPE 声明 |
| -------------- | ------------------------------- |
| **HTML5** | `<!DOCTYPE html>` |
| HTML 4.01 Strict | `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">` |
| HTML 4.01 Transitional | `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">` |
| XHTML 1.0 Strict | `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">` |

:::

## meta 标签是干什么的，都有什么属性和作用

`<meta>` 标签用于描述 HTML 文档的元数据（metadata），不会显示在页面上，但浏览器、搜索引擎、社交媒体等会读取这些信息。
::: details 详情
| 属性组合 | 用途 | 示例 |
| --- | --- | --- |
| `charset` | 指定字符编码 | `<meta charset="UTF-8">` |
| `name` + `content` | 控制页面在移动设备上的显示和缩放行为 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| `name` + `content` | 搜索引擎优化（SEO） | `<meta name="description" content="页面描述，搜索引擎结果展示">`<br/>`<meta name="keywords" content="关键词1, 关键词2">`<br/>`<meta name="author" content="作者名">`<br/>`<meta name="robots" content="index, follow">` |
:::

## 常见的inline元素

::: details 详情
`a`, `span`, `img`, `strong`, `em`, `b`, `i`, `abbr`, `code`, `br`, `q`（引用）, `sub`（下标）, `sup`（上标）
:::

## 常见的block元素

::: details 详情
`div`, `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `ul`, `ol`, `li`, `form`, `section`, `article`, `footer`, `header`, `nav`
:::

## 常见的inline-block元素

::: details 详情
`input`, `button`
:::

## offsetHeight、scrollHeight、clientHeight 有什么区别

::: details 详情
`offsetHeight` 包括内容高度（content）、内边距（padding）、边框（border）、水平滚动条高度（如果存在）。不包括外边距（margin）。

`scrollHeight` 包括内容高度（content）、内边距（padding）、不可见的溢出部分（scrollable content）。不包括边框（border）、水平滚动条高度（如果存在）、外边距（margin）。大于等于 `clientHeight`。

`clientHeight` 包括内容高度（content）、内边距（padding）。不包括边框（border）、水平滚动条高度（如果存在）、外边距（margin）。
:::

## Node 和 Element 有什么区别

在 DOM（文档对象模型）中，HTML Element 和 Node 都是表示文档结构中的对象，但它们有不同的定义和用途。
::: details 详情
Node 是 DOM 树中所有类型对象的基类，是一个接口，表示文档树中的一个节点。它有多个子类型，Element 是其中的一个。其他的还有 Text、Comment 等。

Node 常见属性如 `nodeName` `nodeValue`

HTML Element 是 Node 的子类，专门表示 HTML 元素节点。它提供了与 HTML 元素相关的更多功能，如属性、样式等。HTML Element 仅表示 HTML 元素节点，通常对应 HTML 标签，如 `<div>`, `<p>`, `<a>` 等。

Element 常见属性和方法如 `innerHTML` `getAttribute` `setAttribute`
:::
