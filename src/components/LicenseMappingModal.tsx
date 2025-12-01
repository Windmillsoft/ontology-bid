import { useState } from 'react';
import { License, ConsortiumMember } from '../types/ontology';
import { SldsModal } from './slds/SldsModal';
import { SldsButton } from './slds/SldsButton';
import { SldsSelect } from './slds/SldsSelect';
import { SldsTabs } from './slds/SldsTabs';
import { SldsBadge } from './slds/SldsBadge';
import { SldsIcon } from './slds/SldsIcon';

interface LicenseMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenseType?: string;
  ownedLicenses: License[];
  consortiumMembers: ConsortiumMember[];
  onConfirm: (licenseId: string, source: 'owned' | 'consortium') => void;
}

export function LicenseMappingModal({
  isOpen,
  onClose,
  licenseType,
  ownedLicenses,
  consortiumMembers,
  onConfirm
}: LicenseMappingModalProps) {
  const [selectedLicense, setSelectedLicense] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [source, setSource] = useState<'owned' | 'consortium'>('owned');

  const selectedMember = consortiumMembers.find(m => m.id === selectedMemberId);

  const handleConfirm = () => {
    if (selectedLicense) {
      onConfirm(selectedLicense, source);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedLicense('');
    setSelectedMemberId('');
    setSource('owned');
    onClose();
  };

  const renderLicenseTable = (licenses: License[]) => {
    if (licenses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center px-4 border border-gray-300 rounded">
          <SldsIcon name="error" size="large" className="text-gray-400 mb-3" />
          <p className="text-sm text-gray-600">
            해당 타입의 면허가 없습니다
          </p>
        </div>
      );
    }

    return (
      <div className="border border-gray-300 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="w-12 px-3 py-2"></th>
              <th className="text-left px-3 py-2">면허명</th>
              <th className="text-left px-3 py-2">유효기간</th>
              <th className="text-left px-3 py-2">발급처</th>
              <th className="text-left px-3 py-2">소유</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => {
              const isValid = new Date(license.expiryDate) > new Date();
              return (
                <tr 
                  key={license.id}
                  className={`border-b border-gray-200 last:border-0 hover:bg-gray-50 cursor-pointer ${
                    selectedLicense === license.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedLicense(license.id)}
                >
                  <td className="px-3 py-2">
                    <input
                      type="radio"
                      name="license"
                      checked={selectedLicense === license.id}
                      onChange={() => setSelectedLicense(license.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {license.name}
                      {license.documentUrl && (
                        <SldsIcon name="link" size="xx-small" className="text-gray-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {license.expiryDate}
                      {isValid ? (
                        <SldsIcon name="check" size="xx-small" className="text-green-600" />
                      ) : (
                        <SldsIcon name="error" size="xx-small" className="text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {license.issuer}
                  </td>
                  <td className="px-3 py-2">
                    <SldsBadge variant="lightest">
                      {license.owner}
                    </SldsBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const ownedTab = (
    <div className="space-y-4">
      {renderLicenseTable(ownedLicenses)}
    </div>
  );

  const consortiumTab = (
    <div className="space-y-4">
      <SldsSelect
        label="컨소시엄 멤버 선택"
        value={selectedMemberId}
        onChange={(e) => {
          setSelectedMemberId(e.target.value);
          setSelectedLicense('');
        }}
        options={[
          { value: '', label: '멤버를 선택하세요' },
          ...consortiumMembers.map(m => ({
            value: m.id,
            label: `${m.name} (${m.role}, ${m.share}%)`
          }))
        ]}
      />
      
      {selectedMember ? (
        renderLicenseTable(selectedMember.licenses)
      ) : (
        <div className="flex items-center justify-center h-64 border border-gray-300 rounded">
          <p className="text-sm text-gray-600">
            멤버를 선택하여 면허를 확인하세요
          </p>
        </div>
      )}
    </div>
  );

  const footer = (
    <>
      <SldsButton variant="neutral" onClick={handleClose}>
        취소
      </SldsButton>
      <SldsButton variant="brand" onClick={handleConfirm} disabled={!selectedLicense}>
        매핑하기
      </SldsButton>
    </>
  );

  return (
    <SldsModal
      isOpen={isOpen}
      onClose={handleClose}
      title="면허 매핑"
      description="이 노드를 충족하는 면허를 선택하세요. 컨소시엄 구성원의 면허도 선택할 수 있습니다."
      size="large"
      footer={footer}
    >
      <div className="space-y-4">
        {licenseType && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded border border-blue-200">
            <SldsIcon name="info" size="x-small" className="text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              <span className="font-medium">필요 면허 타입:</span> {licenseType}
            </p>
          </div>
        )}
        
        <SldsTabs
          tabs={[
            {
              id: 'owned',
              label: '자체 보유',
              count: ownedLicenses.length,
              content: ownedTab
            },
            {
              id: 'consortium',
              label: '컨소시엄',
              count: consortiumMembers.reduce((acc, m) => acc + m.licenses.length, 0),
              content: consortiumTab
            }
          ]}
          defaultTab={source}
          onTabChange={(tabId) => {
            setSource(tabId as 'owned' | 'consortium');
            setSelectedLicense('');
          }}
        />
      </div>
    </SldsModal>
  );
}
