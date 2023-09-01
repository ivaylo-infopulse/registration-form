import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProducts } from "../../features/user";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";


const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProducts = useSelector((state) => state.user.basket);
  const totalPrice = useSelector((state) =>
    parseFloat(state.user.totalPrice.toFixed(2))
  );
  const [productList, setProductList] = useState([]);
  const [showAddButton, setShowAddButton] = useState(null);
  const [basketList, setBasketList] = useState(userProducts);
  const [isBasket, setIsBaskt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const basketContainerRef = useRef(null);

  useEffect(() => {
    const apiUrl = "https://fakestoreapi.com/products";
    axios
      .get(apiUrl)
      .then((response) => {
        setProductList(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  const onAddProduct = (image, price) => {
    setIsBaskt(true);
    window.scrollTo(0, 10);

    const updatedBasket = [...basketList, { image, price }];
    setBasketList(updatedBasket);
    dispatch(addProducts(updatedBasket));
  };

  const onDelete = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      const updatedBasket = [...basketList];
      updatedBasket.splice(index, 1);
      setBasketList(updatedBasket);
      dispatch(addProducts(updatedBasket));
    }
  };

  useEffect(() => {
    if (basketContainerRef.current) {
      const targetScroll = basketContainerRef.current.scrollHeight;
      const currentScroll = basketContainerRef.current.scrollTop;
      const distance = targetScroll - currentScroll;
      let startTime = null;

      const animateScroll = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / 600;

        basketContainerRef.current.scrollTop =
          currentScroll + distance * progress;
        if (progress < 1) requestAnimationFrame(animateScroll);
      };
      requestAnimationFrame(animateScroll);
    }
  }, [userProducts]);


  return (
    <>
      {isLoading ? (
        <div className="spin"></div>
      ) : (
        <div className="product-buttons-container">
          <button onClick={() => setIsBaskt(!isBasket)}>
            {!isBasket ? "Show basket" : "Hide basket"}
          </button>
          <button onClick={() => navigate("/profile")}>Back to profile</button>
        </div>
      )}
      {isBasket && (
        <div className="basket-container" ref={basketContainerRef}>
          <span>Added products:</span>
          <ul className="basket">
            {userProducts?.map((product, index) => {
              return (
                <li key={index} className="basket-product">
                  {index + 1}
                  <img
                    className="basket-img"
                    src={product.image}
                    alt="product pic"
                  />
                  <p className="cost-price">Price {product.price} $</p>
                  <FontAwesomeIcon
                    className="trash-icon"
                    onClick={() => onDelete(index, product.price)}
                    icon={faTrash}
                  />
                </li>
              );
            })}
          </ul>
          <div className="total-cost">Total cost: {totalPrice} $</div>
        </div>
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
                <p className="product-price">Price: {product.price} $</p>
                {showAddButton === index && (
                  <button
                    className="add-button"
                    onMouseEnter={() => setShowAddButton(index)}
                    onClick={() => onAddProduct(product.image, product.price)}
                  >
                    Add to <FontAwesomeIcon icon={faShoppingBasket} />
                  </button>
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