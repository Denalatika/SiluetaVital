import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonios = () => {
  // COMENTARIO: Cambiar testimonios reales aquí
  const testimoniosData = [
    {
      id: 1,
      name: "María Gómez",
      text: "Muy buena atención. Me orientaron con una gran amabilidad y me recomendaron lo que mejor se ajustaba a lo que buscaba. Los productos son de gran calidad.",
      role: "Cliente Frecuente"
    },
    {
      id: 2,
      name: "Juan Carlos R.",
      text: "Encontré justo lo que necesitaba para complementar mi rutina. La entrega fue sencilla y me explicaron muy bien cómo integrar el suplemento en mi día a día.",
      role: "Nuevo Cliente"
    },
    {
      id: 3,
      name: "Elena Torres",
      text: "Se nota la preocupación por el bienestar del cliente. No intentan venderte por vender, sino realmente sugerirte algo que apoye tu salud natural.",
      role: "Cliente Destacada"
    },
    {
      id: 4,
      name: "Rosa M.",
      text: "¡Excelente servicio al cliente! Me explicaron a detalle cómo usar el kit integral y la verdad he notado resultados positivos desde las primeras semanas.",
      role: "Cliente Satisfecha"
    },
    {
      id: 5,
      name: "Pedro Gutiérrez",
      text: "Llevaba mucho tiempo buscando un sitio de confianza. El envío fue rápido y los productos llegaron en perfecto estado. 100% recomendados.",
      role: "Nuevo Cliente"
    },
    {
      id: 6,
      name: "Ana L.",
      text: "Me gusta mucho que siempre están al pendiente por WhatsApp para resolver dudas. El trato es muy humano y los suplementos son de la mejor calidad.",
      role: "Cliente VIP"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La confianza y tranquilidad de quienes nos eligen es nuestro mejor respaldo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimoniosData.map((test) => (
            <div key={test.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:rotate-1">
              <Quote className="absolute top-8 right-8 w-12 h-12 text-secondary-light opacity-50" />
              
              <div className="flex space-x-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-8 italic relative z-10 min-h-[100px]">
                "{test.text}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-light/30 rounded-full flex items-center justify-center text-primary-dark font-bold text-xl mr-4">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{test.name}</h4>
                  <p className="text-sm text-gray-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonios;
