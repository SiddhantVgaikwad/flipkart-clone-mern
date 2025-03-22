import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import gadgetSale from '../../../assets/images/Banners/gadget-sale.jpg';
import kitchenSale from '../../../assets/images/Banners/kitchen-sale.jpg';
import poco from '../../../assets/images/Banners/poco-m4-pro.webp';
import realme from '../../../assets/images/Banners/realme-9-pro.webp';
import fashionSale from '../../../assets/images/Banners/fashionsale.jpg';
import oppo from '../../../assets/images/Banners/oppo-reno7.webp';
import './Banner.css';

export const PreviousBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick} aria-label="Previous">
      <ArrowBackIosIcon />
    </div>
  );
};

export const NextBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick} aria-label="Next">
      <ArrowForwardIosIcon />
    </div>
  );
};

const Banner = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
  };

  const banners = [gadgetSale, kitchenSale, poco, fashionSale, realme, oppo];

  return (
    <section className="h-44 sm:h-72 w-full rounded-sm shadow relative overflow-hidden">
      <Slider {...settings}>
        {banners.map((el, i) => (
          <div key={i} className="h-44 sm:h-72 w-full">
            <img
              draggable="false"
              className="h-full w-full object-cover"
              src={el}
              alt={`Banner ${i + 1}`}
              loading="lazy" // Lazy load images for better performance
            />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Banner;