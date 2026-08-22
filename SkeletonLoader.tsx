import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
      <div className="w-full h-44 bg-slate-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
      </div>
      <div className="pt-2 flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-1/4" />
        <div className="h-8 bg-slate-200 rounded-xl w-24" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded-xl w-full flex items-center px-4 space-x-4">
          <div className="h-4 bg-slate-200 rounded w-1/6" />
          <div className="h-4 bg-slate-200 rounded w-2/6" />
          <div className="h-4 bg-slate-200 rounded w-2/6" />
          <div className="h-4 bg-slate-200 rounded w-1/6" />
        </div>
      ))}
    </div>
  );
};

export const BannerSkeleton: React.FC = () => {
  return (
    <div className="w-full h-64 bg-slate-200 rounded-3xl animate-pulse flex items-center justify-center">
      <div className="space-y-3 text-center w-2/3">
        <div className="h-6 bg-slate-300 rounded w-1/2 mx-auto" />
        <div className="h-4 bg-slate-300 rounded w-3/4 mx-auto" />
      </div>
    </div>
  );
};
