import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  PlayIcon,
  PauseIcon 
} from '@heroicons/react/24/outline';

import useWebSocket from '../hooks/useWebSocket';
import ResearchPanel from './ResearchPanel';
import AgentPanel from './AgentPanel';
import JudgePanel from './JudgePanel';
import FinalReport from './FinalReport';

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
    startTime: null
  });

  const messagesEndRef = useRef(null);
  const { isConnected, messages, sendMessage, clearMessages, connectionStatus } = useWebSocket(
    `ws://localhost:8000/debate/${sessionId}`
  );

  // --- FIX: This ref tracks how many messages we've already processed ---
  const processedMessagesCount = useRef(0);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [debateState.agentMessages, debateState.finalReport]);

  // --- FIX: Rewritten message processing logic to handle batches ---
  useEffect(() => {
    // Get only the new messages that haven't been processed yet
    const newMessages = messages.slice(processedMessagesCount.current);
    if (newMessages.length === 0) return;

    // Process all new messages in a batch
    setDebateState(prev => {
      // Create a mutable copy of the previous state
      const newState = { ...prev };

      newMessages.forEach(message => {
        switch (message.type) {
          case 'research_complete':
            newState.status = 'research_complete';
            newState.researchBrief = message.data.brief;
            break;

          case 'agent_response':
            newState.status = 'debating';
            // Avoid adding duplicate messages
            if (!newState.agentMessages.some(m => m.id === message.id)) {
              newState.agentMessages.push(message);
            }
            newState.currentRound = Math.max(newState.currentRound, message.data.round || 1);
            break;

          case 'judge_decision':
            newState.status = 'judge_deciding';
            if (!newState.judgeDecisions.some(d => d.id === message.id)) {
                newState.judgeDecisions.push(message);
            }
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
            console.log('Received unknown message type:', message.type);
            break;
        }
      });

      return newState;
    });

    // Update the counter to the new total number of messages
    processedMessagesCount.current = messages.length;

  }, [messages]); // This effect now correctly depends only on the 'messages' array

  const startDebate = () => {
    if (!query.trim() || !isConnected) return;
    
    clearMessages();
    processedMessagesCount.current = 0; // Reset the counter
    setDebateState({
      status: 'starting',
      researchBrief: null,
      agentMessages: [],
      judgeDecisions: [],
      finalReport: null,
      currentRound: 0,
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
    processedMessagesCount.current = 0; // Reset the counter
    setDebateState({
      status: 'idle',
      researchBrief: null,
      agentMessages: [],
      judgeDecisions: [],
      finalReport: null,
      currentRound: 0,
      startTime: null
    });
  };

  const getStatusConfig = () => {
    const configs = {
      idle: { 
        message: 'Ready to explore complex topics through expert debate', 
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: '🤔'
      },
      starting: { 
        message: 'Initializing expert debate session...', 
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        icon: '🚀'
      },
      researching: { 
        message: 'AI researcher gathering comprehensive information...', 
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        icon: '🔍'
      },
      research_complete: { 
        message: 'Research complete. Expert agents preparing arguments...', 
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: '✅'
      },
      debating: { 
        message: `Round ${debateState.currentRound} - Expert debate in progress...`, 
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        icon: '🎯'
      },
      judge_deciding: { 
        message: 'AI judge evaluating debate progress...', 
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: '⚖️'
      },
      moderating: { 
        message: 'AI moderator synthesizing insights and conclusions...', 
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        icon: '📝'
      },
      complete: { 
        message: 'Multi-agent debate analysis complete!', 
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: '🎉'
      },
      error: { 
        message: 'An error occurred during the debate process', 
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: '❌'
      }
    };
    return configs[debateState.status] || configs.idle;
  };

  const isDebateActive = ['starting', 'researching', 'research_complete', 'debating', 'judge_deciding', 'moderating'].includes(debateState.status);
  const statusConfig = getStatusConfig();

  const getConnectionStatusConfig = () => {
    const configs = {
      connected: { color: 'bg-green-500', text: 'Connected', textColor: 'text-green-800' },
      connecting: { color: 'bg-yellow-500', text: 'Connecting...', textColor: 'text-yellow-800' },
      reconnecting: { color: 'bg-yellow-500', text: 'Reconnecting...', textColor: 'text-yellow-800' },
      disconnected: { color: 'bg-red-500', text: 'Disconnected', textColor: 'text-red-800' },
      error: { color: 'bg-red-500', text: 'Connection Error', textColor: 'text-red-800' },
      failed: { color: 'bg-red-500', text: 'Connection Failed', textColor: 'text-red-800' }
    };
    return configs[connectionStatus] || configs.disconnected;
  };

  const connectionConfig = getConnectionStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Project Chimera
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Multi-Agent Expert Debate System
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Harness the power of AI experts to explore complex topics from multiple perspectives
          </p>
        </motion.div>

        {/* Query Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your complex question or debate topic..."
                  className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg"
                  disabled={isDebateActive}
                  onKeyPress={(e) => e.key === 'Enter' && !isDebateActive && startDebate()}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🤖
                </div>
              </div>
              
              <button
                onClick={startDebate}
                disabled={!query.trim() || !isConnected || isDebateActive}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                {isDebateActive ? (
                  <>
                    <PauseIcon className="h-5 w-5 animate-pulse" />
                    <span>In Progress</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-5 w-5" />
                    <span>Start Debate</span>
                  </>
                )}
              </button>
              
              <button
                onClick={resetDebate}
                disabled={isDebateActive}
                className="px-6 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-semibold shadow-lg"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Status Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${statusConfig.bgColor} ${statusConfig.color}`}>
            <span className="mr-2">{statusConfig.icon}</span>
            {statusConfig.message}
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/80 ${connectionConfig.textColor} border border-gray-200`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${connectionConfig.color} ${
              connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ? 'animate-pulse' : ''
            }`}></div>
            {connectionConfig.text}
          </div>
        </motion.div>

        {/* Research Phase */}
        <AnimatePresence>
          {(debateState.status === 'researching' || debateState.researchBrief) && (
            <ResearchPanel 
              researchBrief={debateState.researchBrief} 
              isLoading={debateState.status === 'researching'}
            />
          )}
        </AnimatePresence>

        {/* Judge Decisions */}
        <AnimatePresence>
          {debateState.judgeDecisions.length > 0 && (
            <JudgePanel judgeDecisions={debateState.judgeDecisions} />
          )}
        </AnimatePresence>

        {/* Expert Agents Grid */}
        <AnimatePresence>
          {(debateState.agentMessages.length > 0 || isDebateActive) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
            >
              {['innovator', 'skeptic', 'engineer', 'ethicist'].map((agent) => (
                <AgentPanel
                  key={agent}
                  agent={agent}
                  messages={debateState.agentMessages}
                  currentRound={debateState.currentRound}
                  isActive={false} // Active state can be enhanced later
                  debateStatus={debateState.status}
                />
              ))}
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

        {/* Development Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs space-y-1"
          >
            <div className="text-green-300 font-bold mb-2">🔧 Debug Panel</div>
            <div>Session: {sessionId}</div>
            <div>Status: {debateState.status}</div>
            <div>WS Msgs: {messages.length}</div>
            <div>Processed Msgs: {processedMessagesCount.current}</div>
            <div>Round: {debateState.currentRound}</div>
            <div>Connection: {connectionStatus}</div>
            <div>Agent Msgs in State: {debateState.agentMessages.length}</div>
            {debateState.startTime && (
              <div>Duration: {Math.round((new Date() - debateState.startTime) / 1000)}s</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DebateInterface;