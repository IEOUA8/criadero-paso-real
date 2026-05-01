import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useProducts(tipo = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [tipo]);

  const loadProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select(`
        *,
        product_images (*)
      `)
      .order('created_at', { ascending: false });

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  return { products, loading, error, refreshProducts: loadProducts };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          product_reviews (
            *,
            user_profiles (nombre, apellidos)
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) {
        setError(fetchError);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  return { product, loading, error };
}