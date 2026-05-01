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

const AdminVientres = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vientres, setVientres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVientre, setEditingVientre] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    edad: '',
    descripcion: '',
    estado_reproductivo: 'activo',
    estado_publicacion: true,
    fotos: [],
  });

  useEffect(() => {
    fetchVientres();
  }, []);

  const fetchVientres = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vientres')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVientres(data || []);
    } catch (error) {
      console.error('Error fetching vientres:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los vientres.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVientre(null);
    setFormData({
      nombre: '',
      raza: '',
      edad: '',
      descripcion: '',
      estado_reproductivo: 'activo',
      estado_publicacion: true,
      fotos: [],
    });
    setIsFormOpen(true);
  };

  const handleEdit = (vientre) => {
    setEditingVientre(vientre);
    setFormData({
      nombre: vientre.nombre || '',
      raza: vientre.raza || '',
      edad: vientre.edad || '',
      descripcion: vientre.descripcion || '',
      estado_reproductivo: vientre.estado_reproductivo || 'activo',
      estado_publicacion: vientre.estado_publicacion !== false,
      fotos: Array.isArray(vientre.fotos) ? vientre.fotos : [],
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
      const vientreData = {
        nombre: formData.nombre,
        raza: formData.raza || null,
        edad: formData.edad ? parseInt(formData.edad) : null,
        descripcion: formData.descripcion || null,
        estado_reproductivo: formData.estado_reproductivo,
        estado_publicacion: formData.estado_publicacion,
        fotos: formData.fotos,
      };

      if (editingVientre) {
        const { error } = await supabase
          .from('vientres')
          .update(vientreData)
          .eq('id', editingVientre.id);

        if (error) throw error;

        toast({
          title: "Vientre actualizado",
          description: "El vientre ha sido actualizado exitosamente.",
        });
      } else {
        const { error } = await supabase
          .from('vientres')
          .insert([vientreData]);

        if (error) throw error;

        toast({
          title: "Vientre creado",
          description: "El vientre ha sido creado exitosamente.",
        });
      }

      setIsFormOpen(false);
      fetchVientres();
    } catch (error) {
      console.error('Error saving vientre:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el vientre.",
      });
    }
  };

  const handleTogglePublish = async (vientre) => {
    try {
      const { error } = await supabase
        .from('vientres')
        .update({ estado_publicacion: !vientre.estado_publicacion })
        .eq('id', vientre.id);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `Vientre ${!vientre.estado_publicacion ? 'publicado' : 'despublicado'}.`,
      });

      fetchVientres();
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
    if (!confirm('¿Estás seguro de eliminar este vientre?')) return;

    try {
      const { error } = await supabase
        .from('vientres')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Vientre eliminado",
        description: "El vientre ha sido eliminado exitosamente.",
      });

      fetchVientres();
    } catch (error) {
      console.error('Error deleting vientre:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el vientre.",
      });
    }
  };

  const filteredVientres = vientres.filter(vientre =>
    vientre.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vientre.raza?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusLabel = (status) => {
    const labels = {
      activo: 'Activo',
      en_descanso: 'En Descanso',
      retirado: 'Retirado',
    };
    return labels[status] || status;
  };

  const getVientreThumbnail = (vientre) => {
    if (Array.isArray(vientre.fotos) && vientre.fotos.length > 0) {
      return vientre.fotos[0];
    }
    return 'https://images.unsplash.com/photo-1673872800723-df87b2c829d1?w=400';
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
        <title>Panel de Vientres - Admin | Criadero Paso Real</title>
        <meta name="description" content="Gestión de vientres reproductoras" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Panel de Vientres</h1>
            <p className="text-gray-600 mt-2">Gestiona las vientres reproductoras</p>
          </div>
          <Button onClick={handleCreate} className="admin-button admin-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Crear Vientre
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
              Vientres ({filteredVientres.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredVientres.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron vientres</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Nombre</th>
                      <th>Edad</th>
                      <th>Estado Reproductivo</th>
                      <th>Publicado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVientres.map((vientre) => (
                      <tr key={vientre.id}>
                        <td>
                          <img
                            src={getVientreThumbnail(vientre)}
                            alt={vientre.nombre}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="font-medium">{vientre.nombre}</td>
                        <td>{vientre.edad ? `${vientre.edad} años` : 'N/A'}</td>
                        <td>
                          <span className={`admin-badge ${
                            vientre.estado_reproductivo === 'activo' 
                              ? 'admin-badge-success' 
                              : vientre.estado_reproductivo === 'en_descanso'
                              ? 'admin-badge-warning'
                              : 'admin-badge-error'
                          }`}>
                            {getStatusLabel(vientre.estado_reproductivo)}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-badge ${
                            vientre.estado_publicacion 
                              ? 'admin-badge-success' 
                              : 'admin-badge-error'
                          }`}>
                            {vientre.estado_publicacion ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(vientre)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTogglePublish(vientre)}
                              title="Publicar/Despublicar"
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            <a
                              href="/vientres"
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
                              onClick={() => handleDelete(vientre.id)}
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
              {editingVientre ? 'Editar Vientre' : 'Crear Vientre'}
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
                  placeholder="Nombre del vientre"
                />
              </div>

              <div>
                <Label htmlFor="raza">Raza</Label>
                <Input
                  id="raza"
                  value={formData.raza}
                  onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                  className="admin-input"
                  placeholder="Burra criolla colombiana"
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
                  placeholder="6"
                />
              </div>

              <div>
                <Label htmlFor="estado_reproductivo">Estado Reproductivo</Label>
                <Select 
                  value={formData.estado_reproductivo} 
                  onValueChange={(value) => setFormData({ ...formData, estado_reproductivo: value })}
                >
                  <SelectTrigger className="admin-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="en_descanso">En Descanso</SelectItem>
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
                  placeholder="Descripción detallada del vientre..."
                />
              </div>

              <div className="col-span-2">
                <Label>Fotos (máximo 4)</Label>
                <PhotoUploader
                  maxPhotos={4}
                  initialPhotos={formData.fotos}
                  onPhotosChange={(photos) => setFormData({ ...formData, fotos: photos })}
                  folder="vientres"
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
                {editingVientre ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminVientres;