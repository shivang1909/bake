import React from 'react';
import { Link } from 'react-router-dom';

const BottomToolBar = () => {
  return (
    <>
      <div className="ec-nav-toolbar">
        <div className="container">
          <div className="ec-nav-panel">
            <div className="ec-nav-panel-icons">
              <Link to="/mobile-menu" className="navbar-toggler-btn ec-header-btn ec-side-toggle">
                <i className="fi fi-rr-menu-burger"></i>
              </Link>
            </div>
            <div className="ec-nav-panel-icons">
              <Link to="/shopall" className="toggle-cart ec-header-btn ec-side-toggle">
                <i className="fi-rr-shopping-basket"></i>
                <span className="ec-cart-noti ec-header-count cart-count-lable">3</span>
              </Link>
            </div>
            <div className="ec-nav-panel-icons">
              <Link to="/productpage" className="ec-header-btn">
                <i className="fi-rr-home"></i>
              </Link>
            </div>
            {/* <div className="ec-nav-panel-icons">
              <Link to="/wishlist" className="ec-header-btn">
                <i className="fi-rr-heart"></i>
                <span className="ec-cart-noti">4</span>
              </Link>
            </div> */}
            <div className="ec-nav-panel-icons">
              <Link to="/login" className="ec-header-btn">
                <i className="fi-rr-user"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomToolBar;
