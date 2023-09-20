import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/user";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../validations/userValidation";
import { Link } from "react-router-dom";

export const arrData = JSON.parse(localStorage.getItem("userData") || "[]");

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const generateUniqueRegistrationToken = () => {
    const shortid = require("shortid");
    const token = shortid.generate();
    const expirationTime = Date.now() + 60 * 60 * 1000; // 1h in milliseconds

    return {
      token,
      expiresAt: expirationTime,
    };
  };

  const onSubmit = async (data) => {
    let userId;
    const isProfileExist = arrData?.find((user, index) => {
      userId = index;
      return user.name === data.name;
    });
    if (isProfileExist) {
      const registrationToken = generateUniqueRegistrationToken();
      localStorage.setItem(
        "registrationToken",
        JSON.stringify(registrationToken)
      );

      dispatch(login(isProfileExist));
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div>
      <h1>Login page</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <input type="text" placeholder="Enter username" {...register("name")} />
        <label>{errors.name?.message}</label>

        <input
          type="password"
          placeholder="Enter password"
          {...register("password")}
        />
        <label>{errors.password?.message}</label>

        <button type="submit">Login</button>
        <Link className="link" to={"/forgetPassword"}>
          Forgot password
        </Link>
        <Link className="link" to={"/register"}>
          Go to Registration
        </Link>
      </form>
    </div>
  );
};
