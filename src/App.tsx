import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Bot, Shield, Car, Home, Phone } from 'lucide-react';
import { getAIResponse } from './getAIResponse';

// Liberty Mutual Design System Tokens
const LMDesignSystem = {
  colors: {
    // Primary Colors
    libertyYellow: '#FFD000',
    libertyBlue: '#1A1446',
    libertyTeal: '#78E1E1',
    libertyDarkTeal: '#037B86',
    
    // Neutral Colors
    libertyAtmosphericWhite: '#F5F5F5',
    libertyDarkGray: '#343741',
    white: '#FFFFFF',
    
    // Tints
    yellowTint80: '#FFDB50',
    yellowTint60: '#FFE280',
    tealTint40: '#C9F3F4',
    grayTint10: '#E6E6E6'
  },
  typography: {
    fontFamily: {
      primary: '"Guardian Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      system: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    weights: {
      light: 300,
      regular: 400,
      semibold: 600,
      bold: 700
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  }
};

// Design System Components
interface LMButtonProps {
  variant?: 'primary' | 'secondary' | 'suggestion';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

const LMButton = ({ variant = 'primary', size = 'md', children, onClick, disabled = false, fullWidth = false, ...props }: LMButtonProps) => {
  const getResponsivePadding = (buttonSize: string) => {
    const mobile: Record<string, string> = {
      sm: `${LMDesignSystem.spacing.sm} ${LMDesignSystem.spacing.md}`,
      md: `${LMDesignSystem.spacing.md} ${LMDesignSystem.spacing.lg}`,
      lg: `${LMDesignSystem.spacing.lg} ${LMDesignSystem.spacing.xl}`
    };
    const desktop: Record<string, string> = {
      sm: `${LMDesignSystem.spacing.md} ${LMDesignSystem.spacing.lg}`,
      md: `${LMDesignSystem.spacing.lg} ${LMDesignSystem.spacing.xl}`,
      lg: `${LMDesignSystem.spacing.xl} ${LMDesignSystem.spacing.xxl}`
    };
    return window.innerWidth < 768 ? mobile[buttonSize] : desktop[buttonSize];
  };

  const getResponsiveFontSize = (buttonSize: string) => {
    const mobile: Record<string, string> = { sm: '0.75rem', md: '0.875rem', lg: '1rem' };
    const desktop: Record<string, string> = { sm: '0.875rem', md: '1rem', lg: '1.125rem' };
    return window.innerWidth < 768 ? mobile[buttonSize] : desktop[buttonSize];
  };
  
  return (
    <button
      style={{
        fontFamily: LMDesignSystem.typography.fontFamily.primary,
        fontWeight: LMDesignSystem.typography.weights.semibold,
        borderRadius: LMDesignSystem.borderRadius.md,
        transition: 'all 0.2s ease-in-out',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: LMDesignSystem.spacing.sm,
        width: fullWidth ? '100%' : 'auto',
        minWidth: 'fit-content',
        backgroundColor: variant === 'primary' ? LMDesignSystem.colors.libertyTeal : 
                        variant === 'secondary' ? 'transparent' : LMDesignSystem.colors.libertyAtmosphericWhite,
        color: LMDesignSystem.colors.libertyBlue,
        padding: getResponsivePadding('md'),
        fontSize: getResponsiveFontSize('md'),
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        textAlign: 'center',
        ...props.style
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          const target = e.target as HTMLButtonElement;
          if (variant === 'primary') {
            target.style.backgroundColor = LMDesignSystem.colors.libertyDarkTeal;
            target.style.color = 'white';
          } else if (variant === 'secondary') {
            target.style.backgroundColor = LMDesignSystem.colors.libertyBlue;
            target.style.color = 'white';
          } else if (variant === 'suggestion') {
            target.style.backgroundColor = LMDesignSystem.colors.tealTint40;
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          const target = e.target as HTMLButtonElement;
          if (variant === 'primary') {
            target.style.backgroundColor = LMDesignSystem.colors.libertyTeal;
            target.style.color = LMDesignSystem.colors.libertyBlue;
          } else if (variant === 'secondary') {
            target.style.backgroundColor = 'transparent';
            target.style.color = LMDesignSystem.colors.libertyBlue;
          } else if (variant === 'suggestion') {
            target.style.backgroundColor = LMDesignSystem.colors.libertyAtmosphericWhite;
          }
        }
      }}
    >
      {children}
    </button>
  );
};

interface LMCardProps {
  children: React.ReactNode;
  elevated?: boolean;
  style?: React.CSSProperties;
}

const LMCard = ({ children, elevated = false, ...props }: LMCardProps) => (
  <div
    style={{
      backgroundColor: LMDesignSystem.colors.white,
      borderRadius: LMDesignSystem.borderRadius.lg,
      border: `1px solid ${LMDesignSystem.colors.grayTint10}`,
      padding: LMDesignSystem.spacing.lg
    }}
    {...props}
  >
    {children}
  </div>
);

const LMIcon = ({ name, size = 20, color = LMDesignSystem.colors.libertyBlue, bgColor = null, ...props }) => {
  const IconComponent = name === 'car' ? Car : 
                       name === 'home' ? Home :
                       name === 'phone' ? Phone :
                       name === 'shield' ? Shield :
                       name === 'user' ? User :
                       name === 'bot' ? Bot : MessageCircle;
  
  if (bgColor) {
    return (
      <div
        style={{
          width: size + 16,
          height: size + 16,
          borderRadius: LMDesignSystem.borderRadius.full,
          backgroundColor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <IconComponent size={size} color={color} {...props} />
      </div>
    );
  }
  
  return <IconComponent size={size} color={color} {...props} />;
};

const LibertyMutualAIDemo = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm Liberty Assistant, here to help you with your insurance needs. I can help you file a claim, get a quote, or answer policy questions. What can I help you with today?",
      timestamp: new Date(),
      suggestions: ["File a claim", "Get a quote", "Policy questions", "Payment help"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  const handleSendMessage = async (messageText: string | null = null) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: textToSend,
      timestamp: new Date(),
      suggestions: [] as string[]
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      console.log('Current context:', conversationContext);
      console.log('User message:', textToSend);
      
      const aiResponse = getAIResponse(textToSend, conversationContext);
      console.log('AI Response:', aiResponse);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions || []
      };

      setMessages(prev => [...prev, botMessage]);
      setConversationContext(prev => {
        const newContext = { ...prev, ...aiResponse.context };
        console.log('Updated context:', newContext);
        return newContext;
      });
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Realistic response time
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      style={{
        maxWidth: '1024px',
        margin: '0 auto',
        backgroundColor: LMDesignSystem.colors.white,
        borderRadius: window.innerWidth < 768 ? 0 : LMDesignSystem.borderRadius.lg,
        overflow: 'hidden',
        fontFamily: LMDesignSystem.typography.fontFamily.primary,
        width: '100%',
        minHeight: window.innerWidth < 768 ? '100vh' : 'auto'
      }}
    >
      {/* Header - Following Liberty Mutual Brand Guidelines */}
      <div 
        style={{
          background: `linear-gradient(135deg, ${LMDesignSystem.colors.libertyBlue} 0%, ${LMDesignSystem.colors.libertyDarkTeal} 100%)`,
          color: LMDesignSystem.colors.white,
          padding: window.innerWidth < 768 ? LMDesignSystem.spacing.md : LMDesignSystem.spacing.lg
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: LMDesignSystem.spacing.md,
          flexWrap: 'wrap'
        }}>
          <div 
            style={{
              width: window.innerWidth < 768 ? '32px' : '40px',
              height: window.innerWidth < 768 ? '32px' : '40px',
              backgroundColor: LMDesignSystem.colors.libertyYellow,
              borderRadius: LMDesignSystem.borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <LMIcon name="bot" size={window.innerWidth < 768 ? 20 : 24} color={LMDesignSystem.colors.libertyBlue} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ 
              fontSize: window.innerWidth < 768 ? '1.125rem' : '1.25rem', 
              fontWeight: LMDesignSystem.typography.weights.bold,
              margin: 0,
              color: LMDesignSystem.colors.white
            }}>
              Liberty Assistant
            </h1>
            <p style={{ 
              fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem',
              margin: 0,
              color: LMDesignSystem.colors.libertyTeal,
              fontWeight: LMDesignSystem.typography.weights.regular
            }}>
              AI-Powered Insurance Support • Always Available
            </p>
          </div>
        </div>
        
        {/* Security Badge - Following LM Brand Guidelines */}
        <LMCard 
          style={{
            marginTop: LMDesignSystem.spacing.md,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            padding: window.innerWidth < 768 ? LMDesignSystem.spacing.sm : LMDesignSystem.spacing.md
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: LMDesignSystem.spacing.sm }}>
            <LMIcon name="shield" size={16} color={LMDesignSystem.colors.libertyYellow} />
            <span style={{ 
              fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem', 
              color: LMDesignSystem.colors.white 
            }}>
              Secure & Private Conversation
            </span>
          </div>
          <div style={{ 
            fontSize: window.innerWidth < 768 ? '0.625rem' : '0.75rem', 
            color: LMDesignSystem.colors.libertyTeal,
            marginTop: LMDesignSystem.spacing.xs
          }}>
            Demo showcasing AI UX patterns for insurance customer service
          </div>
        </LMCard>
      </div>

      {/* Messages Area */}
      <div 
        style={{
          height: window.innerWidth < 768 ? '50vh' : '400px',
          overflowY: 'auto',
          padding: window.innerWidth < 768 ? LMDesignSystem.spacing.md : LMDesignSystem.spacing.lg,
          backgroundColor: LMDesignSystem.colors.libertyAtmosphericWhite,
          display: 'flex',
          flexDirection: 'column',
          gap: LMDesignSystem.spacing.lg
        }}
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <LMCard
              style={{
                maxWidth: window.innerWidth < 768 ? '280px' : '320px',
                width: window.innerWidth < 768 ? 'calc(100% - 40px)' : 'auto',
                backgroundColor: message.type === 'user' 
                  ? LMDesignSystem.colors.libertyBlue 
                  : LMDesignSystem.colors.white,
                color: message.type === 'user' 
                  ? LMDesignSystem.colors.white 
                  : LMDesignSystem.colors.libertyDarkGray,
                border: message.type === 'bot' 
                  ? `1px solid ${LMDesignSystem.colors.grayTint10}` 
                  : 'none',
                padding: window.innerWidth < 768 ? LMDesignSystem.spacing.md : LMDesignSystem.spacing.lg
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: LMDesignSystem.spacing.sm }}>
                {message.type === 'bot' && (
                  <LMIcon 
                    name="bot" 
                    size={16} 
                    color={LMDesignSystem.colors.libertyTeal}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line'
                  }}>
                    {message.content}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    marginTop: LMDesignSystem.spacing.sm,
                    color: message.type === 'user' 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : LMDesignSystem.colors.libertyDarkGray,
                    opacity: 0.7
                  }}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                {message.type === 'user' && (
                  <LMIcon 
                    name="user" 
                    size={16} 
                    color="rgba(255, 255, 255, 0.8)"
                  />
                )}
              </div>
              
              {/* Suggestion Buttons */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div style={{ 
                  marginTop: LMDesignSystem.spacing.md, 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: LMDesignSystem.spacing.sm 
                }}>
                  {message.suggestions.map((suggestion, index) => (
                    <LMButton
                      key={index}
                      variant="suggestion"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={false}
                      style={{
                        fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem',
                        padding: window.innerWidth < 768 ? 
                          `${LMDesignSystem.spacing.xs} ${LMDesignSystem.spacing.sm}` :
                          `${LMDesignSystem.spacing.sm} ${LMDesignSystem.spacing.md}`
                      }}
                    >
                      {suggestion}
                    </LMButton>
                  ))}
                </div>
              )}
            </LMCard>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <LMCard style={{
              padding: window.innerWidth < 768 ? LMDesignSystem.spacing.md : LMDesignSystem.spacing.lg
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: LMDesignSystem.spacing.sm }}>
                <LMIcon name="bot" size={16} color={LMDesignSystem.colors.libertyTeal} />
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: LMDesignSystem.colors.libertyTeal,
                        borderRadius: LMDesignSystem.borderRadius.full,
                        animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`
                      }}
                    />
                  ))}
                </div>
                <span style={{ 
                  fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem', 
                  color: LMDesignSystem.colors.libertyDarkGray 
                }}>
                  Typing...
                </span>
              </div>
            </LMCard>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div 
        style={{
          borderTop: `1px solid ${LMDesignSystem.colors.grayTint10}`,
          padding: window.innerWidth < 768 ? LMDesignSystem.spacing.md : LMDesignSystem.spacing.lg,
          backgroundColor: LMDesignSystem.colors.white
        }}
      >
        <div style={{ 
          display: 'flex', 
          gap: LMDesignSystem.spacing.md,
          flexDirection: window.innerWidth < 480 ? 'column' : 'row'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about claims, quotes, policy details, or billing..."
            style={{
              flex: 1,
              border: `1px solid ${LMDesignSystem.colors.grayTint10}`,
              borderRadius: LMDesignSystem.borderRadius.md,
              padding: window.innerWidth < 768 ? LMDesignSystem.spacing.sm : LMDesignSystem.spacing.md,
              fontSize: window.innerWidth < 768 ? '0.875rem' : '1rem',
              fontFamily: LMDesignSystem.typography.fontFamily.primary,
              outline: 'none',
              transition: 'border-color 0.2s ease-in-out',
              width: window.innerWidth < 480 ? '100%' : 'auto'
            }}
            onFocus={(e) => e.target.style.borderColor = LMDesignSystem.colors.libertyTeal}
            onBlur={(e) => e.target.style.borderColor = LMDesignSystem.colors.grayTint10}
          />
          <LMButton
            variant="primary"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            fullWidth={window.innerWidth < 480}
          >
            <Send size={18} />
            {window.innerWidth < 480 && ' Send'}
          </LMButton>
        </div>
        
        {/* Quick Actions */}
        <div style={{ 
          marginTop: LMDesignSystem.spacing.md, 
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 480 ? '1fr' : 
                               window.innerWidth < 768 ? 'repeat(2, 1fr)' : 
                               'repeat(4, 1fr)',
          gap: LMDesignSystem.spacing.sm
        }}>
          <LMButton
            variant="suggestion"
            onClick={() => handleSendMessage("I need to file a claim")}
            disabled={false}
            fullWidth={true}
            style={{
              backgroundColor: LMDesignSystem.colors.yellowTint60
            }}
          >File Claim
          </LMButton>
          <LMButton
            variant="suggestion"
            onClick={() => handleSendMessage("I want a quote for auto insurance")}
            disabled={false}
            fullWidth={true}
            style={{
              backgroundColor: LMDesignSystem.colors.yellowTint60
            }}
          >
            Get Quote
          </LMButton>
          <LMButton
            variant="suggestion"
            onClick={() => handleSendMessage("Help me understand my policy")}
            disabled={false}
            fullWidth={true}
            style={{
              backgroundColor: LMDesignSystem.colors.yellowTint60
            }}
          >
            Policy Help
          </LMButton>
          <LMButton
            variant="suggestion"
            onClick={() => handleSendMessage("gibberish test")}
            disabled={false}
            fullWidth={true}
            style={{
              backgroundColor: LMDesignSystem.colors.yellowTint60
            }}
          >
            Test Error Handling
          </LMButton>
        </div>
        
        <div style={{
          marginTop: LMDesignSystem.spacing.md,
          fontSize: window.innerWidth < 768 ? '0.625rem' : '0.75rem',
          color: LMDesignSystem.colors.libertyDarkGray,
          textAlign: 'center'
        }}>
          Demo by Mirabelle Doiron • Showcasing AI UX Best Practices for Insurance
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            } 40% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LibertyMutualAIDemo;