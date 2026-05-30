
export interface DocMeta {
  id: string;
  title: string;
  description?: string;
  category?: string;
  order?: number;
}

export interface DocEntry {
  meta: DocMeta;
  content: string;
}

export type DocumentId = 
  | 'commands';

export const DOCUMENTS: Record<DocumentId, DocMeta> = {
  'commands': {
    id: 'commands',
    title: '命令列表',
    description: 'TShock 完整命令列表',
    category: '参考',
    order: 1,
  },
};

export const getSortedDocuments = (): DocMeta[] => {
  return Object.values(DOCUMENTS).sort((a, b) => (a.order || 999) - (b.order || 999));
};
