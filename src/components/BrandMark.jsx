import React from 'react';

const BrandMark = ({ className = 'w-9 h-9' }) => {
  return (
    <img
      src="/logo-paso-real.png"
      className={`${className} object-contain`}
      aria-hidden="true"
      alt=""
    />
  );
};

export default BrandMark;
