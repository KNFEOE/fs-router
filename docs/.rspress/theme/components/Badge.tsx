import React from 'react';

interface BadgeProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ type = 'info', children }) => {
  const getTypeClass = (type: string) => {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (type) {
      case 'success':
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'warning':
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case 'danger':
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    }
  };

  return (
    <span className={getTypeClass(type)}>
      {children}
    </span>
  );
};

export default Badge;