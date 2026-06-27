import React, { useState } from 'react';
import { Leaf, Apple, ShieldCheck, Heart, Sun, Smile, X } from 'lucide-react';

const Beneficios = () => {
  const [selectedBenefit, setSelectedBenefit] = useState(null);

  const beneficios = [
    {
      icon: <Apple className="w-6 h-6 text-primary-dark group-hover:animate-pulse" />,
      title: "Apoyo Digestivo",
      desc: "Opciones naturales que favorecen una digestión ligera y un buen tránsito intestinal.",
      extendedDesc: "El bienestar comienza en el interior. Un sistema digestivo saludable es la base para una correcta absorción de nutrientes, lo cual impacta directamente en tu energía diaria. Nuestros productos enfocados en el apoyo digestivo están formulados con extractos herbales, fibras naturales y probióticos que trabajan en armonía con tu cuerpo para reducir la inflamación, mejorar el tránsito y hacerte sentir ligero todos los días.",
      image: "/images/botanical_realistic.webp"
    },
    {
      icon: <Heart className="w-6 h-6 text-primary-dark group-hover:scale-125 transition-transform" />,
      title: "Bienestar Integral",
      desc: "Complementos para promover el equilibrio y un cuerpo saludable en el día a día.",
      extendedDesc: "Sentirse bien es más que la ausencia de malestar; es un estado de equilibrio constante. Ofrecemos complementos diseñados para fortalecer tu sistema inmunológico, mejorar tu vitalidad y mantener tu cuerpo protegido frente al estrés oxidativo. Una rutina que incluye nutrientes esenciales te permite disfrutar de tu vida al máximo y con la mejor actitud.",
      image: "/images/nosotros_realistic.webp"
    },
    {
      icon: <Leaf className="w-6 h-6 text-primary-dark group-hover:rotate-12 transition-transform" />,
      title: "Enfoque Natural",
      desc: "Ingredientes derivados de la naturaleza y herbolaria pura.",
      extendedDesc: "Creemos fielmente en el poder de la naturaleza. Por ello, seleccionamos suplementos que priorizan ingredientes de origen natural, extrayendo lo mejor de las plantas y raíces milenarias. Evitamos los componentes sintéticos innecesarios, apostando por fórmulas limpias que tu organismo puede reconocer y aprovechar de manera óptima.",
      image: "/images/botanical_realistic.webp"
    },
    {
      icon: <Sun className="w-6 h-6 text-primary-dark group-hover:text-yellow-500 transition-colors duration-500" />,
      title: "Variedad de Productos",
      desc: "Amplio catálogo para atender las diversas necesidades de la familia.",
      extendedDesc: "Cada persona es única y sus necesidades nutricionales también lo son. En nuestro catálogo encontrarás desde vitaminas y minerales esenciales, hasta fórmulas especializadas para el descanso, el control de peso o el cuidado de la piel. Así, aseguramos que toda tu familia tenga acceso a la opción ideal para su bienestar.",
      image: "/images/hero_realistic.webp"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-dark group-hover:-translate-y-1 transition-transform" />,
      title: "Opciones Confiables",
      desc: "Productos cuidadosamente seleccionados por su calidad y origen.",
      extendedDesc: "Tu salud no es un juego. Trabajamos exclusivamente con marcas y laboratorios que cumplen con estrictos estándares de calidad. Revisamos minuciosamente el origen de cada producto para garantizar que lo que consumes sea seguro, efectivo y verdaderamente beneficioso para tu salud a largo plazo.",
      image: "/images/nosotros_realistic.webp"
    },
    {
      icon: <Smile className="w-6 h-6 text-primary-dark group-hover:scale-125 transition-transform" />,
      title: "Atención Cercana",
      desc: "Te escuchamos y orientamos con amabilidad para que elijas lo mejor.",
      extendedDesc: "No estás solo en este camino hacia una vida más saludable. Nuestro equipo está comprometido a escucharte, entender tus necesidades específicas y brindarte recomendaciones honestas. Queremos que te sientas con la confianza de preguntar y descubrir junto a nosotros las opciones naturales que realmente cambiarán tu día a día.",
      image: "/images/botanical_realistic.webp"
    }
  ];

  return (
    <section id="beneficios" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">¿Por qué elegir un camino natural?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Incorporar productos naturistas es una forma excelente de complementar tu estilo de vida y favorecer la armonía física.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((ben, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedBenefit(ben)}
              className="bg-background p-8 rounded-2xl border border-gray-100 hover-lift hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-primary-light/30 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md">
                {ben.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-dark transition-colors font-serif">{ben.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{ben.desc}</p>
              <span className="text-primary font-medium text-sm flex items-center group-hover:translate-x-2 transition-transform duration-300">
                Saber más <span className="ml-1">→</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Información */}
      {selectedBenefit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Fondo oscuro */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setSelectedBenefit(null)}
          ></div>

          {/* Contenedor del Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row transform transition-all animate-in zoom-in-95 duration-300 max-h-[90vh]">

            {/* Imagen Lateral */}
            <div className="w-full md:w-2/5 h-48 md:h-auto relative bg-secondary-light">
              <img
                src={selectedBenefit.image}
                alt={selectedBenefit.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
            </div>

            {/* Contenido */}
            <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col overflow-y-auto">
              <button
                onClick={() => setSelectedBenefit(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100/80 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6 mt-2 md:mt-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  {selectedBenefit.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {selectedBenefit.title}
                </h3>
              </div>

              <div className="prose prose-green max-w-none text-gray-600 text-base md:text-lg leading-relaxed space-y-4">
                <p className="font-medium text-gray-800 text-lg">
                  {selectedBenefit.desc}
                </p>
                <p>
                  {selectedBenefit.extendedDesc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 text-left md:text-right">
                <button
                  onClick={() => setSelectedBenefit(null)}
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors hover-lift w-full md:w-auto"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Beneficios;
