
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
  | 'getting-started'
  | 'rest-api'
  | 'permissions'
  | 'commands';

export const DOCUMENTS: Record<DocumentId, DocMeta> = {
  'getting-started': {
    id: 'getting-started',
    title: '入门指南',
    description: '快速开始使用 TShock 控制器',
    category: '基础',
    order: 1,
  },
  'rest-api': {
    id: 'rest-api',
    title: 'REST API 文档',
    description: 'TShock REST API 端点说明',
    category: 'API',
    order: 2,
  },
  'permissions': {
    id: 'permissions',
    title: '权限说明',
    description: 'TShock 权限详解',
    category: '管理',
    order: 3,
  },
  'commands': {
    id: 'commands',
    title: '命令列表',
    description: 'TShock 完整命令列表',
    category: '参考',
    order: 4,
  },
};

export const getSortedDocuments = (): DocMeta[] => {
  return Object.values(DOCUMENTS).sort((a, b) => (a.order || 999) - (b.order || 999));
};
