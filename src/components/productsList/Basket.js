import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const Basket = ({
  discount,
  userProducts,
  onDelete,
  totalPrice,
  applyDiscount,
}) => {

    

  return (
    <div className="basket-container">
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
        {totalPrice > 0 ? `Total cost: ${totalPrice} $` : "Basket is empty"}
      </div>
    </div>
  );
};
