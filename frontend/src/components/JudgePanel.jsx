// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ScaleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

// const JudgePanel = ({ judgeDecisions = [] }) => {
//   if (judgeDecisions.length === 0) {
//     return null;
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl shadow-lg p-6 mb-6"
//     >
//       <div className="flex items-center space-x-3 mb-5">
//         <div className="bg-amber-100 p-2 rounded-lg">
//           <ScaleIcon className="h-7 w-7 text-amber-700" />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-amber-800">Judge Decisions</h3>
//           <p className="text-sm text-amber-600">Guiding the debate progression</p>
//         </div>
//       </div>
      
//       <div className="space-y-4">
//         <AnimatePresence>
//           {judgeDecisions.map((decision, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-amber-200/50 shadow-sm"
//             >
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
//                   After Round {decision.data.round_count}
//                 </span>
//                 <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${
//                   decision.data.should_continue 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {decision.data.should_continue ? (
//                     <>
//                       <CheckCircleIcon className="h-4 w-4" />
//                       <span>Continue Debate</span>
//                     </>
//                   ) : (
//                     <>
//                       <XCircleIcon className="h-4 w-4" />
//                       <span>Conclude Debate</span>
//                     </>
//                   )}
//                 </div>
//               </div>
              
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <p className="text-sm text-gray-700 leading-relaxed font-medium">
//                   <span className="text-amber-700 font-semibold">Reasoning:</span> {decision.data.reasoning}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   );
// };

// export default JudgePanel;


import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScaleIcon, CheckCircleIcon, XCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

const JudgePanel = ({ judgeDecisions = [] }) => {
  if (judgeDecisions.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="relative bg-gradient-to-r from-amber-900/40 via-yellow-900/40 to-orange-900/40 backdrop-blur-xl border-2 border-amber-500/30 rounded-3xl shadow-2xl p-8 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
      
      {/* Floating Justice Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
            initial={{ 
              x: Math.random() * 400,
              y: Math.random() * 200,
              opacity: 0 
            }}
            animate={{ 
              y: [null, -30],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <motion.div
              className="bg-amber-500/20 p-4 rounded-2xl backdrop-blur-sm border border-amber-400/30 relative"
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <ScaleIcon className="h-8 w-8 text-amber-400" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h3 className="text-3xl font-black text-white mb-1">Supreme Judge</h3>
              <p className="text-amber-300 font-bold">Neural arbitration decisions</p>
            </div>
          </div>
          
          <motion.div
            className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl px-6 py-3"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(245, 158, 11, 0.3)", 
                "0 0 40px rgba(245, 158, 11, 0.5)", 
                "0 0 20px rgba(245, 158, 11, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-amber-300 font-bold text-sm flex items-center">
              <SparklesIcon className="h-4 w-4 mr-2" />
              AI Arbitrator
            </p>
          </motion.div>
        </div>
        
        <div className="space-y-6">
          <AnimatePresence>
            {judgeDecisions.map((decision, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.9 }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Decision Glow Effect */}
                <div className={`absolute inset-0 ${
                  decision.data.should_continue 
                    ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10' 
                    : 'bg-gradient-to-r from-red-500/10 to-pink-500/10'
                } rounded-2xl`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="bg-amber-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-amber-400/30">
                        <span className="text-sm font-bold text-amber-300">
                          Post-Round {decision.data.round_count}
                        </span>
                      </div>
                      <motion.div
                        className="w-2 h-2 bg-amber-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.div>
                    
                    <motion.div 
                      className={`flex items-center space-x-3 px-4 py-2 rounded-xl font-bold text-sm border-2 ${
                        decision.data.should_continue 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      animate={{ 
                        boxShadow: decision.data.should_continue ?
                          ["0 0 15px rgba(34, 197, 94, 0.3)", "0 0 25px rgba(34, 197, 94, 0.5)", "0 0 15px rgba(34, 197, 94, 0.3)"] :
                          ["0 0 15px rgba(239, 68, 68, 0.3)", "0 0 25px rgba(239, 68, 68, 0.5)", "0 0 15px rgba(239, 68, 68, 0.3)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {decision.data.should_continue ? (
                        <>
                          <CheckCircleIcon className="h-5 w-5" />
                          <span>Continue Neural Combat</span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-5 w-5" />
                          <span>Conclude Matrix</span>
                        </>
                      )}
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-600/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-start space-x-3">
                      <motion.div
                        className="w-1 h-16 bg-gradient-to-b from-amber-400 to-yellow-400 rounded-full mt-1"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="flex-1">
                        <p className="text-slate-200 leading-relaxed font-medium mb-2">
                          <span className="text-amber-400 font-bold">Neural Analysis:</span>
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                          {decision.data.reasoning}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default JudgePanel;
