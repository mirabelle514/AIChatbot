const getAIResponse = (userMessage, context) => {
const message = userMessage.toLowerCase();
const currentFlow = context.flow || '';
const currentStep = context.step || '';

console.log('getAIResponse called with:', { userMessage, message, currentFlow, currentStep, context });
  
  // Claims flow - Initial entry
  if ((message.includes('claim') && !currentFlow) || (message.includes('accident') && !currentFlow)) {
    return {
      content: "I can help you file a claim. To get started efficiently, I'll need to gather some basic information. Are you reporting a new incident, or following up on an existing claim?",
      suggestions: ["New incident", "Existing claim", "Check claim status"],
      context: { flow: 'claims', step: 'initial' }
    };
  }
  
  // Claims flow - Continuing conversation
  if (currentFlow === 'claims') {
    if (currentStep === 'initial') {
      if (message.includes('new incident')) {
        return {
          content: "I understand you need to report a new incident. For your safety and to expedite the process:\n\n• If anyone is injured or in immediate danger, please call 911 first\n• I can collect preliminary information now\n• You'll receive a claim number immediately\n\nIs everyone safe? If yes, let's proceed with the details.",
          suggestions: ["Everyone is safe, continue", "Need emergency help", "Call me instead"],
          context: { flow: 'claims', step: 'safety_check' }
        };
      }
      
      if (message.includes('existing claim') || message.includes('check claim status')) {
        return {
          content: "I can help you check on an existing claim. To locate your claim, I'll need your claim number (starts with CLM) or policy number.",
          suggestions: ["I have my claim number", "I have my policy number", "Use my phone number"],
          context: { flow: 'claims', step: 'claim_lookup' }
        };
      }
    }
    
    if (currentStep === 'safety_check') {
      if (message.includes('everyone is safe') || message.includes('continue')) {
        return {
          content: "Great, I'm glad everyone is safe. Now let's gather the incident details:\n\nWhat type of incident are you reporting?",
          suggestions: ["Auto accident", "Property damage", "Theft", "Weather damage"],
          context: { flow: 'claims', step: 'incident_type' }
        };
      }
    }
    
    if (currentStep === 'incident_type') {
      if (message.includes('auto accident')) {
        return {
          content: "I'll help you report the auto accident. When did this accident occur?",
          suggestions: ["Today", "Yesterday", "Within the last week", "More than a week ago"],
          context: { flow: 'claims', step: 'auto_accident_details', incidentType: 'auto_accident' }
        };
      }
    }
    
    if (currentStep === 'auto_accident_details') {
      if (message.includes('today')) {
        return {
          content: "Thank you. Since this happened today, time is important for documentation. Where did the accident occur?",
          suggestions: ["In Fox Point, WI", "Different location", "On the highway", "In a parking lot"],
          context: { flow: 'claims', step: 'accident_location', incidentType: 'auto_accident', when: 'today' }
        };
      }
    }
    
    if (currentStep === 'claim_lookup') {
      if (message.includes('claim number')) {
        return {
          content: "Perfect! Please provide your claim number. For this demo, I'll simulate checking claim CLM123456789:",
          suggestions: ["CLM123456789", "Different claim number"],
          context: { flow: 'claims', step: 'claim_status_result' }
        };
      }
    }
    
    if (currentStep === 'claim_status_result') {
      if (message.includes('clm123456789')) {
        return {
          content: "Claim Status Found:\n\nClaim #: CLM123456789\nType: Auto Accident\nStatus: Under Review\nFiled: March 15, 2025\nAdjuster: Sarah Johnson\nNext Step: Waiting for repair estimate\n\nYou can reach your adjuster at (800) 555-0123\n\nIs there anything specific about this claim you'd like to know?",
          suggestions: ["When will it be resolved?", "How much will I receive?", "Update my information", "Speak to my adjuster"],
          context: { flow: 'claims', step: 'claim_details', claimNumber: 'CLM123456789' }
        };
      }
    }
  }
  
  // Quote flow - Initial entry
  if ((message.includes('quote') && !currentFlow) || (message.includes('price') && !currentFlow)) {
    return {
      content: "I'd be happy to help you get a personalized quote. I can provide estimates for:\n\n• Auto insurance - Starting at $89/month\n• Home insurance - Starting at $67/month\n• Renters insurance - Starting at $12/month\n• Life insurance - Starting at $15/month\n\nWhich type of coverage are you interested in?",
      suggestions: ["Auto insurance", "Home insurance", "Renters insurance", "Life insurance"],
      context: { flow: 'quote', step: 'coverage_type' }
    };
  }
  
  // Quote flow - Continuing conversation
  if (currentFlow === 'quote') {
    if (currentStep === 'coverage_type') {
      if (message.includes('auto insurance')) {
        return {
          content: "Great choice! For an accurate auto insurance quote, I'll need some information about you and your vehicle. This should only take about 3 minutes.\n\nFirst, what's your ZIP code? This helps us determine local rates and coverage requirements.",
          suggestions: ["53217 (Fox Point, WI)", "Different ZIP code", "Why do you need this?"],
          context: { flow: 'quote', step: 'auto_details', coverage: 'auto' }
        };
      }
    }
    
    if ((message.includes('53217') || message.includes('fox point')) && context.coverage === 'auto') {
      return {
        content: "Perfect! Fox Point, Wisconsin. I see you're in a relatively low-risk area for auto claims, which means better rates for you!\n\nNext, what year is your primary vehicle? This helps us calculate the appropriate coverage and rates.",
        suggestions: ["2020 or newer", "2015-2019", "2010-2014", "Older than 2010"],
        context: { flow: 'quote', step: 'vehicle_year', location: 'Fox Point, WI', coverage: 'auto' }
      };
    }
    
    // Progressive disclosure: Vehicle year → Make/model
    if (message.includes('2020') || message.includes('newer') || message.includes('2015') || message.includes('2019') || message.includes('2010') || message.includes('2014') || message.includes('older') || message.includes('2010')) {
      const vehicleYear = message.includes('2020') || message.includes('newer') ? '2020+'
                       : message.includes('2015') || message.includes('2019') ? '2015-2019'
                       : message.includes('2010') || message.includes('2014') ? '2010-2014'
                       : 'Pre-2010';
      
      return {
        content: `Great! ${vehicleYear} vehicle. Now I need to know the make and model of your vehicle to provide the most accurate quote.\n\nWhat's the make of your vehicle?`,
        suggestions: ["Toyota", "Honda", "Ford", "Chevrolet", "Other"],
        context: { flow: 'quote', step: 'vehicle_make', location: 'Fox Point, WI', coverage: 'auto', vehicleYear }
      };
    }
    
    // Progressive disclosure: Make → Model
    if (message.includes('toyota') || message.includes('honda') || message.includes('ford') || message.includes('chevrolet') || message.includes('other')) {
      const make = message.includes('toyota') ? 'Toyota'
                : message.includes('honda') ? 'Honda'
                : message.includes('ford') ? 'Ford'
                : message.includes('chevrolet') ? 'Chevrolet'
                : 'Other';
      
      return {
        content: `Perfect! ${make}. Now what's the model? For example: Camry, Accord, F-150, Silverado, etc.`,
        suggestions: ["Camry/Accord", "SUV", "Truck", "Other"],
        context: { flow: 'quote', step: 'vehicle_model', location: 'Fox Point, WI', coverage: 'auto', vehicleMake: make }
      };
    }
    
    // Progressive disclosure: Model → Driving history
    if (message.includes('camry') || message.includes('accord') || message.includes('suv') || message.includes('truck') || message.includes('other')) {
      return {
        content: "Excellent! Now I need to understand your driving history to provide the most accurate quote.\n\nHow long have you been licensed to drive?",
        suggestions: ["Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"],
        context: { flow: 'quote', step: 'driving_history', location: 'Fox Point, WI', coverage: 'auto' }
      };
    }
    
    // Progressive disclosure: Driving history → Final quote
    if (message.includes('less than 1') || message.includes('1-3') || message.includes('3-5') || message.includes('more than 5')) {
      const experience = message.includes('less than 1') ? 'new driver'
                      : message.includes('1-3') ? '1-3 years'
                      : message.includes('3-5') ? '3-5 years'
                      : 'experienced driver';
      
      return {
        content: `Thank you! Based on your ${experience} experience in Fox Point, WI, here's your personalized auto insurance quote:\n\n🏆 **Your Liberty Mutual Auto Quote**\n\n**Monthly Premium: $89.50**\n**Annual Premium: $1,074**\n\n**Coverage Includes:**\n• Liability: $100,000/$300,000\n• Collision: $500 deductible\n• Comprehensive: $500 deductible\n• Uninsured Motorist: $100,000/$300,000\n• Roadside Assistance: Included\n\n**Liberty Mutual Benefits:**\n• Accident Forgiveness (first accident)\n• New Car Replacement\n• Better Car Replacement\n• 24/7 Claims Support\n\nWould you like to proceed with this quote or make any adjustments?`,
        suggestions: ["Proceed with quote", "Adjust coverage", "Compare with other companies", "Speak to an agent"],
        context: { flow: 'quote', step: 'final_quote', location: 'Fox Point, WI', coverage: 'auto', monthlyPremium: '$89.50' }
      };
    }
    
    if (message.includes('2020 or newer') && context.coverage === 'auto') {
      return {
        content: "Excellent! A newer vehicle typically qualifies for our best rates. What's the make and model?",
        suggestions: ["Honda Civic", "Toyota Camry", "Ford F-150", "Tesla Model 3"],
        context: { flow: 'quote', step: 'vehicle_make', location: 'Fox Point, WI', coverage: 'auto', year: '2020+' }
      };
    }
    
    if ((message.includes('honda civic') || message.includes('toyota camry')) && context.coverage === 'auto') {
      const vehicle = message.includes('honda') ? 'Honda Civic' : 'Toyota Camry';
      return {
        content: `Great choice! The ${vehicle} is known for safety and reliability. Now I need some information about your driving history:\n\n• How many years have you been driving?\n• Any accidents or violations in the last 5 years?`,
        suggestions: ["5+ years, clean record", "10+ years, clean record", "Some violations", "New driver"],
        context: { flow: 'quote', step: 'driver_history', location: 'Fox Point, WI', coverage: 'auto', year: '2020+', vehicle: vehicle }
      };
    }
    
    if (message.includes('clean record') && context.coverage === 'auto') {
      const experience = message.includes('10+') ? '10+' : '5+';
      return {
        content: `Perfect! With your ${experience} years of experience and clean driving record, you qualify for our best rates.\n\nYour Estimated Auto Insurance Quote:\n\nMonthly Premium: $78-$95\nCoverage Includes:\n• Liability: $100K/$300K/$100K\n• Collision & Comprehensive\n• Uninsured Motorist\n• Roadside Assistance\n\nAvailable Discounts:\n• Multi-policy discount: Save 10%\n• Safe driver discount: Save 15%\n\nWould you like to customize your coverage or apply for this policy?`,
        suggestions: ["Apply for this policy", "Adjust coverage levels", "Add another vehicle", "See home insurance too"],
        context: { flow: 'quote', step: 'quote_ready', coverage: 'auto', premium: '$78-95', location: 'Fox Point, WI' }
      };
    }
    
    if (message.includes('home insurance') || (currentFlow === 'quote' && context.coverage === 'home')) {
      return {
        content: "Excellent! Home insurance protects your most valuable investment. Let's start with your property details:\n\n• What's your home's ZIP code?\n• What year was your home built?\n• What's the approximate square footage?",
        suggestions: ["53217, built 1990s, 2000+ sq ft", "Different details", "I'm still shopping for a home"],
        context: { flow: 'quote', step: 'home_details', coverage: 'home' }
      };
    }
    
    if (message.includes('53217') && message.includes('1990s') && context.coverage === 'home') {
      return {
        content: "Great location and a well-established home! Fox Point has excellent fire protection and low crime rates.\n\nYour Estimated Home Insurance Quote:\n\nAnnual Premium: $800-$1,200\nCoverage Includes:\n• Dwelling: $400,000\n• Personal Property: $300,000\n• Liability: $300,000\n• Loss of Use: $80,000\n\nSpecial Features:\n• Replacement cost coverage\n• Water backup protection\n• Identity theft recovery\n\nBundle & Save: Combine with auto insurance for 20% off both policies!",
        suggestions: ["Bundle with auto insurance", "Adjust coverage amounts", "Apply for home only", "Learn about discounts"],
        context: { flow: 'quote', step: 'home_quote_ready', coverage: 'home', premium: '$800-1200' }
      };
    }
    
    if (message.includes('bundle') || message.includes('see home insurance too')) {
      return {
        content: "Bundle & Save Opportunity!\n\nCombining your auto and home insurance with Liberty Mutual gives you:\n\nTotal Monthly Savings:\n• Auto: $78-95 → $62-76 (20% off)\n• Home: $67-100 → $54-80 (20% off)\n• Total: $116-156/month\n• Annual Savings: $350-450\n\nAdditional Bundle Benefits:\n• Single deductible for claims affecting both\n• One point of contact for all policies\n• Simplified billing\n• 24/7 support for all your insurance needs\n\nReady to start your application?",
        suggestions: ["Yes, start my application", "I need more time to decide", "Compare to other companies", "Speak to an agent"],
        context: { flow: 'quote', step: 'bundle_ready', autoPremium: '$62-76', homePremium: '$54-80' }
      };
    }
    
    if (message.includes('why do you need') && context.coverage === 'auto') {
      return {
        content: "Great question! Here's why we need your ZIP code for accurate auto insurance quotes:\n\nLocation affects rates because:\n• Accident frequency - Urban vs rural claim rates\n• Weather risks - Hail, flooding, snow damage\n• Theft rates - Vehicle theft statistics by area\n• Repair costs - Labor and parts prices vary\n• State requirements - Minimum coverage laws differ\n\nFor example, Fox Point, WI has:\n• Low crime rates = Lower comprehensive premiums\n• Good road conditions = Fewer accident claims\n• Lower population density = Less traffic risk\n\nThis typically means better rates for you! Ready to continue with your quote?",
        suggestions: ["Yes, continue my quote", "53217 (Fox Point, WI)", "Try a different ZIP code"],
        context: { flow: 'quote', step: 'zip_explanation', coverage: 'auto' }
      };
    }
  }
  
  // Policy management flow
  if (message.includes('policy') || message.includes('coverage') || currentFlow === 'policy') {
    if (message.includes('current coverage') || currentStep === 'coverage_review') {
      return {
        content: "I can help you review your current coverage. To access your policy details securely, I'll need to verify your identity first.\n\nVerification Options:\n• Policy number (found on your insurance card)\n• Phone number on your account\n• Email address on file",
        suggestions: ["Use policy number", "Use phone number", "Use email address", "I don't have these"],
        context: { flow: 'policy', step: 'verification' }
      };
    }
    
    if (message.includes('policy number') && currentStep === 'verification') {
      return {
        content: "Perfect! Please provide your policy number. For this demo, I'll use sample policy POL-987654321:",
        suggestions: ["POL-987654321", "Different policy number"],
        context: { flow: 'policy', step: 'policy_lookup' }
      };
    }
    
    if (message.includes('pol-987654321') || currentStep === 'policy_details') {
      return {
        content: "Policy Found - Welcome back, Sarah!\n\nYour Current Coverage:\n\nAuto Policy: POL-987654321\n• Vehicle: 2021 Honda Civic\n• Premium: $89/month\n• Liability: $100K/$300K/$100K\n• Deductible: $500\n• Next Payment: April 15, 2025\n\nHome Policy: POL-987654322\n• Property: 123 Oak Street, Fox Point, WI\n• Premium: $75/month\n• Dwelling: $350,000\n• Deductible: $1,000\n\nWhat would you like to do with your policy?",
        suggestions: ["Make a payment", "Change coverage", "Update information", "Add a driver"],
        context: { flow: 'policy', step: 'policy_actions', policyNumber: 'POL-987654321' }
      };
    }
    
    if (message.includes('make changes') || message.includes('change coverage')) {
      return {
        content: "I can help you make changes to your policy. Here are the most common updates:\n\nAuto Policy Changes:\n• Add or remove a driver\n• Add or remove a vehicle\n• Change coverage limits\n• Adjust deductibles\n\nHome Policy Changes:\n• Update property value\n• Add personal property coverage\n• Change deductibles\n• Add endorsements\n\nWhat type of change would you like to make?",
        suggestions: ["Add a driver", "Add a vehicle", "Increase coverage", "Lower my premium"],
        context: { flow: 'policy', step: 'policy_changes' }
      };
    }
    
    if (message.includes('understand coverage') || message.includes('explain')) {
      return {
        content: "I'd be happy to explain your insurance coverage! Insurance can be complex, but I'll break it down simply.\n\nWhat would you like me to explain:\n\nAuto Insurance:\n• Liability coverage (what you're legally required to have)\n• Collision & comprehensive (protects your car)\n• Uninsured motorist (protects you from others)\n\nHome Insurance:\n• Dwelling coverage (rebuilds your home)\n• Personal property (your belongings)\n• Liability (protects your assets)\n\nWhich topic interests you most?",
        suggestions: ["Liability coverage", "Comprehensive coverage", "Deductibles", "Claims process"],
        context: { flow: 'policy', step: 'education' }
      };
    }
  }
  
  // Billing and payments flow
  if (message.includes('payment') || message.includes('bill') || currentFlow === 'billing') {
    if (currentStep !== 'payment_verification') {
      return {
        content: "I can help with payment and billing questions.\n\n🔒 **Security Verification Required**\nFor your protection, I need to verify your identity before accessing billing information.\n\n**Verification Options:**\n• Policy number (most secure)\n• Phone number on file\n• Email address on file\n• Last 4 digits of SSN\n\n**Your data is protected:**\n• Encrypted transmission\n• Secure verification process\n• No data stored in chat\n\nWhat's the easiest way for you to verify your account?",
        suggestions: ["Policy number", "Phone number", "Email address", "Last 4 of SSN"],
        context: { flow: 'billing', step: 'payment_verification', securityRequired: true }
      };
    }
    
    if (message.includes('policy number') && currentStep === 'payment_verification') {
      return {
        content: "Account Verified\n\nYour Billing Information:\n\nNext Payment Due: April 15, 2025\nAmount Due: $164.00 (Auto: $89 + Home: $75)\nPayment Method: Auto-pay from checking account ending in 1234\n\nPayment Options:\n• Make a one-time payment now\n• Update auto-pay settings\n• View payment history\n• Set up payment reminders\n\nWhat would you like to do?",
        suggestions: ["Make a payment now", "Update auto-pay", "View payment history", "Change payment method"],
        context: { flow: 'billing', step: 'payment_options', amountDue: '$164.00' }
      };
    }
    
    if (message.includes('make a payment') || message.includes('pay now')) {
      return {
        content: "Make a Payment\n\nAmount Due: $164.00\nDue Date: April 15, 2025\n\nPayment Methods:\n• Bank account (ACH) - No fee\n• Debit card - No fee\n• Credit card - $2.50 fee\n• Phone payment - $5.00 fee\n\nFor this demo, I'll simulate a successful payment:\n\nPayment Processed Successfully!\nConfirmation: PMT-789123456\nReceipt emailed to: sarah@email.com\nNext due date: May 15, 2025",
        suggestions: ["Set up auto-pay", "Get payment confirmation", "Make another payment", "Return to main menu"],
        context: { flow: 'billing', step: 'payment_complete' }
      };
    }
  }
  
  // Human transfer requests
  if (message.includes('human') || message.includes('agent') || message.includes('speak to someone')) {
    return {
      content: "I'd be happy to connect you with one of our licensed agents!\n\nContact Options:\n\nImmediate Help:\n• Call: 1-800-290-8711 (24/7)\n• Live chat on our website\n\nSchedule a Call:\n• Choose a convenient time\n• Agent will call you\n• No wait time\n\nLocal Agent:\n• Find agents near Fox Point, WI\n• In-person consultation\n• Local expertise\n\nWhich option works best for you?",
      suggestions: ["Call now", "Schedule a callback", "Find local agent", "Continue with AI"],
      context: { flow: 'human_transfer', step: 'contact_options' }
    };
  }
  
  // Help requests
  if (message.includes('help') && !currentFlow) {
    return {
      content: "I'm here to help with all your Liberty Mutual insurance needs!\n\nPopular requests:\n• File or check a claim\n• Get insurance quotes\n• Review your policy\n• Make a payment\n• Update your information\n• Speak with an agent\n\nQuick tip: You can ask me questions in plain English, like \"How much would car insurance cost?\" or \"I need to add my teenager to my policy.\"\n\nWhat can I help you with today?",
      suggestions: ["File a claim", "Get a quote", "Review my policy", "Make a payment"],
      context: { flow: 'general', step: 'help_menu' }
    };
  }
  
  // Greetings
  if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
    return {
      content: "Hello! Great to meet you! I'm Liberty Assistant, and I'm here to make insurance simple and straightforward.\n\n🏆 **Liberty Mutual - Protecting What Matters Most**\n\nI can help you with:\n• Filing claims quickly and easily\n• Getting instant quotes\n• Understanding your coverage\n• Managing payments\n• Updating your information\n\n**Progressive Approach:** I'll guide you step-by-step, only asking for what's needed when it's needed.\n\nWhether you're a current customer or shopping for new coverage, I'm here to help! What brings you here today?",
      suggestions: ["I need insurance", "I'm a current customer", "I have a question", "Just browsing"],
      context: { flow: 'greeting', step: 'initial_response', progressiveDisclosure: true }
    };
  }
  
  // Thank you responses
  if (message.includes('thank') || message.includes('appreciate')) {
    return {
      content: "You're very welcome! I'm glad I could help.\n\nIs there anything else I can assist you with today? I'm here 24/7 whenever you need insurance support.",
      suggestions: ["Nothing else, thanks", "I have another question", "Connect me to an agent", "Return to main menu"],
      context: { flow: 'conclusion', step: 'thanks_response' }
    };
  }
  
  // Error handling - when AI doesn't understand
  if (message.includes('gibberish') || message.includes('test') || message.includes('asdf') || message.includes('qwerty')) {
    return {
      content: "I'm not quite sure I understand that request. Let me help you get back on track!\n\n🔒 **Security Note:** I'm designed to help with insurance-related questions only.\n\n**I can help you with:**\n• Filing insurance claims\n• Getting quotes for coverage\n• Explaining policy details\n• Payment and billing questions\n\n**Trust & Security:**\n• All conversations are encrypted\n• Your information is protected\n• I can't access personal data without verification\n\nWhat would you like help with?",
      suggestions: ["File a claim", "Get a quote", "Policy questions", "Speak to a human agent"],
      context: { needsClarification: true, securityMessage: true }
    };
  }
  
  // Default helpful response
  return {
    content: "I want to make sure I give you the most helpful information. Could you tell me a bit more about what you're looking for? I'm here to help with claims, quotes, policy questions, and billing.",
    suggestions: ["File a claim", "Get a quote", "Policy questions", "Billing help"],
    context: { flow: 'general' }
  };
};

export { getAIResponse };