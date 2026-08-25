/**
 * 应用入口 - 自定义入口绕过 expo/AppEntry.js 的跨包相对路径解析
 *
 * 为什么不用默认的 "main": "node_modules/expo/AppEntry.js"?
 * AppEntry.js 内部以 '../../App' 相对路径引用应用根组件, 在 pnpm 的
 * 符号链接目录结构 (.pnpm) 下, Metro 按真实路径解析会定位失败。
 * 自定义入口直接引用 './App', 无跨包边界问题。
 */
import { registerRootComponent } from 'expo';

import App from './App';

// 注册根组件, 同时适配原生 (AppRegistry) 与 Web (ReactDOM.render)
registerRootComponent(App);
