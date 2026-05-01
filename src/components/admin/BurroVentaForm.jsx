import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BurroVentaForm = ({ burro, onClose, onSaved }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    raza: 'Burro Criollo Colombiano de Silla',
    sexo: 'Macho',
    edad: '',
    color: '',
    alzada: '',
    criador: '',
    propietario: 'Criadero Paso Real',
    estado: 'Disponible',
    precio: '',
    descripcion: '',
    fotos: []
  });

  useEffect(() => {
    if (burro) {
      setFormData({
        nombre: burro.nombre || '',
        raza: burro.raza || 'Burro Criollo Colombiano de Silla',
        sexo: burro.sexo || 'Macho',
        edad: burro.edad || '',
        color: burro.color || '',
        alzada: burro.alzada || '',
        criador: burro.criador || '',
        propietario: burro.propietario || 'Criadero Paso Real',
        estado: burro.estado || 'Disponible',
        precio: burro.precio || '',
        descripcion: burro.descripcion || '',
        fotos: burro.fotos || []
      });
    }
  }, [burro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre) {
      toast({ title: "Error", description: "El nombre es obligatorio", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        edad: formData.edad ? parseInt(formData.edad) : null,
        alzada: formData.alzada ? parseInt(formData.alzada) : null,
        precio: formData.precio ? parseFloat(formData.precio) : null,
      };

      let error;
      if (burro?.id) {
        const { error: updateError } = await supabase
          .from('burros_venta')
          .update(dataToSave)
          .eq('id', burro.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('burros_venta')
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Éxito",
        description: `Animal ${burro ? 'actualizado' : 'creado'} correctamente.`,
      });
      onSaved();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="font-playfair text-2xl font-bold text-[#0B0B0B]">
            {burro ? 'Editar Animal en Venta' : 'Nuevo Animal en Venta'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input name="nombre" value={formData.nombre} onChange={handleChange} required className="text-gray-900" />
            </div>
            <div className="space-y-2">
              <Label>Raza</Label>
              <Select value={formData.raza} onValueChange={(val) => handleSelectChange('raza', val)}>
                <SelectTrigger className="text-gray-900"><SelectValue placeholder="Seleccionar raza" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Burro Criollo Colombiano de Silla">Burro Criollo Colombiano de Silla</SelectItem>
                  <SelectItem value="Equino">Equino</SelectItem>
                  <SelectItem value="Mular">Mular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select value={formData.sexo} onValueChange={(val) => handleSelectChange('sexo', val)}>
                <SelectTrigger className="text-gray-900"><SelectValue placeholder="Seleccionar sexo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Edad (Años)</Label>
              <Input type="number" name="edad" value={formData.edad} onChange={handleChange} className="text-gray-900" />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input name="color" value={formData.color} onChange={handleChange} className="text-gray-900" />
            </div>
            <div className="space-y-2">
              <Label>Alzada (cm)</Label>
              <Input type="number" name="alzada" value={formData.alzada} onChange={handleChange} className="text-gray-900" />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={formData.estado} onValueChange={(val) => handleSelectChange('estado', val)}>
                <SelectTrigger className="text-gray-900"><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="En negociación">En negociación</SelectItem>
                  <SelectItem value="Vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Precio (COP)</Label>
              <Input type="number" name="precio" value={formData.precio} onChange={handleChange} className="text-gray-900" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} className="text-gray-900" />
          </div>

          <div className="space-y-2">
            <Label>URLs de Fotos (separadas por comas)</Label>
            <Textarea 
              name="fotos" 
              value={formData.fotos.join(', ')} 
              onChange={(e) => handleSelectChange('fotos', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
              rows={2} 
              className="text-gray-900"
            />
          </div>

        </form>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="text-gray-700">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-[#0B0B0B] font-bold">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {burro ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BurroVentaForm;