import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { timer } from "../../features/timer";
import { useLocalStorage } from "react-use";
import { logout } from "../../features/user";

export const DeleteAcc = (className, { existingData }) => {
  const user = useSelector((state) => state.user?.value.isUserExist);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingUsers = existingData;
  const [, setDeletedUser] = useLocalStorage("userData");

  const onDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirmed) {
      dispatch(timer());
      const deletedData = existingUsers.filter(
        (item) => item.name !== user.name
      );
      existingData.length === 1
        ? setDeletedUser([])
        : setDeletedUser(deletedData);
      navigate("/");
      dispatch(logout());
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
