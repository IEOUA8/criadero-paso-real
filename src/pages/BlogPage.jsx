import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { normalizeBlogPost, normalizeCategory } from '@/lib/contentAdapters';

const BlogPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const [postsResponse, categoriesResponse] = await Promise.all([
          supabase
            .from('blog_posts')
            .select('*')
            .eq('estado', 'published')
            .order('fecha_publicacion', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false }),
          supabase
            .from('categories')
            .select('*')
            .eq('tipo', 'blog')
            .eq('activa', true)
            .order('orden', { ascending: true })
            .order('nombre', { ascending: true }),
        ]);

        if (postsResponse.error) throw postsResponse.error;
        if (categoriesResponse.error) {
          console.warn('Categories table not ready or unavailable:', categoriesResponse.error.message);
        }

        const activeCategories = (categoriesResponse.data || []).map(normalizeCategory);
        const categoriesMap = new Map(activeCategories.map((category) => [category.id, category]));

        const normalizedPosts = (postsResponse.data || []).map((item) => {
          const post = normalizeBlogPost(item);
          const category = categoriesMap.get(post.categoria_id);
          return {
            ...post,
            categoria_nombre: category?.nombre || post.categoria_nombre || post.categoria,
            categoria_slug: category?.slug || post.categoria_slug || '',
          };
        });

        setPosts(normalizedPosts);
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error loading blog posts:', error);
        toast({
          variant: 'destructive',
          title: 'Error al cargar blog',
          description: 'No se pudieron cargar las publicaciones.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [toast]);

  const visiblePosts = useMemo(
    () =>
      posts.filter((post) => {
        if (selectedCategory === 'all') return true;
        return post.categoria_id === selectedCategory || post.categoria_slug === selectedCategory;
      }),
    [posts, selectedCategory]
  );

  const filterCategories = useMemo(() => {
    if (categories.length > 0) return categories;
    const map = new Map();
    posts.forEach((post) => {
      if (!post.categoria_slug) return;
      if (!map.has(post.categoria_slug)) {
        map.set(post.categoria_slug, {
          id: post.categoria_slug,
          nombre: post.categoria_nombre || post.categoria_slug,
          color: '#C8A94B',
        });
      }
    });
    return Array.from(map.values());
  }, [categories, posts]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog - Criadero Paso Real</title>
      </Helmet>

      <Header />

      <div className="min-h-screen premium-page-bg pt-24 md:pt-32 pb-12 md:pb-16 max-[389px]:pt-20 max-[389px]:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 max-[389px]:px-3">
          <div className="mb-8 md:mb-10 premium-glass rounded-3xl p-6 md:p-10 text-center max-[389px]:rounded-2xl max-[389px]:p-4">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-white/75 border border-white/80">
              <Sparkles className="w-4 h-4 text-[#C8A94B]" />
              <span className="premium-kicker !tracking-[0.12em] max-[389px]:!text-[10px] max-[389px]:!tracking-[0.09em]">Notas de criadero</span>
            </div>
            <h1 className="premium-title text-3xl md:text-5xl font-bold mb-4 max-[389px]:text-[1.7rem]">
              Nuestro Blog
            </h1>
            <p className="premium-description text-justify-desktop max-w-3xl mx-auto max-[389px]:text-[0.95rem]">
              Historias, guías y criterios técnicos sobre genética, manejo y tradición del burro criollo colombiano de silla.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content (2 cols within) */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-[389px]:gap-5">
                {loading ? (
                  <div className="md:col-span-2 min-h-[260px] flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : visiblePosts.length === 0 ? (
                  <div className="md:col-span-2 glass-card rounded-2xl p-10 text-center">
                    <h3 className="font-playfair text-3xl font-bold text-[#0B0B0B] mb-2">Aún no hay publicaciones</h3>
                    <p className="premium-description">No hay resultados para esa categoría. Prueba otra opción.</p>
                  </div>
                ) : visiblePosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden glass-card rounded-xl h-full flex flex-col">
                      <div className="aspect-[16/9] overflow-hidden relative">
                        <img
                          src={post.imagen_portada}
                          alt={post.título}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <CardContent className="p-5 md:p-6 flex-1 flex flex-col max-[389px]:p-4">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.fecha_publicacion)}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.autor_nombre}</span>
                        </div>
                        <h2 className="font-playfair text-2xl font-bold text-[#0B0B0B] mb-3 line-clamp-2 max-[389px]:text-[1.35rem]">
                          {post.título}
                        </h2>
                        <p className="premium-description text-justify-desktop text-sm mb-6 flex-1 line-clamp-3">
                          {post.extracto}
                        </p>
                        <Button
                          onClick={() => navigate(`/blog/${post.slug || post.id}`)}
                          variant="outline"
                          className="w-full max-[389px]:text-sm max-[389px]:py-2.5"
                        >
                          Leer más
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8 max-[389px]:space-y-5">
              <div className="glass-card rounded-xl p-6 max-[389px]:p-4">
                <h3 className="font-playfair text-xl font-bold text-[#0B0B0B] mb-4 border-b pb-2">Últimas Publicaciones</h3>
                <ul className="space-y-4">
                  {posts.slice(0, 6).map(post => (
                    <li key={post.slug} className="group cursor-pointer" onClick={() => navigate(`/blog/${post.slug || post.id}`)}>
                      <h4 className="font-medium text-gray-800 group-hover:text-[#C8A94B] transition-colors">{post.título}</h4>
                      <span className="text-xs text-gray-500">{formatDate(post.fecha_publicacion)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card rounded-xl p-6 max-[389px]:p-4">
                <h3 className="font-playfair text-xl font-bold text-[#0B0B0B] mb-4 border-b pb-2">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-full text-sm transition max-[389px]:text-xs max-[389px]:px-2.5 ${
                      selectedCategory === 'all'
                        ? 'bg-[#C8A94B] text-white'
                        : 'bg-[#F4F5F7] text-gray-600 hover:bg-[#C8A94B] hover:text-white'
                    }`}
                  >
                    Todas
                  </button>
                  {filterCategories.length === 0 ? (
                    <span className="text-sm text-gray-500">Sin categorías publicadas</span>
                  ) : (
                    filterCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-3 py-1 rounded-full text-sm transition max-[389px]:text-xs max-[389px]:px-2.5 ${
                          selectedCategory === category.id
                            ? 'text-white'
                            : 'bg-[#F4F5F7] text-gray-600 hover:bg-[#C8A94B] hover:text-white'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === category.id ? category.color : undefined,
                        }}
                      >
                        {category.nombre}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPage;
