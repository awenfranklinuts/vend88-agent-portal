# ⚠️ IMPORTANT: One-Time-Use Token Requirement

## 概述 (Overview)

**Critical Security Requirement:** Registration tokens are **ONE-TIME-USE ONLY**. Once a customer submits the registration form, that token becomes invalid and cannot be used again.

**关键安全要求：** 注册 token **只能使用一次**。客户提交注册表单后，该 token 将失效，无法再次使用。

---

## 为什么需要一次性使用？(Why One-Time Use?)

### Security Reasons (安全原因)
1. **Prevent duplicate submissions** (防止重复提交)
2. **Prevent data tampering** - user cannot resubmit with different data (防止数据篡改)
3. **Clear audit trail** - one token = one submission (清晰的审计跟踪)
4. **Prevent sharing** - token cannot be shared and used multiple times (防止共享)

### Business Reasons (业务原因)
1. **One business = one registration** (一个商家=一次注册)
2. **Admin controls new registrations** (管理员控制新注册)
3. **Clear workflow** - Generate → Submit → Review → Approve/Reject (清晰的工作流程)

---

## Implementation Requirements (实施要求)

### ✅ What Must Happen (必须做的事)

1. **When form is submitted:**
   ```
   Status: pending → submitted
   submitted_at: Set current timestamp
   ```

2. **When validating token:**
   ```javascript
   if (status === 'submitted' || status === 'approved' || status === 'rejected') {
     return {
       valid: false,
       used: true,
       reason: "This registration form has already been submitted..."
     }
   }
   ```

3. **When attempting second submission:**
   ```
   HTTP 400 Bad Request
   {
     "success": false,
     "error": "This token has already been used"
   }
   ```

### ❌ What Must NOT Happen (不能做的事)

1. ❌ Do NOT allow resubmission with same token
2. ❌ Do NOT allow editing via the public form after submission
3. ❌ Do NOT reset status back to "pending" once submitted
4. ❌ Do NOT allow token reuse even if rejected

---

## Status Flow (状态流程)

```
┌─────────┐
│ pending │  ← Token just generated
└────┬────┘
     │
     │ Customer submits form
     │ ✅ FIRST TIME: Allow
     │ ❌ SECOND TIME: Reject!
     ↓
┌───────────┐
│ submitted │  ← Token now LOCKED
└─────┬─────┘
      │
      │ Admin reviews
      ↓
   ┌──────┐
   │ approved │  or  │ rejected │
   └─────────┘      └──────────┘
      ↑                    ↑
      └────────────────────┘
      Both are FINAL states
      Token can NEVER be reused
```

---

## Code Examples (代码示例)

### Token Validation (Node.js)

```javascript
// GET /registration/validate-token/:token
app.get('/registration/validate-token/:token', async (req, res) => {
  const { token } = req.params;
  
  const registration = await db.query(
    'SELECT status, expires_at FROM registrations WHERE token = ?',
    [token]
  );
  
  if (!registration) {
    return res.json({
      success: true,
      data: {
        valid: false,
        expired: false,
        used: false,
        reason: 'Invalid registration link'
      }
    });
  }
  
  // ⚠️ CHECK IF ALREADY USED
  if (['submitted', 'approved', 'rejected'].includes(registration.status)) {
    return res.json({
      success: true,
      data: {
        valid: false,
        expired: false,
        used: true,  // ← IMPORTANT!
        reason: 'This registration form has already been submitted. Each link can only be used once. Please contact the admin if you need to make changes.'
      }
    });
  }
  
  // Check expiration
  if (new Date() > new Date(registration.expires_at)) {
    return res.json({
      success: true,
      data: {
        valid: false,
        expired: true,
        used: false,
        reason: 'This registration link has expired'
      }
    });
  }
  
  // Token is valid
  return res.json({
    success: true,
    data: {
      valid: true,
      expired: false,
      used: false
    }
  });
});
```

### Form Submission (Node.js)

```javascript
// POST /registration/submit
app.post('/registration/submit', async (req, res) => {
  const { token, ...formData } = req.body;
  
  // Find registration
  const registration = await db.query(
    'SELECT id, status FROM registrations WHERE token = ?',
    [token]
  );
  
  if (!registration) {
    return res.status(400).json({
      success: false,
      error: 'Invalid token'
    });
  }
  
  // ⚠️ CRITICAL CHECK: Prevent resubmission
  if (registration.status !== 'pending') {
    return res.status(400).json({
      success: false,
      error: 'This token has already been used. Each registration link can only be used once.'
    });
  }
  
  // Update registration
  await db.query(
    `UPDATE registrations 
     SET status = 'submitted',
         submitted_at = NOW(),
         business_name = ?,
         contact_email = ?,
         ... (other fields)
     WHERE token = ? AND status = 'pending'`,
    [formData.business_name, formData.contact_email, ..., token]
  );
  
  return res.json({
    success: true,
    message: 'Registration submitted successfully'
  });
});
```

---

## Testing Requirements (测试要求)

### Test Cases (测试用例)

✅ **Test 1: First submission succeeds**
```bash
POST /registration/submit
Body: { token: "valid_token", ... }
Expected: 200 OK, status changes to "submitted"
```

❌ **Test 2: Second submission fails**
```bash
POST /registration/submit
Body: { token: "same_token_as_test1", ... }
Expected: 400 Bad Request, error: "token already used"
```

✅ **Test 3: Validation shows used status**
```bash
GET /registration/validate-token/same_token_as_test1
Expected: 200 OK, { valid: false, used: true, ... }
```

❌ **Test 4: Cannot reuse after approval**
```bash
# After admin approves the registration
POST /registration/submit
Body: { token: "approved_token", ... }
Expected: 400 Bad Request, error: "token already used"
```

❌ **Test 5: Cannot reuse after rejection**
```bash
# After admin rejects the registration
POST /registration/submit
Body: { token: "rejected_token", ... }
Expected: 400 Bad Request, error: "token already used"
```

---

## Frontend Integration (前端集成)

The frontend already handles this correctly:

```typescript
// Before showing form, validate token
const validation = await fetch(`/api/registration/validate-token/${token}`);
const { data } = await validation.json();

if (data.used) {
  // Show error message: form already submitted
  showErrorMessage(data.reason);
  disableForm();
}

if (data.valid) {
  // Allow user to fill form
  showForm();
}
```

---

## Database Constraint (数据库约束)

Add a unique constraint to ensure no duplicate submissions:

```sql
-- Ensure token can only be submitted once
ALTER TABLE registrations 
ADD CONSTRAINT check_single_submission 
CHECK (
  (status = 'pending' AND submitted_at IS NULL) 
  OR 
  (status IN ('submitted', 'approved', 'rejected') AND submitted_at IS NOT NULL)
);

-- Index for fast lookup
CREATE INDEX idx_token_status ON registrations(token, status);
```

---

## Error Messages (错误消息)

### English
- **Token already used:** "This registration form has already been submitted. Each link can only be used once. Please contact the admin if you need to make changes."
- **Token expired:** "This registration link has expired. Links are valid for 30 days. Please contact the admin for a new link."
- **Invalid token:** "Invalid registration link. Please check the URL or contact the admin."

### 中文
- **Token 已使用:** "此注册表单已提交。每个链接只能使用一次。如需修改，请联系管理员。"
- **Token 已过期:** "此注册链接已过期。链接有效期为 30 天。请联系管理员获取新链接。"
- **无效 Token:** "无效的注册链接。请检查 URL 或联系管理员。"

---

## FAQ

**Q: What if customer needs to change submitted data?**  
**A:** Customer must contact admin. Admin can:
1. Approve/reject the current submission
2. Generate a NEW token if needed
3. Customer fills form again with new token

**Q: 如果客户需要更改已提交的数据怎么办？**  
**A:** 客户必须联系管理员。管理员可以：
1. 批准/拒绝当前提交
2. 如需要则生成新 token
3. 客户使用新 token 重新填写表单

---

**Priority:** 🔴 HIGH - Security Critical  
**Status:** Required for MVP  
**Updated:** November 21, 2025
