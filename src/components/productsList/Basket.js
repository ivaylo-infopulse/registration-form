import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

export const Basket = ({
  discount,
  userProducts,
  onDelete,
  totalPrice,
  applyDiscount,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const basketContainerRef = useRef(null);
  const isOrderBtn = location.pathname === "/products-list";
  // debugger
  
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

  return (
    <div className="basket-container" ref={basketContainerRef}>
      <span>Added products:</span>

      <ul className="basket">
        {userProducts?.map((product) => (
          <li key={product.id} className="basket-product">
            {product.quantity}
            <img className="basket-img" src={product.image} alt="product pic" />
            <p className="cost-price">
              Price {discount ? applyDiscount(product.price) : product.price} $
            </p>

            <FontAwesomeIcon
              className="trash-icon"
              onClick={() => onDelete(product.id)}
              icon={faTrash}
            />
          </li>
        ))}
      </ul>

      <div className="total-cost">
        {totalPrice > 0 ? (
          <>
            Total cost: ${totalPrice} $
            {isOrderBtn && (
              <button onClick={() => navigate("/finish-order")}>
                finish order
              </button>
            )}
          </>
        ) : (
          "Basket is empty"
        )}
      </div>
    </div>
  );
};
