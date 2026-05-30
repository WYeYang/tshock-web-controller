
import type { DocEntry, DocumentId, DocMeta } from '../types/docs';
import { DOCUMENTS } from '../types/docs';

const docModules = import.meta.glob('../../docs/*.md', { query: '?raw', import: 'default' });

export const loadDocument = async (id: DocumentId): Promise<DocEntry> => {
  // Map id to filename
  const filenameMap: Record<string, string> = {
    'commands': 'tshock-commands.md',
  };
  const filename = filenameMap[id] || `${id}.md`;
  const path = `../../docs/${filename}`;

  if (!docModules[path]) {
    return {
      meta: { ...DOCUMENTS[id] },
      content: '# 文档未找到',
    };
  }

  const content = await (docModules[path] as () => Promise<string>)();

  return {
    meta: {
      ...DOCUMENTS[id],
    },
    content,
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
