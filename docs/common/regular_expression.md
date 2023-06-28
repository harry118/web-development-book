# 常用正则表达式

### 1. 手机号中间四位脱敏处理

```typescript
const desensitization = (str: string) => {
  return str.replace(/^(\d{3})(?:\d{4})(\d{4})/, '$1****$2');
};
```
