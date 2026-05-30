
import { useState, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { loadDocument, getSortedDocuments } from '../utils/docsLoader';
import type { DocumentId, DocMeta } from '../types/docs';

interface DocViewProps {
  onGoToConfig?: () => void;
  initialDocId?: string;
}

export const DocView = ({ onGoToConfig: _onGoToConfig, initialDocId }: DocViewProps) => {
  const [currentDoc, setCurrentDoc] = useState<DocumentId>('commands');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocMeta[]>([]);

  useEffect(() => {
    setDocuments(getSortedDocuments());
  }, []);

  useEffect(() => {
    if (initialDocId) {
      setCurrentDoc(initialDocId as DocumentId);
    }
  }, [initialDocId]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const entry = await loadDocument(currentDoc);
        setContent(entry.content);
      } catch (error) {
        setContent('# 加载失败\n\n无法加载文档内容。');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [currentDoc]);

  return (
    <div className="flex h-full">
      <div className="w-64 h-full bg-slate-900/50 border-r border-slate-700/50 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          文档目录
        </h2>
        <div className="space-y-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setCurrentDoc(doc.id as DocumentId)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                currentDoc === doc.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-cyan-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="font-medium">{doc.title}</div>
              {doc.description && (
                <div className="text-xs opacity-75 mt-1">{doc.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 h-full overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-400">加载中...</div>
          </div>
        ) : (
          <MarkdownRenderer content={content} />
        )}
      </div>
    </div>
  );
};
