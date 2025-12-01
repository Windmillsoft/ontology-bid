export type NodeStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'RISK' | 'SATISFIED';
export type BidStatus = 'DRAFT' | 'IN_PREPARATION' | 'REVIEW' | 'SUBMITTED' | 'AWARDED' | 'LOST';

export interface TreeNode {
  id: string;
  label: string;
  status: NodeStatus;
  required?: boolean;
  children?: TreeNode[];
}

export interface BidInfo {
  name: string;
  noticeNo: string;
  dDay: number;
  progress: number;
}

export interface BidListItem {
  id: string;
  name: string;
  noticeNo: string;
  client: string;
  status: BidStatus;
  dDay: number;
  deadline: string;
  progress: number;
  checklistProgress: number;
  owner: string;
  estimatedAmount?: string;
  createdAt: string;
  category: string;
}

export interface Evidence {
  id: string;
  name: string;
  version: string;
  by: string;
  at: string;
  url?: string;
  reference?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ContentDocument {
  id: string; // ContentDocumentId
  title: string;
  fileExtension: string;
  fileType: string;
  contentSize: number;
  createdBy: string;
  createdDate: string;
  lastModifiedDate: string;
  description?: string;
}

export interface ContentDocumentLink {
  id: string; // ContentDocumentLinkId
  contentDocumentId: string;
  linkedEntityId: string; // 연결된 레코드 ID (노드 ID)
  contentDocument: ContentDocument;
  linkedBy: string;
  linkedAt: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  file?: UploadedFile;
  contentDocumentLink?: ContentDocumentLink;
}

export interface License {
  id: string;
  name: string;
  expiryDate: string;
  issuer: string;
  documentUrl?: string;
  owner: string;
}

export interface ConsortiumMember {
  id: string;
  name: string;
  share: number;
  role: string;
  licenses: License[];
}

export interface HistoryEntry {
  id: string;
  at: string;
  who: string;
  action: string;
  from?: string;
  to?: string;
  detail?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  checkedBy?: string;
  checkedAt?: string;
  category: 'deadline' | 'upload' | 'signature' | 'filename' | 'amount' | 'evidence' | 'general';
}

export interface ReferenceInfo {
  page?: string;
  article?: string;
  content: string;
  extractedAt?: string;
  extractedBy?: string;
}

export interface NodeDetail {
  id: string;
  label: string;
  status: NodeStatus;
  required: boolean;
  licenseType?: string;
  weight?: number;
  owner?: string;
  reviewer?: string;
  evidence: Evidence[];
  requiredDocuments?: RequiredDocument[];
  history: HistoryEntry[];
  relatedNodes?: number;
  checklist?: ChecklistItem[];
  reference?: ReferenceInfo;
}
