import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      onUpdateQuantity(item.id, value);
    }
  };

  const handleDecrement = () => {
    if (item.cantidad > 1) {
      onUpdateQuantity(item.id, item.cantidad - 1);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.cantidad + 1);
  };

  const handleRemove = () => {
    if (window.confirm(`¿Estás seguro de eliminar ${item.nombre} del carrito?`)) {
      onRemove(item.id);
    }
  };

  const subtotal = item.precio * item.cantidad;

  return (
    <div className="glass-card rounded-2xl p-4 md:p-5 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={item.imagen}
            alt={item.nombre}
            className="w-[150px] h-[150px] object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-inter text-lg font-bold text-[#0B0B0B] mb-1">
              {item.nombre}
            </h3>
            <p className="font-inter text-sm text-[#6B7280] mb-2">
              {item.tipo}
            </p>
            <p className="font-inter text-base text-[#C8A94B] font-semibold">
              {formatPrice(item.precio)}
            </p>
          </div>

          {/* Quantity Controls and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-white/70 bg-white/70"
                onClick={handleDecrement}
                disabled={item.cantidad <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={handleQuantityChange}
                className="w-16 h-8 text-center rounded-full border-white/70 bg-white/80 text-gray-900"
              />
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-white/70 bg-white/70"
                onClick={handleIncrement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <p className="font-inter text-base font-bold text-[#0B0B0B]">
                {formatPrice(subtotal)}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
