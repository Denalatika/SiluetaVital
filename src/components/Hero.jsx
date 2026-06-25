import React from 'react';
import { Link } from 'react-router-dom';
import { createSupportWhatsAppLink } from '../utils/whatsapp';

const Hero = () => {
  // COMENTARIO: Cambiar textos de la sección princial, colores y la imagen de ilustración.
  const WHATSAPP_LINK = "https://wa.link/712v4z"; // Reemplaza con enlace de WhatsApp

  return (
    <section id="inicio" className="relative bg-background pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="text-center lg:text-left z-10">
            <div className="inline-block bg-primary-light/50 text-primary-dark font-medium px-4 py-1.5 rounded-full text-sm mb-6">
              Tu opción natural y confiable
            </div>
            {/* TEXTOS: Cambia los títulos aquí */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6">
              Bienestar natural para tu <span className="text-accent">día a día</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Encuentra productos naturistas seleccionados para apoyar tu cuerpo, complementar tu buena alimentación y sentirte mejor de manera natural cada día.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <a href={createSupportWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-semibold rounded-md hover:bg-accent-dark transition-all hover-lift text-center">
                Asesoría por WhatsApp
              </a>
              <Link to="/productos" className="w-full sm:w-auto px-8 py-4 bg-white text-accent border border-accent font-semibold rounded-md hover:bg-accent/10 transition-all hover-lift text-center">
                Ver productos
              </Link>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-lg lg:max-w-full animate-float">
            {/* IMAGEN DE ILUSTRACIÓN HERO: Cambiar por la ruta real si prefieres otra */}
            <div className="relative rounded-3xl overflow-hidden aspect-square bg-secondary-light shadow-xl hover-lift">
              {/* placeholder para imagen, estoy usando la que generé por IA */}
              <img
                src="/images/hero_realistic.webp"
                alt="Bienestar natural y yoga"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Elemento decorativo: Promo de Mayoreo */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-accent/20 animate-pulseSoft z-20">
              <div className="bg-accent text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-md animate-bounce">5+</div>
              <div className="text-left">
                <p className="text-xs font-black text-accent uppercase tracking-wider">¡MAYOREO!</p>
                <p className="text-[11px] font-bold text-gray-800 leading-tight">Envío GRATIS + 10% OFF</p>
              </div>
            </div>

            {/* Elemento decorativo */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg flex items-center space-x-3 hidden md:flex">
              <div className="bg-primary/20 p-2 rounded-full text-primary-dark font-bold">100%</div>
              <p className="text-sm font-medium text-gray-800 leading-tight">Enfoque<br />Natural</p>
            </div>
          </div>

        </div>
      </div>

      {/* Fondo decorativo vector */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-secondary/30 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
