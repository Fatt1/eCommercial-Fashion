import { register } from "../../services/authenticateService.js";
import { FormValidator } from "../../services/formValidator.js";
import {
  clearErrors,
  handleClickExitBtn,
  handleTogglePassword,
  Login,
  setUpLoginForm,
} from "../Login/Login.js";

export default function Register() {
  return `
    <form id="register" class="login register">
          <div class="register-container login-container">
              <img src="../assets/carousel-1.jpg" id="jiso1">
              <div class="register-box login-box">
                <div class="content">
                <div style="display: flex; justify-content: center;">  <p>Đăng Ký</p></div>
                <button class="exit-btn"><i class="fa-solid fa-xmark"></i></button>
                <div class="login-response register-response"></div>
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

              <div class="form-group">  
                <label for="password">Nhập lại mật khẩu*</label>         
                <div class="input-password-container">
                    <input type="password" name="confirmPassword" id="confirm-password" placeholder="Nhập lại mật khẩu" required>
                    <span class="toggle-eye-btn">
                    <i class="fa-solid fa-eye-slash"></i>
                    </span>
                </div>
                <div class="error-message error-confirmPassword"></div>
                
                </div>
                  </div>
                      <button class="register-button form-btn">ĐĂNG KÝ</button>
                      <div class="bottom-register">
                      <div >Bạn đã có tài khoản?</div>
                      <span class="bottom-register__login-links">Đăng nhập</span>
                      </div>
                </div>
          </div>
        </form>
  `;
}

const registerConfig = {
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
  confirmPassword: {
    isRequired: "Mật khẩu nhập lại là bắt buộc",
    checkConfirmPassword: {
      message: "Mật khẩu nhập lại không trùng khớp",
    },
  },
};

export function setupRegisterForm() {
  handleClickExitBtn();
  handleTogglePassword();
  const formValidator = new FormValidator(registerConfig, "register");
  document
    .querySelector(".register-button")
    .addEventListener("click", (event) => {
      event.preventDefault();
      const idValid = formValidator.validate();
      if (!idValid) {
        formValidator.displayErrors();
        return;
      }
      handleRegister();
    });
  document.querySelectorAll("#register input").forEach((input) =>
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
        handleRegister();
      }
    })
  );
  document
    .querySelector(".bottom-register__login-links")
    .addEventListener("click", () => {
      document.getElementById("register-login").innerHTML = Login();
      setUpLoginForm();
    });
}

function handleRegister() {
  const response = register(
    document.getElementById("email").value,
    document.getElementById("password").value
  );
  // Kiểm tra đăng kí
  // Nếu thất bại
  if (!response.successful) {
    document.querySelector(".login-response").style.display = "block";
    document.querySelector(".login-response").textContent = response.message;
    return;
  }
  // Thành công thì sẽ chuyển sang phần đăng nhập
  document.getElementById("register-login").innerHTML = Login();
  setUpLoginForm();
}
