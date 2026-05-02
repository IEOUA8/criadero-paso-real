import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Truck,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getOrderStatusLabel, normalizeOrderRecord, normalizeOrderStatus } from '@/lib/orderStatus';
import { getSiteUrl } from '@/lib/siteUrl';

const AdminOrders = () => {
  const { toast } = useToast();
  const siteUrl = getSiteUrl();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []).map(normalizeOrderRecord));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los pedidos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => normalizeOrderStatus(order.estado) === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.comprador_nombre?.toLowerCase().includes(term) ||
        order.comprador_email?.toLowerCase().includes(term) ||
        (order.comprador_teléfono || order.teléfono || order.telefono || '').toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ estado: normalizeOrderStatus(newStatus), updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `El pedido ha sido marcado como ${getOrderStatusLabel(newStatus)}.`,
      });

      fetchOrders();
      setDetailsOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del pedido.",
      });
    }
  };

  const getStatusBadge = (estado) => {
    const status = normalizeOrderStatus(estado);
    const statusConfig = {
      pending: { label: 'Pendiente', className: 'admin-badge admin-badge-warning' },
      processing: { label: 'En Proceso', className: 'admin-badge admin-badge-info' },
      completed: { label: 'Completado', className: 'admin-badge admin-badge-success' },
      cancelled: { label: 'Cancelado', className: 'admin-badge admin-badge-error' },
      shipped: { label: 'Despachado', className: 'admin-badge admin-badge-success' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <span className={config.className}>{config.label}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
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
        <title>Gestión de Pedidos - Admin | Criadero Paso Real</title>
        <meta name="description" content="Gestión de pedidos del Criadero Paso Real" />
        <link rel="canonical" href={`${siteUrl}/admin/pedidos`} />
        <meta property="og:url" content={`${siteUrl}/admin/pedidos`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-gray-600 mt-2">Gestiona todos los pedidos de tu tienda</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, email, teléfono o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 admin-input"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="admin-input">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="processing">En Proceso</SelectItem>
                  <SelectItem value="shipped">Despachado</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-playfair">
              Pedidos ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron pedidos</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Contacto</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="font-medium">
                          {order.comprador_nombre || 'Cliente'}
                        </td>
                        <td className="text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">
                                {order.comprador_email || 'N/A'}
                              </span>
                            </div>
                            {(order.comprador_teléfono || order.teléfono || order.telefono) && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Phone className="w-3 h-3" />
                                <span>{order.comprador_teléfono || order.teléfono || order.telefono}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="font-semibold text-green-600">
                          {formatCurrency(order.total)}
                        </td>
                        <td>{getStatusBadge(order.estado)}</td>
                        <td className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="w-4 h-4" />
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

      {/* Order Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair">Detalles del Pedido</DialogTitle>
            <DialogDescription>
              ID: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium">{selectedOrder.comprador_nombre || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedOrder.comprador_email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium">{selectedOrder.comprador_teléfono || selectedOrder.teléfono || selectedOrder.telefono || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ciudad</p>
                    <p className="font-medium">{selectedOrder.ciudad || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">{selectedOrder.dirección || selectedOrder.direccion || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Información del Pedido</h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span>{getStatusBadge(selectedOrder.estado)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de creación:</span>
                    <span>{formatDate(selectedOrder.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Acciones</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedOrder.estado === 'pending' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      className="admin-button admin-button-primary"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprobar
                    </Button>
                  )}
                  {selectedOrder.estado === 'processing' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                      className="admin-button admin-button-success"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Despachar
                    </Button>
                  )}
                  {selectedOrder.estado !== 'cancelled' && selectedOrder.estado !== 'completed' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                      className="admin-button admin-button-error"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
