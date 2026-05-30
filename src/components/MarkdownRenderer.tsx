
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-invert max-w-none">
      <style>{`
        .prose {
          color: #e2e8f0;
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #f1f5f9;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
        }
        .prose h1 {
          font-size: 1.875rem;
          border-bottom: 1px solid #334155;
          padding-bottom: 0.5rem;
        }
        .prose h2 {
          font-size: 1.5rem;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 0.25rem;
        }
        .prose h3 {
          font-size: 1.25rem;
        }
        .prose p {
          margin: 1em 0;
          line-height: 1.7;
        }
        .prose a {
          color: #60a5fa;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #93c5fd;
        }
        .prose strong {
          color: #f1f5f9;
        }
        .prose code {
          background-color: #1e293b;
          color: #f472b6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .prose pre {
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1em 0;
        }
        .prose pre code {
          background-color: transparent;
          padding: 0;
          color: #e2e8f0;
        }
        .prose ul, .prose ol {
          margin: 1em 0;
          padding-left: 1.5em;
        }
        .prose li {
          margin: 0.25em 0;
        }
        .prose blockquote {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin: 1em 0;
          color: #94a3b8;
          background-color: #1e293b33;
          padding: 0.75rem 1rem;
          border-radius: 0 0.375rem 0.375rem 0;
        }
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        .prose th, .prose td {
          border: 1px solid #334155;
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        .prose th {
          background-color: #1e293b;
          font-weight: 600;
        }
        .prose tr:nth-child(even) {
          background-color: #0f172a;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
