import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  FileCode, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { 
  EnvironmentalRecord, 
  DataOrigin, 
  IngestionPreviewResult 
} from '../../types/environmentalData';
import { 
  parseExcelData, 
  parseCSVData, 
  parseJSONData, 
  downloadExcelTemplate, 
  downloadCSVTemplate, 
  downloadJSONTemplate, 
  downloadGeoJSONTemplate 
} from '../../utils/environmentalValidator';
import { DataOriginBadge } from './DataOriginBadge';
import { ReliabilityBadge } from './ReliabilityBadge';

interface FileImporterTabProps {
  onCommitImport: (records: EnvironmentalRecord[]) => void;
  existingRecords?: EnvironmentalRecord[];
  onCancel?: () => void;
}

export const FileImporterTab: React.FC<FileImporterTabProps> = ({
  onCommitImport,
  existingRecords = [],
  onCancel
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<DataOrigin>('USUARIO');
  const [importMode, setImportMode] = useState<'FILE' | 'PASTE'>('FILE');
  const [pastedText, setPastedText] = useState('');
  const [pasteType, setPasteType] = useState<'JSON' | 'CSV'>('JSON');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<IngestionPreviewResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const fileName = file.name.toLowerCase();
      let result: IngestionPreviewResult;

      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        result = parseExcelData(buffer, selectedOrigin, existingRecords);
        result.fileName = file.name;
      } else if (fileName.endsWith('.csv')) {
        const text = await file.text();
        result = parseCSVData(text, selectedOrigin, existingRecords);
        result.fileName = file.name;
      } else if (fileName.endsWith('.geojson') || (fileName.endsWith('.json') && fileName.includes('geo'))) {
        const text = await file.text();
        result = parseJSONData(text, selectedOrigin, existingRecords);
        result.fileName = file.name;
      } else if (fileName.endsWith('.json')) {
        const text = await file.text();
        result = parseJSONData(text, selectedOrigin, existingRecords);
        result.fileName = file.name;
      } else {
        throw new Error('Formato no soportado. Por favor suba un archivo .xlsx, .csv, .json o .geojson.');
      }

      if (result.records.length === 0) {
        throw new Error('El archivo no contiene filas de datos legibles.');
      }

      setPreviewResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al procesar el archivo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPasted = () => {
    if (!pastedText.trim()) {
      setErrorMessage('Por favor pegue texto en formato JSON o CSV.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      let result: IngestionPreviewResult;
      if (pasteType === 'JSON') {
        result = parseJSONData(pastedText, selectedOrigin, existingRecords);
        result.fileName = 'Texto_JSON_Pegado';
      } else {
        result = parseCSVData(pastedText, selectedOrigin, existingRecords);
        result.fileName = 'Texto_CSV_Pegado';
      }

      if (result.records.length === 0) {
        throw new Error('No se detectaron registros válidos en el texto ingresado.');
      }

      setPreviewResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de parseo en el texto ingresado.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommit = () => {
    if (!previewResult || previewResult.records.length === 0) return;
    onCommitImport(previewResult.records);
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* 1. ORIGIN SELECTION FOR BATCH */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <label className="text-xs font-extrabold text-white uppercase tracking-wider">
              Categoría de Origen del Lote a Importar *
            </label>
          </div>
          <DataOriginBadge origin={selectedOrigin} size="sm" />
        </div>

        <p className="text-[11px] text-slate-400">
          Seleccione el origen exacto de los datos del archivo. Todos los registros importados llevarán esta etiqueta para evitar mezclas con datos oficiales o simulados.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['OFICIAL', 'USUARIO', 'DEMO', 'MODELADO', 'SIMULADO'] as DataOrigin[]).map((org) => (
            <button
              type="button"
              key={org}
              onClick={() => setSelectedOrigin(org)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                selectedOrigin === org
                  ? 'bg-slate-800 border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <DataOriginBadge origin={org} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {/* 2. TEMPLATES DOWNLOAD BAR */}
      <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-white font-bold text-xs">
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Plantillas de Importación con Muestras de Lima</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Descargue un archivo base con cabeceras y coordenadas correctas de Lima Metropolitana:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={downloadExcelTemplate}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            type="button"
            onClick={downloadCSVTemplate}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>CSV (.csv)</span>
          </button>
          <button
            type="button"
            onClick={downloadJSONTemplate}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>
          <button
            type="button"
            onClick={downloadGeoJSONTemplate}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>GeoJSON</span>
          </button>
        </div>
      </div>

      {/* 3. INPUT METHOD SWITCH (FILE UPLOAD VS RAW PASTE) */}
      <div className="flex border-b border-slate-800">
        <button
          type="button"
          onClick={() => { setImportMode('FILE'); setPreviewResult(null); }}
          className={`pb-2.5 px-4 font-bold transition-all border-b-2 cursor-pointer ${
            importMode === 'FILE'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Subir Archivo (.xlsx / .csv / .json / .geojson)
        </button>
        <button
          type="button"
          onClick={() => { setImportMode('PASTE'); setPreviewResult(null); }}
          className={`pb-2.5 px-4 font-bold transition-all border-b-2 cursor-pointer ${
            importMode === 'PASTE'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Pegar Código (JSON / CSV)
        </button>
      </div>

      {/* 4. DRAG & DROP OR FILE UPLOADER */}
      {importMode === 'FILE' ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-emerald-400/80 bg-slate-950/70 hover:bg-slate-900/60 rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.json,.geojson"
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-emerald-500/40 text-emerald-400 transition-all shadow-lg">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-extrabold text-white">
              Arrastre y suelte su archivo aquí, o <span className="text-emerald-400 underline">explore en su equipo</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Formatos soportados: <strong className="text-slate-300">Excel (.xlsx/.xls), CSV (.csv), JSON (.json), GeoJSON (.geojson)</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Auto-detección de columnas</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Validación instantánea</span>
          </div>
        </div>
      ) : (
        /* RAW PASTE AREA */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300">Pegue su contenido aquí:</span>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-400">Formato:</label>
              <button
                type="button"
                onClick={() => setPasteType('JSON')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                  pasteType === 'JSON' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'
                }`}
              >
                JSON / GeoJSON
              </button>
              <button
                type="button"
                onClick={() => setPasteType('CSV')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                  pasteType === 'CSV' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'
                }`}
              >
                CSV
              </button>
            </div>
          </div>

          <textarea
            rows={7}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder={
              pasteType === 'JSON'
                ? `[\n  {\n    "fecha": "2026-08-23",\n    "hora": "09:00",\n    "latitud": -12.0464,\n    "longitud": -77.0428,\n    "parametro": "PM2.5",\n    "valor": 48.2,\n    "unidad": "µg/m³"\n  }\n]`
                : `fecha,hora,latitud,longitud,distrito,parametro,valor,unidad,equipo,fuente\n2026-08-23,09:00,-12.0464,-77.0428,Lima Cercado,PM2.5,48.2,µg/m³,Sensor IoT,Red Ciudadana`
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-400"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleProcessPasted}
              disabled={isProcessing || !pastedText.trim()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analizar y Validar Texto</span>
            </button>
          </div>
        </div>
      )}

      {/* ERROR FEEDBACK */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block text-xs">Error de Importación:</span>
            <p className="text-[11px] mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 5. PREVIEW & VALIDATION SUMMARY SECTION */}
      {previewResult && (
        <div className="space-y-4 animate-in fade-in zoom-in-95">
          
          {/* Validation Metrics Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-extrabold text-white">Resultado de Validación Automática</h4>
                  <span className="font-mono text-[11px] text-slate-400">({previewResult.fileName || previewResult.fileFormat})</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Total de filas procesadas: <strong className="text-white">{previewResult.totalParsed}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Confiabilidad Promedio:</span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-extrabold text-xs">
                  {previewResult.avgReliability}%
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400">Válidos (Sin Errores)</span>
                <span className="font-mono font-extrabold text-emerald-400 text-base">{previewResult.validCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400">Con Advertencias</span>
                <span className="font-mono font-extrabold text-amber-400 text-base">{previewResult.warningCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400">Rechazados / Errores</span>
                <span className="font-mono font-extrabold text-rose-400 text-base">{previewResult.rejectedCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400">Duplicados</span>
                <span className="font-mono font-extrabold text-indigo-400 text-base">{previewResult.duplicateCount}</span>
              </div>
            </div>
          </div>

          {/* Table Preview */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-300 text-xs">Vista Previa de Registros a Guardar:</span>
              <span className="text-[11px] text-slate-400">Mostrando {previewResult.records.length} registros</span>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 bg-slate-950">
              {previewResult.records.map((r, i) => (
                <div key={i} className="p-3 hover:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <DataOriginBadge origin={r.origen} size="sm" />
                    <span className="font-mono text-slate-300">{r.fecha} {r.hora}</span>
                    <span className="text-slate-400 font-semibold">{r.distrito}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {r.parametro}: <strong className="text-emerald-400 font-mono">{r.valor} {r.unidad}</strong>
                    </span>
                    <ReliabilityBadge reliability={r.reliability} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Commit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPreviewResult(null)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl cursor-pointer"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={handleCommit}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar e Incorporar {previewResult.records.length} Registros</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
