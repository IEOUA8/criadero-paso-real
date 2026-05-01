import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import LoadingSpinner from '@/components/LoadingSpinner';

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { uploadPhotos, isLoading: uploadingPhoto } = usePhotoUpload('blog');
  const [loading, setLoading] = useState(false);
  const [blogCategories, setBlogCategories] = useState([]);
  const [portadaPreview, setPortadaPreview] = useState(null);
  const [formData, setFormData] = useState({
    título: '',
    slug: '',
    contenido: '',
    imagen_portada: '',
    extracto: '',
    resumen: '',
    categoria: '',
    categoria_id: '',
    etiquetas: '',
    estado: 'draft',
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('tipo', 'blog')
        .eq('activa', true)
        .order('orden', { ascending: true })
        .order('nombre', { ascending: true });

      if (error) throw error;
      setBlogCategories(data || []);
    } catch (error) {
      console.error('Error fetching blog categories:', error);
    }
  };

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        título: data.título || '',
        slug: data.slug || '',
        contenido: data.contenido || '',
        imagen_portada: data.imagen_portada || '',
        extracto: data.extracto || '',
        resumen: data.resumen || '',
        categoria: data.categoria || '',
        categoria_id: data.categoria_id || '',
        etiquetas: Array.isArray(data.etiquetas) ? data.etiquetas.join(', ') : '',
        estado: data.estado || 'draft',
      });
      setPortadaPreview(data.imagen_portada || null);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar el artículo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData({
      ...formData,
      título: newTitle,
      slug: generateSlug(newTitle),
    });
  };

  const handlePortadaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const urls = await uploadPhotos([file], 0);
    if (urls.length > 0) {
      setFormData({ ...formData, imagen_portada: urls[0] });
      setPortadaPreview(urls[0]);
      toast({
        title: "Portada subida",
        description: "La imagen de portada ha sido subida exitosamente.",
      });
    }
  };

  const handleSubmit = async (e, publishNow = false) => {
    e.preventDefault();

    if (!formData.título || !formData.contenido) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Título y contenido son obligatorios.",
      });
      return;
    }

    try {
      setLoading(true);

      const etiquetasArray = formData.etiquetas
        ? formData.etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const articleData = {
        título: formData.título,
        slug: formData.slug || generateSlug(formData.título),
        contenido: formData.contenido,
        imagen_portada: formData.imagen_portada || null,
        extracto: formData.extracto || formData.contenido.substring(0, 200),
        resumen: formData.resumen || formData.extracto || formData.contenido.substring(0, 200),
        categoria: formData.categoria || blogCategories.find((cat) => cat.id === formData.categoria_id)?.nombre || null,
        categoria_id: formData.categoria_id || null,
        etiquetas: etiquetasArray,
        estado: publishNow ? 'published' : formData.estado,
        autor_id: currentUser?.id,
        autor_nombre: `${currentUser?.nombre} ${currentUser?.apellidos || ''}`.trim(),
        fecha_publicacion: publishNow ? new Date().toISOString() : null,
      };

      const persist = async (payload) => {
        if (id) {
          const { error } = await supabase
            .from('blog_posts')
            .update(payload)
            .eq('id', id);
          if (error) throw error;
          toast({
            title: 'Artículo actualizado',
            description: 'El artículo ha sido actualizado exitosamente.',
          });
        } else {
          const { error } = await supabase
            .from('blog_posts')
            .insert([payload]);
          if (error) throw error;
          toast({
            title: 'Artículo creado',
            description: 'El artículo ha sido creado exitosamente.',
          });
        }
      };

      try {
        await persist(articleData);
      } catch (persistError) {
        if (String(persistError?.message || '').includes('categoria_id')) {
          const fallbackPayload = { ...articleData };
          delete fallbackPayload.categoria_id;
          await persist(fallbackPayload);
        } else {
          throw persistError;
        }
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el artículo.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
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
        <title>{id ? 'Editar' : 'Crear'} Artículo - Admin | Criadero Paso Real</title>
        <meta name="description" content={`${id ? 'Editar' : 'Crear'} artículo del blog`} />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/blog')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-900">
                {id ? 'Editar Artículo' : 'Crear Artículo'}
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading || uploadingPhoto}
              variant="outline"
            >
              Guardar Borrador
            </Button>
            <Button
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading || uploadingPhoto}
              className="admin-button admin-button-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Guardando...' : 'Publicar'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="título">Título *</Label>
                <Input
                  id="título"
                  value={formData.título}
                  onChange={handleTitleChange}
                  required
                  className="admin-input"
                  placeholder="Título del artículo..."
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="admin-input"
                  placeholder="titulo-del-articulo"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Se genera automáticamente desde el título
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select 
                    value={formData.categoria_id || 'legacy'}
                    onValueChange={(value) => {
                      if (value === 'legacy') {
                        setFormData({ ...formData, categoria_id: '', categoria: '' });
                        return;
                      }
                      const selected = blogCategories.find((item) => item.id === value);
                      setFormData({
                        ...formData,
                        categoria_id: value,
                        categoria: selected?.nombre || '',
                      });
                    }}
                  >
                    <SelectTrigger className="admin-input">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legacy">Sin categoría</SelectItem>
                      {blogCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="etiquetas">Etiquetas</Label>
                  <Input
                    id="etiquetas"
                    value={formData.etiquetas}
                    onChange={(e) => setFormData({ ...formData, etiquetas: e.target.value })}
                    className="admin-input"
                    placeholder="burros, cuidados, salud (separadas por coma)"
                  />
                </div>
              </div>

              <div>
                <Label>Imagen de Portada</Label>
                <div className="space-y-3">
                  {portadaPreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={portadaPreview}
                        alt="Portada"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="portada-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {uploadingPhoto ? 'Subiendo...' : portadaPreview ? 'Cambiar portada' : 'Subir portada'}
                      </span>
                    </label>
                    <input
                      id="portada-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePortadaUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                    <p className="text-sm text-gray-600">JPG, PNG, WebP • Máx. 5MB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Contenido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="extracto">Extracto/Resumen</Label>
                <Textarea
                  id="extracto"
                  value={formData.extracto}
                  onChange={(e) => setFormData({ ...formData, extracto: e.target.value })}
                  rows={3}
                  className="admin-input"
                  placeholder="Breve descripción del artículo (se mostrará en listados)..."
                />
              </div>

              <div>
                <Label htmlFor="contenido">Contenido Principal *</Label>
                <Textarea
                  id="contenido"
                  value={formData.contenido}
                  onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  rows={20}
                  required
                  className="admin-input font-mono"
                  placeholder="Escribe el contenido del artículo aquí..."
                />
                <p className="text-sm text-gray-600 mt-1">
                  Puedes usar Markdown para dar formato al texto
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="autor">Autor</Label>
                <Input
                  id="autor"
                  value={`${currentUser?.nombre} ${currentUser?.apellidos || ''}`}
                  disabled
                  className="admin-input bg-gray-100 cursor-not-allowed"
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
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogEditor;
