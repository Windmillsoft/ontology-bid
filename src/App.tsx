import { useState } from 'react';
import { BidListPage } from './components/BidListPage';
import { BidDetailPage } from './components/BidDetailPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { bidList } from './data/mockData';

type Page = 'list' | 'detail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);

  const handleSelectBid = (bidId: string) => {
    setSelectedBidId(bidId);
    setCurrentPage('detail');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedBidId(null);
  };

  const handleCreateNew = () => {
    toast.info('새 입찰 등록 기능', {
      description: '새 입찰을 등록하는 기능이 곧 추가됩니다.'
    });
  };

  return (
    <>
      <Toaster />
      
      {currentPage === 'list' ? (
        <BidListPage 
          bids={bidList} 
          onSelectBid={handleSelectBid}
          onCreateNew={handleCreateNew}
        />
      ) : selectedBidId ? (
        <BidDetailPage 
          bidId={selectedBidId}
          onBack={handleBackToList}
        />
      ) : null}
    </>
  );
}
