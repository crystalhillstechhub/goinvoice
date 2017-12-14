import React, { Component } from 'react';
import Header from './Header';
import axios from 'axios';

class Products extends Component {

  constructor() {
    super();
    this.state = {
      productName: '',
      productDescription: '',
      productExpiry: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { productName, productDescription , productExpiry } = this.state;

    axios.post('/api/product', { productName, productDescription, productExpiry })
      .then((result) => {
        this.props.history.push("/")
      });
  }

  render() {
    return (
      <div>
        <Header />
        <div className="row">
          <form className="col s6" onSubmit={this.onSubmit}>
              <div className="input-field">
               Product Name: <input id="first_name" type="text" className="validate" name="" />
              </div>
              <div className="input-field">
             Product Description: <textarea className="materialize-textarea validate" name=""></textarea>
              </div>
              <div className="input-field">
               Product Expiry Date: <input id="password" type="text" className="validate" name="" />
              </div>
            <input type="submit" value="Add Product" className="btn btn-success" />
          </form>
        </div>
      </div>
    )
  }
}
export default Products;