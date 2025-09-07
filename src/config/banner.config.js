/**
 * 轮播图CDN配置文件
 * 使用CDN链接优化图片加载性能
 * 支持开发/生产环境不同的CDN地址
 */

import { getBannerCDNData } from './cdn-env.config.js';

// 获取CDN数据
const cdnData = getBannerCDNData();

// 获取主页轮播图（过滤已删除的）
export function getMainBanners() {
  return cdnData.mainBanners.filter(item => !item.deleted);
}

// 获取指定ID的产品轮播图
export function getProductBannersById(id) {
  return cdnData.productBanners[id] || [];
}