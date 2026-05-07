import React from 'react';

const OrderSummary = ({ items, total }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const taxes = 0; // 0% taxes
  const shipping = 0; // Free shipping
  const finalTotal = total !== undefined ? total : subtotal + taxes + shipping;

  return (
    <div className="border border-[#cdbb91] bg-[#fffdf7] p-6 md:p-8 sticky top-24">
      <h2 className="font-inter text-lg font-bold text-[#0B0B0B] mb-6">
        Resumen de compra
      </h2>

      <div className="space-y-4 mb-6">
        {/* Items List */}
        {items.length > 0 && (
          <div className="space-y-2 pb-4 border-b border-[#E5E7EB]">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate mr-2">
                  {item.nombre} x{item.cantidad}
                </span>
                <span className="text-[#0B0B0B] font-medium">
                  {formatPrice(item.precio * item.cantidad)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="font-inter text-sm text-[#6B7280]">Subtotal</span>
          <span className="font-inter text-sm text-[#0B0B0B]">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Taxes */}
        <div className="flex justify-between">
          <span className="font-inter text-sm text-[#6B7280]">Impuestos</span>
          <span className="font-inter text-sm text-[#0B0B0B]">
            {formatPrice(taxes)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between">
          <span className="font-inter text-sm text-[#6B7280]">Envío</span>
          <span className="font-inter text-sm text-[#10B981] font-medium">
            {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]">
        <span className="font-inter text-lg font-bold text-[#0B0B0B]">Total</span>
        <span className="font-inter text-lg font-bold text-[#C8A94B]">
          {formatPrice(finalTotal)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
