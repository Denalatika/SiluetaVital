import React, { createContext, useContext, useState, useEffect } from 'react';
import { productosData as initialData } from '../data/productos';

const ProductContext = createContext();

// Función de sanitización para corregir rutas de imágenes viejas y precios
const sanitizeProducts = (currentProducts) => {
  const hasOldData = currentProducts.some(p => 
    (p.imagen && (p.imagen.includes(' ') || p.imagen.includes('Imagenes'))) || 
    !p.precio || 
    p.precio === 0
  );
  
  if (hasOldData) {
    console.log("Actualizando datos antiguos preservando estados...");
    return currentProducts.map(p => {
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
  return currentProducts;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    // Intentar migrar desde el localStorage viejo del navegador si tiene datos más recientes
    try {
      const localData = localStorage.getItem('products');
      if (localData) {
        console.log("Detectados productos locales en localStorage, usando como punto de partida.");
        return sanitizeProducts(JSON.parse(localData));
      }
    } catch (e) {
      console.warn("No se pudo leer del localStorage viejo:", e);
    }
    // Si no hay datos viejos en localStorage, cargamos los iniciales del código
    return sanitizeProducts(initialData);
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [adminPassword, setAdminPassword] = useState(() => {
    return sessionStorage.getItem('admin_password') || '';
  });

  // Guardar contraseña de administrador en sessionStorage para persistencia de sesión
  useEffect(() => {
    if (adminPassword) {
      sessionStorage.setItem('admin_password', adminPassword);
    } else {
      sessionStorage.removeItem('admin_password');
    }
  }, [adminPassword]);

  // Cargar productos de la base de datos al iniciar la página
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            let dbProducts = sanitizeProducts([...data.products]);
            let updated = false;
            
            // Sincronización automática: Preservar productos del estado actual (que incluye localStorage del usuario)
            // si no están presentes en la base de datos todavía.
            products.forEach(localProduct => {
              if (!dbProducts.find(p => String(p.id) === String(localProduct.id))) {
                dbProducts.push(localProduct);
                updated = true;
              }
            });
            
            // Asegurar que cualquier producto predeterminado del código también esté presente
            initialData.forEach(defaultProduct => {
              if (!dbProducts.find(p => String(p.id) === String(defaultProduct.id))) {
                dbProducts.push(defaultProduct);
                updated = true;
              }
            });
            
            setProducts(dbProducts);
            
            // Si el administrador está logueado y tuvimos que agregar productos faltantes,
            // sincronizamos inmediatamente el catálogo completo con la base de datos en la nube.
            if (updated && adminPassword) {
              await saveProductsToDB(dbProducts);
            }
          } else {
            console.log("La base de datos está vacía. Si tenemos productos de localStorage o de código, los preservamos.");
            // Si el administrador está logueado y la base de datos de Vercel KV está en blanco,
            // subimos automáticamente la lista actual de productos (que incluye los locales migrados)
            // para poblar la base de datos por primera vez.
            if (adminPassword) {
              console.log("Poblando la base de datos vacía con tus productos actuales...");
              await saveProductsToDB(products);
            }
          }
        } else {
          console.warn("La API de productos devolvió un error, usando fallback local.");
        }
      } catch (err) {
        console.error("Error al conectar con Vercel KV. Usando productos locales de respaldo.", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [adminPassword]);

  // Función para guardar cambios en la base de datos Vercel KV
  const saveProductsToDB = async (updatedList, currentPassword = adminPassword) => {
    if (!currentPassword) {
      console.warn("No se encontró contraseña de administrador. No se guardará en la base de datos.");
      return false;
    }
    
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentPassword}`
        },
        body: JSON.stringify({ products: updatedList })
      });
      
      if (res.ok) {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 3000);
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Error del servidor al guardar');
      }
    } catch (err) {
      console.error("Error al sincronizar con Vercel KV:", err);
      setSyncStatus('error');
      return false;
    }
  };

  const addProduct = async (newProduct) => {
    const updated = [...products, { ...newProduct, id: Date.now() }];
    setProducts(updated);
    if (adminPassword) {
      await saveProductsToDB(updated);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    const updated = products.map((p) => (p.id === id ? { ...updatedProduct, id } : p));
    setProducts(updated);
    if (adminPassword) {
      await saveProductsToDB(updated);
    }
  };

  const deleteProduct = async (id) => {
    const updated = products.filter((p) => String(p.id) !== String(id));
    setProducts(updated);
    if (adminPassword) {
      await saveProductsToDB(updated);
    }
  };

  const bulkActions = async (ids, action) => {
    let updated = [...products];
    if (action === 'delete') {
      const idsStrings = ids.map(id => String(id));
      updated = products.filter((p) => !idsStrings.includes(String(p.id)));
    } else if (action === 'hide') {
      updated = products.map((p) => (ids.includes(p.id) ? { ...p, hidden: true } : p));
    } else if (action === 'show') {
      updated = products.map((p) => (ids.includes(p.id) ? { ...p, hidden: false } : p));
    }
    setProducts(updated);
    if (adminPassword) {
      await saveProductsToDB(updated);
    }
  };

  const moveProduct = async (id, direction) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return;

    const newProducts = [...products];
    const product = newProducts.splice(index, 1)[0];

    if (direction === 'top') {
      newProducts.unshift(product);
    } else if (direction === 'bottom') {
      newProducts.push(product);
    } else if (direction === 'up' && index > 0) {
      newProducts.splice(index - 1, 0, product);
    } else if (direction === 'down' && index < products.length - 1) {
      newProducts.splice(index + 1, 0, product);
    } else {
      newProducts.splice(index, 0, product);
    }
    
    setProducts(newProducts);
    if (adminPassword) {
      await saveProductsToDB(newProducts);
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      isLoading, 
      syncStatus, 
      adminPassword, 
      setAdminPassword, 
      saveProductsToDB, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      bulkActions, 
      moveProduct 
    }}>
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
