import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  isLoading?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  action,
  isLoading = false
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
              )}
            </div>
            {action && (
              action.href ? (
                <Button variant="primary" href={action.href}>
                  {action.label}
                </Button>
              ) : (
                <Button variant="primary" onClick={action.onClick}>
                  {action.label}
                </Button>
              )
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default PageLayout; 