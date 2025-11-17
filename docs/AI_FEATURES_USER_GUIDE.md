# AI Features - User Guide

## 🤖 Google Gemini AI Integration

Universal Clothing Exchange uses Google's Gemini AI to provide intelligent fashion features. **You control your own AI usage** by providing your personal API key.

---

## 🔐 Why You Need Your Own API Key

**Privacy & Security**:
- Your API key = Your control
- No shared usage with other users
- You monitor your own billing
- Your data stays between you and Google

**Cost Control**:
- Most users stay within Google's free tier
- You can set your own usage limits
- No surprise charges from us
- Transparent billing through Google Cloud

---

## 📋 How to Get Your Gemini API Key

### Step 1: Visit Google AI Studio
Go to: https://makersuite.google.com/app/apikey

### Step 2: Sign In
Use your Google account to sign in

### Step 3: Create API Key
1. Click "Get API Key" or "Create API Key"
2. Select your Google Cloud project (or create one)
3. Copy the generated key (starts with `AIza...`)

### Step 4: Add to Platform
1. Go to **Settings** in the Universal Clothing Exchange
2. Find "Google Gemini API Key" section
3. Paste your key
4. Click "Save API Key"

✅ **Done!** AI features are now enabled.

---

## 💡 What AI Features Do You Get?

### 1. Auto-Populate Clothing Details
Upload a photo → AI detects:
- Category (shirt, dress, pants, etc.)
- Colors (top 3 dominant colors)
- Pattern (solid, striped, floral, etc.)
- Style (casual, formal, athletic, etc.)
- Care suggestions

### 2. Virtual Try-On Descriptions
Select any item → Get personalized advice:
- How it fits different body types
- Flattering styling tips
- Outfit pairing suggestions
- Occasion recommendations
- Color combination ideas

### 3. Personalized Style Recommendations
Based on your wardrobe → AI suggests:
- Items to complete outfits
- Gaps in your wardrobe
- Versatile pieces to add
- Seasonal must-haves
- Budget-friendly finds

### 4. Smart Collection Ideas
AI analyzes your items and suggests:
- Themed collections
- Seasonal groupings
- Color-coordinated sets
- Capsule wardrobes

---

## 💰 Pricing & Usage

### Google Gemini API Pricing

**Free Tier** (most users never exceed):
- 60 requests per minute
- 1,500 requests per day
- No credit card required initially

**Paid Usage** (if you exceed free tier):
- ~$0.001-0.005 per request
- Typically $1-5/month for active users
- Full pricing: https://ai.google.dev/pricing

### Platform AI Credits

Your Universal Clothing Exchange subscription includes monthly AI credit limits:

| Tier | Monthly Credits | Typical Usage |
|------|----------------|---------------|
| **Basic** | 10 | ~10 clothing analyses |
| **Standard** | 50 | ~50 analyses or try-ons |
| **Pro** | 200 | Unlimited analysis |

**Note**: Credits limit platform usage, not Google billing. You pay Google directly for actual API usage.

---

## 🔒 Security & Privacy

### Your API Key
- ✅ Encrypted in our database
- ✅ Never exposed to other users
- ✅ Never logged or stored in plain text
- ✅ Only used for your AI requests
- ✅ Can be removed anytime

### Your Photos
- ✅ Processed temporarily for AI analysis
- ✅ Not stored permanently (unless you save the item)
- ✅ Never used to train AI models
- ✅ Not shared with third parties
- ✅ Explicit consent required

### Your Data
- ✅ Requests sent directly to Google
- ✅ We don't intercept or modify responses
- ✅ No tracking of AI conversations
- ✅ You control data retention

---

## ⚙️ Managing Your API Key

### View Status
Settings → Google Gemini API Key → See if configured

### Update Key
Settings → Remove current key → Add new key

### Remove Key
Settings → Remove API Key → Confirm
(Disables all AI features)

### Monitor Usage
1. Go to Google Cloud Console
2. Navigate to "APIs & Services"
3. View "Gemini API" usage
4. Set up billing alerts

---

## 🛡️ Best Practices

### DO:
✅ Keep your API key private
✅ Set up billing alerts in Google Cloud
✅ Monitor your usage monthly
✅ Revoke and regenerate keys if compromised
✅ Use different keys for testing vs production

### DON'T:
❌ Share your API key with others
❌ Commit API keys to public repositories
❌ Use the same key across multiple services
❌ Ignore Google billing notifications
❌ Store keys in insecure locations

---

## 🐛 Troubleshooting

### "Please add your Gemini API key in Settings"
**Solution**: You haven't added an API key yet
1. Get key from Google AI Studio
2. Add in Settings
3. Try again

### "Invalid API key format"
**Solution**: API key must start with `AIza`
- Check you copied the entire key
- No extra spaces or characters
- Get a new key if corrupted

### "No AI credits remaining"
**Solution**: You've used your monthly platform credits
- Upgrade your subscription tier
- Wait for monthly reset
- Credits don't affect Google billing

### "API key exceeded quota"
**Solution**: You've hit Google's rate limits
- Wait for quota to reset
- Upgrade Google Cloud plan
- Check Google Cloud Console for details

---

## 📊 Example Usage Costs

**Typical User** (Standard tier, 30 items/month):
- Clothing analyses: 30 requests
- Try-on descriptions: 10 requests
- Recommendations: 5 requests
- **Total Google Cost**: $0.05 - $0.25/month

**Power User** (Pro tier, 100 items/month):
- Clothing analyses: 100 requests
- Try-on descriptions: 50 requests
- Recommendations: 20 requests
- **Total Google Cost**: $0.50 - $2.00/month

**Most users stay FREE** with Google's generous free tier!

---

## 🆘 Need Help?

**Google API Issues**:
- Google AI Studio: https://ai.google.dev/support
- Google Cloud Support: https://cloud.google.com/support

**Platform Issues**:
- Contact our support: support@universalclothingexchange.com
- Check our FAQ: /help/ai-features
- Community forum: /community

---

## 🎓 Learning More

**Google Gemini**:
- Documentation: https://ai.google.dev/docs
- Pricing: https://ai.google.dev/pricing
- Best practices: https://ai.google.dev/guides

**Our Platform**:
- Full user guide: /help
- Video tutorials: /tutorials
- Blog posts: /blog/ai-features

---

**Last Updated**: November 4, 2025  
**Version**: 1.0
