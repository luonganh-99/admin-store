import React from "react";
import logo from "../../assets/logo.png";
import imageLogin from "../../assets/imageLogin.jpg";
import "./login.scss";

import auth from "../../components/authentication/authentication";

import { useFormik } from "formik";

import userApi from "../../api/userApi";

import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
  Link,
} from "react-router-dom";

//notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import Cookies from 'js-cookie'

const Login = (props) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log("this value", values);

      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await userApi.login(values);
      if (response) {
        toast.success("Login success!");

        console.log("response", response.user.token)

        Cookies.set('auth', response.user.token)

        props.history.push("/")

      }
    } catch (error) {
      toast.error(error , { autoClose: false });
    }
  };

  const history = useHistory();

  console.log("ec", Cookies.get('token'))

  return (
    <div className="login">
      <ToastContainer autoClose={5000} />
      <form onSubmit={formik.handleSubmit} className="login__left">
        <img className="login__left__logo" src={logo} alt="" />
        <p className="login__left__title">Hello</p>
        <p className="login__left__description">Login please ~</p>
        <input
          id="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          className="login__left__account"
          type="text"
        />
        <input
          id="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          className="login__left__password"
          type="password"
        />
        <button
          //   onClick={() => {
          //     auth.login(() => {
          //       props.history.push("/");
          //     });
          //   }}
          type="submit"
          //onClick={() => props.history.push("/")}
          className="login__left__btn-login"
        >
          Login
        </button>
      </form>
      <div className="login__right">
        <img src={imageLogin} alt="" className="login__right__image" />
      </div>
    </div>
  );
};

export default Login;
