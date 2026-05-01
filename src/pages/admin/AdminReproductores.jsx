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

const AdminReproductores = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reproductores, setReproductores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReproductor, setEditingReproductor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    edad: '',
    descripcion: '',
    estado: 'activo',
    estado_publicacion: true,
    fotos: [],
  });

  useEffect(() => {
    fetchReproductores();
  }, []);

  const fetchReproductores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reproductores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReproductores(data || []);
    } catch (error) {
      console.error('Error fetching reproductores:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los reproductores.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingReproductor(null);
    setFormData({
      nombre: '',
      raza: '',
      edad: '',
      descripcion: '',
      estado: 'activo',
      estado_publicacion: true,
      fotos: [],
    });
    setIsFormOpen(true);
  };

  const handleEdit = (reproductor) => {
    setEditingReproductor(reproductor);
    setFormData({
      nombre: reproductor.nombre || '',
      raza: reproductor.raza || '',
      edad: reproductor.edad || '',
      descripcion: reproductor.descripcion || '',
      estado: reproductor.estado || 'activo',
      estado_publicacion: reproductor.estado_publicacion !== false,
      fotos: Array.isArray(reproductor.fotos) ? reproductor.fotos : [],
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre es obligatorio.",
      });
      return;
    }

    try {
      const reproductorData = {
        nombre: formData.nombre,
        raza: formData.raza || null,
        edad: formData.edad ? parseInt(formData.edad) : null,
        descripcion: formData.descripcion || null,
        estado: formData.estado,
        estado_publicacion: formData.estado_publicacion,
        fotos: formData.fotos,
      };

      if (editingReproductor) {
        const { error } = await supabase
          .from('reproductores')
          .update(reproductorData)
          .eq('id', editingReproductor.id);

        if (error) throw error;

        toast({
          title: "Reproductor actualizado",
          description: "El reproductor ha sido actualizado exitosamente.",
        });
      } else {
        const { error } = await supabase
          .from('reproductores')
          .insert([reproductorData]);

        if (error) throw error;

        toast({
          title: "Reproductor creado",
          description: "El reproductor ha sido creado exitosamente.",
        });
      }

      setIsFormOpen(false);
      fetchReproductores();
    } catch (error) {
      console.error('Error saving reproductor:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el reproductor.",
      });
    }
  };

  const handleTogglePublish = async (reproductor) => {
    try {
      const { error } = await supabase
        .from('reproductores')
        .update({ estado_publicacion: !reproductor.estado_publicacion })
        .eq('id', reproductor.id);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `Reproductor ${!reproductor.estado_publicacion ? 'publicado' : 'despublicado'}.`,
      });

      fetchReproductores();
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
    if (!confirm('¿Estás seguro de eliminar este reproductor?')) return;

    try {
      const { error } = await supabase
        .from('reproductores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Reproductor eliminado",
        description: "El reproductor ha sido eliminado exitosamente.",
      });

      fetchReproductores();
    } catch (error) {
      console.error('Error deleting reproductor:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el reproductor.",
      });
    }
  };

  const filteredReproductores = reproductores.filter(reproductor =>
    reproductor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reproductor.raza?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReproductorThumbnail = (reproductor) => {
    if (Array.isArray(reproductor.fotos) && reproductor.fotos.length > 0) {
      return reproductor.fotos[0];
    }
    return 'https://images.unsplash.com/photo-1695331326719-3d12cd513167?w=400';
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
        <title>Panel de Reproductores - Admin | Criadero Paso Real</title>
        <meta name="description" content="Gestión de reproductores" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Panel de Reproductores</h1>
            <p className="text-gray-600 mt-2">Gestiona los reproductores activos</p>
          </div>
          <Button onClick={handleCreate} className="admin-button admin-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Crear Reproductor
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
              Reproductores ({filteredReproductores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReproductores.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron reproductores</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Nombre</th>
                      <th>Edad</th>
                      <th>Estado</th>
                      <th>Publicado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReproductores.map((reproductor) => (
                      <tr key={reproductor.id}>
                        <td>
                          <img
                            src={getReproductorThumbnail(reproductor)}
                            alt={reproductor.nombre}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="font-medium">{reproductor.nombre}</td>
                        <td>{reproductor.edad ? `${reproductor.edad} años` : 'N/A'}</td>
                        <td>
                          <span className={`admin-badge ${
                            reproductor.estado === 'activo' 
                              ? 'admin-badge-success' 
                              : 'admin-badge-error'
                          }`}>
                            {reproductor.estado === 'activo' ? 'Activo' : 'Retirado'}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-badge ${
                            reproductor.estado_publicacion 
                              ? 'admin-badge-success' 
                              : 'admin-badge-error'
                          }`}>
                            {reproductor.estado_publicacion ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(reproductor)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTogglePublish(reproductor)}
                              title="Publicar/Despublicar"
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            <a
                              href="/reproductores"
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
                              onClick={() => handleDelete(reproductor.id)}
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
              {editingReproductor ? 'Editar Reproductor' : 'Crear Reproductor'}
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
                  placeholder="Nombre del reproductor"
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
                  placeholder="7"
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
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="retirado">Retirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estado_publicacion">Publicar en Web</Label>
                <Select 
                  value={formData.estado_publicacion.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, estado_publicacion: value === 'true' })}
                >
                  <SelectTrigger className="admin-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={4}
                  className="admin-input"
                  placeholder="Descripción detallada del reproductor..."
                />
              </div>

              <div className="col-span-2">
                <Label>Fotos (máximo 4)</Label>
                <PhotoUploader
                  maxPhotos={4}
                  initialPhotos={formData.fotos}
                  onPhotosChange={(photos) => setFormData({ ...formData, fotos: photos })}
                  folder="reproductores"
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
                {editingReproductor ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminReproductores;