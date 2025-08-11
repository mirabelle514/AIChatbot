# Claude API Setup Guide

## Quick Setup

To get the Claude AI responses working in your chatbot:

1. **Get your API key** from [Anthropic Console](https://console.anthropic.com/)
2. **Create a `.env` file** in your project root with:
   ```
   REACT_APP_CLAUDE_API_KEY=sk-ant-your-actual-api-key-here
   ```
3. **Restart your development server** (`npm start`)

## What's Working Now

✅ **Rule-based responses** - Always work, no API key needed
✅ **Enhanced fallback system** - Comprehensive insurance responses
✅ **Demo mode selector** - Moved to sidebar on desktop, below header on mobile
✅ **Responsive layout** - Works on all screen sizes

## Current Status

- **Claude AI Mode**: Requires API key to work
- **Rule-based Mode**: Always works with enhanced responses
- **Auto Mode**: Tries Claude first, falls back to rule-based

## Enhanced Fallback Responses

The chatbot now provides detailed, helpful responses for:
- Claims (filing, status, process)
- Quotes (auto, home, renters, life)
- Policy questions (coverage, changes, documents)
- Billing (payments, methods, due dates)
- General insurance help

## Troubleshooting

If Claude AI isn't working:
1. Check that your `.env` file exists and has the correct API key
2. Ensure the API key starts with `sk-ant-`
3. Verify you have sufficient API credits
4. Check the browser console for error messages

The chatbot will automatically use rule-based responses if Claude isn't available.
