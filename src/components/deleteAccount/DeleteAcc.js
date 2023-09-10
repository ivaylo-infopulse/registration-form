import React from "react";
import { arrData } from "../login/Login";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { timer } from "../../features/timer";

export const DeleteAcc = (className) => {
  const user = useSelector((state) => state.user?.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirmed) {
      dispatch(timer());
      const deletedData = arrData.filter((item) => item !== user);
      localStorage.setItem("userData", JSON.stringify(deletedData));
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <button
      type="text"
      tabIndex={className !== "profile-wrapper" && -1}
      onClick={onDelete}
    >
      Delete acount
    </button>
  );
};
