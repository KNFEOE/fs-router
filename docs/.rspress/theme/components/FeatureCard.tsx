import React from 'react';

interface FeatureCardProps {
  icon?: string;
  title: string;
  description: string;
  link?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, link }) => {
  const CardContent = (
    <div className="rspress-home-feature">
      {icon && (
        <div className="text-2xl mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block no-underline">
        {CardContent}
      </a>
    );
  }

  return CardContent;
};

export default FeatureCard;