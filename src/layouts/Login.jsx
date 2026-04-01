import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Spinner } from "reactstrap";
import "./style.css";

import { AppContext } from "../context/AppProvider";
import { notify } from "../components/Toast/ToastCustom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const Login = () => {
  const { setUser } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();
  useEffect(() => {
    const inputs = document.querySelectorAll(".input");

    function addcl() {
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
    }

    function remcl() {
      let parent = this.parentNode.parentNode;
      if (this.value == "") {
        parent.classList.remove("focus");
      }
    }

    inputs.forEach((input) => {
      input.addEventListener("focus", addcl);
      input.addEventListener("blur", remcl);
    });

    if (localStorage.getItem("user")) {
      history.push("/");
    }

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", addcl);
        input.removeEventListener("blur", remcl);
      });
    };
  }, [history]);

  const hanldeLogin = () => {
    if (!email || !password) {
      notify("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu", "Error");
      return;
    }

    setIsLoading(true);
    const authentication = getAuth();

    signInWithEmailAndPassword(authentication, email, password)
      .then((response) => {
        console.log("Login Success:", response);
        if (response) {
          setIsLoading(false);
          notify("Đăng Nhập Thành Công", "Success");
          
          history.push("/");

          localStorage.setItem(
            "user",
            JSON.stringify({ user: response.user.email })
          );
          // get the authen token
          response.user.getIdToken().then((token) => {
            localStorage.setItem("vhgp-token", token);
            console.log("Token after login:", token);
          })
        }
      })
      .catch((error) => {
        console.error("Login Error:", error.code, error.message);
        setIsLoading(false);
        
        let message = "Sai tài khoản hoặc mật khẩu";
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
          message = "Sai tài khoản hoặc mật khẩu";
        } else if (error.code === "auth/operation-not-allowed") {
           message = "Phương thức đăng nhập này chưa được bật (Email/Password)";
        } else if (error.code === "auth/too-many-requests") {
           message = "Đã thử quá nhiều lần, vui lòng đợi một lúc";
        } else if (error.code === "auth/network-request-failed") {
          message = "Lỗi kết nối mạng";
        }
        
        notify(message, "Error");
      });
  };
  return (
    <div>
      <img class="wave" src="images/wave.png" alt="" />
      <div class="container">
        <div class="img">
          <img src="images/bg.svg" />
        </div>
        <div class="login-content">
          <form action="index.html" className="form-login">
            <img src="images/avatar.svg" alt="" />
            <h2 class="login-title">
              Chào mừng bạn đến với VHGP - Tiện ích cư dân
            </h2>

            <div class="input-div one">
              <div class="i">
                <i class="fas fa-user"></i>
              </div>
              <div class="div">
                <h5>Tên Đăng Nhập</h5>
                <input
                  type="text"
                  class="input"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>
            </div>
            <div class="input-div pass">
              <div class="i">
                <i class="fas fa-lock"></i>
              </div>
              <div class="div">
                <h5>Mật Khẩu</h5>
                <input
                  type="password"
                  class="input"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                />
              </div>
            </div>
            <button
              type="submit"
              class="btn-login"
              value="Đăng Nhập"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                hanldeLogin();
              }}
            >
              {isLoading ? (
                <Spinner style={{ color: "rgb(100,100,100)" }}>
                  Loading...
                </Spinner>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
