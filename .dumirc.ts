import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'dumi-docs',
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
  },
});
