// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   ArrowPathIcon, 
//   PlayIcon,
//   PauseIcon 
// } from '@heroicons/react/24/outline';

// import useWebSocket from '../hooks/useWebSocket';
// import ResearchPanel from './ResearchPanel';
// import AgentPanel from './AgentPanel';
// import JudgePanel from './JudgePanel';
// import FinalReport from './FinalReport';

// const DebateInterface = () => {
//   const [query, setQuery] = useState('');
//   const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
//   const [debateState, setDebateState] = useState({
//     status: 'idle',
//     researchBrief: null,
//     agentMessages: [],
//     judgeDecisions: [],
//     finalReport: null,
//     currentRound: 0,
//     startTime: null
//   });

//   const messagesEndRef = useRef(null);
//   const { isConnected, messages, sendMessage, clearMessages, connectionStatus } = useWebSocket(
//     `ws://localhost:8000/debate/${sessionId}`
//   );

//   // --- FIX: This ref tracks how many messages we've already processed ---
//   const processedMessagesCount = useRef(0);

//   // Auto-scroll to bottom on new messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [debateState.agentMessages, debateState.finalReport]);

//   // --- FIX: Rewritten message processing logic to handle batches ---
//   useEffect(() => {
//     // Get only the new messages that haven't been processed yet
//     const newMessages = messages.slice(processedMessagesCount.current);
//     if (newMessages.length === 0) return;

//     // Process all new messages in a batch
//     setDebateState(prev => {
//       // Create a mutable copy of the previous state
//       const newState = { ...prev };

//       newMessages.forEach(message => {
//         switch (message.type) {
//           case 'research_complete':
//             newState.status = 'research_complete';
//             newState.researchBrief = message.data.brief;
//             break;

//           case 'agent_response':
//             newState.status = 'debating';
//             // Avoid adding duplicate messages
//             if (!newState.agentMessages.some(m => m.id === message.id)) {
//               newState.agentMessages.push(message);
//             }
//             newState.currentRound = Math.max(newState.currentRound, message.data.round || 1);
//             break;

//           case 'judge_decision':
//             newState.status = 'judge_deciding';
//             if (!newState.judgeDecisions.some(d => d.id === message.id)) {
//                 newState.judgeDecisions.push(message);
//             }
//             break;

//           case 'final_report':
//             newState.status = 'complete';
//             newState.finalReport = message.data;
//             break;

//           case 'debate_complete':
//             newState.status = 'complete';
//             break;

//           case 'error':
//             console.error('Debate error:', message.message);
//             newState.status = 'error';
//             break;

//           default:
//             console.log('Received unknown message type:', message.type);
//             break;
//         }
//       });

//       return newState;
//     });

//     // Update the counter to the new total number of messages
//     processedMessagesCount.current = messages.length;

//   }, [messages]); // This effect now correctly depends only on the 'messages' array

//   const startDebate = () => {
//     if (!query.trim() || !isConnected) return;
    
//     clearMessages();
//     processedMessagesCount.current = 0; // Reset the counter
//     setDebateState({
//       status: 'starting',
//       researchBrief: null,
//       agentMessages: [],
//       judgeDecisions: [],
//       finalReport: null,
//       currentRound: 0,
//       startTime: new Date()
//     });

//     const success = sendMessage({
//       type: 'start_debate',
//       query: query
//     });

//     if (success) {
//       setDebateState(prev => ({ ...prev, status: 'researching' }));
//     }
//   };

//   const resetDebate = () => {
//     setQuery('');
//     clearMessages();
//     processedMessagesCount.current = 0; // Reset the counter
//     setDebateState({
//       status: 'idle',
//       researchBrief: null,
//       agentMessages: [],
//       judgeDecisions: [],
//       finalReport: null,
//       currentRound: 0,
//       startTime: null
//     });
//   };

//   const getStatusConfig = () => {
//     const configs = {
//       idle: { 
//         message: 'Ready to explore complex topics through expert debate', 
//         color: 'text-gray-600',
//         bgColor: 'bg-gray-100',
//         icon: '🤔'
//       },
//       starting: { 
//         message: 'Initializing expert debate session...', 
//         color: 'text-blue-600',
//         bgColor: 'bg-blue-100',
//         icon: '🚀'
//       },
//       researching: { 
//         message: 'AI researcher gathering comprehensive information...', 
//         color: 'text-blue-600',
//         bgColor: 'bg-blue-100',
//         icon: '🔍'
//       },
//       research_complete: { 
//         message: 'Research complete. Expert agents preparing arguments...', 
//         color: 'text-green-600',
//         bgColor: 'bg-green-100',
//         icon: '✅'
//       },
//       debating: { 
//         message: `Round ${debateState.currentRound} - Expert debate in progress...`, 
//         color: 'text-purple-600',
//         bgColor: 'bg-purple-100',
//         icon: '🎯'
//       },
//       debating_round_1_parallel: { 
//         message: 'Round 1 - All experts presenting opening statements simultaneously...', 
//         color: 'text-purple-600',
//         bgColor: 'bg-purple-100',
//         icon: '🎯'
//       },
//       judge_deciding: { 
//         message: 'AI judge evaluating debate progress...', 
//         color: 'text-yellow-600',
//         bgColor: 'bg-yellow-100',
//         icon: '⚖️'
//       },
//       moderating: { 
//         message: 'AI moderator synthesizing insights and conclusions...', 
//         color: 'text-indigo-600',
//         bgColor: 'bg-indigo-100',
//         icon: '📝'
//       },
//       complete: { 
//         message: 'Multi-agent debate analysis complete!', 
//         color: 'text-green-600',
//         bgColor: 'bg-green-100',
//         icon: '🎉'
//       },
//       error: { 
//         message: 'An error occurred during the debate process', 
//         color: 'text-red-600',
//         bgColor: 'bg-red-100',
//         icon: '❌'
//       }
//     };

//     // Handle dynamic sequential round statuses
//     if (debateState.status.startsWith('debating_round_') && debateState.status.includes('_sequential')) {
//       return {
//         message: `Round ${debateState.currentRound} - Expert rebuttals and counter-arguments...`,
//         color: 'text-indigo-600',
//         bgColor: 'bg-indigo-100',
//         icon: '💬'
//       };
//     }

//     return configs[debateState.status] || configs.idle;
//   };

//   const isDebateActive = ['starting', 'researching', 'research_complete', 'debating', 'judge_deciding', 'moderating'].includes(debateState.status);
//   const statusConfig = getStatusConfig();

//   const getConnectionStatusConfig = () => {
//     const configs = {
//       connected: { color: 'bg-green-500', text: 'Connected', textColor: 'text-green-800' },
//       connecting: { color: 'bg-yellow-500', text: 'Connecting...', textColor: 'text-yellow-800' },
//       reconnecting: { color: 'bg-yellow-500', text: 'Reconnecting...', textColor: 'text-yellow-800' },
//       disconnected: { color: 'bg-red-500', text: 'Disconnected', textColor: 'text-red-800' },
//       error: { color: 'bg-red-500', text: 'Connection Error', textColor: 'text-red-800' },
//       failed: { color: 'bg-red-500', text: 'Connection Failed', textColor: 'text-red-800' }
//     };
//     return configs[connectionStatus] || configs.disconnected;
//   };

//   const connectionConfig = getConnectionStatusConfig();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
//       <div className="max-w-7xl mx-auto p-4 space-y-6">
        
//         {/* Header */}
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center py-8"
//         >
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
//             Project Chimera
//           </h1>
//           <p className="text-xl text-gray-600 font-medium">
//             Multi-Agent Expert Debate System
//           </p>
//           <p className="text-sm text-gray-500 mt-2">
//             Harness the power of AI experts to explore complex topics from multiple perspectives
//           </p>
//         </motion.div>

//         {/* Query Input Section */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50"
//         >
//           <div className="flex flex-col space-y-4">
//             <div className="flex space-x-4">
//               <div className="flex-1 relative">
//                 <input
//                   type="text"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Enter your complex question or debate topic..."
//                   className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg"
//                   disabled={isDebateActive}
//                   onKeyPress={(e) => e.key === 'Enter' && !isDebateActive && startDebate()}
//                 />
//                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                   🤖
//                 </div>
//               </div>
              
//               <button
//                 onClick={startDebate}
//                 disabled={!query.trim() || !isConnected || isDebateActive}
//                 className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-semibold text-lg shadow-lg hover:shadow-xl"
//               >
//                 {isDebateActive ? (
//                   <>
//                     <PauseIcon className="h-5 w-5 animate-pulse" />
//                     <span>In Progress</span>
//                   </>
//                 ) : (
//                   <>
//                     <PlayIcon className="h-5 w-5" />
//                     <span>Start Debate</span>
//                   </>
//                 )}
//               </button>
              
//               <button
//                 onClick={resetDebate}
//                 disabled={isDebateActive}
//                 className="px-6 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-semibold shadow-lg"
//               >
//                 <ArrowPathIcon className="h-5 w-5" />
//                 <span>Reset</span>
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Status Bar */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex items-center justify-between"
//         >
//           <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${statusConfig.bgColor} ${statusConfig.color}`}>
//             <span className="mr-2">{statusConfig.icon}</span>
//             {statusConfig.message}
//           </div>
          
//           <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/80 ${connectionConfig.textColor} border border-gray-200`}>
//             <div className={`w-2 h-2 rounded-full mr-2 ${connectionConfig.color} ${
//               connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ? 'animate-pulse' : ''
//             }`}></div>
//             {connectionConfig.text}
//           </div>
//         </motion.div>

//         {/* Research Phase */}
//         <AnimatePresence>
//           {(debateState.status === 'researching' || debateState.researchBrief) && (
//             <ResearchPanel 
//               researchBrief={debateState.researchBrief} 
//               isLoading={debateState.status === 'researching'}
//             />
//           )}
//         </AnimatePresence>

//         {/* Judge Decisions */}
//         <AnimatePresence>
//           {debateState.judgeDecisions.length > 0 && (
//             <JudgePanel judgeDecisions={debateState.judgeDecisions} />
//           )}
//         </AnimatePresence>

//         {/* Expert Agents Grid */}
//         <AnimatePresence>
//           {(debateState.agentMessages.length > 0 || isDebateActive) && (
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
//             >
//               {['innovator', 'skeptic', 'engineer', 'ethicist'].map((agent) => (
//                 <AgentPanel
//                   key={agent}
//                   agent={agent}
//                   messages={debateState.agentMessages}
//                   currentRound={debateState.currentRound}
//                   isActive={false} // Active state can be enhanced later
//                   debateStatus={debateState.status}
//                 />
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Final Report */}
//         <AnimatePresence>
//           {debateState.finalReport && (
//             <FinalReport report={debateState.finalReport} />
//           )}
//         </AnimatePresence>

//         {/* Scroll marker */}
//         <div ref={messagesEndRef} />

//         {/* Development Debug Panel */}
//         {process.env.NODE_ENV === 'development' && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs space-y-1"
//           >
//             <div className="text-green-300 font-bold mb-2">🔧 Debug Panel</div>
//             <div>Session: {sessionId}</div>
//             <div>Status: {debateState.status}</div>
//             <div>WS Msgs: {messages.length}</div>
//             <div>Processed Msgs: {processedMessagesCount.current}</div>
//             <div>Round: {debateState.currentRound}</div>
//             <div>Connection: {connectionStatus}</div>
//             <div>Agent Msgs in State: {debateState.agentMessages.length}</div>
//             {debateState.startTime && (
//               <div>Duration: {Math.round((new Date() - debateState.startTime) / 1000)}s</div>
//             )}
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DebateInterface;



import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  PlayIcon,
  PauseIcon,
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon
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
    activeAgents: new Set(),
    startTime: null
  });

  const messagesEndRef = useRef(null);
  const { isConnected, messages, sendMessage, clearMessages, connectionStatus } = useWebSocket(
    `ws://localhost:8000/debate/${sessionId}`
  );
  
  // FIX: This ref tracks how many messages we've already processed. It's essential
  // for correctly handling messages that arrive in quick batches.
  const processedMessagesCount = useRef(0);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [debateState.agentMessages, debateState.finalReport]);

  // FIX: Replaced the faulty message handler with a robust batch-processing logic.
  // This ensures that no messages are dropped, solving the "No neural activity" issue.
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
            console.log('Received message:', message.type, message.data);
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
    processedMessagesCount.current = 0; // Reset counter on new debate
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
    processedMessagesCount.current = 0; // Reset counter on reset
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
      moderating: { 
        message: 'Synthesizing collective intelligence...', 
        color: 'text-indigo-700',
        bgColor: 'bg-gradient-to-r from-indigo-100 to-violet-100',
        borderColor: 'border-indigo-300',
        icon: '🧬',
        glow: 'shadow-indigo-300/60'
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

  const isDebateActive = ['starting', 'researching', 'research_complete', 'debating', 'judge_deciding', 'moderating'].includes(debateState.status);
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
        
        {/* Stunning Header */}
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

        {/* Futuristic Query Input Section */}
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

        {/* Futuristic Status Bar */}
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
          {(debateState.status === 'debating' || debateState.agentMessages.length > 0 || debateState.status === 'research_complete') && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
            >
              {['innovator', 'skeptic', 'engineer', 'ethicist'].map((agent, index) => (
                <motion.div
                  key={agent}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6, type: "spring" }}
                >
                  <AgentPanel
                    agent={agent}
                    messages={debateState.agentMessages}
                    currentRound={debateState.currentRound}
                    isActive={debateState.activeAgents.has(agent)}
                    debateStatus={debateState.status}
                  />
                </motion.div>
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