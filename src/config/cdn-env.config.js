/**
 * CDN环境配置文件
 * 支持开发/生产环境不同的CDN地址配置
 */

// 开发环境配置
const devConfig = {
  cdnBaseUrl: 'https://dev-cdn.yoursite.com',
  banners: {
    banner1: 'https://dev-cdn.yoursite.com/banners/banner-1.jpg',
    banner2: 'https://dev-cdn.yoursite.com/banners/banner-2.jpg',
    banner3: 'https://dev-cdn.yoursite.com/banners/banner-3.jpg'
  },
  products: {
    product1: 'https://dev-cdn.yoursite.com/products/product-1.jpg',
    product2: 'https://dev-cdn.yoursite.com/products/product-2.jpg',
    product3: 'https://dev-cdn.yoursite.com/products/product-3.jpg'
  }
};

// 生产环境配置
const prodConfig = {
  cdnBaseUrl: 'https://cdn.yoursite.com',
  banners: {
    banner1: 'https://cdn.yoursite.com/banners/banner-1.jpg',
    banner2: 'https://cdn.yoursite.com/banners/banner-2.jpg',
    banner3: 'https://cdn.yoursite.com/banners/banner-3.jpg'
  },
  products: {
    product1: 'https://cdn.yoursite.com/products/product-1.jpg',
    product2: 'https://cdn.yoursite.com/products/product-2.jpg',
    product3: 'https://cdn.yoursite.com/products/product-3.jpg'
  }
};

// 获取当前环境的CDN配置
export function getCurrentCDNConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? prodConfig : devConfig;
}

// 获取指定类型的CDN URL
export function getCDNUrl(type, key) {
  const config = getCurrentCDNConfig();
  
  if (config[type] && config[type][key]) {
    return config[type][key];
  }
  
  // 如果没有找到特定配置，返回基础URL拼接
  return `${config.cdnBaseUrl}/${type}/${key}`;
}

// 获取完整的CDN配置数据
export function getBannerCDNData() {
  const config = getCurrentCDNConfig();
  
  return {
    mainBanners: [
      {
        id: 1,
        imageUrl: config.banners.banner1,
        title: '首页轮播图1',
        description: '欢迎来到我们的官方网站，提供优质的产品和服务',
        deleted: false
      },
      {
        id: 2,
        imageUrl: config.banners.banner2,
        title: '首页轮播图2',
        description: '专业团队，品质保证',
        deleted: false
      },
      {
        id: 3,
        imageUrl: config.banners.banner3,
        title: '首页轮播图3',
        description: '创新引领未来',
        deleted: false
      }
    ],
    productBanners: {
      '1': [
        {
          id: 1,
          name: '精选产品A',
          description: '高品质产品，值得信赖的选择',
          image: config.products.product1
        },
        {
          id: 2,
          name: '精选产品B',
          description: '创新设计，卓越性能',
          image: config.products.product2
        },
        {
          id: 3,
          name: '精选产品C',
          description: '环保材料，健康生活',
          image: config.products.product3
        }
      ]
    }
  };
}