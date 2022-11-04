/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { loadStatuses } from '../utils/constants';
import ProductCard from './ProductCard';
import Recommendations from './Recommendations';

function Results(props) {
  const {
    items,
    loadMoreStatus,
    totalResults,
    page,
    loadMoreSearchResults,
    dataAttributes,
  } = props;
  const numResultsPerPage = 21;
  const location = useLocation();

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [currentProduct, setCurrentProduct] = React.useState();

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setCurrentProduct();
    setIsOpen(false);
  }

  React.useEffect(() => {
    Modal.setAppElement('body');
  }, []);

  return (
    <div className="flex flex-col grow mt-8">
      <div
        id="search-results"
        className="mb-4 flex flex-col sm:flex-row flex-wrap sm:grid sm:grid-cols-[repeat(2,225px)] md:grid-cols-[repeat(3,225px)]
                lg:grid-cols-[repeat(4,225px)] auto-rows-max gap-y-6 place-content-center
                items-center md:items-start justify-around md:justify-between"
        data-cnstrc-num-results={ totalResults }
        { ...dataAttributes }
      >
        {
          items.map(
            (item) => (
              <ProductCard
                key={ item.data.id }
                product={ item }
                onProductClick={ (product) => {
                  setCurrentProduct(product);
                  openModal();
                } }
              />
            ),
          )
        }
      </div>
      {(page * numResultsPerPage < totalResults) && location.pathname.includes('search') && (
        <button className="w-80 mx-auto px-4 py-2 border rounded flex justify-center" type="button" onClick={ () => loadMoreSearchResults() }>
          {loadMoreStatus === loadStatuses.LOADING
            ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : `Load More Results ∙ ${(page * numResultsPerPage).toLocaleString()} / ${totalResults.toLocaleString()}` }
        </button>
      )}
      <Modal
        isOpen={ modalIsOpen }
      >
        <button onClick={ closeModal } type="button" className="text-4xl absolute right-10">&#215;</button>
        <div className="bg-white p-4 flex items-start mt-4 mb-20 justify-between">
          <div className="w-2/3">
            <img className="w-2/3 h-[400px] object-contain" alt="product" src={ currentProduct?.data.image_url } />
          </div>
          <div className="flex flex-col mt-28">
            <div className="text-3xl md:text-3xl mb-4 font-bold">
              {currentProduct?.value}
            </div>
            <div className="text-3xl">
              $
              {currentProduct?.data.price}
            </div>
          </div>
        </div>
        <Recommendations />
      </Modal>
    </div>
  );
}

export default Results;
