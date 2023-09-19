import React, { useState, useEffect } from "react";
import { addProducts, buyProduct, logout } from "../../features/user";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Basket, applyDiscount } from "../productsList/Basket";
import "./styles.css";

const FinishOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registrationToken = localStorage.getItem("registrationToken");
  const existingData = JSON.parse(localStorage.getItem("userData"));
  const [country, setCountry] = useState();
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const { user, products, totalPrice, product, productPrice } = useSelector(
    (state) => ({
      user: state.user?.value,
      products: state.user?.basket,
      totalPrice: parseFloat(state.user.totalPrice).toFixed(2),
      product: state.user?.productToBuy,
      productPrice: state.user?.productToBuy?.discount
        ? applyDiscount(state.user?.productToBuy?.price)
        : state.user?.productToBuy?.price,
    })
  );
  const userId = existingData.findIndex((data) => data?.name === user?.name);
  const [discount, setDiscount] = useState(existingData[userId]?.discount);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = JSON.parse(registrationToken);
      const isExpired = Date.now() > token?.expiresAt;
      if (isExpired && discount) {
        setDiscount(false);
        dispatch(logout());
        dispatch(addProducts([]));
        product && dispatch(buyProduct({ ...product, discount: 0 }));
        alert("You session expired. Please login to use your discount");
      }
    };
    const checkInterval = setInterval(checkTokenExpiration, 100);
    return () => clearInterval(checkInterval);
  }, [discount, dispatch, product, registrationToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Your order const is ${
        productPrice || totalPrice
      }$ and will be send to ${country}, ${city}, ${street}, with phone number: ${phone}`
    );
    !productPrice ? dispatch(addProducts([])) : dispatch(buyProduct());
    navigate("/products-list");
  };

  const onGoBack = (e) => {
    e.preventDefault();
    dispatch(buyProduct());
    navigate("/products-list");
  };

  return (
    <div className="order-wrapper">
      {!productPrice ? (
        <Basket userProducts={products} discount={discount} />
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
          <button onClick={onGoBack}>Go back</button>
        </div>
      </form>
    </div>
  );
};

export default FinishOrder;
