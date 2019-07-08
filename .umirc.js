//import { IConfig } from 'umi-types';
// ref: https://umijs.org/config/


export default {
  treeShaking: true,

  "proxy": {
    "/api": {
      "target": "http://114.212.189.141:30170/",
      "changeOrigin": true,
    },
    "/kiali": {
      "target": "http://114.212.189.141:31597/",
      "changeOrigin": true
    }
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'typhoon-tree',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}
