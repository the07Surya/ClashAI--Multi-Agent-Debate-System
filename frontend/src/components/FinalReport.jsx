// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//   DocumentTextIcon, 
//   LightBulbIcon, 
//   CheckCircleIcon, 
//   ExclamationTriangleIcon,
//   QuestionMarkCircleIcon,
//   ArrowRightIcon 
// } from '@heroicons/react/24/outline';

// const FinalReport = ({ report }) => {
//   if (!report) return null;

//   const sections = [
//     {
//       title: 'Key Insights',
//       items: report.key_insights,
//       icon: LightBulbIcon,
//       color: 'blue',
//       bgColor: 'bg-blue-50',
//       borderColor: 'border-l-blue-400',
//       textColor: 'text-blue-800'
//     },
//     {
//       title: 'Areas of Consensus',
//       items: report.consensus_points,
//       icon: CheckCircleIcon,
//       color: 'green',
//       bgColor: 'bg-green-50',
//       borderColor: 'border-l-green-400',
//       textColor: 'text-green-800'
//     },
//     {
//       title: 'Key Tensions & Disagreements',
//       items: report.tensions,
//       icon: ExclamationTriangleIcon,
//       color: 'red',
//       bgColor: 'bg-red-50',
//       borderColor: 'border-l-red-400',
//       textColor: 'text-red-800'
//     },
//     {
//       title: 'Unresolved Questions',
//       items: report.unresolved_questions,
//       icon: QuestionMarkCircleIcon,
//       color: 'orange',
//       bgColor: 'bg-orange-50',
//       borderColor: 'border-l-orange-400',
//       textColor: 'text-orange-800'
//     }
//   ];

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="bg-white rounded-xl shadow-2xl p-8 mt-8 border border-gray-200"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-4">
//           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
//             <DocumentTextIcon className="h-8 w-8 text-white" />
//           </div>
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900">Final Report</h2>
//             <p className="text-gray-600">Expert debate synthesis and insights</p>
//           </div>
//         </div>
//         <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
//           Analysis Complete
//         </div>
//       </div>

//       {/* Executive Summary */}
//       <div className="mb-8">
//         <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//           <span className="bg-gray-100 p-2 rounded-lg mr-3">📋</span>
//           Executive Summary
//         </h3>
//         <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-l-4 border-indigo-400">
//           <p className="text-gray-800 leading-relaxed text-lg font-medium">
//             {report.summary}
//           </p>
//         </div>
//       </div>

//       {/* Main Sections Grid */}
//       <div className="grid lg:grid-cols-2 gap-6 mb-8">
//         {sections.map((section, index) => (
//           <motion.div
//             key={section.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 * index }}
//           >
//             <ReportSection {...section} />
//           </motion.div>
//         ))}
//       </div>

//       {/* Recommendations */}
//       <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
//         <h3 className="text-xl font-bold text-purple-800 mb-5 flex items-center">
//           <ArrowRightIcon className="h-6 w-6 mr-3 bg-purple-100 p-1 rounded" />
//           Strategic Recommendations
//         </h3>
//         <div className="space-y-4">
//           {report.recommendations?.map((rec, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 * index }}
//               className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-l-4 border-purple-400 shadow-sm"
//             >
//               <div className="flex items-start space-x-3">
//                 <span className="bg-purple-100 text-purple-800 font-bold text-sm px-2 py-1 rounded-full mt-1">
//                   {index + 1}
//                 </span>
//                 <p className="text-gray-800 leading-relaxed">{rec}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-8 pt-6 border-t border-gray-200 text-center">
//         <p className="text-gray-500 text-sm">
//           Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
//         </p>
//       </div>
//     </motion.div>
//   );
// };

// const ReportSection = ({ title, items, icon: Icon, bgColor, borderColor, textColor }) => (
//   <div className={`${bgColor} rounded-xl p-5 h-full border-2 border-opacity-30`}>
//     <div className="flex items-center space-x-3 mb-4">
//       <Icon className={`h-6 w-6 ${textColor.replace('text-', 'text-').replace('800', '600')}`} />
//       <h4 className={`text-lg font-bold ${textColor}`}>{title}</h4>
//     </div>
    
//     <div className="space-y-3">
//       {items?.length > 0 ? (
//         items.map((item, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.05 * index }}
//             className={`bg-white/70 backdrop-blur-sm rounded-lg p-3 border-l-4 ${borderColor}`}
//           >
//             <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
//           </motion.div>
//         ))
//       ) : (
//         <p className="text-gray-500 italic text-sm">No items in this category</p>
//       )}
//     </div>
//   </div>
// );

// export default FinalReport;


import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentTextIcon, 
  LightBulbIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  BoltIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const FinalReport = ({ report }) => {
  if (!report) return null;

  const sections = [
    {
      title: 'Neural Insights',
      items: report.key_insights,
      icon: LightBulbIcon,
      color: 'cyan',
      bgColor: 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-300',
      accentColor: 'bg-cyan-500/20',
      glowColor: 'shadow-cyan-500/30'
    },
    {
      title: 'Consensus Matrix',
      items: report.consensus_points,
      icon: CheckCircleIcon,
      color: 'emerald',
      bgColor: 'bg-gradient-to-br from-emerald-900/30 to-green-900/30',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-300',
      accentColor: 'bg-emerald-500/20',
      glowColor: 'shadow-emerald-500/30'
    },
    {
      title: 'Neural Tensions',
      items: report.tensions,
      icon: ExclamationTriangleIcon,
      color: 'red',
      bgColor: 'bg-gradient-to-br from-red-900/30 to-pink-900/30',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-300',
      accentColor: 'bg-red-500/20',
      glowColor: 'shadow-red-500/30'
    },
    {
      title: 'Quantum Uncertainties',
      items: report.unresolved_questions,
      icon: QuestionMarkCircleIcon,
      color: 'purple',
      bgColor: 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-300',
      accentColor: 'bg-purple-500/20',
      glowColor: 'shadow-purple-500/30'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, type: "spring", stiffness: 80 }}
      className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-slate-700/50 overflow-hidden"
    >
      {/* Epic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Neural Particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [null, -50],
              x: [null, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Spectacular Header */}
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex items-center space-x-6">
            <motion.div
              className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-3xl backdrop-blur-sm border border-purple-500/30 relative"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <DocumentTextIcon className="h-10 w-10 text-purple-400" />
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h2 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Neural Report
              </h2>
              <p className="text-xl text-slate-300 font-bold">
                Collective Intelligence Synthesis
              </p>
              <p className="text-slate-400 mt-1">
                Multi-agent debate conclusions & strategic insights
              </p>
            </div>
          </div>
          
          <motion.div
            className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-3xl px-8 py-4"
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(16, 185, 129, 0.3)", 
                "0 0 50px rgba(16, 185, 129, 0.5)", 
                "0 0 30px rgba(16, 185, 129, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-center space-x-3">
              <BeakerIcon className="h-6 w-6 text-emerald-400" />
              <div>
                <p className="text-emerald-300 font-bold text-lg">Analysis Complete</p>
                <p className="text-emerald-400 text-sm">Matrix synthesized</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Executive Summary */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h3 className="text-3xl font-black text-white">Executive Summary</h3>
            <SparklesIcon className="h-6 w-6 text-purple-400" />
          </div>
          <motion.div 
            className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500/30 relative overflow-hidden"
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
            <p className="relative text-slate-200 leading-relaxed text-lg font-medium">
              {report.summary}
            </p>
          </motion.div>
        </motion.div>

        {/* Main Sections Grid */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                delay: 0.1 * index, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
            >
              <ReportSection {...section} />
            </motion.div>
          ))}
        </motion.div>

        {/* Strategic Recommendations */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-3xl p-8 border-2 border-indigo-500/30 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
          
          <div className="relative z-10">
            <motion.div
              className="flex items-center space-x-4 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <motion.div
                className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4 rounded-2xl backdrop-blur-sm border border-indigo-400/30"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <ArrowRightIcon className="h-8 w-8 text-indigo-400" />
              </motion.div>
              <div>
                <h3 className="text-3xl font-black text-white flex items-center">
                  Strategic Recommendations
                  <BoltIcon className="h-8 w-8 text-yellow-400 ml-3" />
                </h3>
                <p className="text-indigo-300 font-bold">AI-generated action items</p>
              </div>
            </motion.div>
            
            <div className="space-y-6">
              {report.recommendations?.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + 0.1 * index, type: "spring" }}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 relative group"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-start space-x-4">
                    <motion.div
                      className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-3 backdrop-blur-sm border border-indigo-400/30"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <span className="text-indigo-300 font-black text-lg">
                        {index + 1}
                      </span>
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-slate-200 leading-relaxed font-medium">
                        {rec}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-12 pt-8 border-t border-slate-600/50 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-center space-x-6 mb-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <p className="text-slate-400 font-medium">
              Neural synthesis completed on {new Date().toLocaleDateString()}
            </p>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          </div>
          <motion.p 
            className="text-slate-500 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Powered by Chimera's Multi-Agent Intelligence Matrix
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ReportSection = ({ title, items, icon: Icon, bgColor, borderColor, textColor, accentColor, glowColor }) => (
  <motion.div 
    className={`${bgColor} backdrop-blur-sm rounded-2xl p-6 border-2 ${borderColor} h-full relative overflow-hidden group`}
    whileHover={{ 
      scale: 1.02, 
      y: -5,
      boxShadow: `0 20px 40px -10px ${glowColor.replace('shadow-', '').replace('/30', '')}33`
    }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    {/* Section glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      <motion.div 
        className="flex items-center space-x-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className={`${accentColor} backdrop-blur-sm p-3 rounded-xl border ${borderColor}`}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Icon className={`h-6 w-6 ${textColor}`} />
        </motion.div>
        <h4 className={`text-xl font-black text-white`}>{title}</h4>
      </motion.div>
      
      <div className="space-y-4">
        {items?.length > 0 ? (
          items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, type: "spring" }}
              className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-slate-600/20 hover:border-slate-500/40 transition-all duration-300"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-start space-x-3">
                <motion.div
                  className={`w-2 h-2 ${textColor.replace('text-', 'bg-')} rounded-full mt-2`}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />
                <p className="text-slate-200 leading-relaxed text-sm font-medium">
                  {item}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-slate-500 italic text-sm">No data in this neural category</p>
          </motion.div>
        )}
      </div>
    </div>
  </motion.div>
);

export default FinalReport;
