import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/user";
import { buyProduct, addProducts, deleteProducts } from "../../features/basket";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { Basket, applyDiscount } from "./Basket";
import "./styles.css";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registrationToken = localStorage.getItem("registrationToken");
  const userProducts = useSelector((state) => state.basket?.basket);
  const user = useSelector((state) => state.user.value.isUserExist);
  let { userId } = useParams();
  const [productList, setProductList] = useState([]);
  const [showAddButton, setShowAddButton] = useState(null);
  const [isBasket, setIsBaskt] = useState(
    userProducts.length === 0 ? false : true
  );
  const [discount, setDiscount] = useState(user?.discount);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = JSON.parse(registrationToken);
      const isExpired = Date.now() > token?.expiresAt;
      if (isExpired && discount) {
        setDiscount(false);
        dispatch(deleteProducts([]));
        dispatch(logout());
        alert("You session expired. Please login to use your discount");
      }
    };
    const checkInterval = setInterval(checkTokenExpiration, 100);
    return () => clearInterval(checkInterval);
  }, [discount, dispatch, registrationToken, user]);

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

  const onAddProducts = (image, price, id) => {
    setIsBaskt(true);
    window.scrollTo(0, 10);
    dispatch(addProducts([{ image, price, id }]));
  };

  const onBuyNow = (image, price, id) => {
    dispatch(buyProduct({ image, price, id, discount }));
    navigate(`/finish-order/${userId}`);
  };

  return (
    <>
      {productList.length === 0 ? (
        <div className="spin" />
      ) : (
        <div className="product-buttons-container">
          <button onClick={() => setIsBaskt(!isBasket)}>
            {!isBasket ? "Show basket" : "Hide basket"}
          </button>
          <button
            onClick={() => {
              navigate(`/profile/${userId}`);
              if (!userId) {
                dispatch(deleteProducts([]));
              }
            }}
          >
            Go Back
          </button>
        </div>
      )}

      {isBasket && <Basket discount={discount} userProducts={userProducts} />}

      <div className="product-list">
        <h1>Products List</h1>
        <div className="products-list-wrapper">
          {useMemo(() => productList.slice(0, 15), [productList]).map(
            (product, index) => {
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
                          onAddProducts(
                            product.image,
                            product.price,
                            product.id
                          )
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
            }
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsList;
