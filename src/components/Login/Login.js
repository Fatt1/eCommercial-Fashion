import { FormValidator } from "../../services/formValidator.js";
import { login } from "../../services/authenticateService.js";
import { setupDropdownAfterLogin } from "../Header/Header.js";
import Register, { setupRegisterForm } from "../Register/Register.js";
// Config các validation

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
                <button type="submit" class="login-button form-btn">ĐĂNG NHẬP</button>
                <a class="forgotten-password">Quên mật khẩu</a>
                <div class="bottom-login">
                <div >Bạn chưa có tài khoản?</div>
                <span  class="register-links">Đăng ký</span>
                </div>
          </div>
        </div>
      </form>
  `;
}

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

//Set up các sự kiện click, check lỗi ... khi mở login-form lên
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
  document
    .querySelector(".bottom-login .register-links")
    .addEventListener("click", () => {
      document.getElementById("register-login").innerHTML = Register();
      setupRegisterForm();
    });
  handleClickExitBtn();
  handleTogglePassword();
}
//Khi ấn vào nút tắt thì sẽ tắt đi form đăng ki or đăng nhập và xóa đi cái overlay
export function handleClickExitBtn() {
  document.querySelector(".exit-btn").addEventListener("click", (event) => {
    // Vì đây là thẻ button nằm trong thẻ form nên phải chặn sự kiện mặc định của <button></button> nếu ko thì nó sẽ gửi form
    event.preventDefault();
    document.getElementById("register-login").innerHTML = "";
    document.querySelector(".overlay").classList.remove("show");
    document.body.style.overflowY = "scroll";
  });
}
export function clearErrors(input) {
  input.closest(".form-group").querySelector(".error-message").textContent = "";
}

// Khi người dùng ấn vao nút login sẽ kiểm tra validation và tiến hành kiểm tra đăng nhập
function handleLogin() {
  const loginFormValidator = new FormValidator(loginFormConfig, "login");
  let isValid = loginFormValidator.validate();

  // Check validate và nếu có lỗi thì sẽ hiện thị ra các lỗi
  if (!isValid) {
    loginFormValidator.displayErrors();
    return;
  }

  // Nếu valid thành công thì sẽ bắt đầu đăng nhập
  const inputEmailValue = document.querySelector("#email").value;
  const inputPasswordValue = document.querySelector("#password").value;
  const response = login(inputEmailValue, inputPasswordValue);

  // Nếu đăng nhập thất bài thì sẽ hiện thị ra lỗi ở trên đầu form
  if (!response.successful) {
    document.querySelector(".login-response").style.display = "block";
    document.querySelector(".login-response").textContent = response.message;
  }

  // Nếu đăng nhập thành công thì sẽ hiện thị người dùng ở góc trên header và xóa đi overlay
  else {
    document.getElementById("register-login").innerHTML = "";
    document.querySelector(".overlay").classList.remove("show");
    document.body.style.overflowY = "scroll";
    localStorage.setItem("user_info", JSON.stringify(response.data));
    setupDropdownAfterLogin(response.data.email);
  }
}
export function handleTogglePassword() {
  document.querySelectorAll(".toggle-eye-btn").forEach((eye) => {
    eye.addEventListener("click", () => {
      const inputPassword = eye.previousElementSibling;
      const typeInputPassword = inputPassword.getAttribute("type");
      // Khi mà người dùng nhấn vào nếu là đang là text thì sẽ đổi thành password
      if (typeInputPassword === "text") {
        inputPassword.setAttribute("type", "password");
        eye.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
      }
      // Ngược lại
      else {
        inputPassword.setAttribute("type", "text");
        eye.innerHTML = ` <i class="fa-solid fa-eye"></i>`;
      }
    });
  });
}
