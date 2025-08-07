# Hook API

@feoe/fs-router 提供了强大的导航 Hook，让你能够在 React 组件中进行类型安全的路由导航。

## useNavigation

`useNavigation` 是 @feoe/fs-router 的核心导航 Hook，提供了完整的路由导航功能，包括历史记录操作、路由跳转和 URL 构建等。

### 基本用法

```tsx
import { useNavigation } from '@feoe/fs-router'

function MyComponent() {
  const navigation = useNavigation()
  
  return (
    <div>
      <button onClick={() => navigation.back()}>返回</button>
      <button onClick={() => navigation.forward()}>前进</button>
      <button onClick={() => navigation.reload()}>刷新</button>
    </div>
  )
}
```

### API 方法

#### back()

返回到浏览器历史记录的上一页。

```tsx
const navigation = useNavigation()

// 返回上一页
navigation.back()
```

#### forward()

前进到浏览器历史记录的下一页。

```tsx
const navigation = useNavigation()

// 前进到下一页
navigation.forward()
```

#### reload()

重新加载当前页面。

```tsx
const navigation = useNavigation()

// 刷新当前页面
navigation.reload()
```

#### push(path, params?, query?)

导航到指定路由，会在历史记录中添加新条目。

```tsx
const navigation = useNavigation()

// 基本导航
navigation.push('/users')

// 带参数的导航
navigation.push('/users/:id', { id: '123' })

// 带查询参数的导航
navigation.push('/users', undefined, { page: '1', size: '10' })
```

#### replace(path, params?, query?)

替换当前路由，不会在历史记录中添加新条目。

```tsx
const navigation = useNavigation()

// 替换当前路由
navigation.replace('/login')

// 带参数替换
navigation.replace('/users/:id', { id: '456' })
```

#### buildHref(path, params?, query?)

构建指定路由的 URL 字符串，不执行导航。

```tsx
const navigation = useNavigation()

// 构建简单 URL
const userListUrl = navigation.buildHref('/users')

// 构建带参数的 URL
const userDetailUrl = navigation.buildHref('/users/:id', { id: '123' })

// 构建带查询参数的 URL
const searchUrl = navigation.buildHref('/search', undefined, { q: 'react' })
```

### 基础导航示例

#### 历史记录导航

```tsx
import { useNavigation } from '@feoe/fs-router'

function NavigationControls() {
  const navigation = useNavigation()
  
  return (
    <div className="navigation-controls">
      <button 
        onClick={() => navigation.back()}
        className="nav-button"
      >
        ← 返回
      </button>
      
      <button 
        onClick={() => navigation.forward()}
        className="nav-button"
      >
        前进 →
      </button>
      
      <button 
        onClick={() => navigation.reload()}
        className="nav-button"
      >
        🔄 刷新页面
      </button>
    </div>
  )
}
```

#### 实际应用场景

```tsx
import { useNavigation } from '@feoe/fs-router'

function UserProfile() {
  const navigation = useNavigation()
  
  const handleCancel = () => {
    // 取消编辑时返回上一页
    navigation.back()
  }
  
  const handleSaveSuccess = () => {
    // 保存成功后刷新页面显示最新数据
    navigation.reload()
  }
  
  const handleError = () => {
    // 发生错误时重新加载页面
    navigation.reload()
  }
  
  return (
    <div>
      <h1>用户资料</h1>
      <button onClick={handleCancel}>取消</button>
      <button onClick={handleSaveSuccess}>保存</button>
    </div>
  )
}
```

### 高级导航示例

#### 路由跳转和替换

```tsx
import { useNavigation } from '@feoe/fs-router'

function ProductList() {
  const navigation = useNavigation()
  
  const handleViewProduct = (productId: string) => {
    // 导航到产品详情页，添加到历史记录
    navigation.push('/products/:id', { id: productId })
  }
  
  const handleEditProduct = (productId: string) => {
    // 导航到编辑页面，带查询参数
    navigation.push('/products/:id/edit', { id: productId }, { mode: 'edit' })
  }
  
  const handleLogin = () => {
    // 替换当前页面为登录页，不添加到历史记录
    navigation.replace('/login')
  }
  
  return (
    <div>
      <button onClick={() => handleViewProduct('123')}>查看产品</button>
      <button onClick={() => handleEditProduct('123')}>编辑产品</button>
      <button onClick={handleLogin}>登录</button>
    </div>
  )
}
```

#### URL 构建示例

```tsx
import { useNavigation } from '@feoe/fs-router'

function LinkGenerator() {
  const navigation = useNavigation()
  
  // 构建各种类型的 URL
  const homeUrl = navigation.buildHref('/')
  const userProfileUrl = navigation.buildHref('/users/:id', { id: '456' })
  const searchUrl = navigation.buildHref('/search', undefined, { 
    q: 'react', 
    category: 'frontend' 
  })
  
  return (
    <div>
      <a href={homeUrl}>首页</a>
      <a href={userProfileUrl}>用户资料</a>
      <a href={searchUrl}>搜索结果</a>
    </div>
  )
}
```

#### 复杂导航场景

```tsx
import { useNavigation } from '@feoe/fs-router'

function ShoppingCart() {
  const navigation = useNavigation()
  
  const handleCheckout = () => {
    // 导航到结账页面，带购物车信息
    navigation.push('/checkout', undefined, { 
      from: 'cart',
      items: '3'
    })
  }
  
  const handleContinueShopping = () => {
    // 返回到商品列表，保持筛选条件
    navigation.push('/products', undefined, {
      category: 'electronics',
      sort: 'price'
    })
  }
  
  const handleEmptyCart = () => {
    // 清空购物车后刷新页面
    // 这里可以先清空数据，然后刷新
    navigation.reload()
  }
  
  return (
    <div>
      <button onClick={handleCheckout}>去结账</button>
      <button onClick={handleContinueShopping}>继续购物</button>
      <button onClick={handleEmptyCart}>清空购物车</button>
    </div>
  )
}
```

## 类型安全导航

@feoe/fs-router 提供了完整的 TypeScript 支持，通过自动生成的 `RouteTypes` 接口确保路由导航的类型安全。

### RouteTypes 接口

`RouteTypes` 接口会根据你的路由文件结构自动生成，包含所有可用的路由路径：

```typescript
// 自动生成的类型文件 (routes-type.ts)
declare module "@feoe/fs-router" {
  interface RouteTypes {
    "/": {};
    "/users": {};
    "/users/:id": {};
    "/products/:id": {};
    "/products/:id/edit": {};
    "/search": {};
    "/checkout": {};
  }
}
```

### 类型安全的路由导航

使用 `useNavigation` 时，所有的路由路径都会有完整的类型检查：

```tsx
import { useNavigation } from '@feoe/fs-router'

function TypeSafeNavigation() {
  const navigation = useNavigation()
  
  // ✅ 正确：路径存在于 RouteTypes 中
  navigation.push('/users')
  navigation.push('/users/:id', { id: '123' })
  
  // ❌ 错误：TypeScript 会报错，路径不存在
  // navigation.push('/invalid-path')
  
  // ✅ 正确：参数类型检查
  navigation.push('/products/:id', { id: '456' })
  
  // ❌ 错误：缺少必需的参数
  // navigation.push('/products/:id')
  
  return <div>类型安全的导航示例</div>
}
```

### 路由参数类型推导

@feoe/fs-router 会自动推导路由参数的类型，确保参数的正确性：

```tsx
import { useNavigation } from '@feoe/fs-router'

function ParameterTypeInference() {
  const navigation = useNavigation()
  
  // 自动推导参数类型
  const handleUserNavigation = (userId: string) => {
    // id 参数是必需的，类型为 string | number | boolean
    navigation.push('/users/:id', { id: userId })
  }
  
  const handleProductNavigation = (productId: number) => {
    // 支持多种参数类型
    navigation.push('/products/:id', { id: productId })
  }
  
  const handleOptionalParams = () => {
    // 可选参数的处理
    navigation.push('/search/:category?', { category: 'electronics' })
    // 或者不传递可选参数
    navigation.push('/search/:category?')
  }
  
  return (
    <div>
      <button onClick={() => handleUserNavigation('123')}>
        查看用户
      </button>
      <button onClick={() => handleProductNavigation(456)}>
        查看产品
      </button>
      <button onClick={handleOptionalParams}>
        搜索
      </button>
    </div>
  )
}
```

### 类型安全的 URL 构建

`buildHref` 方法同样支持完整的类型检查：

```tsx
import { useNavigation } from '@feoe/fs-router'

function TypeSafeUrlBuilder() {
  const navigation = useNavigation()
  
  // 类型安全的 URL 构建
  const buildUrls = () => {
    // ✅ 正确：所有参数都有类型检查
    const userUrl = navigation.buildHref('/users/:id', { id: '123' })
    const productUrl = navigation.buildHref('/products/:id', { id: 456 })
    const searchUrl = navigation.buildHref('/search', undefined, { 
      q: 'react',
      page: '1' 
    })
    
    return { userUrl, productUrl, searchUrl }
  }
  
  const urls = buildUrls()
  
  return (
    <div>
      <p>用户链接: {urls.userUrl}</p>
      <p>产品链接: {urls.productUrl}</p>
      <p>搜索链接: {urls.searchUrl}</p>
    </div>
  )
}
```

## 参数处理和查询参数

### 路由参数处理

@feoe/fs-router 支持必需参数和可选参数的处理：

```tsx
import { useNavigation } from '@feoe/fs-router'

function ParameterHandling() {
  const navigation = useNavigation()
  
  // 必需参数
  const handleRequiredParams = () => {
    // 必须提供 id 参数
    navigation.push('/users/:id', { id: '123' })
    navigation.push('/posts/:userId/:postId', { 
      userId: '456', 
      postId: '789' 
    })
  }
  
  // 可选参数
  const handleOptionalParams = () => {
    // 可选参数可以不提供
    navigation.push('/search/:category?')
    // 或者提供可选参数
    navigation.push('/search/:category?', { category: 'tech' })
  }
  
  // 混合参数
  const handleMixedParams = () => {
    // 必需参数 + 可选参数
    navigation.push('/users/:id/posts/:postId?', { 
      id: '123',
      postId: '456' // 可选
    })
  }
  
  return (
    <div>
      <button onClick={handleRequiredParams}>必需参数</button>
      <button onClick={handleOptionalParams}>可选参数</button>
      <button onClick={handleMixedParams}>混合参数</button>
    </div>
  )
}
```

### 查询参数使用

查询参数通过第三个参数传递，支持任意键值对：

```tsx
import { useNavigation } from '@feoe/fs-router'

function QueryParameters() {
  const navigation = useNavigation()
  
  const handleSearch = () => {
    // 基本查询参数
    navigation.push('/search', undefined, { 
      q: 'react',
      page: '1',
      size: '10'
    })
  }
  
  const handleFilter = () => {
    // 复杂查询参数
    navigation.push('/products', undefined, {
      category: 'electronics',
      brand: 'apple',
      minPrice: '100',
      maxPrice: '1000',
      sort: 'price-asc',
      inStock: 'true'
    })
  }
  
  const handlePagination = (page: number, size: number) => {
    // 动态查询参数
    navigation.push('/users', undefined, {
      page: page.toString(),
      size: size.toString(),
      sort: 'created_at',
      order: 'desc'
    })
  }
  
  return (
    <div>
      <button onClick={handleSearch}>搜索查询</button>
      <button onClick={handleFilter}>产品筛选</button>
      <button onClick={() => handlePagination(2, 20)}>分页导航</button>
    </div>
  )
}
```

### 复杂路由场景

结合路由参数和查询参数的复杂使用场景：

```tsx
import { useNavigation } from '@feoe/fs-router'

function ComplexRouting() {
  const navigation = useNavigation()
  
  const handleUserProfile = (userId: string, tab?: string) => {
    // 路由参数 + 可选查询参数
    const query = tab ? { tab } : undefined
    navigation.push('/users/:id', { id: userId }, query)
  }
  
  const handleProductSearch = (category: string, filters: Record<string, string>) => {
    // 路由参数 + 多个查询参数
    navigation.push('/categories/:category', { category }, filters)
  }
  
  const handleDashboard = (userId: string, options: {
    view?: 'grid' | 'list'
    period?: 'day' | 'week' | 'month'
    refresh?: boolean
  }) => {
    // 复杂的参数组合
    const query: Record<string, string> = {}
    if (options.view) query.view = options.view
    if (options.period) query.period = options.period
    if (options.refresh) query.refresh = 'true'
    
    navigation.push('/dashboard/:userId', { userId }, query)
  }
  
  const buildComplexUrl = () => {
    // 构建复杂 URL 而不导航
    const url = navigation.buildHref(
      '/admin/users/:id/settings/:section?',
      { id: '123', section: 'profile' },
      { 
        edit: 'true',
        returnTo: '/admin/users',
        timestamp: Date.now().toString()
      }
    )
    
    console.log('构建的 URL:', url)
    return url
  }
  
  return (
    <div>
      <button onClick={() => handleUserProfile('123', 'settings')}>
        用户资料
      </button>
      <button onClick={() => handleProductSearch('electronics', { 
        brand: 'apple', 
        price: '100-1000' 
      })}>
        产品搜索
      </button>
      <button onClick={() => handleDashboard('456', { 
        view: 'grid', 
        period: 'week' 
      })}>
        仪表板
      </button>
      <button onClick={buildComplexUrl}>
        构建复杂 URL
      </button>
    </div>
  )
}
```

### 最佳实践

#### 参数验证

```tsx
import { useNavigation } from '@feoe/fs-router'

function BestPractices() {
  const navigation = useNavigation()
  
  const handleSafeNavigation = (id: string | number) => {
    // 参数验证
    if (!id) {
      console.error('ID 参数不能为空')
      return
    }
    
    // 类型转换
    const safeId = typeof id === 'number' ? id.toString() : id
    navigation.push('/users/:id', { id: safeId })
  }
  
  const handleConditionalNavigation = (user: { id: string; role: string }) => {
    // 条件导航
    const basePath = user.role === 'admin' ? '/admin/users/:id' : '/users/:id'
    const query = user.role === 'admin' ? { admin: 'true' } : undefined
    
    navigation.push(basePath, { id: user.id }, query)
  }
  
  return (
    <div>
      <button onClick={() => handleSafeNavigation('123')}>
        安全导航
      </button>
      <button onClick={() => handleConditionalNavigation({ 
        id: '456', 
        role: 'admin' 
      })}>
        条件导航
      </button>
    </div>
  )
}
```