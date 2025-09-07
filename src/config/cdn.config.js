/**
 * CDN配置文件
 * 支持开发/生产环境不同的CDN地址
 */

// 开发环境CDN配置
const devCDN = {
  baseUrl: 'https://dev-cdn.example.com',
  banners: {
    'home-banner-1.jpg': 'https://dev-cdn.example.com/banners/home-banner-1.jpg',
    'home-banner-2.jpg': 'https://dev-cdn.example.com/banners/home-banner-2.jpg',
    'home-banner-3.jpg': 'https://dev-cdn.example.com/banners/home-banner-3.jpg'
  },
  products: {
    'product-a.jpg': 'https://dev-cdn.example.com/products/product-a.jpg',
    'product-b.jpg': 'https://dev-cdn.example.com/products/product-b.jpg',
    'product-c.jpg': 'https://dev-cdn.example.com/products/product-c.jpg'
  }
};

// 生产环境CDN配置
const prodCDN = {
  baseUrl: 'https://cdn.example.com',
  banners: {
    'home-banner-1.jpg': 'https://cdn.example.com/banners/home-banner-1.jpg',
    'home-banner-2.jpg': 'https://cdn.example.com/banners/home-banner-2.jpg',
    'home-banner-3.jpg': 'https://cdn.example.com/banners/home-banner-3.jpg'
  },
  products: {
    'product-a.jpg': 'https://cdn.example.com/products/product-a.jpg',
    'product-b.jpg': 'https://cdn.example.com/products/product-b.jpg',
    'product-c.jpg': 'https://cdn.example.com/products/product-c.jpg'
  }
};

// 根据环境获取CDN配置
export function getCDNConfig() {
  return process.env.NODE_ENV === 'production' ? prodCDN : devCDN;
}

// 获取CDN图片URL
export function getCDNUrl(type, filename) {
  const config = getCDNConfig();
  
  if (config[type] && config[type][filename]) {
    return config[type][filename];
  }
  
  // 如果没有找到特定配置，返回基础URL拼接
  return `${config.baseUrl}/${type}/${filename}`;
}

// 获取主页轮播图CDN配置
export function getMainBannerCDNs() {
  const config = getCDNConfig();
  return [
    {
      id: 1,
      imageUrl: config.banners['home-banner-1.jpg'],
      title: '首页轮播图1',
      description: '欢迎来到我们的官方网站，提供优质的产品和服务',
      deleted: false
    },
    {
      id: 2,
      imageUrl: config.banners['home-banner-2.jpg'],
      title: '首页轮播图2',
      description: '专业团队，品质保证',
      deleted: false
    },
    {
      id: 3,
      imageUrl: config.banners['home-banner-3.jpg'],
      title: '首页轮播图3',
      description: '创新引领未来',
      deleted: false
    }
  ];
}

// 获取产品轮播图CDN配置
export function getProductBannerCDNs() {
  const config = getCDNConfig();
  return {
    '1': [
      {
        id: 1,
        name: '精选产品A',
        description: '高品质产品，值得信赖的选择',
        image: config.products['product-a.jpg']
      },
      {
        id: 2,
        name: '精选产品B',
        description: '创新设计，卓越性能',
        image: config.products['product-b.jpg']
      },
      {
        id: 3,
        name: '精选产品C',
        description: '环保材料，健康生活',
        image: config.products['product-c.jpg']
      }
    ]
  };
}