import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, buyProduct, addProducts } from "../../features/user";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { Basket } from "./Basket";
import "./styles.css";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registrationToken = localStorage.getItem("registrationToken");
  const existingData = JSON.parse(localStorage.getItem("userData"));
  const { user, userProducts, totalPrice } = useSelector((state) => ({
    user: state.user?.value,
    userProducts: state.user?.basket,
    totalPrice: parseFloat(state.user.totalPrice).toFixed(2),
  }));
  const userId = existingData.findIndex((data) => data?.name === user?.name);
  const [productList, setProductList] = useState([]);
  const [showAddButton, setShowAddButton] = useState(null);
  const [basketList, setBasketList] = useState(userProducts);
  const [isBasket, setIsBaskt] = useState(basketList.length===0 ? false : true);
  const discount = existingData[userId]?.discount;
  // debugger

  useEffect(() => {
    const token = JSON.parse(registrationToken);
    Date.now() > token?.expiresAt | !token && dispatch(logout()); 
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProductList(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    })();
  }, []);

  const onAddProduct = (image, price, id) => {
    setIsBaskt(true);
    window.scrollTo(0, 10);

    const existingProductIndex = basketList.findIndex(
      (product) => product.id === id
    );

    if (existingProductIndex !== -1) {
      const updatedBasket = basketList.map((product, index) => {
        if (index === existingProductIndex) {
          const updatedProduct = { ...product };
          updatedProduct.quantity += 1;
          return updatedProduct;
        }
        return product;
      });
      setBasketList(updatedBasket);
      dispatch(addProducts(updatedBasket));
    } else {
      const updatedBasket = [
        ...basketList,
        { image, price, id, discount, quantity: 1 },
      ];
      setBasketList(updatedBasket);
      dispatch(addProducts(updatedBasket));
    }
  };

  const onBuyNow =(image, price, id)=>{
    dispatch(buyProduct({ image, price, id, discount, quantity: 1 }));
    navigate('/finish-order')
  }

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
    <>
      {productList.length === 0 ? (
        <div className="spin" />
      ) : (
        <div className="product-buttons-container">
          <button onClick={() => setIsBaskt(!isBasket)}>
            {!isBasket ? "Show basket" : "Hide basket"}
          </button>
          <button onClick={() => navigate("/profile")}>Back to profile</button>
        </div>
      )}

      {isBasket && (
        <Basket
          discount={discount}
          userProducts={userProducts}
          onDelete={onDelete}
          totalPrice={totalPrice}
          applyDiscount={applyDiscount}
        />
      )}

      <div className="product-list">
        <h1>Products List</h1>
        <div className="products-list-wrapper">
          {productList.slice(0, 15).map((product, index) => {
            return (
              <div className="products-list" key={product.id}>
                <img
                  className="product-img"
                  src={product.image}
                  alt={product.title}
                  onMouseEnter={() => setShowAddButton(index)}
                  onMouseLeave={() => setShowAddButton(null)}
                />
                <div className="product-price">
                  Price:
                  <span className={discount && "add-discount"}>
                    {product.price}
                  </span>
                  $
                </div>
                <div className={discount ? "discount" : "no-discount"}>
                  {applyDiscount(product.price)} $
                </div>

                {showAddButton === index && (
                  <>
                    <button
                      className="add-button"
                      onMouseEnter={() => setShowAddButton(index)}
                      onClick={() =>
                        onAddProduct(product.image, product.price, product.id)
                      }
                    >
                      Add to <FontAwesomeIcon icon={faShoppingBasket} />
                    </button>
                    <button
                      className="buy-now-btn"
                      onMouseEnter={() => setShowAddButton(index)}
                      onClick={() =>
                        onBuyNow(product.image, product.price, product.id)
                      }
                    >
                      Buy now
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProductsList;
