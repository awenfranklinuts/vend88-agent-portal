# 一次性使用 Token - 快速参考

## 📌 核心要求

**每个注册链接只能使用一次。提交后无法再次使用。**

---

## 🔄 状态流程

```
生成 Token
    ↓
pending (待处理)
    ↓
客户提交表单 ← 只能一次！
    ↓
submitted (已提交) ← Token 锁定
    ↓
管理员审核
    ↓
approved (批准) 或 rejected (拒绝) ← 最终状态
```

---

## ✅ 必须实现

### 1. Token 验证
```javascript
if (status === 'submitted' || status === 'approved' || status === 'rejected') {
  return { valid: false, used: true }
}
```

### 2. 提交检查
```javascript
if (registration.status !== 'pending') {
  throw new Error('Token 已使用')
}
```

### 3. 状态更新
```javascript
// 提交时
status: 'pending' → 'submitted'
submitted_at: NOW()
```

---

## 🚫 禁止操作

❌ 同一 token 提交两次  
❌ 已提交后修改数据（通过表单）  
❌ 将 status 从 submitted 改回 pending  
❌ 批准/拒绝后重用 token

---

## 📝 API 端点

### 生成 Token
```
POST /registration/generate
Response: { token, link, status: 'pending' }
```

### 验证 Token
```
GET /registration/validate-token/:token
Response: { valid, used, expired, reason }
```

### 提交表单
```
POST /registration/submit
Body: { token, ...formData }
Check: status must be 'pending'
```

---

## 💬 错误消息

### Token 已使用
```
"此注册表单已提交。每个链接只能使用一次。如需修改，请联系管理员。"
```

### Token 过期
```
"此注册链接已过期。链接有效期为 30 天。请联系管理员获取新链接。"
```

### 无效 Token
```
"无效的注册链接。请检查 URL 或联系管理员。"
```

---

## 🧪 测试用例

| 测试 | 操作 | 预期结果 |
|------|------|----------|
| 1 | 首次提交 | ✅ 成功 |
| 2 | 二次提交（同一 token） | ❌ 失败："已使用" |
| 3 | 批准后尝试提交 | ❌ 失败："已使用" |
| 4 | 拒绝后尝试提交 | ❌ 失败："已使用" |
| 5 | 验证已用 token | ❌ `used: true` |

---

## 📊 数据库约束

```sql
-- 确保 token 只能提交一次
ALTER TABLE registrations 
ADD CONSTRAINT check_single_submission 
CHECK (
  (status = 'pending' AND submitted_at IS NULL) 
  OR 
  (status IN ('submitted', 'approved', 'rejected') 
   AND submitted_at IS NOT NULL)
);
```

---

## 🎯 实施步骤

1. ✅ 创建数据库表
2. ✅ 实现 token 生成（加密安全）
3. ✅ 实现验证端点（检查 used 状态）
4. ✅ 实现提交端点（拒绝已用 token）
5. ✅ 添加数据库约束
6. ✅ 测试重复提交防护

---

## 📚 完整文档

- `ONE_TIME_USE_REQUIREMENT.md` - 完整指南 + 代码示例
- `GENERATE_FORM_API.md` - API 规范（英文）
- `REGISTRATION_API_SPEC.md` - 完整 API 文档
- `IMPLEMENTATION_SUMMARY.md` - 实施总结

---

## ❓ FAQ

**Q: 客户需要修改已提交的数据？**  
A: 联系管理员 → 管理员批准/拒绝 → 管理员生成新 token → 客户重新填写

**Q: Token 过期时间？**  
A: 30 天

**Q: 可以重置 token 吗？**  
A: 不可以。生成新 token。

**Q: 批准后可以撤销吗？**  
A: 可以，但不能重用原 token

---

**优先级：** 🔴 高 - 安全关键  
**状态：** 等待后端实施  
**日期：** 2025年11月21日
