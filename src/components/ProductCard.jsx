import React, { useRef } from 'react';

import Popup from 'reactjs-popup';

function ProductCard({ product }) {
  const productCardRef = useRef();

  const imageTagClassesLoading = 'w-[225px] md:w-[300px] transition-opacity opacity-0 ml-auto mr-auto';
  const imageTagClassesLoaded = 'w-[225px] md:w-[300px] transition-opacity opacity-100 ml-auto mr-auto';

  return (
    <Popup
      trigger={
        (
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
        )
      }
      ref={ productCardRef }
      modal
      position="bottom right"
      keepTooltipInside="body"
      contentStyle={ {
        maxWidth: '850px',
        maxHeight: '700px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      } }
    >
      <div className="bg-white p-4 border-2">
        <div>
          <img alt="product" src={ product.data.image_url } />
        </div>
        <div>
          {product.value}
        </div>
        <div>
          $
          {product.data.price}
        </div>
      </div>
    </Popup>
  );
}

export default ProductCard;
