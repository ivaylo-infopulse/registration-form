// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeColor } from "../../features/theme";
import { logout, addProducts } from "../../features/user";
import { timer } from "../../features/timer";
import { useNavigate } from "react-router-dom";
import { DeleteAcc } from "../deleteAccount/DeleteAcc";
// import ChangeColor from '../chnageColor/ChangeColor'
import ListOfUsers from "../listOfUsers/ListOfUsers";
import "./styles.css";

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imgInputRef = useRef();
  const registrationToken = localStorage.getItem("registrationToken");
  const existingData = JSON.parse(localStorage.getItem("userData"));
  const user = useSelector((state) => state.user?.value);
  const themeColor = useSelector((state) => state.theme.value);
  const userId = existingData.findIndex((data) => data.name === user?.name);
  const [isList, setIsList] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    existingData[userId]?.image
  );
  const [className, setClassName] = useState("initial-profile");
  const [newPass, setNewPass] = useState();
  const [newPassConfirm, setNewPassConfirm] = useState();
  const [isPassMatch, setIsPassMatch]=useState()
  const [popUp, setPopUp] = useState(false);
  const btnRef = useRef();

  useEffect(() => {
    !registrationToken && navigate("/");
  });

  const onLogOut = () => {
    dispatch(changeColor("wheat"));
    dispatch(logout());
    dispatch(timer(""));
    dispatch(addProducts([]))
    navigate("/");
    localStorage.removeItem("registrationToken");
    window.location.reload();
  };

  const showList = () => {
    setIsList(!isList);
  };

  useEffect(()=>{
    if(newPass===newPassConfirm){
      setIsPassMatch(true)
    }else{
      setIsPassMatch(false)
    }
  },[newPass, newPassConfirm])

  const onChangePassword = () => {
    setPopUp(!popUp);
    if (newPass.length>0 && newPass===newPassConfirm) {
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
    <div className="profile-page" style={{ color: themeColor }}>
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
                <DeleteAcc />
              </li>
              <li>
                <button className="log-out-button" onClick={onChangePassword}>
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

          {/* <ChangeColor/> */}
          <button className="log-out-button" onClick={onLogOut}>
            Logout
          </button>

          {!popUp ? (
            <button className="log-out-button" onClick={onChangePassword}>
              Change password
            </button>
          ) : (
            <div className="popup">
              <span>Change password</span>
              <input
                type="text"
                placeholder="Enter new password"
                onChange={(e) => {
                  setNewPass(e.target.value);
                }}
                ref={btnRef}
              />
              <input
                type="text"
                placeholder="confirm new password"
                onChange={(e) => {
                  setNewPassConfirm(e.target.value);
                }}
              />
              <label className="label-error">{!isPassMatch&&'Passwords have to be the same!'}</label>
              
              <div>
                <button onClick={onChangePassword} disabled={!isPassMatch}>Submit</button>
                <button
                  onClick={() => {
                    setNewPass();
                    setPopUp(false);
                  }}
                >
                  chancel
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
      <button className="users-list" onClick={() => navigate("/products-list")}>
        Go to products list
      </button>
      <button className="sudoku-link" onClick={() => navigate("/sudoku-game")}>
        Play Sudoku
      </button>
    </div>
  );
};