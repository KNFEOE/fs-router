import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CodeExample from '../CodeExample';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe('CodeExample', () => {
  const mockCode = `function hello() {
  console.log('Hello, world!');
}`;

  it('renders code content correctly', () => {
    render(
      <CodeExample
        language="javascript"
        code={mockCode}
      />
    );
    
    expect(screen.getByText(/Hello, world!/)).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(
      <CodeExample
        title="Example Function"
        language="javascript"
        code={mockCode}
      />
    );
    
    expect(screen.getByText('Example Function')).toBeInTheDocument();
  });

  it('displays filename when provided', () => {
    render(
      <CodeExample
        filename="hello.js"
        language="javascript"
        code={mockCode}
      />
    );
    
    expect(screen.getByText('📄 hello.js')).toBeInTheDocument();
  });

  it('shows copy button by default', () => {
    render(
      <CodeExample
        language="javascript"
        code={mockCode}
      />
    );
    
    expect(screen.getByTitle('复制代码')).toBeInTheDocument();
  });

  it('hides copy button when showCopy is false', () => {
    render(
      <CodeExample
        language="javascript"
        code={mockCode}
        showCopy={false}
      />
    );
    
    expect(screen.queryByTitle('复制代码')).not.toBeInTheDocument();
  });

  it('copies code to clipboard when copy button is clicked', async () => {
    render(
      <CodeExample
        language="javascript"
        code={mockCode}
      />
    );
    
    const copyButton = screen.getByTitle('复制代码');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCode);
  });

  it('displays line numbers when showLineNumbers is true', () => {
    render(
      <CodeExample
        language="javascript"
        code={mockCode}
        showLineNumbers={true}
      />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('highlights specified lines', () => {
    render(
      <CodeExample
        language="javascript"
        code={mockCode}
        showLineNumbers={true}
        highlightLines={[2]}
      />
    );
    
    const lines = document.querySelectorAll('.code-line');
    expect(lines[1]).toHaveClass('highlighted');
  });

  it('displays correct language label', () => {
    render(
      <CodeExample
        language="typescript"
        code={mockCode}
      />
    );
    
    expect(screen.getByText('TYPESCRIPT')).toBeInTheDocument();
  });
});