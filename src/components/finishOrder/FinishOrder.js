import React, { useState } from "react";
import { addProducts, buyProduct } from "../../features/user";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { Basket } from "../productsList/Basket";

const FinishOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingData = JSON.parse(localStorage.getItem("userData"));
  const [country, setCountry] = useState();
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const { user, totalPrice, productPrice, products, product } = useSelector(
    (state) => ({
      user: state.user?.value,
      products: state.user?.basket,
      product: state.user?.productToBuy,
      totalPrice: parseFloat(state.user.totalPrice).toFixed(2),
      productPrice:
        state.user.productPrice && state.user.productPrice.toFixed(2),
    })
  );
  const [basketList, setBasketList] = useState(products);
  const userId = existingData.findIndex((data) => data?.name === user?.name);
  const discount = existingData[userId]?.discount;

  // debugger;
  const handleSubmit = () => {
    alert(
      `Your order const is ${
        productPrice || totalPrice
      }$ and will be send to ${country}, ${city}, ${street}, with phone number: ${phone}`
    );
    !productPrice ? dispatch(addProducts([])) : dispatch(buyProduct());
    navigate("/products-list");
  };

  const onGoBack = () => {
    dispatch(buyProduct());
    navigate("/products-list");
  };

  const onDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
        const updatedBasket = [...basketList].filter((item) => item.id !== id);
        setBasketList(updatedBasket);
        dispatch(addProducts(updatedBasket));  
    }
  };

  const applyDiscount = (productPrice) => (productPrice * (1 - 0.2)).toFixed(2);

  return (
    <div className="order-wrapper">
      {!productPrice ? (
        <Basket
          userProducts={products}
          onDelete={onDelete}
          totalPrice={totalPrice}
          discount={discount}
          applyDiscount={applyDiscount}
        />
      ) : (
        <div className="item-wrapper">
            <div className="selected-item">Selected item</div>
            <img className="basket-img" src={product.image} alt="product pic" />
            <label className="cost-price">
              Price {discount ? applyDiscount(product.price) : product.price} $
            </label>
          </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          placeholder="Enter your country"
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <label htmlFor="city">City:</label>
        <input
          type="text"
          placeholder="Enter your city"
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <label htmlFor="street">Street number:</label>
        <input
          type="text"
          placeholder="Enter Street and street №"
          onChange={(e) => setStreet(e.target.value)}
          required
        />
        <label htmlFor="phone">Phone number:</label>
        <input
          type="tel"
          placeholder="Enter phone number"
          pattern="[0-9]{10}"
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label>Total amount to pay:</label>
        <input type="text" value={`${productPrice || totalPrice} $`} disabled />
        <div className="btn-wrapper">
          <button type="submit">Submit</button>
          <button onClick={() => onGoBack()}>Go back</button>
        </div>
      </form>
    </div>
  );
};

export default FinishOrder;
