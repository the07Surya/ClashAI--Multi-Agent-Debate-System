import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LightBulbIcon, 
  ShieldExclamationIcon, 
  CogIcon, 
  ScaleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const getAgentConfig = (agentType) => {
  const configs = {
    innovator: {
      icon: LightBulbIcon,
      title: 'The Innovator',
      description: 'Champions progress & breakthrough solutions',
      colors: {
        primary: 'text-emerald-700',
        bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
        border: 'border-emerald-200',
        accent: 'bg-emerald-100',
        glow: 'shadow-emerald-200/50'
      }
    },
    skeptic: {
      icon: ShieldExclamationIcon,
      title: 'The Skeptic',
      description: 'Challenges assumptions & identifies risks',
      colors: {
        primary: 'text-red-700',
        bg: 'bg-gradient-to-br from-red-50 to-pink-50',
        border: 'border-red-200',
        accent: 'bg-red-100',
        glow: 'shadow-red-200/50'
      }
    },
    engineer: {
      icon: CogIcon,
      title: 'The Engineer',
      description: 'Focuses on feasibility & implementation',
      colors: {
        primary: 'text-blue-700',
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        accent: 'bg-blue-100',
        glow: 'shadow-blue-200/50'
      }
    },
    ethicist: {
      icon: ScaleIcon,
      title: 'The Ethicist',
      description: 'Examines moral implications & social impact',
      colors: {
        primary: 'text-purple-700',
        bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
        border: 'border-purple-200',
        accent: 'bg-purple-100',
        glow: 'shadow-purple-200/50'
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
    // Automatically expand the current round
    if (currentRound > 0) {
      setExpandedRounds(prev => new Set(prev).add(currentRound));
    }
  }, [currentRound]);
  
  const agentMessages = messages
    .filter(msg => msg.data && msg.data.role === agent)
    .sort((a, b) => (a.data.round || 0) - (b.data.round || 0));

  const messagesByRound = agentMessages.reduce((acc, msg) => {
    const round = msg.data.round || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(msg);
    return acc;
  }, {});

  // --- FIX: The core logic change is here ---
  // Determine all rounds to display. This includes rounds the agent has spoken in,
  // AND all rounds up to the current debate round. This ensures that even if an
  // agent hasn't responded yet, a placeholder for the current round is shown.
  const roundsWithMessages = Object.keys(messagesByRound).map(Number);
  const allPossibleRounds = Array.from({ length: currentRound > 0 ? currentRound : 0 }, (_, i) => i + 1);
  const allRounds = [...new Set([
    ...roundsWithMessages,
    ...allPossibleRounds
  ])].sort((a, b) => b - a); // Sort in descending order (latest first)
  // --- End of FIX ---

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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        ${config.colors.bg} 
        ${config.colors.border} 
        border-2 rounded-xl p-5 h-full min-h-[500px] max-h-[700px]
        ${isActive ? `${config.colors.glow} shadow-xl scale-[1.02]` : 'shadow-lg'}
        transition-all duration-300 relative overflow-hidden flex flex-col
      `}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4 flex-shrink-0">
        <div className={`${config.colors.accent} p-2 rounded-lg`}>
          <Icon className={`h-6 w-6 ${config.colors.primary}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg ${config.colors.primary} truncate`}>
            {config.title}
          </h3>
          <p className="text-xs text-gray-600 leading-tight">
            {config.description}
          </p>
        </div>
      </div>
      
      {/* Messages by Round */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 space-y-3">
        <AnimatePresence>
          {allRounds.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 flex flex-col items-center justify-center h-full"
            >
              <div className="text-gray-400 mb-2">
                <Icon className="h-12 w-12 mx-auto opacity-30" />
              </div>
              <p className="text-sm text-gray-500 italic">
                Awaiting debate start...
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
                isWaitingForResponse={debateStatus === 'debating' && round === currentRound && !messagesByRound[round]}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-3 border-t border-white/50 flex-shrink-0">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">
            {agentMessages.length} response{agentMessages.length !== 1 ? 's' : ''}
          </span>
          <span className={`${config.colors.primary} font-medium`}>
            Current: Round {currentRound > 0 ? currentRound : '-'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const RoundSection = ({ round, messages, isExpanded, onToggleExpansion, config, isCurrentRound, isWaitingForResponse }) => {
  const hasMessages = messages && messages.length > 0;
  
  return (
    <div className="border border-white/30 rounded-lg overflow-hidden">
      {/* Round Header */}
      <button
        onClick={() => onToggleExpansion(round)}
        className={`w-full px-3 py-2 flex items-center justify-between transition-all duration-200 ${
          isCurrentRound 
            ? `${config.colors.accent} ${config.colors.primary} font-semibold` 
            : 'bg-white/50 text-gray-700 hover:bg-white/70'
        }`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Round {round}</span>
          {isCurrentRound && (
            <span className="text-xs bg-white/80 px-2 py-0.5 rounded-full">
              Current
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasMessages && (
            <span className="text-xs opacity-70">
              {messages.length} response{messages.length !== 1 ? 's' : ''}
            </span>
          )}
          {isExpanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Round Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3 bg-white/20">
              {isWaitingForResponse ? (
                <div className="text-center py-4">
                  <div className={`w-6 h-6 border-2 ${config.colors.border} border-t-transparent rounded-full animate-spin mx-auto mb-2`}></div>
                  <p className="text-xs text-gray-600 italic">Analyzing...</p>
                </div>
              ) : !hasMessages ? (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500 italic">No response for this round</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id || `${round}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(message.data.timestamp).toLocaleTimeString([], {
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {message.data.content}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentPanel;