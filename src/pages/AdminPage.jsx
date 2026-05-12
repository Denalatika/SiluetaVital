import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Tag, Upload, Lock, Key, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, bulkActions, moveProduct } = useProducts();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const handleOpenDeleteModal = (product = null) => {
    if (product) {
      setProductToDelete(product);
      setIsBulkDelete(false);
    } else {
      setProductToDelete(null);
      setIsBulkDelete(true);
    }
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      bulkActions(selectedIds, 'delete');
      setSelectedIds([]);
    } else if (productToDelete) {
      deleteProduct(productToDelete.id);
      // Deseleccionar si estaba seleccionado
      setSelectedIds(prev => prev.filter(id => id !== productToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
    imagenDetalle: '',
    descripcionCorta: '',
    descripcionLarga: '',
    categoria: 'Suplemento Naturista',
    beneficios: '',
    advertencia: '',
    modoDeUso: '',
    precio: '',
    descuento: ''
  });

  // COMENTARIO: Cambia la contraseña aquí
  const ADMIN_PASSWORD = "admin";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-float-in">
          <div className="bg-primary-dark p-8 text-center text-white">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Acceso Administrativo</h1>
            <p className="text-primary-light text-sm mt-2">Solo personal autorizado</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Introduce la contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  className={`block w-full pl-10 pr-3 py-3 border ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all hover-lift shadow-lg shadow-primary/20"
            >
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        beneficios: product.beneficios ? product.beneficios.join(', ') : '',
        precio: product.precio || '',
        descuento: product.descuento || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        imagen: '',
        imagenDetalle: '',
        descripcionCorta: '',
        descripcionLarga: '',
        categoria: 'Suplemento Naturista',
        beneficios: '',
        advertencia: '',
        modoDeUso: '',
        precio: '',
        descuento: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field = 'imagen') => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      beneficios: typeof formData.beneficios === 'string' 
        ? formData.beneficios.split(',').map(b => b.trim()).filter(b => b !== '')
        : formData.beneficios
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, processedData);
    } else {
      addProduct(processedData);
    }
    handleCloseModal();
  };

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (action === 'delete') {
      handleOpenDeleteModal();
    } else {
      bulkActions(selectedIds, action);
      setSelectedIds([]);
    }
  };

  return (
    <div className="pt-24 pb-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">Panel de Administración</h1>
            <p className="text-gray-600">Gestiona tu catálogo de productos y promociones.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-md font-bold flex items-center transition-all hover-lift"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </button>
        </div>

        {/* Barra de Acciones Masivas */}
        {selectedIds.length > 0 && (
          <div className="bg-primary p-4 rounded-xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between animate-float-in gap-4">
            <div className="flex items-center text-white">
              <Check className="w-5 h-5 mr-2" />
              <span className="font-bold">{selectedIds.length} productos seleccionados</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => handleBulkAction('show')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/30 flex items-center"
              >
                <Check className="w-4 h-4 mr-2" /> Visible
              </button>
              <button 
                onClick={() => handleBulkAction('hide')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/30 flex items-center"
              >
                <X className="w-4 h-4 mr-2" /> Ocultar
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center shadow-lg"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Borrar
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="text-white/70 hover:text-white px-4 py-2 text-sm font-medium transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            className="w-full bg-transparent focus:outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio / Desc.</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors ${product.hidden ? 'bg-gray-50 opacity-70' : ''} ${selectedIds.includes(product.id) ? 'bg-primary/5' : ''}`}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden mr-4 border border-gray-100 relative">
                            <img src={product.imagen} alt={product.nombre} className="h-full w-full object-contain" />
                            {product.hidden && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <X className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-bold text-gray-900">{product.nombre}</div>
                              {product.hidden && (
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase">Oculto</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">{product.descripcionCorta}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-md">
                          {product.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.precio ? `$${product.precio}` : '---'}
                        </div>
                        {product.descuento && (
                          <div className="text-xs text-accent font-bold flex items-center mt-1">
                            <Tag className="w-3 h-3 mr-1" />
                            {product.descuento}% OFF
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-1 sm:space-x-2">
                          <button 
                            onClick={() => moveProduct(product.id, 'top')}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="Mover al principio"
                          >
                            <ChevronsUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => moveProduct(product.id, 'up')}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="Subir"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => moveProduct(product.id, 'down')}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="Bajar"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => moveProduct(product.id, 'bottom')}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="Mover al final"
                          >
                            <ChevronsDown className="w-4 h-4" />
                          </button>
                          <div className="w-px h-6 bg-gray-100 mx-1"></div>
                          <button 
                            onClick={() => handleOpenModal(product)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteModal(product);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* SECCIÓN DE EXPORTACIÓN (Para sincronización con el desarrollador) */}
        <div className="mt-12 p-8 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 text-center">
          <h3 className="text-xl font-bold text-primary mb-2">Sincronización de Datos</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Si has realizado cambios manuales en el panel y quieres que se guarden permanentemente en la web para todos los usuarios, copia los datos y envíalos al desarrollador.
          </p>
          <button 
            onClick={() => {
              const dataStr = JSON.stringify(products, null, 2);
              navigator.clipboard.writeText(dataStr);
              alert("¡Datos copiados al portapapeles! Ahora puedes pegarlos en el chat.");
            }}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all hover-lift shadow-lg flex items-center mx-auto"
          >
            <Check className="w-5 h-5 mr-2" />
            Copiar Datos para Sincronización (JSON)
          </button>
        </div>
      </div>

      {/* Modal de Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-float-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-primary">
                {editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto</label>
                  <input 
                    type="text" name="nombre" required
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    value={formData.nombre} onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                  <select 
                    name="categoria"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    value={formData.categoria} onChange={handleInputChange}
                  >
                    <option>Suplemento Naturista</option>
                    <option>Pérdida de Peso</option>
                    <option>Energía</option>
                    <option>Bienestar General</option>
                    <option>Cuidado Personal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Imagen de Portada (Catálogo)</label>
                  <div className="space-y-4">
                    <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-primary transition-colors group">
                      <input 
                        type="file" accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(e, 'imagen')}
                      />
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-primary transition-colors" />
                        <p className="text-[10px] text-gray-500 font-medium">Subir imagen principal</p>
                      </div>
                    </div>
                    <input 
                      type="text" name="imagen" required
                      placeholder="O pega la URL de portada..."
                      className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                      value={formData.imagen} onChange={handleInputChange}
                    />
                    {formData.imagen && (
                      <div className="h-24 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={formData.imagen} alt="Preview Portada" className="h-full w-full object-contain p-2" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Imagen de Detalle (Interior)</label>
                  <div className="space-y-4">
                    <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-primary transition-colors group">
                      <input 
                        type="file" accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(e, 'imagenDetalle')}
                      />
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-primary transition-colors" />
                        <p className="text-[10px] text-gray-500 font-medium">Subir imagen de descripción</p>
                      </div>
                    </div>
                    <input 
                      type="text" name="imagenDetalle"
                      placeholder="O pega la URL de detalle..."
                      className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                      value={formData.imagenDetalle} onChange={handleInputChange}
                    />
                    {formData.imagenDetalle && (
                      <div className="h-24 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={formData.imagenDetalle} alt="Preview Detalle" className="h-full w-full object-contain p-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Precio ($)</label>
                  <input 
                    type="number" name="precio"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    value={formData.precio} onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Descuento (%)</label>
                  <input 
                    type="number" name="descuento" min="0" max="100"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    value={formData.descuento} onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Descripción Corta</label>
                <input 
                  type="text" name="descripcionCorta" required
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  value={formData.descripcionCorta} onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Descripción Larga</label>
                <textarea 
                  name="descripcionLarga" rows="3"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  value={formData.descripcionLarga} onChange={handleInputChange}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Beneficios (separados por coma)</label>
                <input 
                  type="text" name="beneficios"
                  placeholder="Quema grasa, Da energía, Natural"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  value={formData.beneficios} onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button 
                  type="button" onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all hover-lift flex items-center"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {editingProduct ? 'Guardar Cambios' : 'Añadir Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de Confirmación de Borrado */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-float-in">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Estás seguro?</h3>
            <p className="text-gray-500 mb-8">
              {isBulkDelete 
                ? `Estás a punto de eliminar ${selectedIds.length} productos de forma permanente. Esta acción no se puede deshacer.`
                : `Estás a punto de eliminar "${productToDelete?.nombre}" de forma permanente. Esta acción no se puede deshacer.`
              }
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all hover-lift"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
