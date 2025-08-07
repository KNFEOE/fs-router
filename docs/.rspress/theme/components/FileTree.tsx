import React, { useState } from 'react';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  description?: string;
  highlight?: boolean;
}

interface FileTreeProps {
  structure: FileNode[];
  expandedByDefault?: boolean;
  title?: string;
  showDescription?: boolean;
}

const FileTreeItem: React.FC<{
  node: FileNode;
  level: number;
  expandedByDefault: boolean;
  showDescription: boolean;
}> = ({ node, level, expandedByDefault, showDescription }) => {
  const [isExpanded, setIsExpanded] = useState(expandedByDefault);
  const hasChildren = node.children && node.children.length > 0;

  const getFileIcon = (name: string, type: string) => {
    if (type === 'directory') {
      return isExpanded ? '📂' : '📁';
    }

    const extension = name.split('.').pop()?.toLowerCase();
    const icons: Record<string, string> = {
      'tsx': '⚛️',
      'jsx': '⚛️',
      'ts': '🔷',
      'js': '🟨',
      'json': '📋',
      'md': '📝',
      'css': '🎨',
      'scss': '🎨',
      'less': '🎨',
      'html': '🌐',
      'vue': '💚',
      'svelte': '🧡',
      'py': '🐍',
      'java': '☕',
      'go': '🐹',
      'rs': '🦀',
      'php': '🐘',
      'rb': '💎',
      'swift': '🦉',
      'kt': '🟣',
      'dart': '🎯',
      'yml': '⚙️',
      'yaml': '⚙️',
      'toml': '⚙️',
      'xml': '📄',
      'svg': '🖼️',
      'png': '🖼️',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'gif': '🖼️',
      'ico': '🖼️',
      'pdf': '📕',
      'zip': '📦',
      'tar': '📦',
      'gz': '📦'
    };

    return icons[extension || ''] || '📄';
  };

  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const indentStyle = {
    paddingLeft: `${level * 1.5}rem`
  };

  return (
    <div className="file-tree-item">
      <div
        className={`file-tree-node ${node.highlight ? 'highlighted' : ''} ${hasChildren ? 'expandable' : ''}`}
        style={indentStyle}
        onClick={toggleExpanded}
      >
        <div className="file-tree-content">
          {hasChildren && (
            <span className={`file-tree-arrow ${isExpanded ? 'expanded' : ''}`}>
              ▶
            </span>
          )}
          <span className="file-tree-icon">
            {getFileIcon(node.name, node.type)}
          </span>
          <span className="file-tree-name">
            {node.name}
          </span>
          {node.description && showDescription && (
            <span className="file-tree-description">
              {node.description}
            </span>
          )}
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="file-tree-children">
          {node.children!.map((child, index) => (
            <FileTreeItem
              key={`${child.name}-${index}`}
              node={child}
              level={level + 1}
              expandedByDefault={expandedByDefault}
              showDescription={showDescription}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree: React.FC<FileTreeProps> = ({
  structure,
  expandedByDefault = true,
  title,
  showDescription = true
}) => {
  if (!structure.length) {
    return (
      <div className="file-tree-empty">
        <p>暂无文件结构</p>
      </div>
    );
  }

  return (
    <div className="file-tree-container">
      {title && (
        <div className="file-tree-header">
          <h4 className="file-tree-title">{title}</h4>
        </div>
      )}
      
      <div className="file-tree-content">
        {structure.map((node, index) => (
          <FileTreeItem
            key={`${node.name}-${index}`}
            node={node}
            level={0}
            expandedByDefault={expandedByDefault}
            showDescription={showDescription}
          />
        ))}
      </div>
      
      <div className="file-tree-footer">
        <div className="file-tree-legend">
          <span className="legend-item">
            <span className="legend-icon">📁</span>
            <span className="legend-text">目录</span>
          </span>
          <span className="legend-item">
            <span className="legend-icon">📄</span>
            <span className="legend-text">文件</span>
          </span>
          {showDescription && (
            <span className="legend-item">
              <span className="legend-icon">💡</span>
              <span className="legend-text">说明</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileTree;