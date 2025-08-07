import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApiDoc from '../ApiDoc';

const mockParameters = [
  {
    name: 'config',
    type: 'object',
    required: true,
    description: '配置对象'
  },
  {
    name: 'options',
    type: 'string',
    required: false,
    default: 'default',
    description: '可选参数'
  }
];

const mockExamples = [
  `// 基础用法
const router = createRouter({
  routes: './src/routes'
});`,
  `// 高级用法
const router = createRouter({
  routes: './src/routes',
  options: {
    lazy: true
  }
});`
];

describe('ApiDoc', () => {
  it('renders API name and type correctly', () => {
    render(
      <ApiDoc
        name="createRouter"
        type="function"
        description="创建路由器实例"
      />
    );
    
    expect(screen.getByText('createRouter')).toBeInTheDocument();
    expect(screen.getByText('function')).toBeInTheDocument();
  });

  it('displays description', () => {
    render(
      <ApiDoc
        name="createRouter"
        type="function"
        description="创建路由器实例"
      />
    );
    
    expect(screen.getByText('创建路由器实例')).toBeInTheDocument();
  });

  it('shows parameters table when parameters provided', () => {
    render(
      <ApiDoc
        name="createRouter"
        type="function"
        description="创建路由器实例"
        parameters={mockParameters}
      />
    );
    
    expect(screen.getByText('参数')).toBeInTheDocument();
    expect(screen.getByText('config')).toBeInTheDocument();
    expect(screen.getByText('options')).toBeInTheDocument();
    expect(screen.getByText('配置对象')).toBeInTheDocument();
  });

  it('displays return type when provided', () => {
    render(
      <ApiDoc
        name="createRouter"
        type="function"
        description="创建路由器实例"
        returns="Router"
      />
    );
    
    expect(screen.getByText('返回值')).toBeInTheDocument();
    expect(screen.getByText('Router')).toBeInTheDocument();
  });

  it('shows examples when provided', () => {
    render(
      <ApiDoc
        name="createRouter"
        type="function"
        description="创建路由器实例"
        examples={mockExamples}
      />
    );
    
    expect(screen.getByText('使用示例')).toBeInTheDocument();
    expect(screen.getByText(/基础用法/)).toBeInTheDocument();
  });

  it('switches between multiple examples', () => {
    render(
      <ApiDoc
        name="createRouter"
        type="function"
        description="创建路由器实例"
        examples={mockExamples}
      />
    );
    
    expect(screen.getByText('示例 1')).toBeInTheDocument();
    expect(screen.getByText('示例 2')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('示例 2'));
    expect(screen.getByText(/高级用法/)).toBeInTheDocument();
  });

  it('shows deprecated badge when deprecated', () => {
    render(
      <ApiDoc
        name="oldFunction"
        type="function"
        description="旧函数"
        deprecated={true}
        deprecatedMessage="请使用 newFunction 替代"
      />
    );
    
    expect(screen.getByText('已废弃')).toBeInTheDocument();
    expect(screen.getByText(/请使用 newFunction 替代/)).toBeInTheDocument();
  });

  it('shows version badge when since provided', () => {
    render(
      <ApiDoc
        name="newFunction"
        type="function"
        description="新函数"
        since="2.0.0"
      />
    );
    
    expect(screen.getByText('v2.0.0')).toBeInTheDocument();
  });

  it('displays required and optional parameters correctly', () => {
    render(
      <ApiDoc
        name="createRouter"
        type="function"
        description="创建路由器实例"
        parameters={mockParameters}
      />
    );
    
    const requiredBadges = screen.getAllByText('是');
    const optionalBadges = screen.getAllByText('否');
    
    expect(requiredBadges).toHaveLength(1);
    expect(optionalBadges).toHaveLength(1);
  });

  it('shows default values for parameters', () => {
    render(
      <ApiDoc
        name="createRouter"
        type="function"
        description="创建路由器实例"
        parameters={mockParameters}
      />
    );
    
    expect(screen.getByText('default')).toBeInTheDocument();
  });

  it('displays example count when multiple examples', () => {
    render(
      <ApiDoc
        name="createRouter"
        type="function"
        description="创建路由器实例"
        examples={mockExamples}
      />
    );
    
    expect(screen.getByText('(2 个示例)')).toBeInTheDocument();
  });
});