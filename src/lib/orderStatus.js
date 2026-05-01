const STATUS_MAP = {
  pending: 'pending',
  pendiente: 'pending',
  processing: 'processing',
  proceso: 'processing',
  completed: 'completed',
  completado: 'completed',
  shipped: 'shipped',
  despachado: 'shipped',
  cancelled: 'cancelled',
  cancelado: 'cancelled',
  refunded: 'refunded',
  reembolsado: 'refunded',
};

export const normalizeOrderStatus = (status) => {
  if (!status) return 'pending';
  const key = String(status).trim().toLowerCase();
  return STATUS_MAP[key] || key;
};

export const getOrderStatusLabel = (status) => {
  const normalized = normalizeOrderStatus(status);
  const labels = {
    pending: 'Pendiente',
    processing: 'En Proceso',
    completed: 'Completado',
    shipped: 'Despachado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
  };
  return labels[normalized] || normalized;
};

export const normalizeOrderRecord = (order) => ({
  ...order,
  estado: normalizeOrderStatus(order?.estado),
});

