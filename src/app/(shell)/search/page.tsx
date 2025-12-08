// src/app/(shell)/search/page.tsx
'use client';

import { Suspense } from 'react';
import SearchResults from '@/components/shared/SearchResults';
import { Skeleton } from '@/components/ui/Skeloton';

function SearchResultsSkeleton() {
  return (
    <div className="w-full bg-white rounded-md border border-gray-200 p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-7 w-64" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-md">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchResultsSkeleton />}>
      <SearchResults />
    </Suspense>
  );
}