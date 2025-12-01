import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  count?: number;
}

interface SldsTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function SldsTabs({ tabs, defaultTab, onTabChange }: SldsTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="slds-tabs_default">
      <ul className="flex border-b border-gray-300" role="tablist">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`
              -mb-px
              ${activeTab === tab.id ? 'border-b-2 border-blue-600' : ''}
            `}
            role="presentation"
          >
            <button
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`
                px-4 py-3 text-sm transition-colors
                ${activeTab === tab.id 
                  ? 'text-blue-600 font-normal' 
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 text-xs text-gray-600">
                  ({tab.count})
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="py-4"
      >
        {activeTabContent}
      </div>
    </div>
  );
}
