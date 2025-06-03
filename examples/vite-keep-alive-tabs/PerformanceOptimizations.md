# KeepAlive 性能优化建议

## 1. 缓存策略优化

### LRU 缓存限制
```typescript
// 限制最大缓存数量为活跃标签数的 50%
const MAX_CACHE = Math.ceil(TOTAL_TABS * 0.5);
```

### 智能缓存清理
```typescript
// 基于用户行为的智能清理
const cleanupStrategy = {
  // 超过 10 分钟未访问的标签
  inactiveTimeout: 10 * 60 * 1000,
  // 内存使用超过阈值时触发清理
  memoryThreshold: 500 * 1024 * 1024, // 500MB
  // 保留最近使用的 N 个标签
  keepRecentCount: 5
};
```

## 2. 渲染优化

### 虚拟化非激活标签
```typescript
// 只渲染可见标签 + 左右各一个标签
const visibleRange = {
  start: Math.max(0, activeIndex - 1),
  end: Math.min(tabs.length - 1, activeIndex + 1)
};
```

### 懒加载标签内容
```typescript
// 使用动态导入减少初始包体积
const TabComponent = lazy(() => 
  import(`./tabs/${tabName}`)
);
```

## 3. 内存管理

### 监控内存使用
```typescript
// 定期检查内存使用情况
if (performance.memory) {
  const usedMemory = performance.memory.usedJSHeapSize;
  if (usedMemory > MEMORY_LIMIT) {
    triggerCacheCleanup();
  }
}
```

### 组件卸载优化
```typescript
// 确保组件卸载时清理所有引用
useEffect(() => {
  return () => {
    // 清理事件监听器
    // 取消未完成的请求
    // 清理定时器
    // 释放大对象引用
  };
}, []);
```

## 4. 状态管理优化

### 分离持久化状态
```typescript
// 只缓存必要的状态
interface CachedState {
  formData: FormData;      // ✅ 需要缓存
  scrollPosition: number;  // ✅ 需要缓存
  tempData?: any;         // ❌ 不需要缓存
  apiCache?: any;         // ❌ 可以重新获取
}
```

### 使用 Immer 优化状态更新
```typescript
import { produce } from 'immer';

const updateCache = produce((draft, updates) => {
  Object.assign(draft, updates);
});
```

## 5. 监控和调试

### 性能监控
```typescript
// 监控标签切换性能
const measureTabSwitch = (fromTab: string, toTab: string) => {
  performance.mark('tab-switch-start');
  // ... 切换逻辑
  performance.mark('tab-switch-end');
  performance.measure('tab-switch', 'tab-switch-start', 'tab-switch-end');
};
```

### 缓存命中率统计
```typescript
const cacheStats = {
  hits: 0,
  misses: 0,
  hitRate: () => (hits / (hits + misses)) * 100
};
```

## 6. 最佳实践总结

1. **限制缓存数量**：不要缓存所有 20 个标签，保持 10 个左右
2. **智能预加载**：预加载相邻标签，提升切换体验
3. **定期清理**：实现基于时间和内存的双重清理机制
4. **状态分离**：只缓存用户输入和 UI 状态，业务数据重新获取
5. **性能监控**：建立完善的监控体系，及时发现问题
6. **渐进式加载**：优先加载核心功能，其他功能按需加载 