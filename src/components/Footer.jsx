import React from 'react';
import { Leaf, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // COMENTARIO: Cambiar enlaces del footer
  const WHATSAPP_LINK = "https://wa.me/526311357128";
  const FACEBOOK_LINK = "https://www.facebook.com/naturistalagotita.mvv.3";
  const LOGO_TEXT = "Silueta Vital";

  return (
    <footer className="bg-primary text-white/90 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6">
              <img
                src="/images/logo_oficial.jpg"
                alt="Silueta Vital Oficial"
                className="h-16 w-auto rounded-lg"
              />
            </div>
            <div className="flex space-x-4">
              <a href={FACEBOOK_LINK} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors hover-lift">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors hover-lift">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm flex flex-col">
              <Link to="/" className="hover:text-primary transition-colors hover:translate-x-1 inline-block w-max">Inicio</Link>
              <Link to="/productos" className="hover:text-primary transition-colors hover:translate-x-1 inline-block w-max">Productos</Link>
              <Link to="/beneficios" className="hover:text-primary transition-colors hover:translate-x-1 inline-block w-max">Beneficios</Link>
              <Link to="/nosotros" className="hover:text-primary transition-colors hover:translate-x-1 inline-block w-max">Nosotros</Link>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex flex-col">
                <span className="text-gray-500 mb-1">WhatsApp</span>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-white font-medium">
                  +52 631 135 7128
                </a>
              </li>
              <li className="flex flex-col mt-4">
                <span className="text-gray-500 mb-1">Horario</span>
                <span className="text-gray-300">Lunes a Sábado<br />9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">NUESTRA PROMESA</h4>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <p className="text-xs text-white/80 leading-relaxed italic mb-2">
                "Nos comprometemos a brindar suplementos que entreguen todos los beneficios de la naturaleza, sin excepciones. Porque solo tienes un cuerpo."
              </p>
              <p className="text-xs text-white/90 leading-relaxed italic font-bold">
                Y lo que pones en él, debe contar.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {LOGO_TEXT}. Todos los derechos reservados.
          </p>
          <div className="text-sm text-white/50 flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
