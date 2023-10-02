import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, deleteProducts } from "../../features/user";
import { timer } from "../../features/timer";
import { useNavigate } from "react-router-dom";
import { DeleteAcc } from "../deleteAccount/DeleteAcc";
import ListOfUsers from "../listOfUsers/ListOfUsers";
import "./styles.css";

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imgInputRef = useRef();
  const registrationToken = localStorage.getItem("registrationToken");
  const existingData = JSON.parse(localStorage.getItem("userData"));
  const user = useSelector((state) => state.user?.value.isUserExist);
  const { userId } = useParams();
  const [isList, setIsList] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    existingData[userId]?.image
  );
  const discount = existingData[userId]?.discount;
  const [className, setClassName] = useState("initial-profile");
  const [newPass, setNewPass] = useState();
  const [newPassConfirm, setNewPassConfirm] = useState();
  const [isPassMatch, setIsPassMatch] = useState();
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    const token = JSON.parse(registrationToken);
    (Date.now() > token?.expiresAt) | !token && navigate("/");
  });

  const onLogOut = () => {
    dispatch(logout());
    dispatch(timer());
    dispatch(deleteProducts([]));
    navigate("/");
    localStorage.removeItem("registrationToken");
    window.location.reload();
  };

  const showList = () => {
    setIsList(!isList);
  };

  useEffect(() => {
    if (newPass === newPassConfirm) {
      setIsPassMatch(true);
    } else {
      setIsPassMatch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassConfirm]);

  const onChangePassword = () => {
    setPopUp(!popUp);
    if (newPass?.length > 0 && newPass === newPassConfirm) {
      existingData[userId].password = newPass;
      localStorage.setItem("userData", JSON.stringify(existingData));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        existingData?.[userId] &&
          setSelectedImage((existingData[userId].image = reader.result));
        localStorage.setItem("userData", JSON.stringify(existingData));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
      event.target.value = "";
    }
  };

  const imageChange = () => {
    imgInputRef.current.click();
  };

  const removeImage = () => {
    setSelectedImage((existingData[userId].image = undefined));
    const fileInput = imgInputRef.current;
    if (fileInput) {
      fileInput.value = "";
    }
    localStorage.setItem("userData", JSON.stringify(existingData));
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        {selectedImage ? (
          <div className="image-container">
            <img className="image" src={selectedImage} alt="Avatar" />
            <div className="dropdown-menu">
              <ul>
                <li onClick={imageChange}>Change Photo</li>
                <li onClick={removeImage}>Remove Photo</li>
              </ul>
            </div>
          </div>
        ) : (
          <label className="upload-img" onClick={imageChange}>
            Upload Image
          </label>
        )}

        <div className="profile-dropdown">
          <button
            className="profileBtn"
            onClick={() =>
              className === "initial-profile"
                ? setClassName("profile-wrapper")
                : setClassName("initial-profile")
            }
          >
            <ul className="dropdown-menu2">
              <li>Profile Info</li>
              <li>
                <DeleteAcc className={className} />
              </li>
              <li>
                <button
                  className="log-out-button"
                  tabIndex={-1}
                  onClick={onChangePassword}
                >
                  Change password
                </button>
              </li>
            </ul>

            <input
              ref={imgInputRef}
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <p>Profile Info</p>
          </button>
        </div>

        <div className={`test ${className}`}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          {discount && <p>discount: 20%</p>}

          <button
            className="log-out-button"
            tabIndex={className !== "profile-wrapper" && -1}
            onClick={onLogOut}
          >
            Logout
          </button>

          {!popUp ? (
            <button
              className="log-out-button"
              tabIndex={className !== "profile-wrapper" && -1}
              onClick={onChangePassword}
            >
              Change password
            </button>
          ) : (
            <div className="popup">
              <span>Change password</span>
              <input
                type="password"
                placeholder="Enter new password"
                onChange={(e) => {
                  setNewPass(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="confirm new password"
                onChange={(e) => {
                  setNewPassConfirm(e.target.value);
                }}
              />
              <label className="label-error">
                {!isPassMatch && "Passwords have to be the same!"}
              </label>

              <div>
                <button onClick={onChangePassword} disabled={!isPassMatch}>
                  Submit
                </button>
                <button
                  onClick={() => {
                    setNewPass();
                    setPopUp(false);
                    setIsPassMatch(true);
                  }}
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="users-list" onClick={showList}>
        Show List Of Users
      </button>
      {isList && <ListOfUsers />}
      <button
        className="users-list"
        onClick={() => navigate(`/products-list/${userId}`)}
      >
        Go to products list
      </button>
      <button
        className="sudoku-link"
        onClick={() => navigate(`/sudoku-game/${userId}`)}
      >
        Play Sudoku
      </button>
    </div>
  );
};
