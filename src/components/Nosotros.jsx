import React from 'react';

const Nosotros = () => {
  return (
    <section id="nosotros" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-2xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            <div className="text-white">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                Sobre Nosotros
              </h2>
              {/* COMENTARIO: Cambiar el texto de nosotros si es necesario */}
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                Silueta Vital nace de la pasión por acercar el bienestar natural a más personas. Creemos firmemente que la naturaleza nos brinda las herramientas necesarias para complementar nuestra salud y mejorar nuestra calidad de vida de forma gentil.
              </p>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Nuestro compromiso es ofrecerte atención cercana, escucharte y ayudarte a encontrar la opción más adecuada con productos confiables y de calidad. Tu equilibrio físico es nuestra principal motivación.
              </p>
              <div className="flex items-center space-x-4">
                <div className="h-0.5 w-12 bg-accent"></div>
                <span className="font-semibold text-white tracking-wider uppercase text-sm">Tu bienestar, nuestra prioridad</span>
              </div>
            </div>

            <div className="relative animate-float" style={{ animationDelay: "0.5s" }}>
              {/* IMAGEN SOBRE NOSOTROS: Cambiar ruta */}
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-primary/30 rotate-3 transform transition-transform hover:rotate-0 duration-500 shadow-xl border-4 border-white/10 hover:shadow-2xl">
                <img
                  src="/images/nosotros_realistic.webp"
                  alt="Experta en bienestar natural en Silueta Vital"
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                />
              </div>
            </div>

          </div>

          {/* Círculos decorativos */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-light rounded-full opacity-10 blur-2xl animate-pulseSoft"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white rounded-full opacity-5 blur-2xl animate-pulseSoft" style={{ animationDelay: "1.5s" }}></div>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;
