/**
 * Metro 打包器配置
 *
 * unstable_enableSymlinks: pnpm 的 node_modules 采用符号链接结构
 * (node_modules/expo -> .pnpm/expo@x.x.x/node_modules/expo),
 * 开启后 Metro 才能正确解析跨符号链接的模块路径。
 */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enableSymlinks = true;

module.exports = config;
