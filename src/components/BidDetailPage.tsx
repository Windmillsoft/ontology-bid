import { useState } from "react";
import { OntologyTreePanel } from "./OntologyTreePanel";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { StatusChangeModal } from "./StatusChangeModal";
import { LicenseMappingModal } from "./LicenseMappingModal";
import { EvidenceUploadModal } from "./EvidenceUploadModal";
import { ChecklistModal } from "./ChecklistModal";
import { ReferenceEditModal } from "./ReferenceEditModal";
import { SldsButton } from "./slds/SldsButton";
import { SldsProgressBar } from "./slds/SldsProgressBar";
import { SldsBadge } from "./slds/SldsBadge";
import { SldsIcon } from "./slds/SldsIcon";
import { toast } from "sonner@2.0.3";
import {
  bidInfo,
  treeData,
  nodeDetailsMap,
  ownedLicenses,
  consortiumMembers,
  globalChecklist,
} from "../data/mockData";
import {
  NodeStatus,
  TreeNode,
  ChecklistItem,
  ReferenceInfo,
  ContentDocument,
  ContentDocumentLink,
} from "../types/ontology";

interface BidDetailPageProps {
  bidId: string;
  onBack: () => void;
}

export function BidDetailPage({
  bidId,
  onBack,
}: BidDetailPageProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<
    string | null
  >(null);
  const [nodes, setNodes] = useState(treeData);
  const [checklist, setChecklist] =
    useState<ChecklistItem[]>(globalChecklist);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [licenseModalOpen, setLicenseModalOpen] =
    useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] =
    useState(false);
  const [checklistModalOpen, setChecklistModalOpen] =
    useState(false);
  const [referenceModalOpen, setReferenceModalOpen] =
    useState(false);
  const [currentNodeForModal, setCurrentNodeForModal] =
    useState<string | null>(null);

  const selectedNode = selectedNodeId
    ? nodeDetailsMap[selectedNodeId]
    : null;

  // Calculate checklist stats
  const completedChecklistCount = checklist.filter(
    (item) => item.checked,
  ).length;
  const totalChecklistCount = checklist.length;
  const checklistCompletionRate = Math.round(
    (completedChecklistCount / totalChecklistCount) * 100,
  );
  const criticalCategories = [
    "deadline",
    "signature",
    "amount",
  ];
  const criticalIncompleteCount = checklist.filter(
    (item) =>
      criticalCategories.includes(item.category) &&
      !item.checked,
  ).length;

  const handleOpenStatusModal = (nodeId: string) => {
    setCurrentNodeForModal(nodeId);
    setStatusModalOpen(true);
  };

  const handleOpenLicenseModal = (nodeId: string) => {
    setCurrentNodeForModal(nodeId);
    setLicenseModalOpen(true);
  };

  const handleOpenEvidenceModal = (nodeId: string) => {
    setCurrentNodeForModal(nodeId);
    setEvidenceModalOpen(true);
  };

  const handleOpenReferenceModal = (nodeId: string) => {
    setCurrentNodeForModal(nodeId);
    setReferenceModalOpen(true);
  };

  const updateNodeStatus = (
    nodeId: string,
    newStatus: NodeStatus,
  ) => {
    const updateNodeInTree = (
      nodes: TreeNode[],
    ): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, status: newStatus };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNodeInTree(node.children),
          };
        }
        return node;
      });
    };

    setNodes(updateNodeInTree(nodes));

    if (nodeDetailsMap[nodeId]) {
      const updatedDetail = {
        ...nodeDetailsMap[nodeId],
        status: newStatus,
      };
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      updatedDetail.history = [
        {
          id: `H${Date.now()}`,
          at: timestamp,
          who: updatedDetail.owner || "사용자",
          action: "상태 변경",
          from: nodeDetailsMap[nodeId].status,
          to: newStatus,
          detail: "상태가 업데이트되었습니다",
        },
        ...updatedDetail.history,
      ];

      nodeDetailsMap[nodeId] = updatedDetail;
    }
  };

  const handleStatusChange = (
    newStatus: NodeStatus,
    reason: string,
  ) => {
    if (!currentNodeForModal) return;

    const statusLabels: Record<NodeStatus, string> = {
      NOT_STARTED: "미시작",
      IN_PROGRESS: "진행 중",
      BLOCKED: "차단",
      RISK: "리스크",
      SATISFIED: "완료",
    };

    updateNodeStatus(currentNodeForModal, newStatus);
    toast.success(
      `상태가 '${statusLabels[newStatus]}'으로 변경되었습니다`,
      {
        description: reason || undefined,
      },
    );
  };

  const handleLicenseMapping = (
    licenseId: string,
    source: "owned" | "consortium",
  ) => {
    if (!currentNodeForModal) return;

    const allLicenses =
      source === "owned"
        ? ownedLicenses
        : consortiumMembers.flatMap((m) => m.licenses);

    const license = allLicenses.find((l) => l.id === licenseId);

    if (license) {
      toast.success("면허가 매핑되었습니다", {
        description: `${license.name} - ${license.owner}`,
      });

      if (
        currentNodeForModal &&
        nodeDetailsMap[currentNodeForModal]
      ) {
        updateNodeStatus(currentNodeForModal, "SATISFIED");
      }
    }
  };

  const handleEvidenceUpload = (
    files: File[],
    reference: string,
  ) => {
    if (!currentNodeForModal) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    files.forEach((file, index) => {
      if (nodeDetailsMap[currentNodeForModal]) {
        nodeDetailsMap[currentNodeForModal].evidence.push({
          id: `E${Date.now()}_${index}`,
          name: file.name,
          version: "v1",
          by:
            nodeDetailsMap[currentNodeForModal].owner ||
            "사용자",
          at: timestamp,
          reference: reference || undefined,
        });
      }
    });

    toast.success(
      `${files.length}개의 파일이 업로드되었습니다`,
      {
        description: reference || undefined,
      },
    );
  };

  const handleGlobalChecklistToggle = (
    itemId: string,
    checked: boolean,
  ) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            checked,
            checkedBy: checked ? "사용자" : undefined,
            checkedAt: checked ? timestamp : undefined,
          };
        }
        return item;
      }),
    );

    const updatedChecklist = checklist.map((item) =>
      item.id === itemId
        ? {
            ...item,
            checked,
            checkedBy: checked ? "사용자" : undefined,
            checkedAt: checked ? timestamp : undefined,
          }
        : item,
    );

    const allChecked = updatedChecklist.every(
      (item) => item.checked,
    );
    if (allChecked) {
      toast.success("모든 체크리스트 항목이 완료되었습니다!", {
        description: "입찰 제출 준비가 완료되었습니다.",
      });
    }
  };

  const handleChecklistItemToggle = (
    itemId: string,
    checked: boolean,
  ) => {
    if (!selectedNodeId || !nodeDetailsMap[selectedNodeId])
      return;

    const nodeDetail = nodeDetailsMap[selectedNodeId];
    if (!nodeDetail.checklist) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    nodeDetail.checklist = nodeDetail.checklist.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          checked,
          checkedBy: checked
            ? nodeDetail.owner || "사용자"
            : undefined,
          checkedAt: checked ? timestamp : undefined,
        };
      }
      return item;
    });

    const allChecked = nodeDetail.checklist.every(
      (item) => item.checked,
    );
    if (allChecked && nodeDetail.status !== "SATISFIED") {
      updateNodeStatus(selectedNodeId, "SATISFIED");
      toast.success("모든 체크리스트 항목이 완료되었습니다!", {
        description: '노드 상태가 "완료"로 변경되었습니다.',
      });
    }

    setSelectedNodeId(null);
    setTimeout(() => setSelectedNodeId(selectedNodeId), 0);
  };

  const handleReferenceUpdate = (reference: ReferenceInfo) => {
    if (!currentNodeForModal) return;

    nodeDetailsMap[currentNodeForModal] = {
      ...nodeDetailsMap[currentNodeForModal],
      reference,
    };

    toast.success("공고문 근거가 업데이트되었습니다");
  };

  const handleDocumentSelect = (
    documentId: string,
    contentDocument: ContentDocument,
  ) => {
    if (!selectedNodeId) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const contentDocumentLink: ContentDocumentLink = {
      id: `CDL${Date.now()}`,
      contentDocumentId: contentDocument.id,
      linkedEntityId: selectedNodeId,
      contentDocument: contentDocument,
      linkedBy:
        nodeDetailsMap[selectedNodeId]?.owner || "사용자",
      linkedAt: timestamp,
    };

    if (
      nodeDetailsMap[selectedNodeId] &&
      nodeDetailsMap[selectedNodeId].requiredDocuments
    ) {
      const documents =
        nodeDetailsMap[selectedNodeId].requiredDocuments!;
      const docIndex = documents.findIndex(
        (d) => d.id === documentId,
      );

      if (docIndex !== -1) {
        documents[docIndex] = {
          ...documents[docIndex],
          contentDocumentLink: contentDocumentLink,
        };

        const allRequiredLinked = documents
          .filter((doc) => doc.required)
          .every((doc) => doc.contentDocumentLink);

        if (allRequiredLinked) {
          updateNodeStatus(selectedNodeId, "SATISFIED");
          toast.success(
            "모든 필수 자료가 연결되어 노드가 완료 처리되었습니다",
            {
              description: contentDocument.title,
            },
          );
        } else {
          toast.success(
            "ContentDocumentLink가 생성되었습니다",
            {
              description: contentDocument.title,
            },
          );
        }

        const currentId = selectedNodeId;
        setSelectedNodeId(null);
        setTimeout(() => setSelectedNodeId(currentId), 0);
      }
    }
  };

  const handleDocumentDelete = (documentId: string) => {
    if (!selectedNodeId) return;

    if (
      nodeDetailsMap[selectedNodeId] &&
      nodeDetailsMap[selectedNodeId].requiredDocuments
    ) {
      const documents =
        nodeDetailsMap[selectedNodeId].requiredDocuments!;
      const docIndex = documents.findIndex(
        (d) => d.id === documentId,
      );

      if (docIndex !== -1) {
        const fileName =
          documents[docIndex].contentDocumentLink
            ?.contentDocument.title;
        documents[docIndex] = {
          ...documents[docIndex],
          contentDocumentLink: undefined,
        };

        if (
          nodeDetailsMap[selectedNodeId].status === "SATISFIED"
        ) {
          updateNodeStatus(selectedNodeId, "IN_PROGRESS");
        }

        toast.success("ContentDocumentLink가 삭제되었습니다", {
          description: fileName,
        });

        const currentId = selectedNodeId;
        setSelectedNodeId(null);
        setTimeout(() => setSelectedNodeId(currentId), 0);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* SLDS Page Header */}
      <header className="slds-page-header bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <SldsButton
              variant="neutral"
              size="small"
              icon={
                <SldsIcon name="chevronleft" size="xx-small" />
              }
              iconPosition="left"
              onClick={onBack}
            >
              목록으로
            </SldsButton>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-lg mb-1">입찰 온톨로지</h1>
              <p className="text-sm text-gray-600">
                {bidInfo.name} · 공고번호 {bidInfo.noticeNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <div className="text-right min-w-[140px]">
                  <SldsProgressBar
                    value={bidInfo.progress}
                    label="전체 진행률"
                    size="small"
                  />
                </div>

                <SldsBadge
                  variant={
                    bidInfo.dDay <= 3 ? "error" : "lightest"
                  }
                  className="flex items-center gap-1.5 px-3 py-1"
                >
                  <SldsIcon name="warning" size="xx-small" />
                  D-{bidInfo.dDay}
                </SldsBadge>
              </div>
            </div>

            <SldsButton
              variant="neutral"
              size="medium"
              icon={
                <SldsIcon name="download" size="xx-small" />
              }
              iconPosition="left"
            >
              전체 내보내기
            </SldsButton>
          </div>
        </div>

        {/* Checklist Banner */}
        <div
          className={`
            border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
            ${
              checklistCompletionRate === 100
                ? "bg-green-50 border-green-400"
                : criticalIncompleteCount > 0
                  ? "bg-red-50 border-red-400 animate-pulse"
                  : "bg-yellow-50 border-yellow-400"
            }
          `}
          onClick={() => setChecklistModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${
                  checklistCompletionRate === 100
                    ? "bg-green-600"
                    : criticalIncompleteCount > 0
                      ? "bg-red-600"
                      : "bg-yellow-600"
                }
              `}
              >
                <SldsIcon
                  name={
                    checklistCompletionRate === 100
                      ? "check"
                      : "warning"
                  }
                  size="medium"
                  className="text-white"
                />
              </div>

              <div>
                <h3
                  className={`
                  text-base mb-1
                  ${
                    checklistCompletionRate === 100
                      ? "text-green-900"
                      : criticalIncompleteCount > 0
                        ? "text-red-900 font-medium"
                        : "text-yellow-900"
                  }
                `}
                >
                  제출 전 최종 점검
                  {checklistCompletionRate === 100 && " ✓"}
                </h3>
                <p
                  className={`
                  text-sm
                  ${
                    checklistCompletionRate === 100
                      ? "text-green-700"
                      : criticalIncompleteCount > 0
                        ? "text-red-700"
                        : "text-yellow-700"
                  }
                `}
                >
                  {checklistCompletionRate === 100
                    ? "모든 항목이 확인되었습니다"
                    : criticalIncompleteCount > 0
                      ? `긴급 확인 필요: ${criticalIncompleteCount}개 항목`
                      : `${totalChecklistCount - completedChecklistCount}개 항목 확인 필요`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div
                  className={`
                  text-2xl mb-1
                  ${
                    checklistCompletionRate === 100
                      ? "text-green-900"
                      : criticalIncompleteCount > 0
                        ? "text-red-900"
                        : "text-yellow-900"
                  }
                `}
                >
                  {completedChecklistCount}/
                  {totalChecklistCount}
                </div>
                <div
                  className={`
                  text-xs
                  ${
                    checklistCompletionRate === 100
                      ? "text-green-700"
                      : criticalIncompleteCount > 0
                        ? "text-red-700"
                        : "text-yellow-700"
                  }
                `}
                >
                  {checklistCompletionRate}% 완료
                </div>
              </div>

              <SldsIcon
                name="chevronright"
                size="small"
                className={
                  checklistCompletionRate === 100
                    ? "text-green-600"
                    : criticalIncompleteCount > 0
                      ? "text-red-600"
                      : "text-yellow-600"
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[420px] flex-shrink-0">
          <OntologyTreePanel
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onOpenStatusModal={handleOpenStatusModal}
            onOpenLicenseModal={handleOpenLicenseModal}
            onOpenEvidenceModal={handleOpenEvidenceModal}
          />
        </div>

        <div className="flex-1">
          <NodeDetailPanel
            nodeDetail={selectedNode}
            onOpenStatusModal={() =>
              selectedNodeId &&
              handleOpenStatusModal(selectedNodeId)
            }
            onOpenLicenseModal={() =>
              selectedNodeId &&
              handleOpenLicenseModal(selectedNodeId)
            }
            onOpenEvidenceModal={() =>
              selectedNodeId &&
              handleOpenEvidenceModal(selectedNodeId)
            }
            onOpenReferenceModal={() =>
              selectedNodeId &&
              handleOpenReferenceModal(selectedNodeId)
            }
            onChecklistItemToggle={handleChecklistItemToggle}
            onDocumentSelect={handleDocumentSelect}
            onDocumentDelete={handleDocumentDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <ChecklistModal
        isOpen={checklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
        checklist={checklist}
        onToggleItem={handleGlobalChecklistToggle}
      />

      {currentNodeForModal &&
        nodeDetailsMap[currentNodeForModal] && (
          <>
            <StatusChangeModal
              isOpen={statusModalOpen}
              onClose={() => setStatusModalOpen(false)}
              currentStatus={
                nodeDetailsMap[currentNodeForModal].status
              }
              onConfirm={handleStatusChange}
            />

            <LicenseMappingModal
              isOpen={licenseModalOpen}
              onClose={() => setLicenseModalOpen(false)}
              licenseType={
                nodeDetailsMap[currentNodeForModal].licenseType
              }
              ownedLicenses={ownedLicenses}
              consortiumMembers={consortiumMembers}
              onConfirm={handleLicenseMapping}
            />

            <EvidenceUploadModal
              isOpen={evidenceModalOpen}
              onClose={() => setEvidenceModalOpen(false)}
              onConfirm={handleEvidenceUpload}
            />

            <ReferenceEditModal
              isOpen={referenceModalOpen}
              onClose={() => setReferenceModalOpen(false)}
              currentReference={
                currentNodeForModal
                  ? nodeDetailsMap[currentNodeForModal]
                      ?.reference
                  : undefined
              }
              onConfirm={handleReferenceUpdate}
              nodeLabel={
                currentNodeForModal
                  ? nodeDetailsMap[currentNodeForModal]
                      ?.label || ""
                  : ""
              }
            />
          </>
        )}
    </div>
  );
}