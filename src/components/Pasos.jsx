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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">¿Cómo Comprar?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hacer un pedido es rápido, fácil y con atención 100% personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-start text-left group hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center space-x-4 mb-4 w-full">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center relative group-hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {step.num}
                  </div>
                  {React.cloneElement(step.icon, { className: "w-6 h-6 text-primary" })}
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-serif leading-tight">{step.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pasos;
