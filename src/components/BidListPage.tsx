import { useState, useMemo } from 'react';
import { BidListItem } from '../types/ontology';
import { BidStatusBadge } from './BidStatusBadge';
import { SldsButton } from './slds/SldsButton';
import { SldsInput } from './slds/SldsInput';
import { SldsSelect } from './slds/SldsSelect';
import { SldsIcon } from './slds/SldsIcon';
import { SldsBadge } from './slds/SldsBadge';
import { SldsProgressBar } from './slds/SldsProgressBar';
import { NewBidModal, NewBidData } from './NewBidModal';

interface BidListPageProps {
  bids: BidListItem[];
  onSelectBid: (bidId: string) => void;
  onCreateNew: () => void;
}

export function BidListPage({ bids, onSelectBid, onCreateNew }: BidListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [isNewBidModalOpen, setIsNewBidModalOpen] = useState(false);

  // Filter and sort bids
  const filteredBids = useMemo(() => {
    let filtered = bids.filter(bid => {
      const matchesSearch = 
        bid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.noticeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.client.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || bid.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || bid.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return a.dDay - b.dDay;
        case 'progress':
          return b.progress - a.progress;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [bids, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Statistics
  const stats = {
    total: bids.length,
    inPreparation: bids.filter(b => b.status === 'IN_PREPARATION' || b.status === 'REVIEW').length,
    urgent: bids.filter(b => b.dDay > 0 && b.dDay <= 7).length,
    submitted: bids.filter(b => b.status === 'SUBMITTED').length
  };

  // Get unique categories
  const categories = Array.from(new Set(bids.map(b => b.category)));

  const handleNewBidSubmit = (data: NewBidData) => {
    console.log('New bid data:', data);
    // TODO: 실제 구현에서는 여기서 백엔드 API를 호출하여 입찰을 생성하고
    // 온톨로지 분석을 시작합니다
    onCreateNew();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="slds-page-header bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg mb-1">입찰 관리</h1>
            <p className="text-sm text-gray-600">
              전체 {stats.total}건 · 진행 중 {stats.inPreparation}건 · 긴급 {stats.urgent}건
            </p>
          </div>
          
          <SldsButton 
            variant="brand" 
            size="medium"
            icon={<SldsIcon name="add" size="xx-small" />}
            iconPosition="left"
            onClick={() => setIsNewBidModalOpen(true)}
          >
            새 입찰 등록
          </SldsButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">전체 입찰</div>
            <div className="text-2xl text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-blue-50 border border-blue-300 rounded p-3">
            <div className="text-xs text-blue-700 mb-1">진행 중</div>
            <div className="text-2xl text-blue-900">{stats.inPreparation}</div>
          </div>
          <div className="bg-red-50 border border-red-300 rounded p-3">
            <div className="text-xs text-red-700 mb-1">긴급 (D-7 이내)</div>
            <div className="text-2xl text-red-900">{stats.urgent}</div>
          </div>
          <div className="bg-green-50 border border-green-300 rounded p-3">
            <div className="text-xs text-green-700 mb-1">제출 완료</div>
            <div className="text-2xl text-green-900">{stats.submitted}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1">
            <SldsInput
              placeholder="프로젝트명, 공고번호, 발주처 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<SldsIcon name="search" size="xx-small" className="text-gray-600" />}
            />
          </div>
          
          <SldsSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: '전체 상태' },
              { value: 'DRAFT', label: '초안' },
              { value: 'IN_PREPARATION', label: '준비 중' },
              { value: 'REVIEW', label: '검토 중' },
              { value: 'SUBMITTED', label: '제출 완료' },
              { value: 'AWARDED', label: '낙찰' },
              { value: 'LOST', label: '미낙찰' }
            ]}
            className="w-40"
          />

          <SldsSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: '전체 분야' },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
            className="w-48"
          />
          
          <SldsSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'deadline', label: '마감일순' },
              { value: 'progress', label: '진행률순' },
              { value: 'created', label: '최신순' }
            ]}
            className="w-36"
          />
        </div>
      </header>

      {/* Bid List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredBids.length > 0 ? (
          <div className="space-y-3">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectBid(bid.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base text-gray-900">{bid.name}</h3>
                      <BidStatusBadge status={bid.status} />
                      {bid.dDay > 0 && bid.dDay <= 3 && (
                        <SldsBadge variant="error" className="flex items-center gap-1 animate-pulse">
                          <SldsIcon name="warning" size="xx-small" />
                          긴급
                        </SldsBadge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <SldsIcon name="file" size="xx-small" />
                        {bid.noticeNo}
                      </span>
                      <span className="flex items-center gap-1">
                        <SldsIcon name="user" size="xx-small" />
                        {bid.client}
                      </span>
                      <span>•</span>
                      <span>{bid.category}</span>
                      {bid.estimatedAmount && (
                        <>
                          <span>•</span>
                          <span>{bid.estimatedAmount}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className={`
                      text-2xl mb-1
                      ${bid.dDay < 0 
                        ? 'text-gray-400' 
                        : bid.dDay <= 3 
                          ? 'text-red-600 font-medium' 
                          : bid.dDay <= 7 
                            ? 'text-yellow-600' 
                            : 'text-gray-600'
                      }
                    `}>
                      {bid.dDay < 0 ? `D+${Math.abs(bid.dDay)}` : `D-${bid.dDay}`}
                    </div>
                    <div className="text-xs text-gray-600">
                      {bid.deadline}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">전체 진행률</div>
                    <SldsProgressBar value={bid.progress} size="small" />
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-600 mb-1">체크리스트</div>
                    <SldsProgressBar 
                      value={bid.checklistProgress} 
                      size="small"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <div className="text-xs text-gray-600">담당자:</div>
                    <SldsBadge variant="lightest" className="flex items-center gap-1">
                      <SldsIcon name="user" size="xx-small" />
                      {bid.owner}
                    </SldsBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <SldsIcon name="search" size="large" className="text-gray-400 mb-4" />
            <h3 className="mb-2 text-gray-900">검색 결과가 없습니다</h3>
            <p className="text-sm text-gray-600 mb-4">
              검색어나 필터를 조정해보세요
            </p>
            <SldsButton variant="outline-brand" size="small" onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}>
              필터 초기화
            </SldsButton>
          </div>
        )}
      </div>

      {/* New Bid Modal */}
      <NewBidModal
        isOpen={isNewBidModalOpen}
        onClose={() => setIsNewBidModalOpen(false)}
        onSubmit={handleNewBidSubmit}
      />
    </div>
  );
}
