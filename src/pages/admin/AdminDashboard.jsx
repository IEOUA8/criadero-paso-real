import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  FileText,
  Tags,
  TrendingUp,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { normalizeOrderRecord, normalizeOrderStatus } from '@/lib/orderStatus';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    monthSales: 0,
    activeAnimals: 0,
    blogArticles: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch current month sales
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: salesData, error: salesError } = await supabase
        .from('orders')
        .select('total, estado')
        .gte('created_at', startOfMonth.toISOString());

      if (salesError) throw salesError;

      const monthSales = (salesData || []).reduce((sum, order) => {
        const status = normalizeOrderStatus(order.estado);
        if (status === 'cancelled' || status === 'refunded') return sum;
        return sum + (parseFloat(order.total) || 0);
      }, 0);

      const { data: pendingOrdersData, error: pendingError } = await supabase
        .from('orders')
        .select('estado');

      if (pendingError) throw pendingError;

      const pendingCount = (pendingOrdersData || []).reduce((count, order) => {
        const status = normalizeOrderStatus(order.estado);
        if (status === 'pending' || status === 'processing') return count + 1;
        return count;
      }, 0);

      // Fetch active animals count
      const { count: reproductoresCount } = await supabase
        .from('reproductores')
        .select('*', { count: 'exact', head: true })
        .eq('estado_publicacion', true);

      const { count: vientresCount } = await supabase
        .from('vientres')
        .select('*', { count: 'exact', head: true })
        .eq('estado_publicacion', true);

      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'available');

      const activeAnimals = (reproductoresCount || 0) + (vientresCount || 0) + (productsCount || 0);

      // Fetch blog articles count
      const { count: blogCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        pendingOrders: pendingCount || 0,
        monthSales: monthSales,
        activeAnimals: activeAnimals,
        blogArticles: blogCount || 0,
      });

      setRecentOrders((ordersData || []).map(normalizeOrderRecord));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar la información del dashboard.",
      });
    } finally {
      setLoading(false);
    }
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
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (estado) => {
    const status = normalizeOrderStatus(estado);
    const statusConfig = {
      pending: { label: 'Pendiente', className: 'admin-badge admin-badge-warning' },
      processing: { label: 'Procesando', className: 'admin-badge admin-badge-info' },
      completed: { label: 'Completado', className: 'admin-badge admin-badge-success' },
      cancelled: { label: 'Cancelado', className: 'admin-badge admin-badge-error' },
      shipped: { label: 'Despachado', className: 'admin-badge admin-badge-success' },
      refunded: { label: 'Reembolsado', className: 'admin-badge admin-badge-error' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <span className={config.className}>{config.label}</span>;
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
        <title>Dashboard - Admin | Criadero Paso Real</title>
        <meta name="description" content="Panel de administración del Criadero Paso Real" />
      </Helmet>

      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">Bienvenido al panel de administración</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Orders */}
          <div className="admin-stat-card bg-gradient-to-br from-rose-500 via-red-600 to-red-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Pedidos Pendientes</p>
                <p className="text-3xl md:text-4xl font-bold mt-2">{stats.pendingOrders}</p>
                <p className="text-white/70 text-xs mt-2">Requieren atención</p>
              </div>
              <div className="bg-white/25 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Month Sales */}
          <div className="admin-stat-card bg-gradient-to-br from-green-500 to-green-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Ventas del Mes</p>
                <p className="text-3xl md:text-4xl font-bold mt-2">{formatCurrency(stats.monthSales)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-white/70" />
                  <p className="text-white/70 text-xs">Mes actual</p>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Active Animals */}
          <div className="admin-stat-card bg-gradient-to-br from-blue-500 to-blue-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Animales Activos</p>
                <p className="text-3xl md:text-4xl font-bold mt-2">{stats.activeAnimals}</p>
                <p className="text-white/70 text-xs mt-2">Publicados en web</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Blog Articles */}
          <div className="admin-stat-card bg-gradient-to-br from-purple-500 to-purple-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Artículos de Blog</p>
                <p className="text-3xl md:text-4xl font-bold mt-2">{stats.blogArticles}</p>
                <p className="text-white/70 text-xs mt-2">Total publicados</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-playfair">Pedidos Recientes</CardTitle>
            <Link to="/admin/pedidos">
              <Button variant="ghost" className="text-[#C8A94B] hover:text-[#B8941B]">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay pedidos recientes</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="font-medium">
                          {order.comprador_nombre || 'Cliente'}
                        </td>
                        <td className="font-semibold text-green-600">
                          {formatCurrency(order.total)}
                        </td>
                        <td>{getStatusBadge(order.estado)}</td>
                        <td className="text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.created_at)}
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

        {/* Quick Access */}
        <div>
          <h2 className="text-xl font-playfair font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/ventas">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#C8A94B]/10 p-3 rounded-lg">
                      <Package className="w-6 h-6 text-[#C8A94B]" />
                    </div>
                    <div>
                      <p className="font-semibold">Gestionar Ventas</p>
                      <p className="text-sm text-gray-600">Productos a la venta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/vientres">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#4A6741]/10 p-3 rounded-lg">
                      <Package className="w-6 h-6 text-[#4A6741]" />
                    </div>
                    <div>
                      <p className="font-semibold">Gestionar Vientres</p>
                      <p className="text-sm text-gray-600">Vientres reproductoras</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/reproductores">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <Package className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Gestionar Reproductores</p>
                      <p className="text-sm text-gray-600">Reproductores activos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/categorias">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-500/10 p-3 rounded-lg">
                      <Tags className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Gestionar Categorías</p>
                      <p className="text-sm text-gray-600">Venta y Blog</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
