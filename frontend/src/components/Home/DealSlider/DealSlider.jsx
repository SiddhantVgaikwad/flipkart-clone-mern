import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { NextBtn, PreviousBtn } from '../Banner/Banner';
import { offerProducts } from '../../../utils/constants';
import { getRandomProducts } from '../../../utils/functions';
import Product from './Product';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6,
  initialSlide: 1,
  swipe: false,
  prevArrow: <PreviousBtn />,
  nextArrow: <NextBtn />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const DealSlider = ({ title }) => {
  const randomProducts = getRandomProducts(offerProducts, 12);

  return (
    <section className="bg-white w-full shadow overflow-hidden" aria-labelledby="deal-slider-title">
      {/* Header */}
      <div className="flex px-6 py-3 justify-between items-center">
        <h1 id="deal-slider-title" className="text-xl font-medium">
          {title}
        </h1>
        <Link
          to="/products"
          className="bg-primary-blue text-xs font-medium text-white px-5 py-2.5 rounded-sm shadow-lg hover:bg-blue-600 transition-colors"
          aria-label="View all products"
        >
          VIEW ALL
        </Link>
      </div>
      <hr />

      {/* Slider */}
      <Slider {...settings}>
        {randomProducts.map((item, i) => (
          <div key={i} className="px-2">
            <Product {...item} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default React.memo(DealSlider); // Optimize re-renders