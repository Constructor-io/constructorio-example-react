import React from 'react';

function RecommendationCard({ product }) {
  const imageTagClassesLoading = 'h-[100px] md:h-[150px] transition-opacity opacity-0 ml-auto mr-auto';
  const imageTagClassesLoaded = 'h-[100px] md:h-[150px] transition-opacity opacity-100 ml-auto mr-auto';

  return (
    <div
      role="button"
      tabIndex={ 0 }
      className="recommendation text-center flex flex-col items-center"
      data-cnstrc-item="Recommendation"
      data-cnstrc-item-id={ product.data.id }
      data-cnstrc-item-name={ product.value }
      data-cnstrc-item-variation-id={ product.data?.variation_id }
      data-cnstrc-strategy-id={ product.strategy?.id }
    >
      <div className="mb-3">
        <img
          className={ imageTagClassesLoading }
          src={ product.data.image_url }
          alt={ product.value }
          onError={ (event) => { event.target.style.display = 'none'; } }
          onLoad={ (event) => { event.target.className = imageTagClassesLoaded; } }
        />
      </div>
      <div className="w-2/3 text-center">
        {product.value}
      </div>
    </div>
  );
}

export default RecommendationCard;
