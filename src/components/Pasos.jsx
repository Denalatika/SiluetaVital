import React from 'react';
import { Search, ListChecks, MessageCircle } from 'lucide-react';

const Pasos = () => {
  const steps = [
    {
      num: "01",
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Explora los productos",
      desc: "Revisa nuestro catálogo y encuentra lo que mejor se adapte a tus rutinas de bienestar."
    },
    {
      num: "02",
      icon: <ListChecks className="w-8 h-8 text-primary" />,
      title: "Elige tus opciones",
      desc: "Selecciona los complementos naturistas que te interesen y anota sus nombres."
    },
    {
      num: "03",
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Contáctanos",
      desc: "Envíanos un mensaje por WhatsApp para confirmar existencias, resolver dudas y preparar tu pedido."
    }
  ];

  return (
    <section className="py-20 bg-secondary-light/40 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Cómo Comprar?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hacer un pedido es rápido, fácil y con atención 100% personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Línea conectora decorativa desktop */}
          <div className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-0.5 bg-gray-200 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-md border border-gray-50 flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {step.num}
                </div>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pasos;
