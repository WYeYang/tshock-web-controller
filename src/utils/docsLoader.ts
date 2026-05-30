
import type { DocEntry, DocumentId, DocMeta } from '../types/docs';
import { DOCUMENTS } from '../types/docs';

import gettingStartedContent from '../../docs/01-getting-started.md?raw';
import restApiContent from '../../docs/github_tshock_wiki_rest_endpoints.md?raw';
import permissionsContent from '../../docs/github_tshock_wiki_permissions.md?raw';
import commandsContent from '../../docs/tshock-rest-api.md?raw';

export const loadDocument = async (id: DocumentId): Promise<DocEntry> => {
  const contentMap: Record<DocumentId, string> = {
    'getting-started': gettingStartedContent,
    'rest-api': restApiContent,
    'permissions': permissionsContent,
    'commands': commandsContent,
  };

  return {
    meta: {
      ...DOCUMENTS[id],
    },
    content: contentMap[id] || '# 文档未找到',
  };
};

export const loadAllDocuments = async (): Promise<DocEntry[]> => {
  const entries: DocEntry[] = [];

  for (const id of Object.keys(DOCUMENTS) as DocumentId[]) {
    entries.push(await loadDocument(id));
  }

  return entries;
};

export const getSortedDocuments = (): DocMeta[] => {
  return Object.values(DOCUMENTS).sort((a, b) => (a.order || 999) - (b.order || 999));
};
