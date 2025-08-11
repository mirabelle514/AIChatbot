// Claude API Service for Insurance Company AI Chatbot Demo
// This service handles all communication with Claude API

class ClaudeAPIService {
    constructor() {
    this.apiKey = process.env.REACT_APP_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;
    this.model = process.env.REACT_APP_CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
    this.maxTokens = parseInt(process.env.REACT_APP_CLAUDE_MAX_TOKENS) || 4000;
    this.temperature = parseFloat(process.env.REACT_APP_CLAUDE_TEMPERATURE) || 0.7;

    console.log('Claude API Service initialized with:');
    console.log('API Key exists:', !!this.apiKey);
    console.log('API Key length:', this.apiKey ? this.apiKey.length : 0);
    console.log('Model:', this.model);
    console.log('Environment variables:', {
      REACT_APP_CLAUDE_API_KEY: !!process.env.REACT_APP_CLAUDE_API_KEY,
      CLAUDE_API_KEY: !!process.env.CLAUDE_API_KEY
    });

    if (!this.apiKey) {
      console.warn('Claude API key not found. Please set REACT_APP_CLAUDE_API_KEY environment variable.');
    }
  }

    // Generate AI response using Claude API
  async generateResponse(userMessage, conversationHistory = [], context = {}) {
    console.log('generateResponse called with:', { userMessage, context });
    
    if (!this.apiKey) {
      console.log('No API key found, using fallback');
      return this.getFallbackResponse(userMessage, context);
    }

    try {
      console.log('Building system prompt and messages...');
      const systemPrompt = this.buildSystemPrompt(context);
      const messages = this.buildMessageHistory(systemPrompt, conversationHistory, userMessage);
      
      console.log('Making API request to Claude...');
      console.log('Request payload:', {
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        messages: messages,
        system: systemPrompt
      });
      
      // Test if fetch is working
      console.log('Testing fetch availability:', typeof fetch);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          messages: messages,
          system: systemPrompt
        })
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      const processedResponse = this.processAPIResponse(data, context);
      console.log('Processed response:', processedResponse);
      
      return processedResponse;

    } catch (error) {
      console.error('Claude API error:', error);
      console.log('Falling back to rule-based response');
      return this.getFallbackResponse(userMessage, context);
    }
  }

  // Build system prompt for Claude
  buildSystemPrompt(context) {
    return `You are Insurance Assistant, an AI-powered insurance customer service representative for Insurance Company. 

Your role is to help customers with:
- Filing and managing insurance claims
- Getting insurance quotes for auto, home, renters, and life insurance
- Understanding policy details and coverage
- Billing and payment assistance
- General insurance questions

Key Guidelines:
1. Always maintain a professional, helpful, and empathetic tone
2. Use Insurance Company's brand voice - trustworthy, knowledgeable, and customer-focused
3. Ask clarifying questions when needed to provide accurate assistance
4. Provide specific, actionable information rather than generic responses
5. Maintain conversation context and remember previous interactions
6. When asking for specific information (like incident details, vehicle info, etc.), provide relevant answer choices as suggestions
7. Offer contextual suggestions that directly answer the questions you're asking
8. If you don't know something specific about Insurance Company policies, suggest contacting an agent

Current Context: ${JSON.stringify(context, null, 2)}

Important: When helping customers file claims, ask for specific information and provide relevant answer choices. For example:
- If asking "What type of incident occurred?", suggest: Auto accident, Property damage, Theft, Natural disaster
- If asking "When did it happen?", suggest: Today, Yesterday, This week, Last week
- If asking "Where did it occur?", suggest: At home, On the road, At work, Other location
- If asking "Are there any injuries?", suggest: No injuries, Minor injuries, Serious injuries, Not sure yet

CRITICAL: Always provide suggestions that directly answer the questions you're asking, not generic actions. The suggestions should be the actual answers the customer can choose from.

Remember: You're helping real customers with real insurance needs. Be thorough, accurate, and helpful.`;
  }

  // Build message history for Claude API
  buildMessageHistory(systemPrompt, conversationHistory, currentMessage) {
    const messages = [];
    
    // Add conversation history (last 10 messages to stay within token limits)
    const recentHistory = conversationHistory.slice(-10);
    
    recentHistory.forEach(msg => {
      if (msg.type === 'user') {
        messages.push({
          role: 'user',
          content: msg.content
        });
      } else if (msg.type === 'bot') {
        messages.push({
          role: 'assistant',
          content: msg.content
        });
      }
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: currentMessage
    });

    return messages;
  }

  // Process Claude API response
  processAPIResponse(data, context) {
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from Claude API');
    }

    const responseText = data.content[0].text;
    
    // Extract suggestions from response (look for patterns like "You can..." or "Options include...")
    const suggestions = this.extractSuggestions(responseText);
    
    // Update context based on response
    const updatedContext = this.updateContext(context, responseText);
    
    return {
      content: responseText,
      suggestions: suggestions,
      context: updatedContext
    };
  }

  // Extract relevant suggestions from AI response
  extractSuggestions(responseText) {
    const suggestions = [];
    
    // Check if we're in a claims flow asking for incident details
    if (responseText.includes('What type of incident occurred') || 
        responseText.includes('When did it happen') || 
        responseText.includes('Where did it occur') || 
        responseText.includes('Are there any injuries')) {
      
      // Provide contextual suggestions for incident details
      if (responseText.includes('What type of incident occurred')) {
        suggestions.push('Auto accident', 'Property damage', 'Theft', 'Natural disaster');
      }
      if (responseText.includes('When did it happen')) {
        suggestions.push('Today', 'Yesterday', 'This week', 'Last week');
      }
      if (responseText.includes('Where did it occur')) {
        suggestions.push('At home', 'On the road', 'At work', 'Other location');
      }
      if (responseText.includes('Are there any injuries')) {
        suggestions.push('No injuries', 'Minor injuries', 'Serious injuries', 'Not sure yet');
      }
      
      // If we have multiple questions, provide a mix of helpful options
      if (suggestions.length === 0) {
        suggestions.push('Auto accident', 'Today', 'At home', 'No injuries');
      }
    }
    // Check if we're asking for claim status information
    else if (responseText.includes('claim number') || responseText.includes('policy number')) {
      suggestions.push('I have claim number', 'I have policy number', 'I need to file new claim', 'Contact agent');
    }
    // Check if we're asking for vehicle information for quotes
    else if (responseText.includes('What type of vehicle') || responseText.includes('How you use your vehicle')) {
      suggestions.push('Sedan', 'SUV', 'Truck', 'Motorcycle');
    }
    // Check if we're asking for home information for quotes
    else if (responseText.includes('Type of home') || responseText.includes('Year built')) {
      suggestions.push('Single-family home', 'Condo', 'Townhouse', 'Mobile home');
    }
    // Check if we're asking for payment verification
    else if (responseText.includes('verify your identity') || responseText.includes('policy number') || responseText.includes('SSN')) {
      suggestions.push('Policy number', 'Last 4 SSN', 'Phone number', 'Email address');
    }
    // Default to general action suggestions
    else {
      // Look for common patterns that indicate actionable next steps
      if (responseText.includes('file a claim') || responseText.includes('start a claim')) {
        suggestions.push('File a claim');
      }
      if (responseText.includes('get a quote') || responseText.includes('insurance quote')) {
        suggestions.push('Get a quote');
      }
      if (responseText.includes('policy') || responseText.includes('coverage')) {
        suggestions.push('Policy questions');
      }
      if (responseText.includes('billing') || responseText.includes('payment')) {
        suggestions.push('Payment help');
      }
      if (responseText.includes('contact') || responseText.includes('agent')) {
        suggestions.push('Contact agent');
      }
      
      // If no specific suggestions found, provide general ones
      if (suggestions.length === 0) {
        suggestions.push('File a claim', 'Get a quote', 'Policy questions', 'Payment help');
      }
    }
    
    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }

  // Update conversation context based on AI response
  updateContext(currentContext, responseText) {
    const newContext = { ...currentContext };
    
    // Detect if we're in a specific flow
    if (responseText.toLowerCase().includes('claim')) {
      newContext.flow = 'claims';
    } else if (responseText.toLowerCase().includes('quote')) {
      newContext.flow = 'quote';
    } else if (responseText.toLowerCase().includes('policy')) {
      newContext.flow = 'policy';
    } else if (responseText.toLowerCase().includes('billing') || responseText.toLowerCase().includes('payment')) {
      newContext.flow = 'billing';
    }
    
    // Update timestamp
    newContext.lastInteraction = new Date().toISOString();
    
    return newContext;
  }

  // Fallback response when API is not available
  getFallbackResponse(userMessage, context) {
    const message = userMessage.toLowerCase();
    
    // Enhanced fallback logic with more comprehensive responses
    if (message.includes('claim') || message.includes('accident') || message.includes('damage')) {
      // Check if we're in a specific step of the claims process
      if (context.flow === 'claims' && context.step === 'incident_type') {
        // User has already selected incident type, now ask for timing
        if (message.includes('auto accident') || message.includes('car') || message.includes('vehicle')) {
          return {
            content: "Thank you for reporting the auto accident. When did this accident occur?",
            suggestions: ["Today", "Yesterday", "This week", "More than a week ago"],
            context: { flow: 'claims', step: 'timing', incidentType: 'auto_accident' }
          };
        } else if (message.includes('property') || message.includes('home') || message.includes('house')) {
          return {
            content: "Thank you for reporting the property damage. When did this incident occur?",
            suggestions: ["Today", "Yesterday", "This week", "More than a week ago"],
            context: { flow: 'claims', step: 'timing', incidentType: 'property_damage' }
          };
        } else if (message.includes('theft')) {
          return {
            content: "Thank you for reporting the theft. When did you discover the theft?",
            suggestions: ["Today", "Yesterday", "This week", "More than a week ago"],
            context: { flow: 'claims', step: 'timing', incidentType: 'theft' }
          };
        } else if (message.includes('natural disaster') || message.includes('weather')) {
          return {
            content: "Thank you for reporting the weather-related damage. When did this damage occur?",
            suggestions: ["Today", "Yesterday", "This week", "More than a week ago"],
            context: { flow: 'claims', step: 'timing', incidentType: 'weather_damage' }
          };
        }
      }
      
      if (context.flow === 'claims' && context.step === 'timing') {
        // User has provided timing, now ask for location
        if (message.includes('today') || message.includes('yesterday') || message.includes('week')) {
          return {
            content: "Thank you. Where did the incident occur?",
            suggestions: ["At home", "On the road", "At work", "Other location"],
            context: { flow: 'claims', step: 'location', incidentType: context.incidentType, when: message }
          };
        }
      }
      
      if (context.flow === 'claims' && context.step === 'location') {
        // User has provided location, now ask about injuries
        if (message.includes('home') || message.includes('road') || message.includes('work') || message.includes('other')) {
          return {
            content: "Thank you. Are there any injuries to report?",
            suggestions: ["No injuries", "Minor injuries", "Serious injuries", "Not sure yet"],
            context: { flow: 'claims', step: 'injuries', incidentType: context.incidentType, when: context.when, where: message }
          };
        }
      }
      
      if (context.flow === 'claims' && context.step === 'injuries') {
        // User has provided injury information, now provide next steps
        if (message.includes('no injuries') || message.includes('minor') || message.includes('serious') || message.includes('not sure')) {
          return {
            content: "Thank you for providing the incident details. I'm creating your claim now.\n\nYour claim number is: CLM-" + Math.random().toString().slice(2, 11) + "\n\nNext steps:\n• A claims adjuster will contact you within 24 hours\n• You can upload photos and documents through our mobile app\n• Keep any receipts for expenses related to this incident\n\nIs there anything else you'd like to add about the incident?",
            suggestions: ["Upload photos", "Add more details", "Check claim status", "Contact adjuster"],
            context: { flow: 'claims', step: 'complete', claimNumber: 'CLM-' + Math.random().toString().slice(2, 11) }
          };
        }
      }
      
      // Initial claims entry
      if (message.includes('file') || message.includes('start') || message.includes('new')) {
        return {
          content: "I can help you file a new claim. To get started, I'll need some basic information:\n\n• What type of incident occurred? (auto accident, property damage, theft, etc.)\n• When did it happen?\n• Where did it occur?\n• Are there any injuries?\n\nLet's start with the first question: What type of incident occurred?",
          suggestions: ["Auto accident", "Property damage", "Theft", "Natural disaster"],
          context: { flow: 'claims', step: 'incident_type', type: 'new' }
        };
      } else if (message.includes('status') || message.includes('check') || message.includes('existing')) {
        return {
          content: "I can help you check the status of an existing claim. To look up your claim, I'll need:\n\n• Your claim number, or\n• Your policy number and the date of the incident\n\nDo you have either of these available?",
          suggestions: ["I have claim number", "I have policy number", "I need to file new claim", "Contact agent"],
          context: { flow: 'claims', step: 'status_check' }
        };
      } else {
        return {
          content: "I can help you with claims-related questions. Are you looking to:\n\n• File a new claim\n• Check the status of an existing claim\n• Get information about the claims process\n• Understand what's covered\n\nWhat would you like to do?",
          suggestions: ["File new claim", "Check claim status", "Claims process info", "What's covered"],
          context: { flow: 'claims', step: 'initial' }
        };
      }
    }
    
    if (message.includes('quote') || message.includes('price') || message.includes('cost') || message.includes('rate')) {
      if (message.includes('auto') || message.includes('car')) {
        return {
          content: "I'd be happy to help you get an auto insurance quote! To provide the most accurate estimate, I'll need some information:\n\n• What type of vehicle (year, make, model)\n• How you use your vehicle (commute, pleasure, business)\n• Your driving history\n• Any safety features on your vehicle\n\nWould you like to start getting a quote?",
          suggestions: ["Start auto quote", "Vehicle information", "Driving history", "Safety features"],
          context: { flow: 'quote', step: 'coverage_type', type: 'auto' }
        };
      } else if (message.includes('home') || message.includes('house')) {
        return {
          content: "Great! I can help you get a home insurance quote. To provide an accurate estimate, I'll need:\n\n• Type of home (single-family, condo, townhouse)\n• Year built and square footage\n• Construction materials\n• Safety features (alarm system, smoke detectors)\n\nReady to get started with your home insurance quote?",
          suggestions: ["Start home quote", "Home details", "Safety features", "Construction info"],
          context: { flow: 'quote', step: 'coverage_type', type: 'home' }
        };
      } else {
        return {
          content: "I can help you get personalized quotes for various types of insurance:\n\n• Auto insurance\n• Home insurance\n• Renters insurance\n• Life insurance\n• Umbrella coverage\n\nWhich type of coverage are you interested in?",
          suggestions: ["Auto insurance", "Home insurance", "Renters insurance", "Life insurance"],
          context: { flow: 'quote', step: 'coverage_type' }
        };
      }
    }
    
    if (message.includes('policy') || message.includes('coverage') || message.includes('deductible') || message.includes('limit')) {
      if (message.includes('understand') || message.includes('explain') || message.includes('what')) {
        return {
          content: "I'd be happy to help you understand your insurance policy! Here are some key areas I can explain:\n\n• What's covered and what's not\n• Deductibles and how they work\n• Policy limits and coverage amounts\n• Exclusions and limitations\n• How to make changes to your policy\n\nWhat specific aspect would you like me to explain?",
          suggestions: ["What's covered", "Deductibles explained", "Policy limits", "Make changes"],
          context: { flow: 'policy', step: 'explanation' }
        };
      } else if (message.includes('change') || message.includes('update') || message.includes('modify')) {
        return {
          content: "I can help you make changes to your policy. Common changes include:\n\n• Adding or removing drivers/vehicles\n• Changing coverage amounts\n• Updating contact information\n• Adding additional coverage options\n\nWhat type of change would you like to make?",
          suggestions: ["Add driver/vehicle", "Change coverage", "Update contact info", "Add coverage"],
          context: { flow: 'policy', step: 'changes' }
        };
      } else {
        return {
          content: "I can help you with policy-related questions. What would you like to know about?\n\n• Understanding your coverage\n• Making policy changes\n• Policy documents and forms\n• Renewal information\n• Cancellation process",
          suggestions: ["Understand coverage", "Make changes", "Policy documents", "Renewal info"],
          context: { flow: 'policy', step: 'initial' }
        };
      }
    }
    
    if (message.includes('billing') || message.includes('payment') || message.includes('bill') || message.includes('pay')) {
      if (message.includes('due') || message.includes('when') || message.includes('amount')) {
        return {
          content: "I can help you with billing and payment information. To access your billing details, I'll need to verify your identity for security reasons. You can verify using:\n\n• Your policy number\n• Last 4 digits of your SSN\n• Your phone number on file\n• Your email address\n\nWhat's the easiest way for you to verify?",
          suggestions: ["Policy number", "Last 4 SSN", "Phone number", "Email address"],
          context: { flow: 'billing', step: 'verification' }
        };
      } else if (message.includes('method') || message.includes('how') || message.includes('way')) {
        return {
          content: "Insurance Company offers several convenient payment options:\n\n• Online through your account\n• Automatic bank draft\n• Credit/debit card\n• Check by mail\n• Phone payments\n\nWhich payment method would you prefer to set up?",
          suggestions: ["Online account", "Bank draft", "Credit card", "Check by mail"],
          context: { flow: 'billing', step: 'payment_method' }
        };
      } else {
        return {
          content: "I can help with billing and payment questions. What would you like to know about?\n\n• Payment due dates and amounts\n• Payment methods and options\n• Setting up automatic payments\n• Payment history and receipts\n• Billing address changes",
          suggestions: ["Payment due info", "Payment methods", "Auto payments", "Payment history"],
          context: { flow: 'billing', step: 'initial' }
        };
      }
    }
    
    if (message.includes('contact') || message.includes('agent') || message.includes('call') || message.includes('speak')) {
      return {
                  content: "I'm here to help, but if you'd prefer to speak with a live agent, you have several options:\n\n• Call our customer service: 1-800-INSURANCE\n• Schedule a call back at your convenience\n• Chat with an agent online\n• Visit a local office\n\nWould you like me to help you with something specific, or would you prefer to connect with an agent?",
        suggestions: ["Keep chatting", "Call customer service", "Schedule call back", "Find local office"],
        context: { flow: 'contact', step: 'agent_connection' }
      };
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('help') || message.includes('start')) {
      return {
                  content: "Hello! I'm Insurance Assistant, your AI-powered insurance support specialist. I'm here to help you with:\n\n• Filing and managing insurance claims\n• Getting personalized insurance quotes\n• Understanding your policy and coverage\n• Billing and payment assistance\n• General insurance questions\n\nWhat can I help you with today?",
        suggestions: ["File a claim", "Get a quote", "Policy questions", "Payment help"],
        context: { flow: 'general', step: 'greeting' }
      };
    }
    
    // Generic response for unrecognized queries
    return {
      content: "I want to make sure I give you the most helpful information. I can assist with:\n\n• Claims: filing new claims, checking status, understanding the process\n• Quotes: auto, home, renters, and life insurance estimates\n• Policies: understanding coverage, making changes, getting documents\n• Billing: payment options, due dates, account management\n\nCould you tell me a bit more about what you're looking for?",
      suggestions: ["File a claim", "Get a quote", "Policy questions", "Payment help"],
      context: { flow: 'general', step: 'clarification' }
    };
  }

  // Check if API is available
  isAPIAvailable() {
    const available = !!this.apiKey;
    console.log('isAPIAvailable check:', { available, apiKeyLength: this.apiKey ? this.apiKey.length : 0 });
    return available;
  }

  // Get API status
  getAPIStatus() {
    return {
      available: this.isAPIAvailable(),
      model: this.model,
      maxTokens: this.maxTokens,
      temperature: this.temperature
    };
  }
}

// Create singleton instance
const claudeAPI = new ClaudeAPIService();

export default claudeAPI;
