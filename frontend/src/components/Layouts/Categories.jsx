import React from 'react';
import { Link } from 'react-router-dom';
import mobiles from '../../assets/images/Categories/phone.png';
import fashion from '../../assets/images/Categories/fashion.png';
import electronics from '../../assets/images/Categories/electronics.png';
import home from '../../assets/images/Categories/home.png';
import travel from '../../assets/images/Categories/travel.png';
import furniture from '../../assets/images/Categories/furniture.png';
import beauty from '../../assets/images/Categories/beauty.png';
import grocery from '../../assets/images/Categories/grocery.png';

const catNav = [
  { name: 'Mobiles', icon: mobiles },
  { name: 'Fashion', icon: fashion },
  { name: 'Electronics', icon: electronics },
  { name: 'Home', icon: home },
  { name: 'Travel', icon: travel },
  { name: 'Furniture', icon: furniture },
  { name: 'Beauty, Toys & More', icon: beauty },
  { name: 'Grocery', icon: grocery },
];

const Categories = () => {
  return (
    <section className="bg-white mt-10 mb-4 min-w-full px-4 sm:px-12 py-1 shadow overflow-hidden">
      {/* Horizontal scroll container for mobile */}
      <div className="flex items-center justify-between mt-4 overflow-x-auto scrollbar-hide">
        {catNav.map((item, i) => (
          <Link
            to={`/products?category=${item.name}`}
            className="flex flex-col gap-1 items-center p-2 group min-w-[80px] sm:min-w-0"
            key={i}
            aria-label={`Explore ${item.name}`}
          >
            <div className="h-16 w-16 flex items-center justify-center">
              <img
                draggable="false"
                className="h-full w-full object-contain"
                src={item.icon}
                alt={item.name}
                loading="lazy" // Lazy load images for better performance
              />
            </div>
            <span className="text-sm text-gray-800 font-medium text-center group-hover:text-primary-blue transition-colors">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Categories); // Optimize re-renders