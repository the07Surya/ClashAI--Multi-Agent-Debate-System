import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScaleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const JudgePanel = ({ judgeDecisions = [] }) => {
  if (judgeDecisions.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center space-x-3 mb-5">
        <div className="bg-amber-100 p-2 rounded-lg">
          <ScaleIcon className="h-7 w-7 text-amber-700" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-amber-800">Judge Decisions</h3>
          <p className="text-sm text-amber-600">Guiding the debate progression</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence>
          {judgeDecisions.map((decision, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-amber-200/50 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  After Round {decision.data.round_count}
                </span>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${
                  decision.data.should_continue 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {decision.data.should_continue ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>Continue Debate</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4" />
                      <span>Conclude Debate</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  <span className="text-amber-700 font-semibold">Reasoning:</span> {decision.data.reasoning}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default JudgePanel;