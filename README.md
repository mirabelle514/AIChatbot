# Liberty Mutual AI Chatbot Demo

A modern, accessible AI chatbot interface showcasing UX best practices for insurance customer service. Built with React, TypeScript, and Liberty Mutual's design system.

## Project Overview

This demo showcases how AI-powered chatbots can enhance customer service in the insurance industry through thoughtful UX design, accessibility features, and brand-consistent visual design.

### Key Features

- **AI-Powered Conversations** - Intelligent responses for insurance-related queries
- **Liberty Mutual Design System** - Consistent branding and visual hierarchy
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Accessibility First** - WCAG compliant with keyboard navigation and screen reader support
- **Smart Suggestions** - Contextual quick-action buttons for common tasks
- **Realistic Interactions** - Typing indicators and natural conversation flow
- **Security Focused** - Privacy-conscious design with clear data handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:mirabelle514/AIChatbot.git
   cd AIChatbot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the chatbot in action.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Design System

### Liberty Mutual Brand Colors

```css
/* Primary Colors */
--liberty-yellow: #FFD000;
--liberty-blue: #1A1446;
--liberty-teal: #78E1E1;
--liberty-dark-teal: #037B86;

/* Neutral Colors */
--liberty-atmospheric-white: #F5F5F5;
--liberty-dark-gray: #343741;
--white: #FFFFFF;
```

### Typography

- **Primary Font**: Guardian Sans (Liberty Mutual's brand font)
- **Fallback**: System fonts for optimal performance
- **Weights**: Light (300), Regular (400), Semibold (600), Bold (700)

### Components

The project includes reusable design system components:

- **LMButton** - Primary, secondary, and suggestion button variants
- **LMCard** - Elevated content containers
- **LMIcon** - Consistent iconography with background options

## Chatbot Features

### Conversation Flow

1. **Welcome Message** - Introduces the assistant and available services
2. **Smart Suggestions** - Contextual quick-action buttons
3. **Natural Responses** - AI-generated responses with realistic timing
4. **Error Handling** - Graceful handling of unclear requests
5. **Context Awareness** - Maintains conversation context

### Supported Interactions

- **File a Claim** - Step-by-step claim filing guidance
- **Get a Quote** - Insurance quote requests and information
- **Policy Questions** - Policy details and coverage explanations
- **Payment Help** - Billing and payment assistance
- **General Support** - Customer service inquiries

### UX Patterns Implemented

- **Progressive Disclosure** - Information revealed as needed
- **Micro-interactions** - Subtle animations and feedback
- **Loading States** - Typing indicators and progress feedback
- **Error Recovery** - Clear error messages and recovery options
- **Accessibility** - Keyboard navigation and screen reader support

## Architecture

### File Structure

```

src/
├── App.tsx              # Main application component
├── getAIResponse.js     # AI response logic and conversation handling
├── index.tsx           # Application entry point
└── react-app-env.d.ts  # TypeScript declarations
```

### Key Components

#### LibertyMutualAIDemo

The main application component that orchestrates:

- Message state management
- User input handling
- AI response processing
- UI rendering and styling

#### Design System Components

- **LMButton** - Configurable button component with multiple variants
- **LMCard** - Content container with elevation options
- **LMIcon** - Icon component with background and size options

### State Management

- **Messages** - Array of conversation messages with metadata
- **Input Value** - Current user input text
- **Typing State** - AI response generation indicator
- **Conversation Context** - Maintains conversation history and context

## UX Best Practices

### 1. **Accessibility**

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- High contrast color ratios
- Screen reader compatibility

### 2. **Responsive Design**

- Mobile-first approach
- Flexible layouts
- Touch-friendly interactions
- Optimized for all screen sizes

### 3. **Performance**

- Efficient re-renders
- Optimized animations
- Minimal bundle size
- Fast loading times

### 4. **User Experience**

- Clear visual hierarchy
- Intuitive navigation
- Consistent interactions
- Helpful error messages
- Progressive enhancement

### 5. **Brand Consistency**

- Liberty Mutual color palette
- Typography guidelines
- Icon usage standards
- Spacing and layout rules

## Customization

### Adding New Features

1. **New Conversation Flows**
   - Add response patterns in `getAIResponse.js`
   - Update suggestion buttons in `App.tsx`
   - Extend conversation context as needed

2. **Design System Updates**
   - Modify `LMDesignSystem` object in `App.tsx`
   - Update component styles and variants
   - Add new design tokens as needed

3. **AI Integration**
   - Replace mock responses with real AI API calls
   - Implement conversation context management
   - Add error handling for API failures

### Styling Customization

The design system is centralized in the `LMDesignSystem` object:

```typescript
const LMDesignSystem = {
  colors: { /* brand colors */ },
  typography: { /* font settings */ },
  spacing: { /* spacing scale */ },
  borderRadius: { /* border radius values */ }
};
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel** - Zero-config deployment
- **Netlify** - Drag and drop deployment
- **GitHub Pages** - Free hosting for public repos
- **AWS S3 + CloudFront** - Scalable static hosting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is a demo showcasing UX best practices for AI chatbots in the insurance industry. The design system and components are inspired by Liberty Mutual's brand guidelines.

## Author

**Mirabelle Doiron**

- UX Engineer
- Specializing in AI/ML interfaces and design systems
- [GitHub](https://github.com/mirabelle514)

## Acknowledgments

- Liberty Mutual for brand inspiration
- React and TypeScript communities
- Accessibility advocates and guidelines
- AI/UX research and best practices

---

**Note**: This is a demo project showcasing UX best practices. The AI responses are simulated and do not represent actual Liberty Mutual services or policies.