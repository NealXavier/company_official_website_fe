import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Footer from '@/views/front/components/Footer.vue'
import * as api from '@/api/index.js'

// Mock API调用
vi.mock('@/api/index.js', () => ({
  getFooterData: vi.fn()
}))

describe('Footer.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    })
  })

  // 1. 正常流程测试
  it('组件挂载时应该正确初始化并获取footer数据', async () => {
    const mockFooterData = {
      phone: '400-123-4567',
      email: 'contact@company.com',
      address: '北京市朝阳区科技大厦123号',
      weChatImage: '/uploads/wechat_qr.png',
      icp: '京ICP备12345678号',
      beianImage: '/uploads/beian.png',
      publicSecurity: '京公网安备12345678901234号',
      copyright: '© 2023 Company. All rights reserved.'
    }

    const mockResponse = {
      code: 0,
      data: [mockFooterData]
    }

    // 模拟API成功响应
    api.getFooterData.mockResolvedValueOnce(mockResponse)

    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证数据更新
    expect(wrapper.vm.footerData).toEqual(mockFooterData)
    // 验证API调用
    expect(api.getFooterData).toHaveBeenCalled()
  })

  // 2. 异常流程测试
  it('获取footer数据失败时应该记录错误', async () => {
    const mockError = new Error('Network error')
    // 模拟API失败响应
    api.getFooterData.mockRejectedValueOnce(mockError)

    // Mock console.error捕获错误日志
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证错误处理
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch footer data:', mockError)

    // 恢复console.error
    consoleSpy.mockRestore()
  })

  // 3. 边界条件测试
  it('应该正确显示默认的footer数据', () => {
    window.localStorage.getItem.mockReturnValue(null)
    api.getFooterData.mockResolvedValueOnce({ code: 1, message: 'error' }) // 模拟API失败

    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    // 验证显示默认数据
    expect(wrapper.text()).toContain('123-456-7890')
    expect(wrapper.text()).toContain('example@example.com')
    expect(wrapper.text()).toContain('默认地址')
  })

  // 5. 状态变更测试
  it('当获取到新的footer数据时应该更新显示', async () => {
    const mockFooterData = {
      phone: '400-123-4567',
      email: 'contact@company.com',
      address: '北京市朝阳区科技大厦123号',
      weChatImage: '/uploads/wechat_qr.png',
      icp: '京ICP备12345678号',
      beianImage: '/uploads/beian.png',
      publicSecurity: '京公网安备12345678901234号',
      copyright: '© 2023 Company. All rights reserved.'
    }

    const mockResponse = {
      code: 0,
      data: [mockFooterData]
    }

    window.localStorage.getItem.mockReturnValue(null)
    api.getFooterData.mockResolvedValueOnce(mockResponse)

    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证更新后的数据显示
    expect(wrapper.text()).toContain(mockFooterData.phone)
    expect(wrapper.text()).toContain(mockFooterData.email)
    expect(wrapper.text()).toContain(mockFooterData.address)
  })

  // 6. 生命周期测试
  it('组件挂载时应该调用fetchFooterData方法', async () => {
    const mockFooterData = {
      phone: '400-123-4567',
      email: 'contact@company.com',
      address: '北京市朝阳区科技大厦123号'
    }

    const mockResponse = {
      code: 0,
      data: [mockFooterData]
    }

    api.getFooterData.mockResolvedValueOnce(mockResponse)

    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证生命周期副作用
    expect(api.getFooterData).toHaveBeenCalled()
  })

  // 8. 依赖注入测试
  it('应该正确使用API依赖', async () => {
    const mockFooterData = {
      phone: '400-123-4567',
      email: 'contact@company.com',
      address: '北京市朝阳区科技大厦123号'
    }

    const mockResponse = {
      code: 0,
      data: [mockFooterData]
    }

    api.getFooterData.mockResolvedValueOnce(mockResponse)

    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证API依赖调用
    expect(api.getFooterData).toHaveBeenCalled()
  })

  // localStorage缓存测试
  it('应该从localStorage获取缓存的footer数据', async () => {
    const cachedFooterData = {
      phone: 'cached-400-123-4567',
      email: 'cached@company.com',
      address: '缓存地址',
      weChatImage: '/uploads/cached_wechat_qr.png',
      icp: '京ICP备11111111号',
      beianImage: '/uploads/cached_beian.png',
      publicSecurity: '京公网安备11111111111111号',
      copyright: '© 2023 Cached Company. All rights reserved.'
    }

    // 模拟localStorage中有缓存数据
    window.localStorage.getItem.mockReturnValue(JSON.stringify(cachedFooterData))

    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证使用了缓存数据
    expect(wrapper.vm.footerData).toEqual(cachedFooterData)
    expect(window.localStorage.getItem).toHaveBeenCalledWith('footerData')
  })

  it('应该将获取的footer数据缓存到localStorage', async () => {
    const mockFooterData = {
      phone: '400-123-4567',
      email: 'contact@company.com',
      address: '北京市朝阳区科技大厦123号',
      weChatImage: '/uploads/wechat_qr.png',
      icp: '京ICP备12345678号',
      beianImage: '/uploads/beian.png',
      publicSecurity: '京公网安备12345678901234号',
      copyright: '© 2023 Company. All rights reserved.'
    }

    const mockResponse = {
      code: 0,
      data: [mockFooterData]
    }

    window.localStorage.getItem.mockReturnValue(null)
    api.getFooterData.mockResolvedValueOnce(mockResponse)

    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证数据被缓存
    expect(window.localStorage.setItem).toHaveBeenCalledWith('footerData', JSON.stringify(mockFooterData))
  })

  // 基础渲染测试
  it('应该正确渲染组件结构', () => {
    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    // 检查组件是否正确渲染
    expect(wrapper.find('.footer').exists()).toBe(true)
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('h1.center').text()).toBe('联系我们')
  })

  // 数据初始化测试
  it('初始化时footerData应该有默认值', () => {
    wrapper = mount(Footer, {
      global: {
        stubs: {
          'el-icon-phone': { template: '<span>📞</span>' },
          'el-icon-message': { template: '<span>✉️</span>' },
          'el-icon-location-information': { template: '<span>📍</span>' }
        }
      }
    })

    expect(wrapper.vm.footerData).toEqual({
      phone: '123-456-7890',
      email: 'example@example.com',
      address: '默认地址',
      weChatImage: 'default-wechat-image.png',
      icp: '默认ICP',
      beianImage: 'default-beian-image.png',
      publicSecurity: '默认公安信息',
      copyright: '© 2023 默认版权'
    })
  })
})