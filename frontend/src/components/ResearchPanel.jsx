import React from 'react';
import { DocumentMagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const ResearchPanel = ({ researchBrief, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-lg p-6 mb-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <DocumentMagnifyingGlassIcon className="h-7 w-7 text-blue-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900">Researching...</h2>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-blue-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-blue-600 font-medium">
          Gathering information from reliable sources...
        </div>
      </motion.div>
    );
  }

  if (!researchBrief) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CheckCircleIcon className="h-7 w-7 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Research Complete</h2>
        </div>
        <div className="text-sm text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
          Ready for Expert Debate
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ResearchSection
            title="Key Facts"
            items={researchBrief.key_facts}
            icon="•"
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
          />
          
          <ResearchSection
            title="Supporting Arguments"
            items={researchBrief.pro_arguments}
            icon="✓"
            iconColor="text-green-600"
            bgColor="bg-yellow-50"
          />
        </div>
        
        <div className="space-y-4">
          <ResearchSection
            title="Critical Concerns"
            items={researchBrief.con_arguments}
            icon="⚠"
            iconColor="text-red-600"
            bgColor="bg-red-50"
          />
          
          <ResearchSection
            title="Recent Developments"
            items={researchBrief.recent_developments}
            icon="🔥"
            iconColor="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>
      </div>

      {researchBrief.source_urls && researchBrief.source_urls.length > 0 && (
        <div className="mt-6 pt-4 border-t border-green-200">
          <h3 className="font-semibold text-gray-800 mb-3">Verified Sources</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {researchBrief.source_urls.slice(0, 4).map((url, index) => (
              <a 
                key={index}
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-700 hover:text-blue-900 bg-white px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 truncate block"
              >
                🔗 {new URL(url).hostname}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ResearchSection = ({ title, items, icon, iconColor, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-4`}>
    <h3 className="font-bold text-gray-800 mb-3 text-lg">{title}</h3>
    <ul className="space-y-2">
      {items?.slice(0, 3).map((item, index) => (
        <li key={index} className="flex items-start space-x-2">
          <span className={`${iconColor} font-bold mt-0.5 text-sm`}>{icon}</span>
          <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
    {items?.length > 3 && (
      <div className="text-xs text-gray-500 mt-2 italic">
        +{items.length - 3} more points
      </div>
    )}
  </div>
);

export default ResearchPanel;
