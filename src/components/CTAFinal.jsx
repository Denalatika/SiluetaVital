import React from 'react';
import { MessageCircle } from 'lucide-react';
import { createSupportWhatsAppLink } from '../utils/whatsapp';

const CTAFinal = () => {
  const WHATSAPP_LINK = createSupportWhatsAppLink();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        <div className="bg-secondary-light/50 p-10 md:p-16 rounded-[3rem] border border-secondary border-opacity-50 shadow-sm relative overflow-hidden">

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary leading-tight mb-6">
              Encuentra una opción natural <br className="hidden md:block" />
              para tu <span className="text-accent">bienestar</span>.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
              Contáctanos hoy mismo. Estamos aquí para orientarte y ayudarte a descubrir los productos que complementen tu día a día.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-accent text-white font-semibold rounded-md hover:bg-accent-dark transition-all hover-lift text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>

          {/* ILUSTRACION DECORATIVA DE FONDO: Cambiar ruta */}
          <div className="absolute -bottom-20 -right-20 opacity-20 transform scale-150 pointer-events-none mix-blend-multiply">
            <img
              src="/images/botanical_realistic.webp"
              alt="Fondo decorativo"
              className="w-96 h-96 object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTAFinal;
