import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const VientrForm = ({ vientre, onClose, onSaved }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    raza: 'Burro Criollo Colombiano de Silla',
    sexo: 'Hembra',
    edad: '',
    color: '',
    alzada: '',
    criador: '',
    propietario: 'Criadero Paso Real',
    estado: 'Disponible',
    descripcion: '',
    genealogia: '',
    evaluacion_morfologica: '',
    registros_produccion: '',
    fotos: []
  });

  useEffect(() => {
    if (vientre) {
      setFormData({
        nombre: vientre.nombre || '',
        raza: vientre.raza || 'Burro Criollo Colombiano de Silla',
        sexo: 'Hembra',
        edad: vientre.edad || '',
        color: vientre.color || '',
        alzada: vientre.alzada || '',
        criador: vientre.criador || '',
        propietario: vientre.propietario || 'Criadero Paso Real',
        estado: vientre.estado || 'Disponible',
        descripcion: vientre.descripcion || '',
        genealogia: vientre.genealogia || '',
        evaluacion_morfologica: vientre.evaluacion_morfologica || '',
        registros_produccion: vientre.registros_produccion || '',
        fotos: vientre.fotos || []
      });
    }
  }, [vientre]);

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
      };

      let error;
      if (vientre?.id) {
        const { error: updateError } = await supabase
          .from('vientres')
          .update(dataToSave)
          .eq('id', vientre.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('vientres')
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Éxito",
        description: `Vientre ${vientre ? 'actualizado' : 'creado'} correctamente.`,
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
            {vientre ? 'Editar Vientre' : 'Nuevo Vientre'}
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
              <Label>Criador</Label>
              <Input name="criador" value={formData.criador} onChange={handleChange} className="text-gray-900" />
            </div>
            <div className="space-y-2">
              <Label>Propietario</Label>
              <Input name="propietario" value={formData.propietario} onChange={handleChange} className="text-gray-900" />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={formData.estado} onValueChange={(val) => handleSelectChange('estado', val)}>
                <SelectTrigger className="text-gray-900"><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="En negociación">En negociación</SelectItem>
                  <SelectItem value="Retirada">Retirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descripción Breve</Label>
            <Textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={2} className="text-gray-900" />
          </div>

          <div className="space-y-2">
            <Label>Genealogía</Label>
            <Textarea name="genealogia" value={formData.genealogia} onChange={handleChange} rows={3} className="text-gray-900" />
          </div>

          <div className="space-y-2">
            <Label>Evaluación Morfológica</Label>
            <Textarea name="evaluacion_morfologica" value={formData.evaluacion_morfologica} onChange={handleChange} rows={3} className="text-gray-900" placeholder="Estructura, Dorso, Aplomos..." />
          </div>

          <div className="space-y-2">
            <Label>Registros de Producción</Label>
            <Textarea name="registros_produccion" value={formData.registros_produccion} onChange={handleChange} rows={3} className="text-gray-900" placeholder="Número de crías, última cría..." />
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
            {vientre ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VientrForm;