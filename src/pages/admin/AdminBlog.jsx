import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Power, Search, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const AdminBlog = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los artículos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (article) => {
    try {
      const newStatus = article.estado === 'published' ? 'draft' : 'published';
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          estado: newStatus,
          fecha_publicacion: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', article.id);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `Artículo ${newStatus === 'published' ? 'publicado' : 'despublicado'}.`,
      });

      fetchArticles();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Artículo eliminado",
        description: "El artículo ha sido eliminado exitosamente.",
      });

      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el artículo.",
      });
    }
  };

  const filteredArticles = articles.filter(article =>
    article.título?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.autor_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getArticleThumbnail = (article) => {
    return article.imagen_portada || 'https://images.unsplash.com/photo-1554145726-b87aa584c850?w=400';
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
        <title>Gestión de Blog - Admin | Criadero Paso Real</title>
        <meta name="description" content="Gestión de artículos del blog" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Gestión de Blog</h1>
            <p className="text-gray-600 mt-2">Gestiona los artículos del blog</p>
          </div>
          <Link to="/admin/blog/nuevo">
            <Button className="admin-button admin-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Crear Artículo
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por título o autor..."
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
              Artículos ({filteredArticles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron artículos</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Portada</th>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>Fecha Publicación</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article.id}>
                        <td>
                          <img
                            src={getArticleThumbnail(article)}
                            alt={article.título}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="font-medium">{article.título}</td>
                        <td>{article.autor_nombre || 'N/A'}</td>
                        <td className="text-sm text-gray-600">
                          {formatDate(article.fecha_publicacion || article.created_at)}
                        </td>
                        <td>
                          <span className={`admin-badge ${
                            article.estado === 'published' 
                              ? 'admin-badge-success' 
                              : 'admin-badge-warning'
                          }`}>
                            {article.estado === 'published' ? 'Publicado' : 'Borrador'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Link to={`/admin/blog/${article.id}/editar`}>
                              <Button size="sm" variant="ghost" title="Editar">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTogglePublish(article)}
                              title="Publicar/Despublicar"
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            {article.slug && (
                              <a
                                href={`/blog/${article.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="ghost" title="Ver en web">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </a>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(article.id)}
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
    </AdminLayout>
  );
};

export default AdminBlog;