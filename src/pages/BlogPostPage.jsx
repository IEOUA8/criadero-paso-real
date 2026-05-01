import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { normalizeBlogPost } from '@/lib/contentAdapters';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('estado', 'published')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          navigate('/blog');
          return;
        }

        const normalizedPost = normalizeBlogPost(data);
        setPost(normalizedPost);

        const { data: relatedData, error: relatedError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('estado', 'published')
          .neq('id', data.id)
          .order('fecha_publicacion', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(3);

        if (relatedError) throw relatedError;
        setRelatedPosts((relatedData || []).map(normalizeBlogPost));
      } catch (error) {
        console.error('Error loading blog post:', error);
        toast({
          variant: 'destructive',
          title: 'No se pudo cargar el artículo',
          description: 'Intenta nuevamente en unos segundos.',
        });
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadPost();
  }, [slug, navigate, toast]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen premium-page-bg pt-28 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  if (!post) return null;

  return (
    <>
      <Helmet>
        <title>{post.título} - Criadero Paso Real</title>
        <meta
          name="description"
          content={(post.extracto || post.contenido || '').slice(0, 160)}
        />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#0B0B0B] mb-6 leading-tight">
                  {post.título}
                </h1>
                <div className="flex items-center gap-6 text-gray-500 border-y border-gray-100 py-4">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C8A94B]" />
                    {post.autor_nombre}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#C8A94B]" />
                    {formatDate(post.fecha_publicacion)}
                  </span>
                </div>
              </div>

              <div className="aspect-[21/9] rounded-xl overflow-hidden mb-12 shadow-md">
                <img src={post.imagen_portada} alt={post.título} className="w-full h-full object-cover" />
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
                {post.contenido}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200 flex items-center gap-3">
                <span className="font-medium text-[#0B0B0B] flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Compartir:
                </span>
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard?.writeText(url);
                    toast({
                      title: 'Enlace copiado',
                      description: 'El enlace del artículo fue copiado al portapapeles.',
                    });
                  }}
                >
                  Copiar enlace
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 glass-card rounded-xl p-6">
                <h3 className="font-playfair text-xl font-bold text-[#0B0B0B] mb-4 border-b pb-2">Artículos Relacionados</h3>
                <div className="space-y-6">
                  {relatedPosts.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay artículos relacionados por ahora.</p>
                  ) : (
                    relatedPosts.map((related) => (
                      <div
                        key={related.id}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/blog/${related.slug || related.id}`)}
                      >
                        <div className="aspect-video rounded-lg overflow-hidden mb-2">
                          <img
                            src={related.imagen_portada}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            alt={related.título}
                          />
                        </div>
                        <h4 className="font-medium text-[#0B0B0B] group-hover:text-[#C8A94B] transition-colors">
                          {related.título}
                        </h4>
                      </div>
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

export default BlogPostPage;

