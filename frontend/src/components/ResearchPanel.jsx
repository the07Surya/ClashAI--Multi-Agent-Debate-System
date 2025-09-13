import React from 'react';
import { DocumentMagnifyingGlassIcon, CheckCircleIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const ResearchPanel = ({ researchBrief, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 backdrop-blur-xl border-2 border-blue-500/30 rounded-3xl shadow-2xl p-8 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <motion.div
              className="bg-blue-500/20 p-4 rounded-2xl backdrop-blur-sm border border-blue-400/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BeakerIcon className="h-8 w-8 text-blue-400" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-white mb-1">Neural Research Active</h2>
              <p className="text-blue-300 font-medium">Scanning global knowledge networks...</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30"
              >
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-lg w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg w-3/4"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-6 text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-blue-300 font-semibold">Analyzing millions of data points...</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (!researchBrief) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative bg-gradient-to-r from-emerald-900/40 via-green-900/40 to-teal-900/40 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl shadow-2xl p-8 overflow-hidden"
    >
      {/* Success Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <motion.div
              className="bg-emerald-500/20 p-4 rounded-2xl backdrop-blur-sm border border-emerald-400/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircleIcon className="h-8 w-8 text-emerald-400" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-white mb-1">Knowledge Matrix Complete</h2>
              <p className="text-emerald-300 font-medium">Neural research analysis ready</p>
            </div>
          </div>
          
          <motion.div
            className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl px-6 py-3"
            animate={{ boxShadow: ["0 0 20px rgba(16, 185, 129, 0.3)", "0 0 40px rgba(16, 185, 129, 0.5)", "0 0 20px rgba(16, 185, 129, 0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-emerald-300 font-bold text-sm">Debate Ready</p>
          </motion.div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ResearchSection
              title="Neural Insights"
              items={researchBrief.key_facts}
              icon="🧠"
              iconColor="text-cyan-400"
              bgColor="bg-gradient-to-br from-cyan-900/30 to-blue-900/30"
              borderColor="border-cyan-500/30"
            />
            
            <ResearchSection
              title="Positive Vectors"
              items={researchBrief.pro_arguments}
              icon="⚡"
              iconColor="text-green-400"
              bgColor="bg-gradient-to-br from-green-900/30 to-emerald-900/30"
              borderColor="border-green-500/30"
            />
          </div>
          
          <div className="space-y-6">
            <ResearchSection
              title="Critical Analysis"
              items={researchBrief.con_arguments}
              icon="🔥"
              iconColor="text-red-400"
              bgColor="bg-gradient-to-br from-red-900/30 to-pink-900/30"
              borderColor="border-red-500/30"
            />
            
            <ResearchSection
              title="Emerging Patterns"
              items={researchBrief.recent_developments}
              icon="🚀"
              iconColor="text-purple-400"
              bgColor="bg-gradient-to-br from-purple-900/30 to-indigo-900/30"
              borderColor="border-purple-500/30"
            />
          </div>
        </div>

        {researchBrief.source_urls && researchBrief.source_urls.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-slate-600/50"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
              Verified Sources
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {researchBrief.source_urls.slice(0, 6).map((url, index) => (
                <motion.a 
                  key={index}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-xl px-4 py-3 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium truncate">
                    {new URL(url).hostname}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const ResearchSection = ({ title, items, icon, iconColor, bgColor, borderColor }) => (
  <motion.div 
    className={`${bgColor} backdrop-blur-sm rounded-2xl p-6 border-2 ${borderColor} shadow-xl`}
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <h3 className="text-xl font-black text-white mb-4 flex items-center">
      <span className={`text-2xl mr-3 ${iconColor}`}>{icon}</span>
      {title}
    </h3>
    <div className="space-y-3">
      {items?.slice(0, 3).map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 border border-slate-600/20"
        >
          <p className="text-slate-200 text-sm leading-relaxed font-medium">
            {item}
          </p>
        </motion.div>
      ))}
    </div>
    {items?.length > 3 && (
      <motion.div 
        className="text-center mt-4"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-xs text-slate-400 italic">
          +{items.length - 3} more insights discovered
        </p>
      </motion.div>
    )}
  </motion.div>
);

export default ResearchPanel;
