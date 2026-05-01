import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const mainImage = product.product_images?.[0]?.imagen_url || product.imagen_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden glass-card">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={mainImage}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4">
            <Badge variant={product.estado === 'Disponible' ? 'gold' : 'secondary'}>
              {product.estado}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="font-playfair text-2xl font-bold text-[#0B0B0B] mb-2">
            {product.nombre}
          </h3>
          <p className="premium-description line-clamp-2 mb-4">
            {product.descripción}
          </p>
          <p className="text-[#C8A94B] font-bold text-xl">
            {formatPrice(product.precio)}
          </p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button
            onClick={() => navigate(`/venta/${product.id}`)}
            className="w-full"
          >
            Ver detalles
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
