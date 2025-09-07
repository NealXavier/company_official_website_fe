<template>
    <div>
        <el-carousel :interval="5000" arrow="always" :height="carouselHeight">
            <el-carousel-item v-for="(item, i) in swiperList" :key="item || i">
                <el-image :src="item.imageUrl" alt="" style="width:100%;height:100%" fit="cover"
                    @error="handleImageError" />
            </el-carousel-item>
            
        </el-carousel>
    </div>
</template>

<script>
import { getAllCarousels } from '@/api/index.js' // 导入API方法

export default {
    name: 'Banner',
    components: {},
    props: {},
    watch: {},
    data() {
        return {
            swiperList: [],
            carouselHeight: '500px', // 默认高度
        };
    },

    mounted() {
        console.log('Component mounted'); // 确认组件挂载
        this.fetchSwiperList(); // 组件挂载后获取数据
        window.addEventListener('resize', this.setCarouselHeight);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.setCarouselHeight);
    },
    methods: {
        async fetchSwiperList() {
            try {
                const response = await getAllCarousels();
                console.log('API response:', response);
                if (response && response.data) {
                    // 直接使用后端的CDN地址，不需要额外处理
                    this.swiperList = response.data.filter(item => !item.deleted);
                    console.log('CDN swiperList:', this.swiperList);
                } else {
                    console.error('API response does not contain data');
                }
            } catch (error) {
                console.error('获取轮播图数据失败:', error);
            }
        },
        encodeUrl(url) {
            const [baseUrl, queryString] = url.split('?');
            if (!queryString) return baseUrl;
            return baseUrl + '?' + queryString.split('&').map(param => {
                const [key, value] = param.split('=');
                return `${key}=${encodeURIComponent(value)}`;
            }).join('&');
        },
        // getFullImageUrl(url) {
        //     if (!url) return '';
            
        //     // 如果已经是完整URL（http/https），直接返回（支持CDN地址）
        //     if (url.startsWith('http')) {
        //         return url;
        //     }
            
        //     // 如果不是完整URL，使用后端地址拼接（兼容旧数据）
        //     const baseUrl = process.env.NODE_ENV === 'production' 
        //         ? 'http://81.71.17.188:8088'  // 生产环境
        //         : 'http://127.0.0.1:8088';    // 开发环境
            
        //     // 确保URL格式正确
        //     return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
        // },
        handleImageError(event) {
            console.error('图片加载失败:', event.target.src);
            event.target.src = require('@/assets/banner/default.jpg'); // 替换为默认图片路径
        },
        setCarouselHeight() {
            if (window.innerWidth <= 768) {
                this.carouselHeight = '200px'; // 将移动端高度调整为200px
            } else {
                this.carouselHeight = '500px';
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  overflow: hidden;
}

.el-carousel {
  width: 100%;
}

.el-carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .el-carousel {
    height: 200px;
  }
  
  .el-image {
    object-position: center; // 确保图片居中显示
  }
}
</style>