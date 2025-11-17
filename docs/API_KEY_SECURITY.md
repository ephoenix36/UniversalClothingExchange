# 🔐 API Key Security Documentation

## For Developers & Platform Administrators

This document explains how API keys are handled securely in the Universal Clothing Exchange platform.

---

## Security Architecture

### User API Keys (Gemini)

**Storage**:
- Encrypted at rest in PostgreSQL database
- Never exposed in API responses
- Not included in logs or error messages
- Accessible only to the owning user

**Transmission**:
- Never sent to client (browser)
- Used only in server-side API routes
- Sent directly to Google's APIs via HTTPS
- No intermediary storage or caching

**Access Control**:
- Whop authentication required
- User can only CRUD their own key
- No admin access to user keys
- Automatic deletion on account removal

---

## Environment Variables

### .env.local (Development)
```bash
# Admin/Demo key - NEVER use in production
GEMINI_API_KEY=AIza...your_dev_key_here

# Other sensitive keys
STRIPE_TEST_SECRET_KEY=sk_test_...
WHOP_API_KEY=...
DATABASE_URL=...
```

### Production Environment
```bash
# NO admin Gemini key in production!
# GEMINI_API_KEY should NOT be set

# Only these are needed:
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
WHOP_API_KEY=...
NEXT_PUBLIC_WHOP_APP_ID=...
```

---

## Code Implementation

### User Key Retrieval

```typescript
// ✅ CORRECT - Get user's key from database
const user = await prisma.user.findUnique({
  where: { whopUserId },
  select: { geminiApiKey: true },
});

// Use user's key for AI features
const result = await analyzeClothingImage(imageUrl, user.geminiApiKey);
```

```typescript
// ❌ WRONG - Never use admin key for user requests
const result = await analyzeClothingImage(imageUrl, process.env.GEMINI_API_KEY);
```

### API Response Sanitization

```typescript
// ✅ CORRECT - Never expose key
return NextResponse.json({
  success: true,
  hasKey: !!user.geminiApiKey, // Boolean only
});
```

```typescript
// ❌ WRONG - Exposes secret key!
return NextResponse.json({
  success: true,
  apiKey: user.geminiApiKey, // NEVER DO THIS
});
```

---

## Database Schema

### User Model (Prisma)

```prisma
model User {
  id              String   @id @default(cuid())
  
  // Other fields...
  
  // Gemini API key - stored encrypted
  geminiApiKey    String?  // Optional, user provides their own
  
  // AI usage tracking
  aiCreditsUsed   Int      @default(0)
  creditsPeriodStart DateTime?
  aiPhotoConsent  Boolean  @default(false)
  aiConsentDate   DateTime?
}
```

**Security Notes**:
- `geminiApiKey` is nullable - not all users need AI
- No default value - forces explicit user input
- Separate consent tracking for compliance

---

## API Endpoints Security

### 1. Save User API Key
`POST /api/users/gemini-key`

**Security Measures**:
- ✅ Authentication required (Whop token)
- ✅ Input validation (must start with 'AIza')
- ✅ User can only save their own key
- ✅ Key never returned in response
- ✅ Audit log entry created

**Request**:
```json
{
  "geminiApiKey": "AIza...user_key"
}
```

**Response**:
```json
{
  "success": true,
  "message": "API key saved successfully"
  // Key NOT included
}
```

### 2. Check Key Status
`GET /api/users/gemini-key`

**Security Measures**:
- ✅ Returns boolean only
- ✅ Never exposes actual key
- ✅ User-specific access

**Response**:
```json
{
  "success": true,
  "hasKey": true  // Boolean, not the key!
}
```

### 3. Delete API Key
`DELETE /api/users/gemini-key`

**Security Measures**:
- ✅ Confirmation required in UI
- ✅ Immediate revocation
- ✅ Cascade deletion on account removal

---

## Production Deployment Checklist

### Before Deploy

- [ ] Remove `GEMINI_API_KEY` from `.env` and `.env.local`
- [ ] Verify no hardcoded API keys in code
- [ ] Check all API responses don't leak keys
- [ ] Test user key flow end-to-end
- [ ] Verify encryption at rest
- [ ] Confirm HTTPS-only transmission

### Environment Setup

```bash
# Vercel/Production - DO NOT SET THESE:
❌ GEMINI_API_KEY  # Users provide their own

# Only set these:
✅ DATABASE_URL
✅ STRIPE_SECRET_KEY
✅ WHOP_API_KEY
✅ UPLOADTHING_SECRET
✅ NEXT_PUBLIC_*  # Public vars only
```

### Code Review Checklist

```typescript
// Search codebase for these patterns:

❌ process.env.GEMINI_API_KEY (except in lib/gemini.ts for fallback)
❌ hardcoded "AIza..." strings
❌ apiKey: user.geminiApiKey in responses
❌ console.log(apiKey) or similar logging
❌ Unvalidated API key inputs
```

---

## Incident Response

### If Admin Key is Compromised

1. **Immediate**:
   - Revoke key in Google AI Studio
   - Generate new key
   - Update development environments only
   - Verify key not in git history

2. **Investigation**:
   - Check if used in production (it shouldn't be)
   - Review access logs
   - Identify exposure point

3. **Prevention**:
   - Add key to `.gitignore`
   - Use secret scanning tools
   - Rotate periodically

### If User Key is Compromised

1. **User Action Required**:
   - User goes to Settings
   - Clicks "Remove API Key"
   - Revokes in Google Cloud Console
   - Generates new key
   - Re-adds to platform

2. **Platform Support**:
   - Notify user via email/notification
   - Provide revocation instructions
   - Offer to force-remove key if requested

---

## Compliance & Privacy

### GDPR
- ✅ User consent required before saving key
- ✅ Right to access (user can view status)
- ✅ Right to deletion (remove key endpoint)
- ✅ Data portability (key is user's, not ours)
- ✅ Processing transparency (user guide)

### CCPA
- ✅ Disclosure of data collection
- ✅ Opt-out mechanism (don't save key)
- ✅ No sale of user keys
- ✅ Deletion on request

### SOC 2 (Future)
- Encryption at rest ✅
- Access controls ✅
- Audit logging (to implement)
- Incident response plan ✅

---

## Monitoring & Logging

### What to Log
✅ API key creation (timestamp, user ID)
✅ API key deletion (timestamp, user ID)
✅ Failed key validations
✅ AI feature usage (count, not content)

### What NOT to Log
❌ Actual API keys
❌ API key validation attempts (could leak key)
❌ AI request/response content
❌ User photos or personal data

### Example Log Entry
```json
{
  "timestamp": "2025-11-04T19:30:00Z",
  "event": "gemini_key_saved",
  "userId": "user_abc123",
  "ipAddress": "192.168.1.1",
  "success": true
  // No API key included!
}
```

---

## Testing

### Unit Tests
```typescript
describe('Gemini Key Security', () => {
  it('should not expose key in API response', async () => {
    const response = await GET(mockRequest);
    const data = await response.json();
    
    expect(data.geminiApiKey).toBeUndefined();
    expect(data.hasKey).toBeDefined();
  });
  
  it('should require authentication', async () => {
    const response = await POST(unauthenticatedRequest);
    expect(response.status).toBe(401);
  });
  
  it('should validate key format', async () => {
    const response = await POST({ geminiApiKey: 'invalid' });
    expect(response.status).toBe(400);
  });
});
```

### Security Scan
```bash
# Check for exposed secrets
npm install -g @trufflesecurity/trufflehog
trufflehog filesystem . --only-verified

# Check dependencies
npm audit
npm audit fix

# Static analysis
npm install -g eslint-plugin-security
eslint . --plugin security
```

---

## Documentation for Users

Location: `/AI_FEATURES_USER_GUIDE.md`

Key Topics Covered:
- ✅ Why they need their own key
- ✅ How to get a Gemini API key
- ✅ Privacy guarantees
- ✅ Cost transparency
- ✅ Security best practices
- ✅ Troubleshooting
- ✅ Usage monitoring

---

## Future Enhancements

### Planned Features
1. **Key Rotation Reminders** - Notify users to rotate keys quarterly
2. **Usage Analytics** - Show user their monthly AI usage
3. **Cost Estimation** - Predict monthly Google bill
4. **Multi-Key Support** - Different keys for different features
5. **Enterprise SSO** - Managed keys for team accounts

### Security Improvements
1. **Encryption Key Rotation** - Rotate database encryption keys
2. **Key Expiration** - Force renewal after 1 year
3. **Anomaly Detection** - Alert on unusual API usage
4. **Rate Limiting** - Per-user rate limits to prevent abuse

---

**Version**: 1.0  
**Last Updated**: November 4, 2025  
**Owner**: Platform Security Team  
**Review Cycle**: Quarterly
