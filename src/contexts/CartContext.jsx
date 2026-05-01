import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('criadero_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        console.log('Cart loaded from localStorage:', parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('criadero_cart', JSON.stringify(items));
      console.log('Cart saved to localStorage:', items);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = useCallback((product) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        toast({
          title: "Cantidad actualizada",
          description: `${product.nombre} ya está en tu carrito. Cantidad actualizada.`,
        });
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      toast({
        title: "Producto agregado",
        description: `${product.nombre} ha sido agregado al carrito.`,
      });

      return [...currentItems, {
        id: product.id,
        nombre: product.nombre,
        tipo: product.tipo,
        precio: product.precio,
        imagen: product.imagen || product.fotos?.[0] || product.imagen_url,
        descripcion: product.descripcion,
        cantidad: 1
      }];
    });
  }, [toast]);

  const removeFromCart = useCallback((productId) => {
    if (!productId) {
      console.error('Invalid productId:', productId);
      return;
    }

    setItems(currentItems => {
      const removedItem = currentItems.find(item => item.id === productId);
      if (removedItem) {
        toast({
          title: "Producto eliminado",
          description: `${removedItem.nombre} ha sido eliminado del carrito.`,
        });
      }
      return currentItems.filter(item => item.id !== productId);
    });
  }, [toast]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (!productId || quantity < 1) {
      console.error('Invalid productId or quantity:', { productId, quantity });
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId
          ? { ...item, cantidad: quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos han sido eliminados del carrito.",
    });
  }, [toast]);

  const getSubtotal = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    console.log('Subtotal calculated:', subtotal);
    return subtotal;
  }, [items]);

  const getTotal = useMemo(() => {
    // For now, total = subtotal (no taxes or shipping)
    return getSubtotal;
  }, [getSubtotal]);

  const getTotalPrice = useMemo(() => {
    return getTotal;
  }, [getTotal]);

  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.cantidad, 0);
  }, [items]);

  const value = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTotal,
    getTotalPrice,
    itemCount
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, getSubtotal, getTotal, getTotalPrice, itemCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
