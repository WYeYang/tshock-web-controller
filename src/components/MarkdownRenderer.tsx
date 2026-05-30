
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="doc-content">
      <style>{`
        .doc-content {
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.6;
        }
        .doc-content h1 {
          color: #f1f5f9;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }
        .doc-content h2 {
          color: #22d3ee;
          font-size: 1.125rem;
          font-weight: 600;
          margin: 1.5rem 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .doc-content h2::before {
          content: '';
          width: 4px;
          height: 1rem;
          background: linear-gradient(180deg, #22d3ee, #a855f7);
          border-radius: 2px;
        }
        .doc-content h3 {
          color: #e2e8f0;
          font-size: 1rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
        }
        .doc-content p {
          margin: 0.75rem 0;
          color: #cbd5e1;
        }
        .doc-content strong {
          color: #f1f5f9;
          font-weight: 600;
        }
        .doc-content code {
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(168, 85, 247, 0.15));
          color: #22d3ee;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: 'Fira Code', 'Consolas', monospace;
          border: 1px solid rgba(34, 211, 238, 0.2);
        }
        .doc-content pre {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
          border: 1px solid rgba(34, 211, 238, 0.2);
          border-radius: 0.75rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.1);
        }
        .doc-content pre code {
          background: transparent;
          color: #e2e8f0;
          padding: 0;
          border: none;
          font-size: 0.8125rem;
        }
        .doc-content ul, .doc-content ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .doc-content li {
          margin: 0.375rem 0;
          color: #cbd5e1;
          position: relative;
        }
        .doc-content ul li::before {
          content: '';
          position: absolute;
          left: -1rem;
          top: 0.6rem;
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #22d3ee, #a855f7);
          border-radius: 50%;
        }
        .doc-content blockquote {
          border-left: 3px solid;
          border-image: linear-gradient(180deg, #22d3ee, #a855f7) 1;
          background: rgba(34, 211, 238, 0.05);
          margin: 1rem 0;
          padding: 0.75rem 1rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .doc-content blockquote p {
          color: #94a3b8;
          margin: 0;
        }
        .doc-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .doc-content th {
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2));
          color: #f1f5f9;
          font-weight: 600;
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(34, 211, 238, 0.3);
        }
        .doc-content td {
          padding: 0.625rem 1rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          color: #cbd5e1;
        }
        .doc-content tr:nth-child(even) td {
          background: rgba(15, 23, 42, 0.5);
        }
        .doc-content tr:hover td {
          background: rgba(34, 211, 238, 0.05);
        }
        .doc-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent);
          margin: 1.5rem 0;
        }
        .doc-content a {
          color: #22d3ee;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
        }
        .doc-content a:hover {
          color: #67e8f9;
          border-bottom-color: #67e8f9;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
