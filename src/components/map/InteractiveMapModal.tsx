import React from 'react';
import { StationData, ViewMode } from '../../types';
import { EcoMapLeaflet } from './EcoMapLeaflet';

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStationId?: string;
  onOpenAnalysisWithStation?: (station: StationData) => void;
  viewMode: ViewMode;
}

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  isOpen,
  onClose,
  selectedStationId,
  onOpenAnalysisWithStation,
  viewMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <EcoMapLeaflet
          selectedStationId={selectedStationId}
          onLaunchDecisionEngine={(station) => {
            if (onOpenAnalysisWithStation) {
              onOpenAnalysisWithStation(station);
            }
          }}
          viewMode={viewMode}
          isModal={true}
          onCloseModal={onClose}
        />
      </div>
    </div>
  );
};
