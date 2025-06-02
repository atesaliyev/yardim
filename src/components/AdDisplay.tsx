import React, { useEffect } from 'react';
import { useAdDisplayStore } from '../store/adDisplayStore';

interface AdDisplayProps {
  location: string;
  className?: string;
}

export default function AdDisplay({ location, className = '' }: AdDisplayProps) {
  const { ads, loading, fetchAds } = useAdDisplayStore();

  useEffect(() => {
    fetchAds([location]);
  }, [location, fetchAds]);

  if (loading || !ads[location]) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}>
        <p className="text-sm text-gray-500">Reklam Alanı</p>
      </div>
    );
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: ads[location] }}
    />
  );
}