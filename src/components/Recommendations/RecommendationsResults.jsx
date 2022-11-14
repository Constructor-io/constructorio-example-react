/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Carousel from 'react-multi-carousel';
import RecommendationCard from './RecommendationCard';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024,
    },
    items: 4,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 768,
    },
    items: 3,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: {
      max: 768,
      min: 500,
    },
    items: 2,
    partialVisibilityGutter: 30,
  },
};

function RecommendationsResults(props) {
  const {
    items,
    dataAttributes,
  } = props;
  return (
    <div
      id="recommendations"
      className="recommendations-carousel"
      data-cnstrc-recommendations
      data-cnstrc-recommendations-pod-id={ dataAttributes.dataCnstrcPodId }
      data-cnstrc-num-results={ dataAttributes.dataCnstrcNumResults }
      data-cnstrc-result-id={ dataAttributes.dataCnstrcResultId }
    >
      <Carousel
        responsive={ responsive }
        additionalTransfrom={ 0 }
        containerClass="container"
        itemClass=""
        sliderClass=""
        slidesToSlide={ 0 }
        centerMode
        removeArrowOnDeviceType={ ['tablet', 'mobile', 'desktop'] }
        draggable={ false }
        { ...dataAttributes }
      >
        { items.map((item) => <RecommendationCard key={ item.data.id } product={ item } />) }
      </Carousel>
    </div>

  );
}

export default RecommendationsResults;
