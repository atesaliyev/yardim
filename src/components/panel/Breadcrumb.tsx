import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      <Link to="/panel" className="flex items-center hover:text-gray-900">
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => (
        <React.Fragment key={path}>
          <ChevronRight className="h-4 w-4" />
          <Link
            to={`/${paths.slice(0, index + 1).join('/')}`}
            className="capitalize hover:text-gray-900"
          >
            {path}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}