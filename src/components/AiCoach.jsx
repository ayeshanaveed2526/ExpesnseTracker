import { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, MessageSquare, Send, X, ArrowUpRight, TrendingUp, TrendingDown, Info, Award, AlertTriangle, ShieldCheck } from 'lucide-react';

const AiCoach = ({ expenses = [], budgets = [], userName = '', currencySymbol = 'Rs.', savingsGoal = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const chatEndRef = useRef(null);

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // --- Financial Health Score Calculation ---
  const calculateHealthScore = () => {
    if (expenses.length === 0) return { score: null, grade: '--', status: 'Insufficient data' };

    let score = 100;
    
    // Factor 1: Cash Flow Ratio (up to 30 points)
    // If spending is greater than income, subtract heavily.
    if (totalIncome > 0) {
      const expenseRatio = totalExpense / totalIncome;
      if (expenseRatio > 1.0) {
        score -= 30; // Deficit spending
      } else if (expenseRatio > 0.8) {
        score -= 15; // Barely saving
      } else if (expenseRatio < 0.5) {
        score += 5;  // Healthy savings rate (>50%)
      }
    } else if (totalExpense > 0) {
      score -= 30; // Expenses but no income
    }

    // Factor 2: Budget Adherence (up to 40 points)
    // Find expenses grouped by category
    const categoryTotals = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    let budgetsExceeded = 0;
    budgets.forEach(b => {
      const spent = categoryTotals[b.category] || 0;
      if (spent > b.limit) {
        budgetsExceeded++;
      }
    });

    if (budgets.length > 0) {
      if (budgetsExceeded > 0) {
        score -= budgetsExceeded * 15; // Deduct 15 points per broken budget
      } else {
        score += 5; // Reward if all budgets are met
      }
    }

    // Factor 3: Savings Progress towards goal (up to 30 points)
    if (savingsGoal > 0) {
      const progressRatio = Math.max(0, balance / savingsGoal);
      if (progressRatio >= 1.0) {
        score += 5; // Goal met
      } else if (progressRatio < 0.1) {
        score -= 10; // Far from goal
      }
    }

    // Clamp score
    const finalScore = Math.max(0, Math.min(score, 100));

    // Map to Grade
    let grade = 'C';
    let status = 'Fair';
    let color = 'text-amber-500';

    if (finalScore >= 90) {
      grade = 'A+';
      status = 'Excellent';
      color = 'text-emerald-500';
    } else if (finalScore >= 80) {
      grade = 'A';
      status = 'Very Good';
      color = 'text-emerald-400';
    } else if (finalScore >= 70) {
      grade = 'B';
      status = 'Good';
      color = 'text-primary';
    } else if (finalScore >= 60) {
      grade = 'C';
      status = 'Average';
      color = 'text-amber-400';
    } else {
      grade = 'D';
      status = 'Needs Attention';
      color = 'text-rose-500';
    }

    return { score: finalScore, grade, status, color };
  };

  const health = calculateHealthScore();

  // Initialize welcome message
  useEffect(() => {
    const greeting = userName ? `Hi, ${userName}!` : 'Hello!';
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `${greeting} I'm your FinPulse AI Advisor. I've analyzed your current transactions and monthly budgets. How can I help you improve your finances today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [userName]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    // Dynamic Client-side Answer Engine
    setTimeout(() => {
      const responseText = generateResponse(textToSend);
      const newAiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const generateResponse = (input) => {
    const text = input.toLowerCase();

    // Group expenses by category
    const categoryTotals = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    // 1. Spending Analysis Query
    if (text.includes('analyze') || text.includes('spend') || text.includes('summary') || text.includes('statistics')) {
      if (expenses.length === 0) {
        return `You have not recorded any expenses yet! Click the "Record Transaction" button at the top of your page to input your first entry, and I will instantly generate a breakdown of your spending.`;
      }
      
      let breakdown = `Here is your current transaction summary:\n\n`;
      breakdown += `• **Total Income**: ${currencySymbol} ${totalIncome.toLocaleString('en-US')}\n`;
      breakdown += `• **Total Spendings**: ${currencySymbol} ${totalExpense.toLocaleString('en-US')}\n`;
      breakdown += `• **Net Balance**: ${currencySymbol} ${balance.toLocaleString('en-US')}\n\n`;

      if (Object.keys(categoryTotals).length > 0) {
        breakdown += `**Spending by Category:**\n`;
        const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
        sortedCats.forEach(([cat, amt]) => {
          const pct = ((amt / totalExpense) * 100).toFixed(1);
          breakdown += `- **${cat}**: ${currencySymbol} ${amt.toLocaleString('en-US')} (${pct}%)\n`;
        });
        breakdown += `\nYour highest expenditure is in the **${sortedCats[0][0]}** category.`;
      }
      return breakdown;
    }

    // 2. Budget Health Query
    if (text.includes('budget') || text.includes('limit')) {
      if (budgets.length === 0) {
        return `You haven't set up any monthly budget limits yet! Set a target limit inside the "Monthly Budgets" panel on your dashboard to help me analyze your limit adherence and save more.`;
      }

      let budgetMsg = `Here is your budget health report:\n\n`;
      let limitsExceeded = [];
      let nearLimits = [];

      budgets.forEach(b => {
        const spent = categoryTotals[b.category] || 0;
        const ratio = spent / b.limit;
        if (ratio > 1.0) {
          limitsExceeded.push(`- **${b.category}**: Over by ${currencySymbol} ${(spent - b.limit).toLocaleString('en-US')} (Spent: ${currencySymbol} ${spent.toLocaleString()} / Limit: ${currencySymbol} ${b.limit.toLocaleString()})`);
        } else if (ratio >= 0.8) {
          nearLimits.push(`- **${b.category}**: Near limit at ${(ratio * 100).toFixed(0)}% (Spent: ${currencySymbol} ${spent.toLocaleString()} / Limit: ${currencySymbol} ${b.limit.toLocaleString()})`);
        }
      });

      if (limitsExceeded.length > 0) {
        budgetMsg += `⚠️ **Alert: Over Budget!**\n${limitsExceeded.join('\n')}\n\n`;
      }
      if (nearLimits.length > 0) {
        budgetMsg += `⚠️ **Warning: Nearing Limits!**\n${nearLimits.join('\n')}\n\n`;
      }
      if (limitsExceeded.length === 0 && nearLimits.length === 0) {
        budgetMsg += `✅ **Excellent!** All of your budget categories are well on track. Keep up the disciplined spending!`;
      } else {
        budgetMsg += `💡 *Tip: Consider setting aside a smaller amount for luxury items to absorb overages in essential categories.*`;
      }
      return budgetMsg;
    }

    // 3. Saving Tips Query
    if (text.includes('tip') || text.includes('save') || text.includes('saving') || text.includes('help')) {
      const topCat = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      const categorySpecificTip = topCat 
        ? `Adjust your spending in **${topCat[0]}** (currently ${currencySymbol} ${topCat[1].toLocaleString()}) as it is your highest spending area. Reducing it by just 15% will yield immediate savings.`
        : `Configure category spending limits to gain absolute visibility over your micro-transactions.`;

      return `Here are 3 tailored recommendations to optimize your finances:

1. **Category Adjustment**: ${categorySpecificTip}
2. **Follow the 50/30/20 Rule**: Allocate 50% of your income for Needs (rent, bills), 30% for Wants (dining out, entertainment), and save 20% immediately.
3. **Emergency Fund Target**: Try to build an emergency fund that covers 3-6 months of your total expenses (${currencySymbol} ${(totalExpense * 3).toLocaleString()}).`;
    }

    // 4. Affordability Query (e.g., "can I buy/afford a bike for 5000?")
    if (text.includes('buy') || text.includes('afford') || text.includes('cost')) {
      const numbers = text.match(/\d+/g);
      if (!numbers) {
        return `To help you check if you can afford a purchase, please specify the cost (e.g. "Can I afford to buy a gadget for 5000?").`;
      }

      const cost = parseFloat(numbers[0]);
      if (balance <= 0) {
        return `Currently, you are running in a deficit (Net Balance: ${currencySymbol} ${balance.toLocaleString()}). I strongly advise against making this purchase of ${currencySymbol} ${cost.toLocaleString()} right now. Prioritize growing your cash flow first!`;
      }

      if (cost > balance) {
        return `No, you cannot afford this purchase of ${currencySymbol} ${cost.toLocaleString()} with your current balance of ${currencySymbol} ${balance.toLocaleString()}. You are short by ${currencySymbol} ${(cost - balance).toLocaleString()}.`;
      }

      const remainingBalance = balance - cost;
      const progressPct = ((cost / savingsGoal) * 100).toFixed(1);

      if (cost >= balance * 0.5) {
        return `You technically have the funds, but it will consume **${((cost / balance) * 100).toFixed(0)}%** of your net balance. This is a high-risk purchase that will delay your savings goal progress by ${progressPct}%. I recommend waiting or saving up specifically for it.`;
      }

      return `Yes, you can comfortably afford this! The purchase of ${currencySymbol} ${cost.toLocaleString()} leaves you with a healthy balance of ${currencySymbol} ${remainingBalance.toLocaleString()} and only impacts your savings goal progress by ${progressPct}%.`;
    }

    // Greetings
    if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('yo')) {
      return `Hello! How can I assist you with your financial dashboard today? You can ask me to analyze your ledger, check your budgets, or give custom saving tips.`;
    }

    // Default Fallback
    return `I received your message! I can help you with financial analyses. Try asking one of these:
• "Analyze my spending"
• "Am I over my budget?"
• "Can I afford a purchase of ${currencySymbol} 5,000?"
• "Give me saving tips"`;
  };

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-lexend select-none">
      
      {/* Floating Button */}
      <button 
        onClick={handleOpenToggle}
        className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative shadow-xl hover:scale-105 active:scale-95 ${
          isOpen 
            ? 'bg-rose-500 text-zinc-950 shadow-rose-500/10' 
            : 'bg-primary text-zinc-950 shadow-primary/20 hover:shadow-primary/30 border border-primary/20'
        }`}
        aria-label="FinPulse AI Advisor"
      >
        {isOpen ? <X size={22} /> : <Bot size={22} className="animate-bounce" />}
        
        {/* Pulsing notification badge */}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[8px] font-bold text-white items-center justify-center">1</span>
          </span>
        )}
      </button>

      {/* Slide-out Coach Panel */}
      <div 
        className={`fixed bottom-24 right-6 w-[360px] md:w-[400px] h-[580px] rounded-3xl border border-border-main bg-surface-bright/90 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${
          isOpen 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-90 pointer-events-none'
        }`}
      >
        {/* Header with health score */}
        <div className="p-4 border-b border-border-main bg-surface/30 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/25">
              <Bot size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-text-main">FinPulse AI Coach</h3>
              <span className="text-[9px] text-emerald-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                <ShieldCheck size={10} /> Active Advisor
              </span>
            </div>
          </div>

          {/* Health Score Gauge */}
          {health.score !== null ? (
            <div className="flex items-center gap-2.5 bg-surface/80 border border-border-main rounded-xl px-3 py-1 shadow-inner relative overflow-hidden group">
              <div className="text-right">
                <span className="text-[8px] text-text-muted font-bold block uppercase tracking-wider">Health Score</span>
                <span className="text-[10px] text-text-main font-semibold">{health.status}</span>
              </div>
              <div className={`w-8 h-8 rounded-full border border-border-main/50 flex items-center justify-center font-bold text-xs ${health.color} shadow-sm bg-surface-bright`}>
                {health.grade}
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-text-muted italic flex items-center gap-1">
              <Info size={11} /> Start adding transactions
            </div>
          )}
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface/10">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border flex-shrink-0 text-[10px] font-bold ${
                msg.sender === 'user'
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'bg-surface-bright border-border-main text-text-muted'
              }`}>
                {msg.sender === 'user' ? (userName ? userName[0].toUpperCase() : 'U') : 'AI'}
              </div>

              {/* Message bubble */}
              <div className="space-y-1">
                <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-zinc-950 font-medium rounded-tr-none'
                    : 'bg-surface-bright/80 text-text-main border border-border-main/50 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <span className={`text-[8px] text-text-muted block ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2 max-w-[80%] mr-auto items-center animate-pulse">
              <div className="w-6 h-6 rounded-full flex items-center justify-center border bg-surface-bright border-border-main text-text-muted text-[10px] font-bold">
                AI
              </div>
              <div className="bg-surface-bright/80 border border-border-main/50 rounded-2xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-surface/20 border-t border-border-main/40 flex-shrink-0">
          <button 
            onClick={() => handleSendMessage("Analyze my spending 📊")}
            className="px-2.5 py-1 rounded-full border border-border-main/80 bg-surface-bright hover:border-primary/40 text-[9px] font-bold text-text-muted hover:text-text-main transition-all cursor-pointer hover:scale-95"
            disabled={isTyping}
          >
            Analyze spending 📊
          </button>
          <button 
            onClick={() => handleSendMessage("How is my budget? 🎯")}
            className="px-2.5 py-1 rounded-full border border-border-main/80 bg-surface-bright hover:border-primary/40 text-[9px] font-bold text-text-muted hover:text-text-main transition-all cursor-pointer hover:scale-95"
            disabled={isTyping}
          >
            How is my budget? 🎯
          </button>
          <button 
            onClick={() => handleSendMessage("Give me 3 saving tips 💡")}
            className="px-2.5 py-1 rounded-full border border-border-main/80 bg-surface-bright hover:border-primary/40 text-[9px] font-bold text-text-muted hover:text-text-main transition-all cursor-pointer hover:scale-95"
            disabled={isTyping}
          >
            Give saving tips 💡
          </button>
        </div>

        {/* Input area */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 bg-surface border-t border-border-main flex items-center gap-2 flex-shrink-0"
        >
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask your Advisor Coach..."
            className="flex-1 bg-surface-bright border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary/60 placeholder:text-text-muted/40 font-medium"
            disabled={isTyping}
          />
          <button 
            type="submit"
            className="p-2 rounded-xl bg-primary text-zinc-950 hover:scale-[0.98] transition-all cursor-pointer flex items-center justify-center shadow-md shadow-primary/10"
            disabled={isTyping}
          >
            <Send size={14} />
          </button>
        </form>

      </div>

    </div>
  );
};

export default AiCoach;
