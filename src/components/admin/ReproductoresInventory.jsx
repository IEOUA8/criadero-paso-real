import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Plus, Search, Edit2, Trash2, Eye, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ReproductorForm from './ReproductorForm';

const ReproductoresInventory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: list, error } = await supabase
        .from('reproductores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(list || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "No se pudieron cargar los datos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) return;
    try {
      const { error } = await supabase.from('reproductores').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Eliminado", description: "El registro ha sido eliminado." });
      loadData();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openModal = (item = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    loadData();
  };

  const filteredData = data.filter(item => 
    item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.raza?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Buscar por nombre o raza..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-200 focus:border-[#C8A94B] focus:ring-[#C8A94B] text-gray-900"
          />
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-[#0B0B0B] font-bold shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Reproductor
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F4F5F7] text-[#374151] font-medium border-b-2 border-[#C8A94B]">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Raza</th>
              <th className="px-4 py-3">Sexo</th>
              <th className="px-4 py-3">Edad</th>
              <th className="px-4 py-3">Alzada</th>
              <th className="px-4 py-3">Propietario</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#C8A94B] mx-auto" />
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">No se encontraron registros.</td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{item.raza}</td>
                  <td className="px-4 py-3 text-gray-600">{item.sexo}</td>
                  <td className="px-4 py-3 text-gray-600">{item.edad ? `${item.edad} años` : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{item.alzada ? `${item.alzada} cm` : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{item.propietario}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50" onClick={() => openModal(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ReproductorForm 
          reproductor={selectedItem} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
};

export default ReproductoresInventory;