# Claude API Setup Guide

## Step 1: Get Your Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (it starts with `sk-ant-...`)

## Step 2: Create Environment File

1. In your project root, create a file called `.env`
2. Add your API key:

```bash
REACT_APP_CLAUDE_API_KEY=sk-ant-your-actual-api-key-here
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Test the Integration

1. Start your development server: `npm start`
2. The chatbot will now use Claude API for responses
3. Check the browser console for API status messages

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Your API key will only be used in your local development environment

## API Configuration Options

You can customize the Claude API behavior by adding these to your `.env` file:

```bash
REACT_APP_CLAUDE_MODEL=claude-3-5-sonnet-20241022
REACT_APP_CLAUDE_MAX_TOKENS=4000
REACT_APP_CLAUDE_TEMPERATURE=0.7
```

## Fallback Behavior

If the Claude API is not available (no API key or API errors), the chatbot will automatically fall back to the rule-based responses to ensure it always works.

## Troubleshooting

- Check that your API key is correct
- Ensure you have sufficient API credits
- Check the browser console for error messages
- Verify the `.env` file is in the project root directory
