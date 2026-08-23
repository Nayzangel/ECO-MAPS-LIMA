import React from 'react';
import { Activity, ShieldCheck, MapPin, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        
        {/* TOP ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-white tracking-tight">ECO-MAP</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                    LIMA
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">Inteligencia Ambiental & Motor de Decisión</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              Plataforma de modelamiento y auditoría ambiental para Lima Metropolitana. 
              Transforma datos dispersos en decisiones prioritarias contrastadas con la normativa ambiental peruana.
            </p>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[11px] text-amber-300/90 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Aviso de Transparencia Técnica:</strong> Esta versión 1.0 opera con datos y modelos DEMO para demostración visual de arquitectura y flujo decisional.
              </span>
            </div>
          </div>

          {/* COL 2: Módulos del Sistema */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Módulos</h4>
            <ul className="space-y-2">
              <li><a href="#aire" className="hover:text-emerald-400 transition-colors">Calidad del Aire (ECA)</a></li>
              <li><a href="#ruido" className="hover:text-cyan-400 transition-colors">Ruido Acústico Urbano</a></li>
              <li><a href="#modelamiento" className="hover:text-indigo-400 transition-colors">Dispersión & Modelos</a></li>
              <li><a href="#fuentes" className="hover:text-teal-400 transition-colors">Catálogo de Fuentes</a></li>
              <li><a href="#como-funciona" className="hover:text-emerald-400 transition-colors">Motor de Decisión</a></li>
            </ul>
          </div>

          {/* COL 3: Normativa Peruana */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Normativa Aplicada</h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>D.S. N° 003-2017-MINAM (ECA Aire)</li>
              <li>D.S. N° 085-2003-PCM (ECA Ruido)</li>
              <li>R.M. N° 181-2016-MINAM (Índice INCA)</li>
              <li>Ley N° 28611 (Ley General del Ambiente)</li>
              <li>Ordenanzas MML de Zonificación</li>
            </ul>
          </div>

          {/* COL 4: Cobertura Territorial */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cobertura Lima</h4>
            <div className="flex flex-wrap gap-1 text-[10px]">
              {['San Juan de Lurigancho', 'Carabayllo', 'Ate Vitarte', 'Cercado de Lima', 'San Borja', 'Miraflores', 'Callao', 'Villa María del Triunfo', 'Puente Piedra'].map((d) => (
                <span key={d} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  {d}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} ECO-MAP LIMA | Plataforma de Inteligencia Ambiental Territorial. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-slate-300">Volver al Inicio</a>
            <span>•</span>
            <a href="#contacto" className="hover:text-slate-300">Privacidad y Términos</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
