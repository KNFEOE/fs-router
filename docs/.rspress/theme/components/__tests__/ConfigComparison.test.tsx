import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfigComparison from '../ConfigComparison';

const mockConfigs = [
  {
    name: 'Vite',
    language: 'typescript',
    code: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})`,
    filename: 'vite.config.ts',
    description: 'Vite 配置示例'
  },
  {
    name: 'Webpack',
    language: 'javascript',
    code: `const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}`,
    filename: 'webpack.config.js',
    description: 'Webpack 配置示例'
  }
];

describe('ConfigComparison', () => {
  it('renders all config tabs', () => {
    render(<ConfigComparison configs={mockConfigs} />);
    
    expect(screen.getByText('Vite')).toBeInTheDocument();
    expect(screen.getByText('Webpack')).toBeInTheDocument();
  });

  it('shows first config by default', () => {
    render(<ConfigComparison configs={mockConfigs} />);
    
    expect(screen.getByText('Vite 配置示例')).toBeInTheDocument();
    expect(screen.getByText(/import { defineConfig }/)).toBeInTheDocument();
  });

  it('switches config when tab is clicked', () => {
    render(<ConfigComparison configs={mockConfigs} />);
    
    fireEvent.click(screen.getByText('Webpack'));
    
    expect(screen.getByText('Webpack 配置示例')).toBeInTheDocument();
    expect(screen.getByText(/const path = require/)).toBeInTheDocument();
  });

  it('shows custom title when provided', () => {
    render(
      <ConfigComparison 
        configs={mockConfigs} 
        title="自定义标题" 
      />
    );
    
    expect(screen.getByText('自定义标题')).toBeInTheDocument();
  });

  it('uses default tab when specified', () => {
    render(
      <ConfigComparison 
        configs={mockConfigs} 
        defaultTab="Webpack"
      />
    );
    
    expect(screen.getByText('Webpack 配置示例')).toBeInTheDocument();
  });

  it('shows empty state when no configs provided', () => {
    render(<ConfigComparison configs={[]} />);
    
    expect(screen.getByText('暂无配置示例')).toBeInTheDocument();
  });

  it('displays config count in footer', () => {
    render(<ConfigComparison configs={mockConfigs} />);
    
    expect(screen.getByText('2 个配置示例')).toBeInTheDocument();
  });

  it('applies active class to selected tab', () => {
    render(<ConfigComparison configs={mockConfigs} />);
    
    const viteTab = screen.getByText('Vite').closest('button');
    expect(viteTab).toHaveClass('active');
    
    fireEvent.click(screen.getByText('Webpack'));
    
    const webpackTab = screen.getByText('Webpack').closest('button');
    expect(webpackTab).toHaveClass('active');
    expect(viteTab).not.toHaveClass('active');
  });
});