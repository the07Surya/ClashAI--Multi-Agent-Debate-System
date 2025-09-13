import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  PlayIcon,
  PauseIcon,
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
  ScaleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';

import useWebSocket from '../hooks/useWebSocket';
import ResearchPanel from './ResearchPanel';
import FinalReport from './FinalReport';

const getAgentConfig = (agentType) => {
  const configs = {
    innovator: {
      name: 'Alex Chen',
      title: 'The Innovator',
      avatar: '🚀',
      colors: {
        primary: 'text-emerald-400',
        bg: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20',
        border: 'border-emerald-500/40',
        accent: 'bg-emerald-500/10',
        glow: 'shadow-emerald-500/30'
      }
    },
    skeptic: {
      name: 'Dr. Sarah Reeves',
      title: 'The Skeptic',
      avatar: '🛡️',
      colors: {
        primary: 'text-red-400',
        bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
        border: 'border-red-500/40',
        accent: 'bg-red-500/10',
        glow: 'shadow-red-500/30'
      }
    },
    engineer: {
      name: 'Marcus Torres',
      title: 'The Engineer',
      avatar: '⚙️',
      colors: {
        primary: 'text-blue-400',
        bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
        border: 'border-blue-500/40',
        accent: 'bg-blue-500/10',
        glow: 'shadow-blue-500/30'
      }
    },
    ethicist: {
      name: 'Dr. Amara Okafor',
      title: 'The Ethicist',
      avatar: '⚖️',
      colors: {
        primary: 'text-purple-400',
        bg: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20',
        border: 'border-purple-500/40',
        accent: 'bg-purple-500/10',
        glow: 'shadow-purple-500/30'
      }
    },
    judge: {
      name: 'Supreme AI Judge',
      title: 'Neutral Arbitrator',
      avatar: '👨‍⚖️',
      colors: {
        primary: 'text-amber-400',
        bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
        border: 'border-amber-500/40',
        accent: 'bg-amber-500/10',
        glow: 'shadow-amber-500/30'
      }
    }
  };
  return configs[agentType] || configs.innovator;
};

const ChatMessage = ({ message, isTyping = false }) => {
  const isJudge = message.type === 'judge_decision';
  const agentType = isJudge ? 'judge' : message.data?.role;
  const config = getAgentConfig(agentType);
  
  if (isJudge) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex justify-center mb-8"
      >
        <div className="max-w-4xl w-full">
          <div className={`${config.colors.bg} backdrop-blur-sm rounded-3xl p-6 border-2 ${config.colors.border} relative overflow-hidden`}>
            {/* Judge glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="text-3xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {config.avatar}
                  </motion.div>
                  <div>
                    <h4 className={`font-black text-lg ${config.colors.primary}`}>
                      {config.name}
                    </h4>
                    <p className="text-amber-300 text-sm font-medium">{config.title}</p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-bold text-sm border-2 ${
                  message.data.should_continue 
                    ? 'bg-green-500/20 text-green-300 border-green-500/40' 
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}>
                  {message.data.should_continue ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Continue Debate</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-5 w-5" />
                      <span>Conclude Debate</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-600/30">
                <div className="flex items-start space-x-3">
                  <div className="w-1 h-20 bg-gradient-to-b from-amber-400 to-yellow-400 rounded-full" />
                  <div className="flex-1">
                    <p className="text-amber-400 font-bold mb-2">Judicial Analysis:</p>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {message.data.reasoning}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-amber-300 text-sm font-medium bg-amber-500/20 px-3 py-1 rounded-full">
                  Post-Round {message.data.round_count} Decision
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: agentType === 'innovator' || agentType === 'engineer' ? -30 : 30 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={`flex ${agentType === 'innovator' || agentType === 'engineer' ? 'justify-start' : 'justify-end'} mb-6`}
    >
      <div className={`max-w-3xl ${agentType === 'innovator' || agentType === 'engineer' ? 'mr-12' : 'ml-12'}`}>
        <div className={`${config.colors.bg} backdrop-blur-sm rounded-2xl p-6 border-2 ${config.colors.border} relative overflow-hidden group`}>
          {/* Message glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            {/* Agent Header */}
            <div className={`flex items-center space-x-3 mb-4 ${agentType === 'skeptic' || agentType === 'ethicist' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <motion.div
                className="text-2xl"
                animate={isTyping ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.8, repeat: isTyping ? Infinity : 0 }}
              >
                {config.avatar}
              </motion.div>
              <div className={`${agentType === 'skeptic' || agentType === 'ethicist' ? 'text-right' : ''}`}>
                <h4 className={`font-black text-lg ${config.colors.primary}`}>
                  {config.name}
                </h4>
                <p className={`text-sm font-medium ${config.colors.primary.replace('400', '300')}`}>
                  {config.title}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
                  Round {message.data?.round || 1}
                </span>
                <div className={`w-2 h-2 ${config.colors.primary.replace('text-', 'bg-')} rounded-full animate-pulse`} />
              </div>
            </div>
            
            {/* Message Content */}
            <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-5 border border-slate-600/20">
              {isTyping ? (
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className={`w-2 h-2 ${config.colors.primary.replace('text-', 'bg-')} rounded-full`}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm italic">Formulating response...</p>
                </div>
              ) : (
                <p className="text-slate-200 leading-relaxed font-medium text-base">
                  {message.data?.content}
                </p>
              )}
            </div>
            
            {/* Timestamp */}
            <div className={`mt-3 ${agentType === 'skeptic' || agentType === 'ethicist' ? 'text-right' : 'text-left'}`}>
              <span className="text-xs text-slate-500">
                {message.data?.timestamp ? new Date(message.data.timestamp).toLocaleTimeString() : 'Now'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RoundSeparator = ({ round, isActive = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex justify-center my-12"
  >
    <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
      <div className={`bg-gradient-to-r ${isActive ? 'from-purple-500/30 to-pink-500/30' : 'from-slate-700/50 to-slate-600/50'} backdrop-blur-sm rounded-2xl px-8 py-4 border-2 ${isActive ? 'border-purple-500/50' : 'border-slate-600/50'}`}>
        <div className="flex items-center space-x-4">
          <motion.div
            className={`w-4 h-4 rounded-full ${isActive ? 'bg-purple-400' : 'bg-slate-400'}`}
            animate={isActive ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className={`font-black text-xl ${isActive ? 'text-purple-300' : 'text-slate-400'}`}>
            Round {round}
          </span>
          {isActive && (
            <motion.span
              className="text-purple-400 text-sm font-bold bg-purple-500/20 px-3 py-1 rounded-full"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Live
            </motion.span>
          )}
        </div>
      </div>
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  </motion.div>
);

const DebateInterface = () => {
  const [query, setQuery] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [debateState, setDebateState] = useState({
    status: 'idle',
    researchBrief: null,
    agentMessages: [],
    judgeDecisions: [],
    finalReport: null,
    currentRound: 0,
    activeAgents: new Set(),
    startTime: null
  });

  const messagesEndRef = useRef(null);
  const processedMessagesCount = useRef(0);

  const { isConnected, messages, sendMessage, clearMessages, connectionStatus } = useWebSocket(
    `ws://localhost:8000/debate/${sessionId}`
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [debateState.agentMessages, debateState.finalReport]);

  // Process messages similar to your original implementation
  useEffect(() => {
    const newMessages = messages.slice(processedMessagesCount.current);
    if (newMessages.length === 0) return;

    setDebateState(prev => {
      const newState = { 
        ...prev,
        agentMessages: [...prev.agentMessages],
        judgeDecisions: [...prev.judgeDecisions],
      };

      newMessages.forEach(message => {
        const messageExists = 
          newState.agentMessages.some(m => m.id === message.id) ||
          newState.judgeDecisions.some(d => d.id === message.id);
        
        if (messageExists) return;

        switch (message.type) {
          case 'research_complete':
            newState.status = 'research_complete';
            newState.researchBrief = message.data.brief;
            break;
          case 'agent_response':
            newState.status = 'debating';
            newState.agentMessages.push(message);
            newState.currentRound = Math.max(newState.currentRound, message.data.round || 1);
            newState.activeAgents = new Set();
            break;
          case 'judge_decision':
            newState.status = 'judge_deciding';
            newState.judgeDecisions.push(message);
            break;
          case 'final_report':
            newState.status = 'complete';
            newState.finalReport = message.data;
            break;
          case 'debate_complete':
            newState.status = 'complete';
            break;
          case 'error':
            console.error('Debate error:', message.message);
            newState.status = 'error';
            break;
          default:
            if (message.type === 'round_start') {
              newState.currentRound = message.data.round;
              newState.status = 'debating';
            }
            break;
        }
      });
      
      return newState;
    });

    processedMessagesCount.current = messages.length;
  }, [messages]);

  const startDebate = () => {
    if (!query.trim() || !isConnected) return;
    
    clearMessages();
    processedMessagesCount.current = 0;
    setDebateState({
      status: 'starting',
      researchBrief: null,
      agentMessages: [],
      judgeDecisions: [],
      finalReport: null,
      currentRound: 0,
      activeAgents: new Set(['researcher']),
      startTime: new Date()
    });

    const success = sendMessage({
      type: 'start_debate',
      query: query
    });

    if (success) {
      setDebateState(prev => ({ ...prev, status: 'researching' }));
    }
  };

  const resetDebate = () => {
    setQuery('');
    clearMessages();
    processedMessagesCount.current = 0;
    setDebateState({
      status: 'idle',
      researchBrief: null,
      agentMessages: [],
      judgeDecisions: [],
      finalReport: null,
      currentRound: 0,
      activeAgents: new Set(),
      startTime: null
    });
  };

  // Combine and sort all debate messages chronologically
  const getAllDebateMessages = () => {
    const allMessages = [];
    
    // Add agent messages
    debateState.agentMessages.forEach(msg => {
      allMessages.push({...msg, sortOrder: new Date(msg.data.timestamp).getTime()});
    });
    
    // Add judge decisions
    debateState.judgeDecisions.forEach(msg => {
      allMessages.push({...msg, sortOrder: new Date(msg.data.timestamp || Date.now()).getTime()});
    });
    
    return allMessages.sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const groupMessagesByRound = (messages) => {
    const rounds = {};
    messages.forEach(msg => {
      const round = msg.data?.round || (msg.type === 'judge_decision' ? msg.data?.round_count : 1);
      if (!rounds[round]) {
        rounds[round] = [];
      }
      rounds[round].push(msg);
    });
    return rounds;
  };

  const allDebateMessages = getAllDebateMessages();
  const roundGroups = groupMessagesByRound(allDebateMessages);
  const sortedRounds = Object.keys(roundGroups).sort((a, b) => parseInt(a) - parseInt(b));
  const isDebateActive = ['starting', 'researching', 'research_complete', 'debating', 'judge_deciding', 'moderating'].includes(debateState.status);

  const getStatusConfig = () => {
    const configs = {
      idle: { 
        message: 'Ready to unleash the power of AI debate', 
        color: 'text-slate-700',
        bgColor: 'bg-gradient-to-r from-slate-100 to-gray-100',
        borderColor: 'border-slate-300',
        icon: '🧠',
        glow: 'shadow-slate-200/50'
      },
      starting: { 
        message: 'Initializing neural debate matrix...', 
        color: 'text-cyan-700',
        bgColor: 'bg-gradient-to-r from-cyan-100 to-blue-100',
        borderColor: 'border-cyan-300',
        icon: '⚡',
        glow: 'shadow-cyan-300/60'
      },
      researching: { 
        message: 'AI researcher scanning global knowledge...', 
        color: 'text-blue-700',
        bgColor: 'bg-gradient-to-r from-blue-100 to-indigo-100',
        borderColor: 'border-blue-300',
        icon: '🔍',
        glow: 'shadow-blue-300/60'
      },
      research_complete: { 
        message: 'Knowledge acquired. Experts awakening...', 
        color: 'text-emerald-700',
        bgColor: 'bg-gradient-to-r from-emerald-100 to-green-100',
        borderColor: 'border-emerald-300',
        icon: '✨',
        glow: 'shadow-emerald-300/60'
      },
      debating: { 
        message: `Round ${debateState.currentRound} • Neural combat engaged`, 
        color: 'text-purple-700',
        bgColor: 'bg-gradient-to-r from-purple-100 to-pink-100',
        borderColor: 'border-purple-300',
        icon: '🎯',
        glow: 'shadow-purple-300/60'
      },
      judge_deciding: { 
        message: 'Supreme Judge evaluating neural patterns...', 
        color: 'text-amber-700',
        bgColor: 'bg-gradient-to-r from-amber-100 to-orange-100',
        borderColor: 'border-amber-300',
        icon: '⚖️',
        glow: 'shadow-amber-300/60'
      },
      complete: { 
        message: 'Debate matrix complete • Insights extracted', 
        color: 'text-emerald-700',
        bgColor: 'bg-gradient-to-r from-emerald-100 to-green-100',
        borderColor: 'border-emerald-300',
        icon: '🎉',
        glow: 'shadow-emerald-300/60'
      },
      error: { 
        message: 'Neural network disruption detected', 
        color: 'text-red-700',
        bgColor: 'bg-gradient-to-r from-red-100 to-pink-100',
        borderColor: 'border-red-300',
        icon: '⚠️',
        glow: 'shadow-red-300/60'
      }
    };
    return configs[debateState.status] || configs.idle;
  };

  const statusConfig = getStatusConfig();

  const getConnectionStatusConfig = () => {
    const configs = {
      connected: { 
        color: 'bg-emerald-500', 
        text: 'Neural Link Active', 
        textColor: 'text-emerald-800',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200' 
      },
      connecting: { 
        color: 'bg-amber-500', 
        text: 'Establishing Link...', 
        textColor: 'text-amber-800',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200' 
      },
      reconnecting: { 
        color: 'bg-amber-500', 
        text: 'Reconnecting Neural Link...', 
        textColor: 'text-amber-800',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200' 
      },
      disconnected: { 
        color: 'bg-red-500', 
        text: 'Neural Link Offline', 
        textColor: 'text-red-800',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200' 
      },
      error: { 
        color: 'bg-red-500', 
        text: 'Connection Error', 
        textColor: 'text-red-800',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200' 
      },
      failed: { 
        color: 'bg-red-500', 
        text: 'Link Failed', 
        textColor: 'text-red-800',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200' 
      }
    };
    return configs[connectionStatus] || configs.disconnected;
  };

  const connectionConfig = getConnectionStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Neural Network Grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-500/5 to-transparent"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.1) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center py-12"
        >
          <div className="relative">
            <motion.h1 
              className="text-7xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 tracking-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Chimera
            </motion.h1>
            
            <motion.div
              className="absolute -top-4 -right-4 text-4xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ⚡
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-2xl md:text-3xl text-slate-300 font-bold tracking-wide">
              Neural Multi-Agent Debate System
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Unleash the collective intelligence of AI experts in epic debates that reshape understanding
            </p>
            
            <div className="flex items-center justify-center space-x-6 mt-6">
              <div className="flex items-center space-x-2 text-cyan-400">
                <SparklesIcon className="h-5 w-5" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <BoltIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Real-Time</span>
              </div>
              <div className="flex items-center space-x-2 text-pink-400">
                <RocketLaunchIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Cutting-Edge</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Query Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-slate-800/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
            
            <div className="relative space-y-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your complex question or debate topic..."
                    className="w-full p-6 pl-16 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-2 border-slate-600/50 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-300 text-white placeholder-slate-400 text-lg font-medium backdrop-blur-sm group-hover:border-slate-500/70"
                    disabled={isDebateActive}
                    onKeyPress={(e) => e.key === 'Enter' && !isDebateActive && startDebate()}
                  />
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🧠
                    </motion.div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(139, 92, 246, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startDebate}
                    disabled={!query.trim() || !isConnected || isDebateActive}
                    className="px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-3 font-bold text-lg shadow-xl border border-purple-500/50"
                  >
                    {isDebateActive ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <PauseIcon className="h-6 w-6" />
                        </motion.div>
                        <span>Neural Active</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-6 w-6" />
                        <span>Ignite Debate</span>
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetDebate}
                    disabled={isDebateActive}
                    className="px-6 py-6 bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 rounded-2xl hover:from-slate-600 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-3 font-semibold shadow-xl border border-slate-600/50"
                  >
                    <ArrowPathIcon className="h-6 w-6" />
                    <span>Reset</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <motion.div 
            className={`inline-flex items-center px-6 py-3 rounded-2xl font-bold text-sm border-2 backdrop-blur-sm ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} ${statusConfig.glow} shadow-xl`}
            animate={{ 
              boxShadow: isDebateActive ? 
                ["0 0 20px rgba(139, 92, 246, 0.3)", "0 0 40px rgba(139, 92, 246, 0.5)", "0 0 20px rgba(139, 92, 246, 0.3)"] :
                "0 0 20px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span 
              className="mr-3 text-lg"
              animate={isDebateActive ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {statusConfig.icon}
            </motion.span>
            {statusConfig.message}
          </motion.div>
          
          <motion.div 
            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border-2 backdrop-blur-sm ${connectionConfig.bgColor} ${connectionConfig.textColor} ${connectionConfig.borderColor} shadow-lg`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className={`w-3 h-3 rounded-full mr-3 ${connectionConfig.color}`}
              animate={connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ? 
                { scale: [1, 1.3, 1] } : {}
              }
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            {connectionConfig.text}
          </motion.div>
        </motion.div>

        {/* Research Phase - Keep Original */}
        <AnimatePresence>
          {(debateState.status === 'researching' || debateState.researchBrief) && (
            <ResearchPanel 
              researchBrief={debateState.researchBrief} 
              isLoading={debateState.status === 'researching'}
            />
          )}
        </AnimatePresence>

        {/* NEW: Chat-Style Debate Section */}
        <AnimatePresence>
          {allDebateMessages.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {/* Participants Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <span className="text-slate-400 font-medium">Active Neural Agents:</span>
                    {['innovator', 'skeptic', 'engineer', 'ethicist'].map(agent => {
                      const config = getAgentConfig(agent);
                      return (
                        <motion.div
                          key={agent}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-xl border-2 ${config.colors.border} ${config.colors.accent} backdrop-blur-sm`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="text-lg">{config.avatar}</span>
                          <span className={`text-sm font-bold ${config.colors.primary}`}>
                            {config.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 text-sm">Round</span>
                    <span className="bg-purple-500/20 text-purple-400 font-bold px-3 py-1 rounded-full">
                      {debateState.currentRound}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Chat Container */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden mb-8">
                <div className="h-[800px] overflow-y-auto p-6 space-y-2 custom-scrollbar">
                  {sortedRounds.map(round => (
                    <div key={round}>
                      <RoundSeparator 
                        round={parseInt(round)} 
                        isActive={parseInt(round) === debateState.currentRound && debateState.status === 'debating'}
                      />
                      <AnimatePresence>
                        {roundGroups[round]
                          .sort((a, b) => new Date(a.data?.timestamp || 0) - new Date(b.data?.timestamp || 0))
                          .map(message => (
                            <ChatMessage key={message.id} message={message} />
                          ))
                        }
                      </AnimatePresence>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Report */}
        <AnimatePresence>
           {debateState.finalReport && (
             <FinalReport report={debateState.finalReport} />
           )}
        </AnimatePresence>

        {/* Scroll marker */}
        <div ref={messagesEndRef} />

        {/* Futuristic Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl text-cyan-400 p-6 rounded-2xl font-mono text-xs space-y-2 border border-slate-700/50 shadow-2xl"
          >
            <div className="text-cyan-300 font-bold mb-3 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
              Neural Debug Console
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>Session: <span className="text-purple-400">{sessionId}</span></div>
              <div>Status: <span className="text-green-400">{debateState.status}</span></div>
              <div>Messages: <span className="text-yellow-400">{messages.length}</span></div>
              <div>Round: <span className="text-pink-400">{debateState.currentRound}</span></div>
              <div>Connection: <span className="text-blue-400">{connectionStatus}</span></div>
              <div>Agents: <span className="text-indigo-400">{debateState.agentMessages.length}</span></div>
            </div>
            {debateState.startTime && (
              <div className="text-center pt-2 border-t border-slate-700">
                Duration: <span className="text-emerald-400 font-bold">
                  {Math.round((new Date() - debateState.startTime) / 1000)}s
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              opacity: 0 
            }}
            animate={{ 
              y: -10,
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DebateInterface;
