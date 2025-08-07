import React, { useState } from 'react';
import CodeExample from './CodeExample';
import Badge from './Badge';

interface Parameter {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
}

interface ApiDocProps {
  name: string;
  type: string;
  description: string;
  parameters?: Parameter[];
  returns?: string;
  examples?: string[];
  since?: string;
  deprecated?: boolean;
  deprecatedMessage?: string;
}

const ApiDoc: React.FC<ApiDocProps> = ({
  name,
  type,
  description,
  parameters = [],
  returns,
  examples = [],
  since,
  deprecated = false,
  deprecatedMessage
}) => {
  const [activeExample, setActiveExample] = useState(0);

  const getTypeColor = (type: string): 'info' | 'success' | 'warning' | 'danger' => {
    if (type.includes('function') || type.includes('Function')) return 'info';
    if (type.includes('string') || type.includes('number') || type.includes('boolean')) return 'success';
    if (type.includes('object') || type.includes('Object')) return 'warning';
    return 'info';
  };

  return (
    <div className="api-doc-container">
      <div className="api-doc-header">
        <div className="api-doc-title">
          <h3 className="api-doc-name">
            {name}
            {deprecated && (
              <Badge type="danger">已废弃</Badge>
            )}
            {since && (
              <Badge type="info">v{since}</Badge>
            )}
          </h3>
          <Badge type={getTypeColor(type)}>
            {type}
          </Badge>
        </div>
        
        <div className="api-doc-description">
          <p>{description}</p>
          {deprecated && deprecatedMessage && (
            <div className="api-doc-deprecated">
              <strong>⚠️ 废弃警告:</strong> {deprecatedMessage}
            </div>
          )}
        </div>
      </div>

      {parameters.length > 0 && (
        <div className="api-doc-section">
          <h4 className="api-doc-section-title">参数</h4>
          <div className="api-doc-parameters">
            <table className="api-doc-table">
              <thead>
                <tr>
                  <th>参数名</th>
                  <th>类型</th>
                  <th>必填</th>
                  <th>默认值</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((param, index) => (
                  <tr key={index}>
                    <td>
                      <code className="api-doc-param-name">
                        {param.name}
                      </code>
                    </td>
                    <td>
                      <code className="api-doc-param-type">
                        {param.type}
                      </code>
                    </td>
                    <td>
                      {param.required ? (
                        <Badge type="danger">是</Badge>
                      ) : (
                        <Badge type="success">否</Badge>
                      )}
                    </td>
                    <td>
                      {param.default ? (
                        <code className="api-doc-param-default">
                          {param.default}
                        </code>
                      ) : (
                        <span className="api-doc-param-none">-</span>
                      )}
                    </td>
                    <td className="api-doc-param-description">
                      {param.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {returns && (
        <div className="api-doc-section">
          <h4 className="api-doc-section-title">返回值</h4>
          <div className="api-doc-returns">
            <code className="api-doc-return-type">{returns}</code>
          </div>
        </div>
      )}

      {examples.length > 0 && (
        <div className="api-doc-section">
          <h4 className="api-doc-section-title">
            使用示例
            {examples.length > 1 && (
              <span className="api-doc-example-count">
                ({examples.length} 个示例)
              </span>
            )}
          </h4>
          
          {examples.length > 1 && (
            <div className="api-doc-example-tabs">
              {examples.map((_, index) => (
                <button
                  key={index}
                  className={`api-doc-example-tab ${activeExample === index ? 'active' : ''}`}
                  onClick={() => setActiveExample(index)}
                >
                  示例 {index + 1}
                </button>
              ))}
            </div>
          )}
          
          <div className="api-doc-examples">
            <CodeExample
              language="typescript"
              code={examples[activeExample]}
              showCopy={true}
              showLineNumbers={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDoc;