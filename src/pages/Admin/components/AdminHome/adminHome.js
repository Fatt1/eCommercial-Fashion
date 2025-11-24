import { AdminHeader } from "../AdminHeader/AdminHeader.js";
import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import { getLoggedUser } from "../../../../services/userService.js";
import { login } from "../../../../services/authenticateService.js";
import { Validation } from "../../../../services/validation.js";
import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../../../../helper/initialData.js";

export function loadAdminHome() {
  const user = getLoggedUser();

  // Kiểm tra đã đăng nhập chưa
  if (!user) {
    renderAdminLoginPage();
    return;
  }

  // Kiểm tra quyền admin
  if (user.role !== "admin") {
    renderUnauthorizedPage();
    return;
  }

  renderAdminHomeHtml();
  setUpHome();
}

function setUpHome() {
  setUpAdminNav();
}

/**
 * Render trang đăng nhập dành riêng cho Admin
 */
function renderAdminLoginPage() {
  document.getElementById("root").innerHTML = `
    <div class="admin-login-container">
      <div class="admin-login-box">
        <div class="admin-login-header">
          <img src="../assets/logo2.svg" alt="Logo" class="admin-login-logo" />
          <h1>ĐĂNG NHẬP QUẢN TRỊ</h1>
          <p>Vui lòng đăng nhập để truy cập trang quản trị</p>
        </div>
        
        <form class="admin-login-form" id="admin-login-form">
          <div class="form-group">
            <label for="admin-email">
              <i class="fa-solid fa-envelope"></i>
              Email
            </label>
            <input 
              type="email" 
              id="admin-email" 
              placeholder="admin@example.com"
              autocomplete="email"
            />
            <span class="error-message" id="email-error"></span>
          </div>
          
          <div class="form-group">
            <label for="admin-password">
              <i class="fa-solid fa-lock"></i>
              Mật khẩu
            </label>
            <div class="password-input-wrapper">
              <input 
                type="password" 
                id="admin-password" 
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <i class="fa-solid fa-eye-slash toggle-password" id="toggle-password"></i>
            </div>
            <span class="error-message" id="password-error"></span>
          </div>
          
          <button type="submit" class="admin-login-btn">
            <i class="fa-solid fa-right-to-bracket"></i>
            ĐĂNG NHẬP
          </button>
          
          <div class="login-footer">
            <a href="./home.html" class="back-to-home">
              <i class="fa-solid fa-arrow-left"></i>
              Về trang chủ
            </a>
          </div>
        </form>
      </div>
    </div>
    
    
  `;

  setUpAdminLoginPage();
}

/**
 * Setup event listeners cho trang đăng nhập admin
 */
function setUpAdminLoginPage() {
  const loginForm = document.getElementById("admin-login-form");
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const togglePassword = document.getElementById("toggle-password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  // Toggle show/hide password
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });

  // Clear errors on input
  emailInput.addEventListener("input", () => {
    emailError.textContent = "";
    emailInput.style.borderColor = "#e2e8f0";
  });

  passwordInput.addEventListener("input", () => {
    passwordError.textContent = "";
    passwordInput.style.borderColor = "#e2e8f0";
  });

  // Handle form submit
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleAdminLogin();
  });
}

/**
 * Xử lý đăng nhập admin
 */
function handleAdminLogin() {
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const loginBtn = document.querySelector(".admin-login-btn");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Clear previous errors
  emailError.textContent = "";
  passwordError.textContent = "";
  emailInput.style.borderColor = "#e2e8f0";
  passwordInput.style.borderColor = "#e2e8f0";

  let hasError = false;

  // Validate email
  const emailValidation = new Validation(email)
    .isRequired("Email không được để trống")
    .isEmail("Email không hợp lệ");

  if (emailValidation.errors.length > 0) {
    emailError.textContent = emailValidation.errors[0];
    emailInput.style.borderColor = "#e53e3e";
    hasError = true;
  }

  // Validate password
  const passwordValidation = new Validation(password)
    .isRequired("Mật khẩu không được để trống")
    .isMinLength(6, "Mật khẩu phải có ít nhất 6 ký tự");

  if (passwordValidation.errors.length > 0) {
    passwordError.textContent = passwordValidation.errors[0];
    passwordInput.style.borderColor = "#e53e3e";
    hasError = true;
  }

  if (hasError) return;

  // Disable button while processing
  loginBtn.disabled = true;
  loginBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG ĐĂNG NHẬP...';

  // Attempt login
  setTimeout(() => {
    const result = login(email, password);

    if (!result.successful) {
      loginBtn.disabled = false;
      loginBtn.innerHTML =
        '<i class="fa-solid fa-right-to-bracket"></i> ĐĂNG NHẬP';

      // Show error message
      emailError.textContent = result.message;
      emailInput.style.borderColor = "#e53e3e";
      passwordInput.style.borderColor = "#e53e3e";
      return;
    }

    // Check if user is admin
    if (result.data.role !== "admin") {
      loginBtn.disabled = false;
      loginBtn.innerHTML =
        '<i class="fa-solid fa-right-to-bracket"></i> ĐĂNG NHẬP';

      emailError.textContent = "Bạn không có quyền truy cập trang quản trị";
      emailInput.style.borderColor = "#e53e3e";
      passwordInput.style.borderColor = "#e53e3e";
      return;
    }

    // Save user info
    localStorage.setItem("user_info", JSON.stringify(result.data));

    // Show success and redirect
    loginBtn.innerHTML =
      '<i class="fa-solid fa-check"></i> ĐĂNG NHẬP THÀNH CÔNG!';
    loginBtn.style.background =
      "linear-gradient(135deg, #48bb78 0%, #38a169 100%)";

    setTimeout(() => {
      loadAdminHome();
    }, 1000);
  }, 500);
}

function renderAdminHomeHtml() {
  document.getElementById("root").innerHTML = `
    <div class="admin">
     ${AdminNav()}
      <div class="admin__main">
        ${AdminHeader()}
        <div class="logo"><img src="../assets/logo2.svg" /></div>
        <div class="admin__main--operate">
          <button class="admin__option">
            <img src="../assets/admin__customer.png" class="option__logo" />
            <p class="two-first-line">KHÁCH HÀNG</p>
            <p class="two-first-line">100</p>
            <p class="third-line">Bạn mặc, bạn đẹp, bạn là chính mình</p>
          </button>
          <button class="admin__option">
            <img src="../assets/admin__product.png" class="option__logo" />
            <p class="two-first-line">SẢN PHẨM</p>
            <p class="two-first-line">100</p>
            <p class="third-line">Tự tin tỏa sáng cùng phong cách riêng</p>
          </button>
          <button class="admin__option">
            <img src="../assets/admin__revenue.png" class="option__logo" />
            <p class="two-first-line">DOANH THU</p>
            <p class="two-first-line">100</p>
            <p class="second-line">
              Order là cá tính riêng, Delivery là phong cách riêng
            </p>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderUnauthorizedPage() {
  document.getElementById("root").innerHTML = `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <h1>Không Có Quyền Truy Cập</h1>
        <p class="message">Xin lỗi, bạn không có quyền truy cập vào trang này.</p>
        <p class="sub-message">
          Trang này chỉ dành cho quản trị viên. Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là một lỗi.
        </p>
        <button class="btn-home" onclick="window.location.href='../../../../index.html'">
          Về Trang Chủ
        </button>
      </div>
    </div>
  `;
}

loadAdminHome();
