import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import About from '@/views/front/About.vue'
import * as api from '@/api/index.js'

// flushPromises 是什么作用
//   1. 等待所有Promise完成
//   2. 确保异步操作结果可预测
//   3. 避免竞态条件
//   4. 提高测试的可靠性

// Mock Element Plus components

// 替代了源码的 import 组件的作用，防止引入新的组件
vi.mock('element-plus', () => ({
  ElBreadcrumb: {
    template: '<div class="el-breadcrumb"><slot></slot></div>',
    name: 'ElBreadcrumb'
  },
  ElBreadcrumbItem: {
    template: '<div class="el-breadcrumb-item"><slot></slot></div>',
    name: 'ElBreadcrumbItem'
  },
  ElCard: {
    template: '<div class="el-card"><slot></slot></div>',
    name: 'ElCard'
  }
}))

// Mock API调用
vi.mock('@/api/index.js', () => ({
  getAboutById: vi.fn()
}))

// Mock子组件
// 替代了 import Banner from "@/views/front/components/Banner.vue"
vi.mock('@/views/front/components/Banner.vue', () => ({
  default: {
    template: '<div class="banner-mock"></div>',
    name: 'Banner'
  }
}))

// 替代了 import Nav from "@/views/front/components/Nav.vue"
vi.mock('@/views/front/components/Nav.vue', () => ({
  default: {
    template: '<div class="nav-mock"></div>',
    name: 'Nav'
  }
}))

// 替代了 import Footer from "@/views/front/components/Footer.vue"
vi.mock('@/views/front/components/Footer.vue', () => ({
  default: {
    template: '<div class="footer-mock"></div>',
    name: 'Footer'
  }
}))

describe('About.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1. 正常流程测试
  it('组件挂载时应该正确初始化并获取图片数据', async () => {
    const mockResponse = {
      data: {
        imageUrl: 'https://example.com/about-image.jpg'
      }
    }

    // 模拟API成功响应
    api.getAboutById.mockResolvedValueOnce(mockResponse)

    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })

    await flushPromises()

    // 验证数据更新
    expect(wrapper.vm.imageUrl).toBe('https://example.com/about-image.jpg')
    // 验证API调用
    expect(api.getAboutById).toHaveBeenCalledWith(1)
  })

  // 2. 异常流程测试
  it('获取图片URL失败时应该记录错误', async () => {
    const mockError = new Error('Network error')
    // 模拟API失败响应
    api.getAboutById.mockRejectedValueOnce(mockError)

    // Mock console.error捕获错误日志
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })
    await flushPromises()

    // 验证错误处理
    expect(consoleSpy).toHaveBeenCalledWith('API request failed:', mockError)

    // 恢复console.error
    consoleSpy.mockRestore()
  })

  // 3. 边界条件测试
  it('当imageUrl为空时不应该渲染图片', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })

    // 验证边界条件处理
    const image = wrapper.find('.about-image')
    expect(image.exists()).toBe(false)
  })

  // 4. 用户操作测试
  it('应该正确渲染面包屑导航', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })

    const breadcrumbItems = wrapper.findAll('.el-breadcrumb-item')
    // 验证数组边界 - 确保有2个面包屑项
    expect(breadcrumbItems.length).toBe(2)
  })

  // 5. 状态变更测试
  it('当imageUrl有值时应该渲染图片', async () => {
    const mockImageUrl = 'https://example.com/about-image.jpg'
    const mockResponse = { data: { imageUrl: mockImageUrl } }

    api.getAboutById.mockResolvedValueOnce(mockResponse)

    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })
    await flushPromises()

    // 验证条件渲染
    const image = wrapper.find('.about-image')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe(mockImageUrl)
  })

  // 6. 生命周期测试
  it('组件挂载时应该调用fetchAboutImage方法', async () => {
    const mockResponse = {
      data: {
        imageUrl: 'https://example.com/about-image.jpg'
      }
    }

    api.getAboutById.mockResolvedValueOnce(mockResponse)

    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })
    await flushPromises()

    // 验证生命周期副作用
    expect(api.getAboutById).toHaveBeenCalledWith(1)
  })

  // 8. 依赖注入测试
  it('应该正确使用API依赖', async () => {
    const mockResponse = { data: { imageUrl: 'https://example.com/image.jpg' } }
    api.getAboutById.mockResolvedValueOnce(mockResponse)

    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })
    await flushPromises()

    // 验证API依赖调用
    expect(api.getAboutById).toHaveBeenCalledWith(1)
  })

  // 10. 兼容性测试
  it('应该在不同环境下正确渲染', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          // 确保在不同环境下组件stub正确配置
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })

    expect(wrapper.find('.page').exists()).toBe(true)
  })

  // 基础渲染测试
  it('应该正确渲染组件结构', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })

    // 检查组件是否正确渲染
    expect(wrapper.find('.page').exists()).toBe(true)
    expect(wrapper.find('.container').exists()).toBe(true)
  })

  // 数据初始化测试
  it('初始化时imageUrl应该为空字符串', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })

    expect(wrapper.vm.imageUrl).toBe('')
  })

  // 样式类测试
  it('应该正确应用样式类', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': { template: '<div class="el-breadcrumb"><slot></slot></div>' },
          'el-breadcrumb-item': { template: '<div class="el-breadcrumb-item"><slot></slot></div>' },
          'el-card': { template: '<div class="el-card"><slot></slot></div>' },
          'Nav': { template: '<div class="nav-mock"></div>' },
          'Banner': { template: '<div class="banner-mock"></div>' },
          'Footer': { template: '<div class="footer-mock"></div>' }
        }
      }
    })

    expect(wrapper.find('.page').exists()).toBe(true)
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('.top').exists()).toBe(true)
  })
})