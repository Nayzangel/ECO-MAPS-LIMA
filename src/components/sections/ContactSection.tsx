import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Building, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    district: 'San Juan de Lurigancho',
    inquiryType: 'Consultoría Ambiental',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <section id="contacto" className="py-20 bg-slate-950 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <PhoneCall className="w-3.5 h-3.5" />
            Mesa de Enlace & Soporte Técnico
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Conecte con el equipo técnico de <span className="text-emerald-400">ECO-MAP LIMA</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            ¿Representa a una municipalidad distrital, consultora ambiental, universidad o colectivo ciudadano? 
            Contáctenos para integraciones, capacitaciones o demostraciones técnicas personalizadas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Institutional Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Centro de Operaciones Lima</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Plataforma de inteligencia y motor de decisión ambiental para los 43 distritos de Lima Metropolitana y la Provincia Constitucional del Callao.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">Área de Cobertura:</strong>
                    <span className="text-slate-400">Lima Metropolitana (Centro, Norte, Este, Sur) y Callao.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <Mail className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">Correo Institucional:</strong>
                    <span className="text-slate-400">contacto@ecomap-lima.pe</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <Building className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">Convenios y Municipalidades:</strong>
                    <span className="text-slate-400">institucional@ecomap-lima.pe</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Asistencia para Proyectos de Grado y Tesis
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Ofrecemos soporte y acceso a los datasets históricos DEMO para investigadores universitarios e ingenieros ambientales en formación.
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT: Modern Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">¡Mensaje Enviado con Éxito!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Gracias por comunicarse con ECO-MAP LIMA. Nuestro equipo técnico evaluará su requerimiento para {formData.district} y le responderá a la brevedad.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        organization: '',
                        district: 'San Juan de Lurigancho',
                        inquiryType: 'Consultoría Ambiental',
                        message: ''
                      });
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">Nombre y Apellidos *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ing. Carlos Mendoza"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">Correo Electrónico Institucional *</label>
                      <input
                        type="email"
                        required
                        placeholder="cmendoza@empresa.pe"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">Institución / Empresa / Colectivo</label>
                      <input
                        type="text"
                        placeholder="Consultora Ambiental / Municipalidad"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">Distrito de Interés</label>
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="San Juan de Lurigancho">San Juan de Lurigancho</option>
                        <option value="Carabayllo">Carabayllo</option>
                        <option value="Ate Vitarte">Ate Vitarte</option>
                        <option value="Cercado de Lima">Cercado de Lima</option>
                        <option value="San Borja">San Borja</option>
                        <option value="Miraflores">Miraflores</option>
                        <option value="Callao">Callao</option>
                        <option value="Villa María del Triunfo">Villa María del Triunfo</option>
                        <option value="Otro Distrito">Otro Distrito de Lima</option>
                      </select>
                    </div>

                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Tipo de Solicitud</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Consultoría Ambiental">Auditoría & Consultoría Ambiental</option>
                      <option value="Convenio Municipal">Convenio Municipal / Fiscalización Local</option>
                      <option value="Integración de Sensores">Integración de Red Propia de Sensores IoT</option>
                      <option value="Licenciamiento Pro">Demostración del Plan Profesional</option>
                      <option value="Consulta General">Consulta de Investigación o Ciudadana</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Detalle de la Consulta *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describa su proyecto, necesidad de modelamiento o requerimiento territorial..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Consulta Técnica
                  </button>

                  <p className="text-[10px] text-slate-500 text-center">
                    Garantizamos la confidencialidad de la información y los datos de monitoreo según la Ley N° 29733 (Protección de Datos Personales).
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
