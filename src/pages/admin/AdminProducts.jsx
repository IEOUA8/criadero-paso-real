import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Eye, Power, Search, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import PhotoUploader from '@/components/PhotoUploader';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getSiteUrl } from '@/lib/siteUrl';

const AdminProducts = () => {
  const { toast } = useToast();
  const siteUrl = getSiteUrl();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    edad: '',
    peso: '',
    descripción: '',
    precio: '',
    cantidad: 1,
    estado: 'available',
    tipo: 'burro',
    categoria_id: '',
    fotos: [],
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await Promise.all([fetchProducts(), fetchCategories()]);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los productos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('tipo', 'producto')
        .eq('activa', true)
        .order('orden', { ascending: true })
        .order('nombre', { ascending: true });

      if (error) throw error;
      setProductCategories(data || []);
    } catch (error) {
      console.error('Error fetching product categories:', error);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      raza: '',
      edad: '',
      peso: '',
      descripción: '',
      precio: '',
      cantidad: 1,
      estado: 'available',
      tipo: 'burro',
      categoria_id: '',
      fotos: [],
    });
    setIsFormOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre || '',
      raza: product.raza || '',
      edad: product.edad || '',
      peso: product.peso || '',
      descripción: product.descripción || '',
      precio: product.precio || '',
      cantidad: product.cantidad || 1,
      estado: product.estado || 'available',
      tipo: product.tipo || 'burro',
      categoria_id: product.categoria_id || '',
      fotos: Array.isArray(product.imagenes) ? product.imagenes : product.imagen_url ? [product.imagen_url] : [],
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nombre y precio son campos obligatorios.",
      });
      return;
    }

    try {
      const productData = {
        nombre: formData.nombre,
        raza: formData.raza || null,
        edad: formData.edad ? parseInt(formData.edad) : null,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        descripción: formData.descripción || null,
        precio: parseFloat(formData.precio),
        cantidad: parseInt(formData.cantidad) || 1,
        estado: formData.estado,
        tipo: formData.tipo,
        categoria_id: formData.categoria_id || null,
        categoria: productCategories.find((cat) => cat.id === formData.categoria_id)?.nombre || null,
        imagenes: formData.fotos,
        imagen_url: formData.fotos.length > 0 ? formData.fotos[0] : null,
      };

      const persist = async (payload) => {
        if (editingProduct) {
          const { error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', editingProduct.id);

          if (error) throw error;

          toast({
            title: 'Producto actualizado',
            description: 'El producto ha sido actualizado exitosamente.',
          });
        } else {
          const { error } = await supabase
            .from('products')
            .insert([payload]);

          if (error) throw error;

          toast({
            title: 'Producto creado',
            description: 'El producto ha sido creado exitosamente.',
          });
        }
      };

      try {
        await persist(productData);
      } catch (persistError) {
        if (String(persistError?.message || '').includes('categoria_id')) {
          const fallbackPayload = { ...productData };
          delete fallbackPayload.categoria_id;
          await persist(fallbackPayload);
        } else {
          throw persistError;
        }
      }

      setIsFormOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el producto.",
      });
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.estado === 'available' ? 'sold' : 'available';
      const { error } = await supabase
        .from('products')
        .update({ estado: newStatus })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `Producto ${newStatus === 'available' ? 'activado' : 'desactivado'}.`,
      });

      fetchProducts();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente.",
      });

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el producto.",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.raza?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    productCategories.find((cat) => cat.id === product.categoria_id)?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (product) => {
    const category = productCategories.find((cat) => cat.id === product.categoria_id);
    return category?.nombre || product?.categoria || 'Sin categoría';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProductThumbnail = (product) => {
    if (Array.isArray(product.imagenes) && product.imagenes.length > 0) {
      return product.imagenes[0];
    }
    if (product.imagen_url) {
      return product.imagen_url;
    }
    return 'https://images.unsplash.com/photo-1554145726-b87aa584c850?w=400';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Panel de Ventas - Admin | Criadero Paso Real</title>
        <meta name="description" content="Gestión de productos en venta" />
        <link rel="canonical" href={`${siteUrl}/admin/ventas`} />
        <meta property="og:url" content={`${siteUrl}/admin/ventas`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Panel de Ventas</h1>
            <p className="text-gray-600 mt-2">Gestiona los animales en venta</p>
          </div>
          <Button onClick={handleCreate} className="admin-button admin-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Crear Producto
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o raza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 admin-input"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-playfair">
              Productos ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron productos</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Nombre</th>
                      <th>Raza</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img
                            src={getProductThumbnail(product)}
                            alt={product.nombre}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="font-medium">{product.nombre}</td>
                        <td>{product.raza || 'N/A'}</td>
                        <td>{getCategoryName(product)}</td>
                        <td className="font-semibold text-green-600">
                          {formatCurrency(product.precio)}
                        </td>
                        <td>
                          <span className={`admin-badge ${
                            product.estado === 'available' 
                              ? 'admin-badge-success' 
                              : 'admin-badge-error'
                          }`}>
                            {product.estado === 'available' ? 'Disponible' : 'Vendido'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(product)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleStatus(product)}
                              title="Activar/Desactivar"
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            <a
                              href="/venta"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Ver en web"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair">
              {editingProduct ? 'Editar Producto' : 'Crear Producto'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="admin-input"
                  placeholder="Nombre del animal"
                />
              </div>

              <div>
                <Label htmlFor="raza">Raza</Label>
                <Input
                  id="raza"
                  value={formData.raza}
                  onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                  className="admin-input"
                  placeholder="Burro criollo colombiano"
                />
              </div>

              <div>
                <Label htmlFor="edad">Edad (años)</Label>
                <Input
                  id="edad"
                  type="number"
                  value={formData.edad}
                  onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                  className="admin-input"
                  placeholder="5"
                />
              </div>

              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  className="admin-input"
                  placeholder="250"
                />
              </div>

              <div>
                <Label htmlFor="categoria_id">Categoría</Label>
                <Select
                  value={formData.categoria_id || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, categoria_id: value === 'none' ? '' : value })}
                >
                  <SelectTrigger className="admin-input">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin categoría</SelectItem>
                    {productCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="precio">Precio (COP) *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  required
                  className="admin-input"
                  placeholder="5000000"
                />
              </div>

              <div>
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  className="admin-input"
                  placeholder="1"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select 
                  value={formData.estado} 
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger className="admin-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="descripción">Descripción</Label>
                <Textarea
                  id="descripción"
                  value={formData.descripción}
                  onChange={(e) => setFormData({ ...formData, descripción: e.target.value })}
                  rows={4}
                  className="admin-input"
                  placeholder="Descripción detallada del animal..."
                />
              </div>

              <div className="col-span-2">
                <Label>Fotos (máximo 4)</Label>
                <PhotoUploader
                  maxPhotos={4}
                  initialPhotos={formData.fotos}
                  onPhotosChange={(photos) => setFormData({ ...formData, fotos: photos })}
                  folder="productos"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="admin-button admin-button-primary">
                {editingProduct ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
