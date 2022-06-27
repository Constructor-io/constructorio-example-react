import React from 'react';

function ProductCard({ product }) {
  const imageTagClassesLoading = 'w-[300px] transition-opacity opacity-0';
  const imageTagClassesLoaded = 'w-[300px] transition-opacity opacity-100';

  return (
    <div
      className="product-card"
      data-cnstrc-item-id={ product.data.id }
      data-cnstrc-item-name={ product.value }
      data-cnstrc-item-variation-id={ product.data?.variation_id }
    >
      <div className="mb-1 h-[225px]">
        <img
          className={ imageTagClassesLoading }
          src={ product.data.image_url }
          alt={ product.value }
          onError={ (event) => { event.target.style.display = 'none'; } }
          onLoad={ (event) => { event.target.className = imageTagClassesLoaded; } }
        />
      </div>
      {product.value}
    </div>
  );
}

export default ProductCard;
