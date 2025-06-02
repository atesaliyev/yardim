import React from 'react';
import Breadcrumb from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <Breadcrumb />
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-gray-500">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}