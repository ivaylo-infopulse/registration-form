import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProducts } from "../../features/user";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";
import { is } from "@babel/types";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const registrationToken = localStorage.getItem("registrationToken");
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
  const [isBasket, setIsBaskt] = useState(false);
  const basketContainerRef = useRef(null);
  const discount = existingData[userId]?.discount;

  // useEffect(() => {
  //   const token = JSON.parse(registrationToken);
  //   Date.now() > token?.expiresAt | !token && navigate("/"); 
  // });
 
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

    const existingProductIndex = basketList.findIndex((product) => product.id === id);

  if (existingProductIndex !== -1) {
    // If a product with the same ID already exists, update its quantity
    const updatedBasket = basketList.map((product, index) => {
      if (index === existingProductIndex) {
        // Create a copy of the existing product and update its quantity
        const updatedProduct = { ...product };
        updatedProduct.quantity += 1;
        return updatedProduct;
      }
      return product;
    });
    setBasketList(updatedBasket);
    dispatch(addProducts(updatedBasket));
    console.log(basketList)
    debugger

  } else {
    // If no product with the same ID exists, add a new product with quantity 1
    const updatedBasket = [...basketList, { image, price, id, discount, quantity: 1 }];
    setBasketList(updatedBasket);
    dispatch(addProducts(updatedBasket));
  }

    // const updatedBasket = [...basketList, { image, price, id, discount }];
    // setBasketList(updatedBasket);
  };

  const onDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
      );
      if (confirmDelete) {
        const updatedBasket =  [...basketList].filter(item => item.id !== id);
        setBasketList(updatedBasket);
      dispatch(addProducts(updatedBasket));
    }
  };

  useEffect(() => {
    if (basketContainerRef.current) {
      const targetScroll = basketContainerRef.current.scrollHeight;
      const currentScroll = basketContainerRef.current.scrollTop;
      let startTime = null;

      const animateScroll = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / 600;
        basketContainerRef.current.scrollTop =
          currentScroll + (targetScroll - currentScroll) * progress;

        progress < 1 && requestAnimationFrame(animateScroll);
      };
      requestAnimationFrame(animateScroll);
    }
  }, [userProducts]);

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
        <div className="basket-container" ref={basketContainerRef}>
          <span>Added products:</span>
          <ul className="basket">
            {userProducts?.map((product, index) => {
              // debugger
              return (
                <li key={product.id} className="basket-product">
                  {/* {index + 1} */}
                  {product.quantity}
                  <img
                    className="basket-img"
                    src={product.image}
                    alt="product pic"
                  />
                  <p className="cost-price">
                    Price{" "}
                    {discount ? applyDiscount(product.price) : product.price} $
                  </p>
                  <FontAwesomeIcon
                    className="trash-icon"
                    onClick={() => onDelete(product.id)}
                    icon={faTrash}
                  />
                </li>
              );
            })}
          </ul>
          <div className="total-cost">
            {totalPrice > 0 ? `Total cost: ${totalPrice} $` : "Basket is empty"}
          </div>
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
                  <button
                    className="add-button"
                    onMouseEnter={() => setShowAddButton(index)}
                    onClick={() => onAddProduct(product.image, product.price, product.id)}
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
