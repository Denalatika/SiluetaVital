import React, { createContext, useContext, useState, useEffect } from 'react';
import { productosData as initialData } from '../data/productos';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    if (!savedProducts) return initialData;
    
    try {
      const parsed = JSON.parse(savedProducts);
      
      // MIGRACIÓN SUAVE: En lugar de resetear todo y perder el estado 'hidden', 
      // actualizamos solo las rutas y precios si detectamos que son antiguos.
      const hasOldData = parsed.some(p => 
        (p.imagen && (p.imagen.includes(' ') || p.imagen.includes('Imagenes'))) || 
        !p.precio || 
        p.precio === 0
      );
      
      if (hasOldData) {
        console.log("Actualizando datos antiguos preservando estados...");
        return parsed.map(p => {
          let updated = { ...p };
          if (p.imagen && (p.imagen.includes(' ') || p.imagen.includes('Imagenes'))) {
            updated.imagen = p.imagen.replace(/ /g, '_').replace('Imagenes_Recortadas', 'images').replace('Imagenes_Nuevas', 'images');
          }
          if (p.imagenDetalle && (p.imagenDetalle.includes(' ') || p.imagenDetalle.includes('Imagenes'))) {
            updated.imagenDetalle = p.imagenDetalle.replace(/ /g, '_').replace('Imagenes_Recortadas', 'images').replace('Imagenes_Nuevas', 'images');
          }
          if (!p.precio || p.precio === 0) {
            updated.precio = 250;
          }
          return updated;
        });
      }
      return parsed;
    } catch (e) {
      return initialData;
    }
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...updatedProduct, id } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const bulkActions = (ids, action) => {
    if (action === 'delete') {
      const idsStrings = ids.map(id => String(id));
      setProducts((prev) => prev.filter((p) => !idsStrings.includes(String(p.id))));
    } else if (action === 'hide') {
      setProducts((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, hidden: true } : p))
      );
    } else if (action === 'show') {
      setProducts((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, hidden: false } : p))
      );
    }
  };

  const moveProduct = (id, direction) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;

      const newProducts = [...prev];
      const product = newProducts.splice(index, 1)[0];

      if (direction === 'top') {
        newProducts.unshift(product);
      } else if (direction === 'bottom') {
        newProducts.push(product);
      } else if (direction === 'up' && index > 0) {
        newProducts.splice(index - 1, 0, product);
      } else if (direction === 'down' && index < prev.length - 1) {
        newProducts.splice(index + 1, 0, product);
      } else {
        // Si no se puede mover arriba/abajo, lo devolvemos a su sitio
        newProducts.splice(index, 0, product);
      }
      return newProducts;
    });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, bulkActions, moveProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
