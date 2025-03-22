import { useEffect } from 'react';
import Categories from '../Layouts/Categories';
import Banner from './Banner/Banner';
import DealSlider from './DealSlider/DealSlider';
import ProductSlider from './ProductSlider/ProductSlider';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getSliderProducts } from '../../actions/productAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import SkeletonLoader from '../Layouts/SkeletonLoader'; // Add a skeleton loader component

const Home = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { error, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    // Fetch slider products
    dispatch(getSliderProducts());

    // Cleanup function to avoid memory leaks
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More. Best Offers!" />
      <Categories />
      <main className="flex flex-col gap-6 px-2 mt-16 sm:mt-2">
        <Banner />

        {/* Discounts for You */}
        <section aria-labelledby="discounts-for-you">
          <h2 id="discounts-for-you" className="text-xl font-bold mb-4">Discounts for You</h2>
          <DealSlider title="Discounts for You" />
        </section>

        {/* Suggested for You */}
        <section aria-labelledby="suggested-for-you">
          <h2 id="suggested-for-you" className="text-xl font-bold mb-4">Suggested for You</h2>
          {loading ? (
            <SkeletonLoader type="productSlider" />
          ) : (
            <ProductSlider title="Suggested for You" tagline="Based on Your Activity" />
          )}
        </section>

        {/* Top Brands, Best Price */}
        <section aria-labelledby="top-brands">
          <h2 id="top-brands" className="text-xl font-bold mb-4">Top Brands, Best Price</h2>
          <DealSlider title="Top Brands, Best Price" />
        </section>

        {/* You May Also Like */}
        <section aria-labelledby="you-may-also-like">
          <h2 id="you-may-also-like" className="text-xl font-bold mb-4">You May Also Like...</h2>
          {loading ? (
            <SkeletonLoader type="productSlider" />
          ) : (
            <ProductSlider title="You May Also Like..." tagline="Based on Your Interest" />
          )}
        </section>

        {/* Top Offers On */}
        <section aria-labelledby="top-offers">
          <h2 id="top-offers" className="text-xl font-bold mb-4">Top Offers On</h2>
          <DealSlider title="Top Offers On" />
        </section>

        {/* Don't Miss These! */}
        <section aria-labelledby="dont-miss-these">
          <h2 id="dont-miss-these" className="text-xl font-bold mb-4">Don't Miss These!</h2>
          {loading ? (
            <SkeletonLoader type="dealSlider" />
          ) : (
            <ProductSlider title="Don't Miss These!" tagline="Inspired by your order" />
          )}
        </section>
      </main>
    </>
  );
};

export default Home;