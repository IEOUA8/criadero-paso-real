import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Power, Search } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { normalizeCategory, makeSlug } from '@/lib/contentAdapters';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getSiteUrl } from '@/lib/siteUrl';

const AdminCategorias = () => {
  const { toast } = useToast();
  const siteUrl = getSiteUrl();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [dbReady, setDbReady] = useState(true);
  const [dbErrorMessage, setDbErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    tipo: 'producto',
    descripcion: '',
    color: '#C8A94B',
    orden: 0,
    activa: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchLegacyCategories = async () => {
    try {
      const [productsResponse, blogResponse] = await Promise.all([
        supabase.from('products').select('categoria'),
        supabase.from('blog_posts').select('categoria'),
      ]);

      const legacyProducts = (productsResponse.data || [])
        .map((item) => item.categoria)
        .filter(Boolean)
        .map((name) =>
          normalizeCategory({
            id: `legacy-producto-${makeSlug(name)}`,
            nombre: name,
            slug: makeSlug(name),
            tipo: 'producto',
            activa: true,
          })
        );

      const legacyBlog = (blogResponse.data || [])
        .map((item) => item.categoria)
        .filter(Boolean)
        .map((name) =>
          normalizeCategory({
            id: `legacy-blog-${makeSlug(name)}`,
            nombre: name,
            slug: makeSlug(name),
            tipo: 'blog',
            activa: true,
          })
        );

      const merged = [...legacyProducts, ...legacyBlog];
      const unique = [];
      const keys = new Set();
      merged.forEach((item) => {
        const key = `${item.tipo}:${item.slug}`;
        if (!keys.has(key)) {
          keys.add(key);
          unique.push(item);
        }
      });
      setCategories(unique);
    } catch (error) {
      console.error('Error loading legacy categories:', error);
      setCategories([]);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('tipo', { ascending: true })
        .order('orden', { ascending: true })
        .order('nombre', { ascending: true });

      if (error) throw error;
      setDbReady(true);
      setDbErrorMessage('');
      setCategories((data || []).map(normalizeCategory));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setDbReady(false);
      setDbErrorMessage(error?.message || 'No se pudo consultar la tabla categories.');
      await fetchLegacyCategories();
      toast({
        variant: 'destructive',
        title: 'Categorías no disponibles',
        description: 'La tabla categories no está lista o no tiene permisos. Se mostrará modo de lectura temporal.',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      slug: '',
      tipo: 'producto',
      descripcion: '',
      color: '#C8A94B',
      orden: 0,
      activa: true,
    });
    setEditingCategory(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre || '',
      slug: category.slug || '',
      tipo: category.tipo || 'producto',
      descripcion: category.descripcion || '',
      color: category.color || '#C8A94B',
      orden: category.orden || 0,
      activa: category.activa !== false,
    });
    setIsFormOpen(true);
  };

  const handleNameChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      nombre: value,
      slug: makeSlug(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dbReady) {
      toast({
        variant: 'destructive',
        title: 'Módulo no inicializado',
        description: 'Ejecuta la migración SQL de categorías en Supabase para habilitar CRUD.',
      });
      return;
    }
    if (!formData.nombre.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'El nombre de la categoría es obligatorio.',
      });
      return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      slug: formData.slug ? makeSlug(formData.slug) : makeSlug(formData.nombre),
      tipo: formData.tipo,
      descripcion: formData.descripcion?.trim() || null,
      color: formData.color || '#C8A94B',
      orden: Number(formData.orden || 0),
      activa: formData.activa !== false,
    };

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast({ title: 'Categoría actualizada', description: 'Los cambios fueron guardados.' });
      } else {
        const { error } = await supabase.from('categories').insert([payload]);
        if (error) throw error;
        toast({ title: 'Categoría creada', description: 'La categoría fue creada exitosamente.' });
      }

      setIsFormOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar la categoría.',
      });
    }
  };

  const handleToggleActive = async (category) => {
    if (!dbReady) {
      toast({
        variant: 'destructive',
        title: 'Modo solo lectura',
        description: 'Activa la tabla categories para editar estados.',
      });
      return;
    }
    try {
      const { error } = await supabase
        .from('categories')
        .update({ activa: !category.activa })
        .eq('id', category.id);
      if (error) throw error;
      toast({
        title: 'Estado actualizado',
        description: `Categoría ${!category.activa ? 'activada' : 'desactivada'}.`,
      });
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el estado.',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!dbReady) {
      toast({
        variant: 'destructive',
        title: 'Modo solo lectura',
        description: 'Activa la tabla categories para eliminar registros.',
      });
      return;
    }
    if (!confirm('¿Eliminar esta categoría? Esta acción no se puede deshacer.')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      toast({
        title: 'Categoría eliminada',
        description: 'La categoría fue eliminada.',
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la categoría. Verifica referencias en productos/blog.',
      });
    }
  };

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        `${category.nombre} ${category.slug} ${category.tipo}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [categories, searchTerm]
  );

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
        <title>Categorías - Admin | Criadero Paso Real</title>
        <meta name="description" content="Gestión de categorías para productos y blog" />
        <link rel="canonical" href={`${siteUrl}/admin/categorias`} />
        <meta property="og:url" content={`${siteUrl}/admin/categorias`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Categorías</h1>
            <p className="text-gray-600 mt-2">Gestiona categorías para Venta y Blog</p>
          </div>
          <Button onClick={handleCreate} className="admin-button admin-button-primary" disabled={!dbReady}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Categoría
          </Button>
        </div>

        {!dbReady && (
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="pt-6">
              <p className="text-amber-900 font-medium mb-2">
                Modo de lectura: no se pudo acceder a la tabla `categories`.
              </p>
              <p className="text-amber-800 text-sm">
                Error detectado: {dbErrorMessage}
              </p>
              <p className="text-amber-800 text-sm mt-2">
                Ejecuta `src/db/create-categories-module.sql` en Supabase SQL Editor para habilitar CRUD completo.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, slug o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 admin-input"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-playfair">Listado ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron categorías</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Slug</th>
                      <th>Tipo</th>
                      <th>Orden</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td className="font-medium">{category.nombre}</td>
                        <td className="font-mono text-sm">{category.slug}</td>
                        <td>
                          <span className="admin-badge admin-badge-info">
                            {category.tipo === 'producto' ? 'Producto' : 'Blog'}
                          </span>
                        </td>
                        <td>{category.orden}</td>
                        <td>
                          <span className={`admin-badge ${category.activa ? 'admin-badge-success' : 'admin-badge-error'}`}>
                            {category.activa ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(category)} title="Editar">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleActive(category)}
                              title="Activar/Desactivar"
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(category.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair">
              {editingCategory ? 'Editar Categoría' : 'Crear Categoría'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="admin-input"
                  required
                  placeholder="Ej: Cuidados, Burros de silla..."
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: makeSlug(e.target.value) }))}
                  className="admin-input"
                  placeholder="slug-de-categoria"
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value }))}>
                  <SelectTrigger className="admin-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="producto">Producto</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="orden">Orden</Label>
                <Input
                  id="orden"
                  type="number"
                  value={formData.orden}
                  onChange={(e) => setFormData((prev) => ({ ...prev, orden: Number(e.target.value || 0) }))}
                  className="admin-input"
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                  className="admin-input h-11"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                  rows={3}
                  className="admin-input"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="activa">Estado</Label>
                <Select
                  value={formData.activa ? 'true' : 'false'}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, activa: value === 'true' }))}
                >
                  <SelectTrigger className="admin-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activa</SelectItem>
                    <SelectItem value="false">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="admin-button admin-button-primary">
                {editingCategory ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategorias;
