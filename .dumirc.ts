import {defineConfig} from 'dumi';


const repo = 'web-development-book'
export default defineConfig({
  themeConfig: {
    base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
    publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
    name: 'WebBook',
    logo: '/web.png',
    nav: [
      {
        title: 'React',
        link: '/react',
      },
      {
        title: '常用开发',
        link: '/common',
      },
    ],
    sidebar: {
      '/react': [
        {
          title: 'react',
          children: [
            {
              title: 'hooks',
              link: '/react/hooks',
            },
            {
              title: 'render',
              link: '/react/render',
            },
          ],
        },
      ],
      '/common': [
        {
          title: '常用开发',
          children: [
            {
              title: '正则表达式',
              link: '/common/regular_expression',
            },
          ],
        },
      ],
    },
    showLineNum: true
  },
});
