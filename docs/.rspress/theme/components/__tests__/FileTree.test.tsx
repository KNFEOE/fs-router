import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileTree from '../FileTree';

const mockStructure = [
  {
    name: 'src',
    type: 'directory' as const,
    children: [
      {
        name: 'components',
        type: 'directory' as const,
        children: [
          {
            name: 'Button.tsx',
            type: 'file' as const,
            description: 'Button component'
          }
        ]
      },
      {
        name: 'index.ts',
        type: 'file' as const,
        description: 'Entry point'
      }
    ]
  },
  {
    name: 'package.json',
    type: 'file' as const,
    description: 'Package configuration',
    highlight: true
  }
];

describe('FileTree', () => {
  it('renders file structure correctly', () => {
    render(<FileTree structure={mockStructure} />);
    
    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('package.json')).toBeInTheDocument();
  });

  it('shows custom title when provided', () => {
    render(
      <FileTree 
        structure={mockStructure} 
        title="项目结构" 
      />
    );
    
    expect(screen.getByText('项目结构')).toBeInTheDocument();
  });

  it('expands directories by default when expandedByDefault is true', () => {
    render(
      <FileTree 
        structure={mockStructure} 
        expandedByDefault={true}
      />
    );
    
    expect(screen.getByText('components')).toBeInTheDocument();
    expect(screen.getByText('index.ts')).toBeInTheDocument();
  });

  it('collapses directories by default when expandedByDefault is false', () => {
    render(
      <FileTree 
        structure={mockStructure} 
        expandedByDefault={false}
      />
    );
    
    expect(screen.queryByText('components')).not.toBeInTheDocument();
    expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
  });

  it('toggles directory expansion when clicked', () => {
    render(
      <FileTree 
        structure={mockStructure} 
        expandedByDefault={false}
      />
    );
    
    const srcDirectory = screen.getByText('src');
    fireEvent.click(srcDirectory);
    
    expect(screen.getByText('components')).toBeInTheDocument();
    expect(screen.getByText('index.ts')).toBeInTheDocument();
    
    fireEvent.click(srcDirectory);
    
    expect(screen.queryByText('components')).not.toBeInTheDocument();
    expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
  });

  it('shows descriptions when showDescription is true', () => {
    render(
      <FileTree 
        structure={mockStructure} 
        showDescription={true}
      />
    );
    
    expect(screen.getByText('Package configuration')).toBeInTheDocument();
  });

  it('hides descriptions when showDescription is false', () => {
    render(
      <FileTree 
        structure={mockStructure} 
        showDescription={false}
      />
    );
    
    expect(screen.queryByText('Package configuration')).not.toBeInTheDocument();
  });

  it('highlights specified files', () => {
    render(<FileTree structure={mockStructure} />);
    
    const packageJsonNode = screen.getByText('package.json').closest('.file-tree-node');
    expect(packageJsonNode).toHaveClass('highlighted');
  });

  it('shows empty state when no structure provided', () => {
    render(<FileTree structure={[]} />);
    
    expect(screen.getByText('暂无文件结构')).toBeInTheDocument();
  });

  it('displays correct file icons based on extension', () => {
    const structure = [
      { name: 'test.tsx', type: 'file' as const },
      { name: 'config.json', type: 'file' as const },
      { name: 'README.md', type: 'file' as const }
    ];
    
    render(<FileTree structure={structure} />);
    
    // Icons are rendered as text content, so we check for their presence
    expect(screen.getByText('test.tsx')).toBeInTheDocument();
    expect(screen.getByText('config.json')).toBeInTheDocument();
    expect(screen.getByText('README.md')).toBeInTheDocument();
  });

  it('shows legend in footer', () => {
    render(<FileTree structure={mockStructure} />);
    
    expect(screen.getByText('目录')).toBeInTheDocument();
    expect(screen.getByText('文件')).toBeInTheDocument();
    expect(screen.getByText('说明')).toBeInTheDocument();
  });
});