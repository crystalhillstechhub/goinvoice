import React, { Component } from 'react';
import Auth from '../auth.js';
import { Link } from 'react-router-dom';

class Header extends Component{

  render() {
    const auth = new Auth();
    return (
      
      <nav>
        <div className="nav-wrapper teal">
          <Link to="/home"><span className="brand-logo">Goinvoice</span></Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><Link to="/products">Products</Link></li>
            <li><a href="badges.html">Customers</a></li>
            <li><a onClick={auth.logout}>Logout</a></li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Header;