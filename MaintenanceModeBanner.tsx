import React from 'react';
import { Wrench, ShieldAlert } from 'lucide-react';

interface Props {
  isMaintenance: boolean;
  announcementText?: string;
}

export const MaintenanceModeBanner: React.FC<Props> = ({ isMaintenance, announcementText }) => {
  if (!isMaintenance && !announcementText) return null;

  return (
    <div className="space-y-1">
      {isMaintenance && (
        <div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-black flex items-center justify-center space-x-2 shadow-md">
          <Wrench className="w-4 h-4 animate-spin shrink-0" />
          <span>SYSTEM NOTICE: UmarMart is under scheduled database optimization. Catalog viewing remains active.</span>
        </div>
      )}

      {announcementText && !isMaintenance && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-blue-100 px-4 py-1.5 text-xs font-bold text-center border-b border-blue-800/40 flex items-center justify-center space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{announcementText}</span>
        </div>
      )}
    </div>
  );
};
