import { useState } from 'react';
import { TreeNode } from '../types/ontology';
import { StatusBadge } from './StatusBadge';
import { SldsInput } from './slds/SldsInput';
import { SldsSelect } from './slds/SldsSelect';
import { SldsIcon } from './slds/SldsIcon';
import { SldsButton } from './slds/SldsButton';
import { SldsBadge } from './slds/SldsBadge';

interface OntologyTreePanelProps {
  nodes: TreeNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onOpenStatusModal: (nodeId: string) => void;
  onOpenLicenseModal: (nodeId: string) => void;
  onOpenEvidenceModal: (nodeId: string) => void;
}

export function OntologyTreePanel({
  nodes,
  selectedNodeId,
  onSelectNode,
  onOpenStatusModal,
  onOpenLicenseModal,
  onOpenEvidenceModal
}: OntologyTreePanelProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['N0001', 'N0002']));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [requiredFilter, setRequiredFilter] = useState<string>('all');
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.filter(node => {
      const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || node.status === statusFilter;
      const matchesRequired = requiredFilter === 'all' || 
        (requiredFilter === 'required' && node.required) ||
        (requiredFilter === 'optional' && !node.required);
      
      return matchesSearch && matchesStatus && matchesRequired;
    }).map(node => ({
      ...node,
      children: node.children ? filterNodes(node.children) : undefined
    }));
  };

  const filteredNodes = filterNodes(nodes);

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const showMenu = showActionsMenu === node.id;

    return (
      <li key={node.id} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
        <div
          className={`
            flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors relative
            ${isSelected ? 'bg-blue-50 border-l-2 border-blue-600' : ''}
          `}
          style={{ paddingLeft: `${12 + level * 20}px` }}
          onClick={() => onSelectNode(node.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="p-0.5 hover:bg-gray-200 rounded flex-shrink-0"
              aria-label={isExpanded ? '축소' : '확장'}
            >
              <SldsIcon 
                name={isExpanded ? 'chevrondown' : 'chevronright'} 
                size="xx-small" 
                className="text-gray-600"
              />
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          
          <SldsIcon name="file" size="xx-small" className="text-gray-600 flex-shrink-0" />
          
          <span className="flex-1 text-sm truncate">{node.label}</span>
          
          {node.required && (
            <SldsBadge variant="default" className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 border-blue-200">
              필수
            </SldsBadge>
          )}
          
          <StatusBadge status={node.status} />
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionsMenu(showMenu ? null : node.id);
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="작업 메뉴"
            >
              <SldsIcon name="more" size="xx-small" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowActionsMenu(null)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(node.id);
                      setShowActionsMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    상세 보기
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenStatusModal(node.id);
                      setShowActionsMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    상태 변경
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLicenseModal(node.id);
                      setShowActionsMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    면허 매핑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEvidenceModal(node.id);
                      setShowActionsMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    증빙 첨부
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && node.children && (
          <ul role="group">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col h-full border-r border-gray-300 bg-white">
      <div className="p-4 border-b border-gray-200 space-y-3">
        <SldsInput
          placeholder="노드 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<SldsIcon name="search" size="xx-small" className="text-gray-600" />}
        />
        
        <div className="grid grid-cols-2 gap-2">
          <SldsSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: '전체 상태' },
              { value: 'NOT_STARTED', label: '미시작' },
              { value: 'IN_PROGRESS', label: '진행 중' },
              { value: 'BLOCKED', label: '차단' },
              { value: 'RISK', label: '리스크' },
              { value: 'SATISFIED', label: '완료' }
            ]}
          />
          
          <SldsSelect
            value={requiredFilter}
            onChange={(e) => setRequiredFilter(e.target.value)}
            options={[
              { value: 'all', label: '전체' },
              { value: 'required', label: '필수' },
              { value: 'optional', label: '선택' }
            ]}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredNodes.length > 0 ? (
          <ul role="tree" className="py-2">
            {filteredNodes.map(node => renderTreeNode(node))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <SldsIcon name="error" size="large" className="text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">검색 결과가 없습니다</p>
            <p className="text-xs text-gray-500">필터를 조정하거나 검색어를 변경해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
