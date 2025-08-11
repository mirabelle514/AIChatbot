import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Bot, Shield, Car, Home, Phone } from 'lucide-react';
import claudeAPI from './claudeAPI';

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

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions: string[];
  aiMode?: 'claude' | 'rule-based' | 'auto';
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

const LMIcon = ({ name, size = 20, color = LMDesignSystem.colors.libertyBlue, bgColor = null, ...props }: {
  name: string;
  size?: number;
  color?: string;
  bgColor?: string | null;
  [key: string]: any;
}) => {
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm Liberty Assistant, here to help you with your insurance needs. I can help you file a claim, get a quote, or answer policy questions. What can I help you with today?",
      timestamp: new Date(),
      suggestions: ["File a claim", "Get a quote", "Policy questions", "Payment help"],
      aiMode: 'auto'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({});
  const [aiMode, setAiMode] = useState<'claude' | 'rule-based' | 'auto'>('auto');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Debug environment variables
    console.log('Environment variables check:');
    console.log('REACT_APP_CLAUDE_API_KEY exists:', !!process.env.REACT_APP_CLAUDE_API_KEY);
    console.log('REACT_APP_CLAUDE_API_KEY length:', process.env.REACT_APP_CLAUDE_API_KEY ? process.env.REACT_APP_CLAUDE_API_KEY.length : 0);
    console.log('Claude API Status:', claudeAPI.getAPIStatus());
    
    scrollToBottom();
  }, [messages, isTyping]);

  const resetConversation = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        content: "Hi! I'm Liberty Assistant, here to help you with your insurance needs. I can help you file a claim, get a quote, or answer policy questions. What can I help you with today?",
        timestamp: new Date(),
        suggestions: ["File a claim", "Get a quote", "Policy questions", "Payment help"],
        aiMode: 'auto'
      }
    ]);
    setConversationContext({});
    setInputValue('');
    setIsTyping(false);
  };


  const handleSendMessage = async (messageText: string | null = null) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: textToSend,
      timestamp: new Date(),
      suggestions: [] as string[],
      aiMode: undefined // User messages don't have AI mode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Check API status first
      console.log('Claude API Status:', claudeAPI.getAPIStatus());
      console.log('Current context:', conversationContext);
      console.log('User message:', textToSend);
      
      // Simulate AI processing time
      setTimeout(async () => {
        try {
          let aiResponse;
          
          // Use selected AI mode
          if (aiMode === 'claude' && claudeAPI.isAPIAvailable()) {
            console.log('Using Claude AI mode');
            aiResponse = await claudeAPI.generateResponse(textToSend, messages, conversationContext);
          } else if (aiMode === 'rule-based') {
            console.log('Using Rule-based mode');
            aiResponse = claudeAPI.getFallbackResponse(textToSend, conversationContext);
          } else {
            // Auto mode - try Claude first, fallback to rule-based
            console.log('Using Auto mode');
            if (claudeAPI.isAPIAvailable()) {
              try {
                aiResponse = await claudeAPI.generateResponse(textToSend, messages, conversationContext);
              } catch (error) {
                console.log('Claude API failed, falling back to rule-based');
                aiResponse = claudeAPI.getFallbackResponse(textToSend, conversationContext);
              }
            } else {
              console.log('Claude API not available, using rule-based');
              aiResponse = claudeAPI.getFallbackResponse(textToSend, conversationContext);
            }
          }
          
          console.log('AI Response:', aiResponse);
          
          if (aiResponse && aiResponse.content) {
            const botMessage: Message = {
              id: Date.now() + 1,
              type: 'bot',
              content: aiResponse.content,
              timestamp: new Date(),
              suggestions: aiResponse.suggestions || [],
              aiMode: aiMode // Add AI mode to track which system generated the response
            };

            setMessages(prev => [...prev, botMessage]);
            setConversationContext(prev => {
              const newContext = { ...prev, ...aiResponse.context };
              console.log('Updated context:', newContext);
              return newContext;
            });
          } else {
            // Fallback response if AI response is invalid
            const fallbackMessage: Message = {
              id: Date.now() + 1,
              type: 'bot',
              content: "I apologize, but I'm having trouble processing that request. Let me help you with something else. What would you like to know about your insurance?",
              timestamp: new Date(),
              suggestions: ["File a claim", "Get a quote", "Policy questions", "Payment help"],
              aiMode: 'rule-based' as const
            };
            setMessages(prev => [...prev, fallbackMessage]);
          }
        } catch (apiError) {
          console.error('Error in AI processing:', apiError);
          // Final fallback to rule-based responses
          const fallbackResponse = claudeAPI.getFallbackResponse(textToSend, conversationContext);
          const botMessage: Message = {
            id: Date.now() + 1,
            type: 'bot',
            content: fallbackResponse.content,
            timestamp: new Date(),
            suggestions: fallbackResponse.suggestions || [],
            aiMode: 'rule-based' as const
          };
          setMessages(prev => [...prev, botMessage]);
          setConversationContext(prev => ({ ...prev, ...fallbackResponse.context }));
        }
        setIsTyping(false);
      }, 1000 + Math.random() * 1000); // Realistic response time
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm experiencing a technical issue. Please try again or contact our support team for assistance.",
        timestamp: new Date(),
        suggestions: ["Try again", "File a claim", "Get a quote", "Contact support"],
        aiMode: 'rule-based' as const
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (timestamp: Date) => {
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
              AI-Powered Insurance Support - Always Available
            </p>
          </div>
          <LMButton
            variant="secondary"
            size="sm"
            onClick={resetConversation}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: LMDesignSystem.colors.white,
              border: `1px solid rgba(255, 255, 255, 0.3)`,
              fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem'
            }}
          >
            Reset Chat
          </LMButton>
        </div>
      </div>

      {/* Mobile Demo Mode Selector */}
      {window.innerWidth < 768 && (
        <div style={{
          padding: LMDesignSystem.spacing.md,
          backgroundColor: LMDesignSystem.colors.white,
          borderBottom: `1px solid ${LMDesignSystem.colors.grayTint10}`,
          display: 'flex',
          flexDirection: 'column',
          gap: LMDesignSystem.spacing.sm
        }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: LMDesignSystem.colors.libertyBlue,
            textAlign: 'center'
          }}>
            Demo Mode Selector
          </div>
          <div style={{
            display: 'flex',
            gap: LMDesignSystem.spacing.sm,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {(['claude', 'rule-based', 'auto'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setAiMode(mode)}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  borderRadius: LMDesignSystem.borderRadius.sm,
                  border: `1px solid ${aiMode === mode ? LMDesignSystem.colors.libertyBlue : LMDesignSystem.colors.libertyDarkGray}`,
                  backgroundColor: aiMode === mode ? LMDesignSystem.colors.libertyBlue : 'white',
                  color: aiMode === mode ? 'white' : LMDesignSystem.colors.libertyBlue,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize'
                }}
                onMouseEnter={(e) => {
                  if (aiMode !== mode) {
                    e.currentTarget.style.backgroundColor = LMDesignSystem.colors.libertyTeal;
                  }
                }}
                onMouseLeave={(e) => {
                  if (aiMode !== mode) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {mode === 'claude' ? 'Claude AI' : mode === 'rule-based' ? 'Rule-based' : 'Auto'}
              </button>
            ))}
          </div>
          <div style={{
            fontSize: '0.625rem',
            color: LMDesignSystem.colors.libertyDarkGray,
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            {aiMode === 'claude' ? 'Forces Claude API responses' :
             aiMode === 'rule-based' ? 'Uses local rule-based system' :
             'Automatically chooses best available option'}
          </div>
        </div>
      )}

      {/* Main Content Area with Sidebar */}
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        height: window.innerWidth < 768 ? 'auto' : 'calc(100vh - 200px)'
      }}>
        {/* Chat Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}>
          {/* Messages Area */}
          <div 
            style={{
              flex: 1,
              height: window.innerWidth < 768 ? '50vh' : 'auto',
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
                      {message.aiMode && (
                        <div style={{
                          fontSize: '0.625rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: message.aiMode === 'claude' ? LMDesignSystem.colors.libertyYellow : 
                                         message.aiMode === 'rule-based' ? LMDesignSystem.colors.libertyTeal :
                                         LMDesignSystem.colors.libertyBlue,
                          color: 'white',
                          fontWeight: 600,
                          display: 'inline-block',
                          marginTop: LMDesignSystem.spacing.xs
                        }}>
                          {message.aiMode === 'claude' ? 'Claude AI' : 
                           message.aiMode === 'rule-based' ? 'Rule-based' : 'Auto'}
                        </div>
                      )}
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
                onClick={() => handleSendMessage("I need help with billing and payments")}
                disabled={false}
                fullWidth={true}
                style={{
                  backgroundColor: LMDesignSystem.colors.yellowTint60
                }}
              >
                Billing Help
              </LMButton>
            </div>
            
            <div style={{
              marginTop: LMDesignSystem.spacing.md,
              fontSize: window.innerWidth < 768 ? '0.625rem' : '0.75rem',
              color: LMDesignSystem.colors.libertyDarkGray,
              textAlign: 'center'
            }}>
              Demo by Mirabelle Doiron - Showcasing AI UX Best Practices for Insurance
            </div>
          </div>
        </div>

        {/* Sidebar - Demo Mode Selector */}
        {window.innerWidth >= 768 && (
          <div style={{
            width: '280px',
            borderLeft: `1px solid ${LMDesignSystem.colors.grayTint10}`,
            backgroundColor: LMDesignSystem.colors.white,
            padding: LMDesignSystem.spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: LMDesignSystem.spacing.lg
          }}>
            {/* AI Mode Toggle */}
            <div style={{
              padding: LMDesignSystem.spacing.md,
              backgroundColor: LMDesignSystem.colors.libertyAtmosphericWhite,
              borderRadius: LMDesignSystem.borderRadius.md,
              border: `1px solid ${LMDesignSystem.colors.grayTint10}`
            }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: LMDesignSystem.colors.libertyBlue,
                marginBottom: LMDesignSystem.spacing.sm
              }}>
                Demo Mode Selector
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: LMDesignSystem.spacing.sm
              }}>
                {(['claude', 'rule-based', 'auto'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAiMode(mode)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.75rem',
                      borderRadius: LMDesignSystem.borderRadius.sm,
                      border: `1px solid ${aiMode === mode ? LMDesignSystem.colors.libertyBlue : LMDesignSystem.colors.libertyDarkGray}`,
                      backgroundColor: aiMode === mode ? LMDesignSystem.colors.libertyBlue : 'white',
                      color: aiMode === mode ? 'white' : LMDesignSystem.colors.libertyBlue,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (aiMode !== mode) {
                        e.currentTarget.style.backgroundColor = LMDesignSystem.colors.libertyTeal;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (aiMode !== mode) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {mode === 'claude' ? 'Claude AI' : mode === 'rule-based' ? 'Rule-based' : 'Auto'}
                  </button>
                ))}
              </div>
              <div style={{
                fontSize: '0.625rem',
                color: LMDesignSystem.colors.libertyDarkGray,
                marginTop: LMDesignSystem.spacing.sm,
                fontStyle: 'italic'
              }}>
                {aiMode === 'claude' ? 'Forces Claude API responses' :
                 aiMode === 'rule-based' ? 'Uses local rule-based system' :
                 'Automatically chooses best available option'}
              </div>
            </div>

            {/* API Status */}
            <div style={{
              padding: LMDesignSystem.spacing.md,
              backgroundColor: LMDesignSystem.colors.libertyAtmosphericWhite,
              borderRadius: LMDesignSystem.borderRadius.md,
              border: `1px solid ${LMDesignSystem.colors.grayTint10}`
            }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: LMDesignSystem.colors.libertyBlue,
                marginBottom: LMDesignSystem.spacing.sm
              }}>
                API Status
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: LMDesignSystem.colors.libertyDarkGray
              }}>
                <div>Claude API: {claudeAPI.isAPIAvailable() ? 'Available' : 'Not Available'}</div>
                <div>Model: {claudeAPI.getAPIStatus().model}</div>
                <div>Current Mode: {aiMode}</div>
              </div>
            </div>

            {/* Mobile Demo Mode Selector (hidden on desktop) */}
            <div style={{
              display: 'none',
              padding: LMDesignSystem.spacing.md,
              backgroundColor: LMDesignSystem.colors.libertyAtmosphericWhite,
              borderRadius: LMDesignSystem.borderRadius.md,
              border: `1px solid ${LMDesignSystem.colors.grayTint10}`
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: LMDesignSystem.colors.libertyBlue,
                marginBottom: LMDesignSystem.spacing.sm
              }}>
                Demo Mode (Mobile)
              </div>
              <div style={{
                display: 'flex',
                gap: LMDesignSystem.spacing.sm,
                flexWrap: 'wrap'
              }}>
                {(['claude', 'rule-based', 'auto'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAiMode(mode)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.625rem',
                      borderRadius: LMDesignSystem.borderRadius.sm,
                      border: `1px solid ${aiMode === mode ? LMDesignSystem.colors.libertyBlue : LMDesignSystem.colors.libertyDarkGray}`,
                      backgroundColor: aiMode === mode ? LMDesignSystem.colors.libertyBlue : 'white',
                      color: aiMode === mode ? 'white' : LMDesignSystem.colors.libertyBlue,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize'
                    }}
                  >
                    {mode === 'claude' ? 'Claude AI' : mode === 'rule-based' ? 'Rule-based' : 'Auto'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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