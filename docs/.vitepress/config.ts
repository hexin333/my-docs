import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    server: {
      port: 7001,
      strictPort: true,
      open: false
    }
  },
  // ======= 应用级配置选项 =======
  lang: 'zh-CN',
  title: '我的文档',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  description: '记录一些前后端以及AI相关的知识',
  // ======= 主题级配置选项 =======
  themeConfig: {
    logo: '/logo.png',
    siteTitle: '我的文档',
    aside: true,
    outline: {
      label: '目录',
    },
    lastUpdatedText: '最后更新于',
    docFooter: {
      prev: false,
      next: false
    },
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    nav: [
      { text: '前端', link: '/front/base' },
      { text: '后端', link: '/back/intro' },
      { text: 'AI', link: '/ai/intro' }
    ],
    sidebar: {
      '/front/': [
        {
          text: '基础知识',
          collapsed: false,
          items: [
            { text: '计算机基础', link: '/front/base' },
            { text: 'HTML', link: '/front/html' },
            { text: 'CSS', link: '/front/css' },
            { text: 'JavaScript', link: '/front/js' },
            { text: 'TypeScript', link: '/front/ts' },
          ]
        },
        {
          text: '框架相关',
          collapsed: false,
          items: [
            { text: 'Vue', link: '/front/vue' },
            { text: 'React', link: '/front/react' }
          ]
        }
      ]
    }
  }
})