import React, { useState } from 'react';

interface CodeExampleProps {
  title?: string;
  language: string;
  code: string;
  showCopy?: boolean;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  filename?: string;
}

const CodeExample: React.FC<CodeExampleProps> = ({
  title,
  language,
  code,
  showCopy = true,
  showLineNumbers = false,
  highlightLines = [],
  filename
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      'typescript': 'TypeScript',
      'javascript': 'JavaScript',
      'tsx': 'TSX',
      'jsx': 'JSX',
      'json': 'JSON',
      'bash': 'Bash',
      'shell': 'Shell',
      'yaml': 'YAML',
      'yml': 'YAML',
      'css': 'CSS',
      'html': 'HTML',
      'md': 'Markdown',
      'markdown': 'Markdown'
    };
    return labels[lang.toLowerCase()] || lang.toUpperCase();
  };

  const lines = code.split('\n');

  return (
    <div className="code-example-container">
      {(title || filename) && (
        <div className="code-example-header">
          <div className="code-example-title">
            {filename && (
              <span className="code-example-filename">
                📄 {filename}
              </span>
            )}
            {title && !filename && (
              <span className="code-example-title-text">
                {title}
              </span>
            )}
          </div>
          <div className="code-example-meta">
            <span className="code-example-language">
              {getLanguageLabel(language)}
            </span>
            {showCopy && (
              <button
                onClick={handleCopy}
                className="code-example-copy-btn"
                title={copied ? '已复制!' : '复制代码'}
              >
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      <div className="code-example-content">
        <pre className={`language-${language}`}>
          <code>
            {showLineNumbers ? (
              lines.map((line, index) => {
                const lineNumber = index + 1;
                const isHighlighted = highlightLines.includes(lineNumber);
                return (
                  <div
                    key={index}
                    className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
                  >
                    <span className="line-number">{lineNumber}</span>
                    <span className="line-content">{line}</span>
                  </div>
                );
              })
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeExample;