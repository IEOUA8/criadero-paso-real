const parseImageList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      if (value.trim()) return [value.trim()];
    }
  }
  return [];
};

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const normalizeProduct = (product) => {
  const images = parseImageList(product?.imagenes);
  const coverImage = product?.imagen_url || images[0] || 'https://images.unsplash.com/photo-1554145726-b87aa584c850?w=1200';
  const description =
    product?.descripcion ||
    product?.descripción ||
    product?.descripcion_breve ||
    'Ejemplar disponible en Criadero Paso Real.';

  return {
    ...product,
    id: String(product?.id ?? ''),
    nombre: product?.nombre || 'Sin nombre',
    tipo: product?.tipo || 'Animal',
    raza: product?.raza || 'Criollo colombiano',
    sexo: product?.sexo || 'No especificado',
    edad: product?.edad ?? null,
    color: product?.color || 'No especificado',
    alzada: product?.alzada ?? null,
    criador: product?.criador || 'Criadero Paso Real',
    propietario: product?.propietario || 'Criadero Paso Real',
    estado: product?.estado || 'available',
    precio: Number(product?.precio || 0),
    imagen: coverImage,
    imagenes: images.length > 0 ? images : [coverImage],
    descripcion: description,
    descripcionCompleta: product?.descripcion_completa || product?.descripcionCompleta || description,
    descripcionBreve: product?.descripcion_breve || product?.extracto || description,
    categoria_id: product?.categoria_id || null,
    categoria_nombre: product?.categoria_nombre || product?.categoria || null,
    categoria_slug: product?.categoria_slug || slugify(product?.categoria_nombre || product?.categoria || ''),
  };
};

export const normalizeReproductor = (item) => {
  const fotos = parseImageList(item?.fotos);
  const cover = fotos[0] || 'https://images.unsplash.com/photo-1695331326719-3d12cd513167?w=1200';

  return {
    ...item,
    id: String(item?.id ?? ''),
    nombre: item?.nombre || 'Reproductor',
    raza: item?.raza || 'Criollo colombiano',
    edad: item?.edad ?? null,
    descripcion: item?.descripcion || 'Sin descripción disponible.',
    estado: item?.estado || 'activo',
    fotos: fotos.length > 0 ? fotos : [cover],
    estado_publicacion: item?.estado_publicacion !== false,
  };
};

export const normalizeVientre = (item) => {
  const fotos = parseImageList(item?.fotos);
  const cover = fotos[0] || 'https://images.unsplash.com/photo-1673872800723-df87b2c829d1?w=1200';

  return {
    ...item,
    id: String(item?.id ?? ''),
    nombre: item?.nombre || 'Vientre',
    raza: item?.raza || 'Criollo colombiano',
    edad: item?.edad ?? null,
    descripcion: item?.descripcion || 'Sin descripción disponible.',
    estado_reproductivo: item?.estado_reproductivo || 'activo',
    estado_publicacion: item?.estado_publicacion !== false,
    fotos: fotos.length > 0 ? fotos : [cover],
  };
};

export const normalizeBlogPost = (post) => {
  const title = post?.título || post?.titulo || 'Sin título';
  const content = post?.contenido || '';
  const excerpt = post?.extracto || post?.resumen || content.slice(0, 220);
  const slug = post?.slug || String(post?.id || '').trim();

  return {
    ...post,
    id: String(post?.id ?? ''),
    título: title,
    contenido: content,
    extracto: excerpt,
    slug,
    imagen_portada:
      post?.imagen_portada || 'https://images.unsplash.com/photo-1554145726-b87aa584c850?w=1200',
    autor_nombre: post?.autor_nombre || 'Equipo Paso Real',
    categoria: post?.categoria || 'General',
    categoria_id: post?.categoria_id || null,
    categoria_nombre: post?.categoria_nombre || post?.categoria || 'General',
    categoria_slug: post?.categoria_slug || slugify(post?.categoria_nombre || post?.categoria || 'General'),
    estado: post?.estado || 'draft',
    fecha_publicacion: post?.fecha_publicacion || post?.created_at,
  };
};

export const normalizeCategory = (category) => {
  const nombre = category?.nombre || '';
  const slug = category?.slug || slugify(nombre);
  const tipo = category?.tipo || 'producto';

  return {
    ...category,
    id: String(category?.id ?? ''),
    nombre,
    slug,
    tipo,
    descripcion: category?.descripcion || '',
    activa: category?.activa !== false,
    orden: Number(category?.orden || 0),
    color: category?.color || '#C8A94B',
  };
};

export const makeSlug = slugify;
