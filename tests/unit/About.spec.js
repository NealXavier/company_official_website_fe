import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import About from '@/views/front/About.vue'
import * as api from '@/api/index.js'

// Mock Element Plus components
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
vi.mock('@/views/front/components/Banner.vue', () => ({
  default: {
    template: '<div class="banner-mock"></div>',
    name: 'Banner'
  }
}))

vi.mock('@/views/front/components/Nav.vue', () => ({
  default: {
    template: '<div class="nav-mock"></div>',
    name: 'Nav'
  }
}))

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

  it('应该正确渲染组件结构', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': {
            template: '<div class="el-breadcrumb"><slot></slot></div>'
          },
          'el-breadcrumb-item': {
            template: '<div class="el-breadcrumb-item"><slot></slot></div>'
          },
          'el-card': {
            template: '<div class="el-card"><slot></slot></div>'
          },
          'Nav': {
            template: '<div class="nav-mock"></div>'
          },
          'Banner': {
            template: '<div class="banner-mock"></div>'
          },
          'Footer': {
            template: '<div class="footer-mock"></div>'
          }
        }
      }
    })

    // 检查组件是否正确渲染
    expect(wrapper.find('.page').exists()).toBe(true)
    expect(wrapper.find('.container').exists()).toBe(true)
  })

  it('应该正确渲染面包屑导航', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': {
            template: '<div class="el-breadcrumb"><slot></slot></div>'
          },
          'el-breadcrumb-item': {
            template: '<div class="el-breadcrumb-item"><slot></slot></div>'
          },
          'el-card': {
            template: '<div class="el-card"><slot></slot></div>'
          },
          'Nav': {
            template: '<div class="nav-mock"></div>'
          },
          'Banner': {
            template: '<div class="banner-mock"></div>'
          },
          'Footer': {
            template: '<div class="footer-mock"></div>'
          }
        }
      }
    })

    const breadcrumb = wrapper.find('.el-breadcrumb')
    expect(breadcrumb.exists()).toBe(true)

    const breadcrumbItems = wrapper.findAll('.el-breadcrumb-item')
    expect(breadcrumbItems.length).toBe(2)
    expect(breadcrumbItems[0].text()).toContain('首页')
    expect(breadcrumbItems[1].text()).toContain('关于我们')
  })

  it('初始化时imageUrl应该为空字符串', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': {
            template: '<div class="el-breadcrumb"><slot></slot></div>'
          },
          'el-breadcrumb-item': {
            template: '<div class="el-breadcrumb-item"><slot></slot></div>'
          },
          'el-card': {
            template: '<div class="el-card"><slot></slot></div>'
          },
          'Nav': {
            template: '<div class="nav-mock"></div>'
          },
          'Banner': {
            template: '<div class="banner-mock"></div>'
          },
          'Footer': {
            template: '<div class="footer-mock"></div>'
          }
        }
      }
    })

    expect(wrapper.vm.imageUrl).toBe('')
  })

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
          'el-breadcrumb': {
            template: '<div class="el-breadcrumb"><slot></slot></div>'
          },
          'el-breadcrumb-item': {
            template: '<div class="el-breadcrumb-item"><slot></slot></div>'
          },
          'el-card': {
            template: '<div class="el-card"><slot></slot></div>'
          },
          'Nav': {
            template: '<div class="nav-mock"></div>'
          },
          'Banner': {
            template: '<div class="banner-mock"></div>'
          },
          'Footer': {
            template: '<div class="footer-mock"></div>'
          }
        }
      }
    })
    await flushPromises()

    expect(api.getAboutById).toHaveBeenCalledWith(1)
  })

  it('成功获取图片URL后应该更新imageUrl', async () => {
    const mockImageUrl = 'https://example.com/about-image.jpg'
    const mockResponse = {
      data: {
        imageUrl: mockImageUrl
      }
    }

    api.getAboutById.mockResolvedValueOnce(mockResponse)

    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': {
            template: '<div class="el-breadcrumb"><slot></slot></div>'
          },
          'el-breadcrumb-item': {
            template: '<div class="el-breadcrumb-item"><slot></slot></div>'
          },
          'el-card': {
            template: '<div class="el-card"><slot></slot></div>'
          },
          'Nav': {
            template: '<div class="nav-mock"></div>'
          },
          'Banner': {
            template: '<div class="banner-mock"></div>'
          },
          'Footer': {
            template: '<div class="footer-mock"></div>'
          }
        }
      }
    })
    await flushPromises()

    expect(wrapper.vm.imageUrl).toBe(mockImageUrl)
  })

  it('获取图片URL失败时应该记录错误', async () => {
    const mockError = new Error('Network error')
    api.getAboutById.mockRejectedValueOnce(mockError)

    // Mock console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': {
            template: '<div class="el-breadcrumb"><slot></slot></div>'
          },
          'el-breadcrumb-item': {
            template: '<div class="el-breadcrumb-item"><slot></slot></div>'
          },
          'el-card': {
            template: '<div class="el-card"><slot></slot></div>'
          },
          'Nav': {
            template: '<div class="nav-mock"></div>'
          },
          'Banner': {
            template: '<div class="banner-mock"></div>'
          },
          'Footer': {
            template: '<div class="footer-mock"></div>'
          }
        }
      }
    })
    await flushPromises()

    expect(consoleSpy).toHaveBeenCalledWith('API request failed:', mockError)

    // 恢复console.error
    consoleSpy.mockRestore()
  })

  it('当imageUrl有值时应该渲染图片', async () => {
    const mockImageUrl = 'https://example.com/about-image.jpg'
    const mockResponse = {
      data: {
        imageUrl: mockImageUrl
      }
    }

    api.getAboutById.mockResolvedValueOnce(mockResponse)

    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': {
            template: '<div class="el-breadcrumb"><slot></slot></div>'
          },
          'el-breadcrumb-item': {
            template: '<div class="el-breadcrumb-item"><slot></slot></div>'
          },
          'el-card': {
            template: '<div class="el-card"><slot></slot></div>'
          },
          'Nav': {
            template: '<div class="nav-mock"></div>'
          },
          'Banner': {
            template: '<div class="banner-mock"></div>'
          },
          'Footer': {
            template: '<div class="footer-mock"></div>'
          }
        }
      }
    })
    await flushPromises()

    const image = wrapper.find('.about-image')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe(mockImageUrl)
    expect(image.attributes('alt')).toBe('关于我们图片')
  })

  it('当imageUrl为空时不应该渲染图片', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': {
            template: '<div class="el-breadcrumb"><slot></slot></div>'
          },
          'el-breadcrumb-item': {
            template: '<div class="el-breadcrumb-item"><slot></slot></div>'
          },
          'el-card': {
            template: '<div class="el-card"><slot></slot></div>'
          },
          'Nav': {
            template: '<div class="nav-mock"></div>'
          },
          'Banner': {
            template: '<div class="banner-mock"></div>'
          },
          'Footer': {
            template: '<div class="footer-mock"></div>'
          }
        }
      }
    })

    const image = wrapper.find('.about-image')
    expect(image.exists()).toBe(false)
  })

  it('应该正确应用样式类', () => {
    wrapper = mount(About, {
      global: {
        stubs: {
          'el-breadcrumb': {
            template: '<div class="el-breadcrumb"><slot></slot></div>'
          },
          'el-breadcrumb-item': {
            template: '<div class="el-breadcrumb-item"><slot></slot></div>'
          },
          'el-card': {
            template: '<div class="el-card"><slot></slot></div>'
          },
          'Nav': {
            template: '<div class="nav-mock"></div>'
          },
          'Banner': {
            template: '<div class="banner-mock"></div>'
          },
          'Footer': {
            template: '<div class="footer-mock"></div>'
          }
        }
      }
    })

    expect(wrapper.find('.page').exists()).toBe(true)
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('.top').exists()).toBe(true)
  })
})