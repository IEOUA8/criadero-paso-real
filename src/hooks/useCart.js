import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    if (!user) {
      // Load from localStorage for non-authenticated users
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(localCart);
      setLoading(false);
      return;
    }

    // Load from Supabase for authenticated users
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user.id);

    if (!error && data) {
      setCartItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (product, cantidad = 1) => {
    if (!user) {
      // Add to localStorage
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = localCart.find(item => item.product_id === product.id);
      
      if (existingItem) {
        existingItem.cantidad += cantidad;
      } else {
        localCart.push({ product_id: product.id, cantidad, products: product });
      }
      
      localStorage.setItem('cart', JSON.stringify(localCart));
      setCartItems(localCart);
      return { error: null };
    }

    // Add to Supabase
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .single();

    if (existingItem) {
      const { error } = await supabase
        .from('cart_items')
        .update({ cantidad: existingItem.cantidad + cantidad })
        .eq('id', existingItem.id);
      
      if (!error) await loadCart();
      return { error };
    }

    const { error } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, product_id: product.id, cantidad });

    if (!error) await loadCart();
    return { error };
  };

  const updateQuantity = async (itemId, cantidad) => {
    if (!user) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = localCart.find(i => i.product_id === itemId);
      if (item) {
        item.cantidad = cantidad;
        localStorage.setItem('cart', JSON.stringify(localCart));
        setCartItems(localCart);
      }
      return { error: null };
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ cantidad })
      .eq('id', itemId);

    if (!error) await loadCart();
    return { error };
  };

  const removeFromCart = async (itemId) => {
    if (!user) {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const filtered = localCart.filter(i => i.product_id !== itemId);
      localStorage.setItem('cart', JSON.stringify(filtered));
      setCartItems(filtered);
      return { error: null };
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (!error) await loadCart();
    return { error };
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.setItem('cart', '[]');
      setCartItems([]);
      return { error: null };
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (!error) await loadCart();
    return { error };
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.products?.precio || 0;
    return sum + (price * item.cantidad);
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    refreshCart: loadCart
  };
}