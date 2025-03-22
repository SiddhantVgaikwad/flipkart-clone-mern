import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Searchbar from './Searchbar';
import logo from '../../../assets/images/logo.png';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';
import SecondaryDropDownMenu from './SecondaryDropDownMenu';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector(state => state.cart);

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
  const [toggleSecondaryDropDown, setToggleSecondaryDropDown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounced search function
  const handleSearch = debounce((query) => {
    console.log('Searching for:', query);
    // Implement your search logic here
  }, 300);

  return (
    <header className="bg-primary-blue fixed top-0 py-2.5 w-full z-10 shadow-md">
      {/* Navbar container */}
      <div className="w-full max-w-7xl px-4 mx-auto flex justify-between items-center">
        {/* Logo & search container */}
        <div className="flex items-center flex-1 space-x-4">
          <Link to="/" className="h-8">
            <img
              draggable="false"
              className="h-full w-auto object-contain"
              src={logo}
              alt="Flipkart Logo"
            />
          </Link>

          <Searchbar onSearch={handleSearch} />
        </div>

        {/* Right navs */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {isAuthenticated ? (
            <div className="relative">
              <button
                className="flex items-center text-white font-medium hover:opacity-80 transition-opacity"
                onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
                aria-expanded={togglePrimaryDropDown}
              >
                {user.name.split(" ", 1)}
                {togglePrimaryDropDown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </button>
              {togglePrimaryDropDown && (
                <PrimaryDropDownMenu
                  setTogglePrimaryDropDown={setTogglePrimaryDropDown}
                  user={user}
                />
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-primary-blue bg-white font-medium rounded-sm hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
          )}

          {!isMobile && (
            <div className="relative">
              <button
                className="flex items-center text-white font-medium hover:opacity-80 transition-opacity"
                onClick={() => setToggleSecondaryDropDown(!toggleSecondaryDropDown)}
                aria-expanded={toggleSecondaryDropDown}
              >
                More
                {toggleSecondaryDropDown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </button>
              {toggleSecondaryDropDown && <SecondaryDropDownMenu />}
            </div>
          )}

          <Link
            to="/cart"
            className="flex items-center text-white font-medium hover:opacity-80 transition-opacity relative"
          >
            <ShoppingCartIcon />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
            <span className="ml-2">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;