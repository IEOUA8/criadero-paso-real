import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

const BlogCard = ({ post, index = 0 }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className="group overflow-hidden border-[#cdbb91] bg-[#fffdf7] shadow-none cursor-pointer"
        onClick={() => navigate(`/blog/${post.slug}`)}
      >
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            src={post.imagen_portada}
            alt={post.título}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            {post.autor && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.autor}</span>
              </div>
            )}
          </div>
          <h3 className="font-playfair text-xl font-bold text-[#0B0B0B] mb-2 group-hover:text-[#C8A94B] transition">
            {post.título}
          </h3>
          <p className="premium-description line-clamp-3">
            {post.extracto}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
