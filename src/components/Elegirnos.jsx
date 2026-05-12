import React from 'react';
import { Leaf } from 'lucide-react';

const Elegirnos = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative order-2 lg:order-1 animate-float">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-secondary-light transition-transform hover:scale-105 duration-500">
              {/* IMAGEN DECORATIVA: Cambiar */}
              <img 
                src="/images/botanical_realistic.webp" 
                alt="Ingredientes naturales y botánicos de Silueta Vital" 
                className="w-full h-auto object-cover transform scale-100 hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary rounded-full hidden md:block opacity-20 animate-pulseSoft"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary rounded-full hidden md:block opacity-50 animate-pulseSoft" style={{animationDelay: "1s"}}></div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center space-x-2 text-primary font-bold mb-4">
              <Leaf className="w-5 h-5" />
              <span>Nuestra Promesa</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              ¿Por qué confiar en <br/>
              <span className="text-primary">Silueta Vital?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              No solo vendemos productos, te ofrecemos un acompañamiento enfocado en la mejora de tus hábitos y tu bienestar físico.
            </p>

            <div className="space-y-6">
              {[
                { title: "Selección Cuidadosa", desc: "Cada producto en nuestro catálogo ha sido elegido por sus ingredientes y beneficios reales." },
                { title: "Asesoría Cercana", desc: "Respondemos a tus dudas y te sugerimos opciones basadas en lo que realmente buscas." },
                { title: "Transparencia Total", desc: "Creemos en el poder de la naturaleza, sin promesas exageradas, solo apoyo genuino." }
              ].map((item, idx) => (
                <div key={idx} className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Elegirnos;
