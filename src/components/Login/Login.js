import { FormValidator } from "../../services/formValidator.js";
import { login } from "../../services/authenticateService.js";
import { setupDropdownAfterLogin } from "../Header/Header.js";

export function Login() {
  return `
   <form id="login">
     <div class="login-container">
        <img src="../assets/carousel-2.jpg" id="jiso1">
        <div class="login-box">
          <div class="content">
        <div style="display: flex; justify-content: center;">  <p>Đăng Nhập</p></div>
        <button class="exit-btn"><i class="fa-solid fa-xmark"></i></button>
        <div class="login-response"></div>
          <div class="form-group">
          <label for="email">Email*</label>
          <input name="email" type="text" id="email" placeholder="aovgamer@gmail.com" required>
          <div class="error-message error-email"></div>
              </div>
          
          <div class="form-group">
          <label for="password">Mật Khẩu*</label>         
         <div class="input-password-container">
            <input name="password" type="password" id="password" placeholder="Nhập mật khẩu" required>
            <span class="toggle-eye-btn">
                <i class="fa-solid fa-eye-slash"></i>
            </span>
         </div>
          <div class="error-message error-password"></div>
          
          </div>
            </div>
                <button type="submit" class="login-button">ĐĂNG NHẬP</button>
                <a class="forgotten-password">Quên mật khẩu</a>
                <div class="register">
                <div >Bạn chưa có tài khoản?</div>
                <span  class="register-links">Đăng ký</span>
                </div>
          </div>
        </div>
      </form>
  `;
}

export function setUpLoginForm() {
  document.querySelector(".login-button").addEventListener("click", (event) => {
    event.preventDefault();
    handleLogin();
  });
  document.querySelectorAll(".form-group input").forEach((input) =>
    input.addEventListener("keydown", (event) => {
      if (
        !(
          input.closest(".form-group").querySelector(".error-message")
            .textContent.length === 0
        )
      )
        clearErrors(input);
      if (event.key === "Enter") {
        event.preventDefault();
        handleLogin();
      }
    })
  );
  document.querySelector(".exit-btn").addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("register-login").innerHTML = "";
    document.querySelector(".overlay").classList.remove("show");
    document.body.style.overflow = "scroll";
  });
}
function clearErrors(input) {
  input.closest(".form-group").querySelector(".error-message").textContent = "";
}
function handleLogin() {
  const loginFormConfig = {
    email: {
      isRequired: "Email là bắt buộc",
      isEmail: "Email không đúng định dạng",
    },
    password: {
      isRequired: "Mật khẩu là bắt buộc",
      isMinLength: {
        value: 6,
        message: "Mật khẩu phải có ít nhất 6 kí tự",
      },
    },
  };
  const loginFormValidator = new FormValidator(loginFormConfig, "login");
  let isValid = loginFormValidator.validate();
  if (!isValid) {
    loginFormValidator.displayErrors();
    return;
  }
  const inputEmailValue = document.querySelector("#email").value;
  const inputPasswordValue = document.querySelector("#password").value;
  const response = login(inputEmailValue, inputPasswordValue);
  if (!response.successful) {
    document.querySelector(".login-response").style.display = "block";
    document.querySelector(".login-response").textContent = response.message;
  } else {
    document.getElementById("register-login").innerHTML = "";
    document.querySelector(".overlay").classList.remove("show");
    document.body.style.overflow = "scroll";
    localStorage.setItem("user_info", JSON.stringify(response.data));
    setupDropdownAfterLogin(response.data.email);
  }
}
