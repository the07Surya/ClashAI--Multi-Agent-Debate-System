import React, { useState , useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LightBulbIcon, 
  ShieldExclamationIcon, 
  CogIcon, 
  ScaleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const getAgentConfig = (agentType) => {
  const configs = {
    innovator: {
      icon: LightBulbIcon,
      title: 'Alex Chen',
      subtitle: 'The Innovator',
      description: 'Visionary strategist pushing breakthrough solutions',
      personality: '🚀 Optimistic • Forward-thinking • Disruptive',
      colors: {
        primary: 'text-emerald-400',
        bg: 'bg-gradient-to-br from-emerald-900/40 via-green-900/40 to-teal-900/40',
        border: 'border-emerald-500/30',
        accent: 'bg-emerald-500/20',
        glow: 'shadow-emerald-500/30',
        particle: 'bg-emerald-400'
      }
    },
    skeptic: {
      icon: ShieldExclamationIcon,
      title: 'Dr. Sarah Reeves',
      subtitle: 'The Skeptic',
      description: 'Risk analyst cutting through hype with precision',
      personality: '🔍 Analytical • Evidence-based • Critical',
      colors: {
        primary: 'text-red-400',
        bg: 'bg-gradient-to-br from-red-900/40 via-pink-900/40 to-rose-900/40',
        border: 'border-red-500/30',
        accent: 'bg-red-500/20',
        glow: 'shadow-red-500/30',
        particle: 'bg-red-400'
      }
    },
    engineer: {
      icon: CogIcon,
      title: 'Marcus Torres',
      subtitle: 'The Engineer',
      description: 'Systems architect bridging vision with reality',
      personality: '⚙️ Pragmatic • Technical • Solution-focused',
      colors: {
        primary: 'text-blue-400',
        bg: 'bg-gradient-to-br from-blue-900/40 via-cyan-900/40 to-sky-900/40',
        border: 'border-blue-500/30',
        accent: 'bg-blue-500/20',
        glow: 'shadow-blue-500/30',
        particle: 'bg-blue-400'
      }
    },
    ethicist: {
      icon: ScaleIcon,
      title: 'Dr. Amara Okafor',
      subtitle: 'The Ethicist',
      description: 'Moral philosopher examining human impact',
      personality: '⚖️ Principled • Human-centered • Thoughtful',
      colors: {
        primary: 'text-purple-400',
        bg: 'bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-violet-900/40',
        border: 'border-purple-500/30',
        accent: 'bg-purple-500/20',
        glow: 'shadow-purple-500/30',
        particle: 'bg-purple-400'
      }
    }
  };
  return configs[agentType] || configs.innovator;
};

const AgentPanel = ({ agent, messages = [], currentRound = 1, isActive = false, debateStatus = 'idle' }) => {
  const [expandedRounds, setExpandedRounds] = useState(new Set());
  const config = getAgentConfig(agent);
  const Icon = config.icon;

  useEffect(() => {
    // Automatically expand the current round when it changes
    if (currentRound > 0) {
      setExpandedRounds(prev => new Set(prev).add(currentRound));
    }
  }, [currentRound]);
  
  // Filter and sort messages for this agent
  const agentMessages = messages
    .filter(msg => msg.data && msg.data.role === agent)
    .sort((a, b) => (a.data.round || 0) - (b.data.round || 0));

  // Group messages by round
  const messagesByRound = agentMessages.reduce((acc, msg) => {
    const round = msg.data.round || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(msg);
    return acc;
  }, {});
  
  // --- FIX START: Correctly determine all rounds to display ---
  // This ensures that placeholders are shown for rounds where the agent hasn't responded yet.
  const roundsWithMessages = Object.keys(messagesByRound).map(Number);
  const allPossibleRounds = Array.from({ length: currentRound > 0 ? currentRound : 0 }, (_, i) => i + 1);
  const allRounds = [...new Set([
    ...roundsWithMessages,
    ...allPossibleRounds
  ])].sort((a, b) => b - a); // Sort in descending order (latest first)
  // --- FIX END ---

  const hasMessages = agentMessages.length > 0;

  const toggleRoundExpansion = (round) => {
    const newExpanded = new Set(expandedRounds);
    if (newExpanded.has(round)) {
      newExpanded.delete(round);
    } else {
      newExpanded.add(round);
    }
    setExpandedRounds(newExpanded);
  };
  
  const isWaitingForResponse = debateStatus === 'debating' && !messagesByRound[currentRound] && currentRound > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`
        ${config.colors.bg} 
        backdrop-blur-xl border-2 ${config.colors.border} rounded-3xl p-6 h-full min-h-[600px] max-h-[800px]
        ${isActive ? `${config.colors.glow} shadow-2xl` : 'shadow-xl'}
        transition-all duration-500 relative overflow-hidden flex flex-col
      `}
    >
      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isActive && [...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${config.colors.particle}/60 rounded-full`}
            initial={{ 
              x: Math.random() * 300,
              y: Math.random() * 400,
              opacity: 0 
            }}
            animate={{ 
              y: [null, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Neural Activity Indicator */}
      {isActive && (
        <div className="absolute top-4 right-4 z-20">
          <motion.div
            className={`${config.colors.accent} backdrop-blur-sm rounded-2xl px-4 py-2 border ${config.colors.border}`}
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [`0 0 20px ${config.colors.glow.split('/')[0]}`, `0 0 40px ${config.colors.glow.split('/')[0]}`, `0 0 20px ${config.colors.glow.split('/')[0]}`]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="flex items-center space-x-2">
              <motion.div 
                className={`w-2 h-2 ${config.colors.particle} rounded-full`}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <span className={`text-xs font-bold ${config.colors.primary}`}>
                Neural Active
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Agent Header */}
      <div className="flex items-start space-x-4 mb-6 flex-shrink-0 relative z-10">
        <motion.div
          className={`${config.colors.accent} backdrop-blur-sm p-4 rounded-2xl border ${config.colors.border}`}
          animate={isActive ? { 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className={`h-8 w-8 ${config.colors.primary}`} />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-2xl font-black ${config.colors.primary} mb-1`}>
            {config.title}
          </h3>
          <p className="text-slate-300 font-bold text-sm mb-2">
            {config.subtitle}
          </p>
          <p className="text-slate-400 text-xs leading-tight mb-2">
            {config.description}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {config.personality}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
        <AnimatePresence>
          {allRounds.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 flex flex-col items-center justify-center h-full"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <UserIcon className="h-16 w-16 mx-auto text-slate-600" />
              </motion.div>
              <p className="text-slate-400 font-medium">
                Neural pathways initializing...
              </p>
            </motion.div>
          ) : (
            allRounds.map(round => (
              <RoundSection
                key={round}
                round={round}
                messages={messagesByRound[round] || []}
                isExpanded={expandedRounds.has(round)}
                onToggleExpansion={toggleRoundExpansion}
                config={config}
                isCurrentRound={round === currentRound}
                isWaitingForRound={isWaitingForResponse && round === currentRound}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Agent Stats Footer */}
      <motion.div 
        className="mt-6 pt-4 border-t border-slate-600/30 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">
              <span className={`${config.colors.primary} font-bold`}>{agentMessages.length}</span> responses
            </span>
            <span className="text-slate-400">
              <span className={`${config.colors.primary} font-bold`}>{allRounds.length}</span> rounds
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 ${currentRound > 0 ? config.colors.particle : 'bg-slate-600'} rounded-full`} />
            <span className="text-slate-400 font-medium">
              Round <span className={config.colors.primary}>{currentRound}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RoundSection = ({ round, messages, isExpanded, onToggleExpansion, config, isCurrentRound, isWaitingForRound }) => {
  const hasMessages = messages && messages.length > 0;
  
  return (
    <motion.div 
      className="border border-slate-600/30 rounded-2xl overflow-hidden backdrop-blur-sm"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Round Header */}
      <motion.button
        onClick={() => onToggleExpansion(round)}
        className={`w-full px-6 py-4 flex items-center justify-between transition-all duration-300 ${
          isCurrentRound 
            ? `${config.colors.accent} ${config.colors.primary} font-bold border-b ${config.colors.border}` 
            : 'bg-slate-800/30 text-slate-300 hover:bg-slate-700/50'
        }`}
        whileHover={{ backgroundColor: isCurrentRound ? undefined : 'rgba(51, 65, 85, 0.7)' }}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            className={`w-3 h-3 rounded-full ${isCurrentRound ? config.colors.particle : 'bg-slate-500'}`}
            animate={isCurrentRound ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="font-bold">Round {round}</span>
          {isCurrentRound && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              Active
            </span>
          )}
          {isWaitingForRound && (
            <motion.span 
              className="text-xs text-orange-400 font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Processing...
            </motion.span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {hasMessages && (
            <span className="text-xs opacity-70 bg-slate-700/50 px-2 py-1 rounded-full">
              {messages.length} response{messages.length !== 1 ? 's' : ''}
            </span>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.button>

      {/* Round Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-slate-800/20 backdrop-blur-sm space-y-4">
              {isWaitingForRound ? (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-current border-t-transparent rounded-full mx-auto mb-3 opacity-50"
                  />
                  <p className="text-sm text-slate-400">Neural processing in progress...</p>
                </div>
              ) : !hasMessages ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500 italic">No neural activity recorded</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id || `${round}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/20 hover:border-slate-500/30 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(message.data.timestamp).toLocaleTimeString([], {
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${config.colors.particle} rounded-full animate-pulse`} />
                        <span className={`text-xs font-bold ${config.colors.primary} bg-slate-800/50 px-2 py-1 rounded-full`}>
                          R{message.data.round}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {message.data.content}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AgentPanel;

