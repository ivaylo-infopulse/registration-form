import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { logout } from "../../../features/user";
import { buyProduct, deleteProducts } from "../../../features/basket";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Basket, applyDiscount } from "../Basket";
import "./styles.css";

const FinishOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registrationToken = localStorage.getItem("registrationToken");
  const { userId } = useParams();
  const user = useSelector((state) => state.user?.value.isUserExist);
  const products = useSelector((state) => state.basket?.basket);
  const product = useSelector((state) => state.basket?.productToBuy);
  const totalPrice = parseFloat(
    useSelector((state) => state.basket.totalPrice)
  ).toFixed(2);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const [discount, setDiscount] = useState(user?.discount);
  const isItemDiscount = product?.discount
    ? applyDiscount(product?.price)
    : product?.price;
  const locations = [
    {
      bulgaria: ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora"],
    },
    { ukraina: ["Kiev", "Odesa", "Zhytomyr"] },
    { usa: ["New Yourk", "Los Angeles", "Miami", "Chicago"] },
  ];
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = JSON.parse(registrationToken);
      const isExpired = Date.now() > token?.expiresAt;
      if (isExpired && discount) {
        setDiscount(false);
        dispatch(deleteProducts([]));
        product && dispatch(buyProduct({ ...product, discount: 0 }));
        dispatch(logout());
        alert("You session expired. Please login to use your discount");
      }
    };
    const checkInterval = setInterval(checkTokenExpiration, 100);
    return () => clearInterval(checkInterval);
  }, [discount, dispatch, product, registrationToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalPrice > 0) {
      alert(
        `Your order const is ${
          isItemDiscount || totalPrice
        }$ and will be send to ${country}, ${city}, ${
          street.charAt(0).toUpperCase() + street.slice(1)
        }, with phone number: ${phone}`
      );
      !product?.price ? dispatch(deleteProducts([])) : dispatch(buyProduct());
      navigate(`/products-list/${userId}`);
    } else {
      alert("Your basket is empty! Please add products.");
      navigate(`/products-list/${userId}`);
    }
  };

  const onGoBack = (e) => {
    e.preventDefault();
    dispatch(buyProduct());
    navigate(`/products-list/${userId}`);
  };

  return (
    <div className="order-wrapper">
      {!product?.price ? (
        <Basket userProducts={products} discount={discount} />
      ) : (
        <div className="item-wrapper">
          <div className="selected-item">Selected item</div>
          <img className="basket-img" src={product.image} alt="product pic" />
          <label className="cost-price">Price {isItemDiscount} $</label>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="country">Country:</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          <option disabled value="">
            Select country
          </option>
          {locations.map((location, index) => {
            const country =
              Object.keys(location)[0].charAt(0).toUpperCase() +
              Object.keys(location)[0].slice(1);
            return (
              <option key={index} value={country}>
                {country}
              </option>
            );
          })}
        </select>

        <label htmlFor="city">City:</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          disabled={!country && true}
        >
          <option disabled value="">
            Select city
          </option>
          {locations
            .find((countryObj) => country.toLowerCase() in countryObj)
            ?.[country.toLowerCase()].map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
        </select>
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
        <input
          type="text"
          value={`${isItemDiscount || totalPrice} $`}
          disabled
        />
        <div className="btn-wrapper">
          <button type="submit">Submit</button>
          <button onClick={onGoBack}>Go back</button>
        </div>
      </form>
    </div>
  );
};

export default FinishOrder;
