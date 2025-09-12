import React from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  LightBulbIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const FinalReport = ({ report }) => {
  if (!report) return null;

  const sections = [
    {
      title: 'Key Insights',
      items: report.key_insights,
      icon: LightBulbIcon,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-400',
      textColor: 'text-blue-800'
    },
    {
      title: 'Areas of Consensus',
      items: report.consensus_points,
      icon: CheckCircleIcon,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-l-green-400',
      textColor: 'text-green-800'
    },
    {
      title: 'Key Tensions & Disagreements',
      items: report.tensions,
      icon: ExclamationTriangleIcon,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-l-red-400',
      textColor: 'text-red-800'
    },
    {
      title: 'Unresolved Questions',
      items: report.unresolved_questions,
      icon: QuestionMarkCircleIcon,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-l-orange-400',
      textColor: 'text-orange-800'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-2xl p-8 mt-8 border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
            <DocumentTextIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Final Report</h2>
            <p className="text-gray-600">Expert debate synthesis and insights</p>
          </div>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
          Analysis Complete
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-gray-100 p-2 rounded-lg mr-3">📋</span>
          Executive Summary
        </h3>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-l-4 border-indigo-400">
          <p className="text-gray-800 leading-relaxed text-lg font-medium">
            {report.summary}
          </p>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <ReportSection {...section} />
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
        <h3 className="text-xl font-bold text-purple-800 mb-5 flex items-center">
          <ArrowRightIcon className="h-6 w-6 mr-3 bg-purple-100 p-1 rounded" />
          Strategic Recommendations
        </h3>
        <div className="space-y-4">
          {report.recommendations?.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-l-4 border-purple-400 shadow-sm"
            >
              <div className="flex items-start space-x-3">
                <span className="bg-purple-100 text-purple-800 font-bold text-sm px-2 py-1 rounded-full mt-1">
                  {index + 1}
                </span>
                <p className="text-gray-800 leading-relaxed">{rec}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">
          Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

const ReportSection = ({ title, items, icon: Icon, bgColor, borderColor, textColor }) => (
  <div className={`${bgColor} rounded-xl p-5 h-full border-2 border-opacity-30`}>
    <div className="flex items-center space-x-3 mb-4">
      <Icon className={`h-6 w-6 ${textColor.replace('text-', 'text-').replace('800', '600')}`} />
      <h4 className={`text-lg font-bold ${textColor}`}>{title}</h4>
    </div>
    
    <div className="space-y-3">
      {items?.length > 0 ? (
        items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className={`bg-white/70 backdrop-blur-sm rounded-lg p-3 border-l-4 ${borderColor}`}
          >
            <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
          </motion.div>
        ))
      ) : (
        <p className="text-gray-500 italic text-sm">No items in this category</p>
      )}
    </div>
  </div>
);

export default FinalReport;