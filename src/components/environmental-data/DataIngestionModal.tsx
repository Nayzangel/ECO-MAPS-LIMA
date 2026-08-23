import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  UploadCloud, 
  ShieldCheck, 
  Database,
  HelpCircle
} from 'lucide-react';
import { EnvironmentalRecord } from '../../types/environmentalData';
import { ManualDataForm } from './ManualDataForm';
import { FileImporterTab } from './FileImporterTab';

interface DataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecord: (record: EnvironmentalRecord) => void;
  onBatchImport: (records: EnvironmentalRecord[]) => void;
  existingRecords?: EnvironmentalRecord[];
}

export const DataIngestionModal: React.FC<DataIngestionModalProps> = ({
  isOpen,
  onClose,
  onSaveRecord,
  onBatchImport,
  existingRecords = []
}) => {
  const [activeTab, setActiveTab] = useState<'MANUAL' | 'IMPORT'>('MANUAL');

  if (!isOpen) return null;

  const handleManualSave = (record: EnvironmentalRecord) => {
    onSaveRecord(record);
    onClose();
  };

  const handleBatchCommit = (records: EnvironmentalRecord[]) => {
    onBatchImport(records);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* HEADER */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Ingreso de Datos Ambientales
              </h3>
              <p className="text-slate-400 text-xs">
                Incorpore registros mediante formulario o importación de archivos con validación automática
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS SWITCHER */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('MANUAL')}
            className={`pb-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'MANUAL'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Formulario Individual</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('IMPORT')}
            className={`pb-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'IMPORT'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Importación por Archivo (Excel / CSV / JSON / GeoJSON)</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === 'MANUAL' ? (
            <ManualDataForm
              onSaveRecord={handleManualSave}
              existingRecords={existingRecords}
              onCancel={onClose}
            />
          ) : (
            <FileImporterTab
              onCommitImport={handleBatchCommit}
              existingRecords={existingRecords}
              onCancel={onClose}
            />
          )}
        </div>

      </div>
    </div>
  );
};
