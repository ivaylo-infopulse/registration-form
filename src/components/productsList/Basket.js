import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProducts, totalCost } from "../../features/basket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

export const applyDiscount = (productPrice) =>
  (productPrice * (1 - 0.2)).toFixed(2);

export const Basket = ({ discount, userProducts }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const total = useSelector((state) => state.basket.totalPrice);
  const basketContainerRef = useRef(null);
  const isOrderBtn = location.pathname === `/products-list/${userId}`;
  const registrationToken = localStorage.getItem("registrationToken");

  const onDelete = useCallback(
    (id) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (confirmDelete) {
        dispatch(deleteProducts({ userProducts, id }));
      }
    },
    [userProducts, dispatch]
  );

  const totalPrice = useMemo(() => {
    dispatch(totalCost({ userProducts, discount }));
    return total;
  }, [discount, dispatch, total, userProducts]);

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

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = JSON.parse(registrationToken);
      const isExpired = Date.now() > token?.expiresAt;
      if (isExpired && discount) {
        return totalPrice;
      }
    };
    const checkInterval = setInterval(checkTokenExpiration, 100);
    return () => clearInterval(checkInterval);
  }, [discount, registrationToken, totalPrice]);

  return (
    <div className="basket-wrapper">
      <div className="basket-container" ref={basketContainerRef}>
        <span>Added products:</span>

        <ul className="basket">
          {userProducts?.map((product) => (
            <li key={product.id} className="basket-product">
              {product.quantity}
              <img
                className="basket-img"
                src={product.image}
                alt="product pic"
              />
              <p className="cost-price">
                Price {discount ? applyDiscount(product.price) : product.price}{" "}
                $
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
                <button onClick={() => navigate(`/finish-order/${userId}`)}>
                  finish order
                </button>
              )}
            </>
          ) : (
            "Basket is empty"
          )}
        </div>
      </div>
    </div>
  );
};
