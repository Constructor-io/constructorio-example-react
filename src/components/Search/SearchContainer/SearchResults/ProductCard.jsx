import React from 'react';

function ProductCard({ product }) {
  const imageTagClassesLoading = 'w-[225px] md:w-[300px] transition-opacity opacity-0 ml-auto mr-auto';
  const imageTagClassesLoaded = 'w-[225px] md:w-[300px] transition-opacity opacity-100 ml-auto mr-auto';

  return (
    <div
      className="product-card text-center"
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
