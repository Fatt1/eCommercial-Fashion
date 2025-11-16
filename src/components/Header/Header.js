import {
  getAllCategoriesByLevel,
  getAllCategory,
  getSubCategory,
} from "../../services/categoryService.js";
import { logout, isLogin } from "../../services/authenticateService.js";
import { loadProductPage } from "../../pages/Product/Product.js";

import { updateCartQuantityStraight } from "../../services/cartService.js";
import { Login, setUpLoginForm } from "../Login/Login.js";
import Register, { setupRegisterForm } from "../Register/Register.js";
import { loadOrderHistory } from "../../pages/OrderHistory/OrderHistory.js";
import { renderUserInfo, setupUserInfoForm } from "../UserInfo/UserInfo.js";

export default function Header(selectedTab) {
  return ` <header>
      
        <div class="container">
          <div class="main-content">
            <div class="header-top">
              <nav class="navbar">
                <ul class="navbar-list">
                  <li data-tab="trang-chu" class="nav-item ${
                    selectedTab === "trang-chu" ? "active" : ""
                  }"><a href="./home.html">TRANG CHỦ</a></li>
                  <li class="nav-item san-pham-tab  ${
                    selectedTab === "san-pham" ? "active" : ""
                  }" data-tab="san-pham"><a href="#">SẢN PHẨM</a>
                    <div class="category-box">
                      ${generateCategorySubMenu()}
                    </div>
              </li>
                  <li class="nav-item"><a href="#">GIỚI THIỆU</a></li>
                  <li class="nav-item"><a href="#">LIÊN HỆ</a></li>
                </ul>
              </nav>
           
            <img class="logo" src="../assets/logo.svg" alt="logo" />
            <div class="action">
              <div class="search-bar">
                <input type="text" class="search" placeholder="Tìm kiếm" />
                <button class="search-icon">
                  <img src="../assets/search-icon.png" />
                </button>
              </div>
              <img
                src="../assets/defaut-avatar.png"
                alt="avatar-user"
                class="avatar-user"
              />
              <div class="login-register-link">
                <a class="login-link">Đăng Nhập</a>
                <span style="color: white">|</span>
                <a class="register-link">Đăng Kí</a>
              </div>
              <div class="header-cart">
               <a href='cart.html'>
                  <img
                    src="../assets/shopping-cart.png"
                    alt="cart-icon"
                    class="cart-icon"
                  />
               </a>
                <span class="cart-quantity"></span>
              </div>
            </div>
        </div>
      </div>
    </header>`;
}

function generateCategorySubMenu() {
  const allCategories = getAllCategory();
  let content = "";

  for (let cate of allCategories) {
    if (cate.parentId === null) {
      let categoryHeaderContent = ` <h3 data-category-id='${
        cate.id
      }' class="category-headings category-submenu-item">${cate.name.toUpperCase()}</h3>`;
      const subCategory = getSubCategory(cate.id, 1);

      let ulElem = ``;
      if (subCategory) {
        ulElem += `<ul>${subCategory
          .map(
            (cate) =>
              `<li class="category-submenu-item" data-category-id='${cate.id}'>${cate.name}</li>`
          )
          .join(" ")}</ul>`;
      }
      const categoryBox = `
      <div class="category-box__column1">
          ${categoryHeaderContent}
          ${ulElem}
        </div>
      `;

      content += categoryBox;
    }
  }
  return content;
}

export function handleClickHeader() {
  // Xử lí sự kiện khi click vào các tab ở header
  document.querySelectorAll(".nav-item").forEach((liHeader) => {
    liHeader.addEventListener("click", (event) => {
      const tabSelected = liHeader.dataset.tab;
      if (tabSelected === "san-pham") {
        const categories = getAllCategoriesByLevel(0);
        loadProductPage(categories[0].id);
        return;
      }
    });
  });
  document.querySelectorAll(".category-submenu-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      const categoryId = item.dataset.categoryId;
      loadProductPage(categoryId);

      return;
    });
  });
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelector(".header-cart .cart-quantity").textContent =
    cart.length;
  handleClickCartIcon();
  handleSearching();
  checkLoggedUser();
}
// Kiểm tra xem người đăng nhập hay chưa để hiện thị thông tin user hoặc ko hiện thị nếu chưa đăng nhập
function checkLoggedUser() {
  const user = localStorage.getItem("user_info");

  if (user) {
    setupDropdownAfterLogin(JSON.parse(user).email, user.id);
  } else {
    handleLoginLink();
    handleRegisterLink();
  }
}
// xử lí khi người dùng nhấn vào nút logout
function handleLogoutClick() {
  const userId = JSON.parse(localStorage.getItem("user_info")).id;
  const response = logout(userId);
  if (response) {
    document.querySelector(
      ".login-register-link"
    ).innerHTML = `<a class="login-link">Đăng Nhập</a>
                <span style="color: white">|</span>
                <a class="register-link">Đăng Kí</a>`;
    document.querySelector(".avatar-user").style.display = "none";
    handleLoginLink();
    handleRegisterLink();
  }
}
// Xử lí khi mà người dùng nhấn vào thanh tìm kiếm
function handleSearching() {
  const searchBtn = document.querySelector(".search-icon");

  searchBtn.addEventListener("click", () => {
    loadProductPage(null, true);
  });
  const searchInput = document.querySelector(".search");
  // Khi người dùng nhấn nút enter
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      loadProductPage(null, true);
    }
  });
}
function handleRegisterLink() {
  document.querySelector(".register-link").addEventListener("click", () => {
    document.getElementById("register-login").innerHTML = Register();
    setupRegisterForm();
    renderOverlay();
  });
}
export function renderOverlay() {
  document.querySelector(".overlay").classList.add("show");
  document.body.style.overflow = "hidden";
  document.getElementById("register-login").style.left =
    Math.round(
      document.body.clientWidth / 2 -
        document.getElementById("register-login").clientWidth / 2
    ) + "px";
}
export function handleLoginLink() {
  document.querySelector(".login-link").addEventListener("click", () => {
    document.getElementById("register-login").innerHTML = Login();
    setUpLoginForm();
    renderOverlay();
  });
}
export function setupDropdownAfterLogin(email, id) {
  document.querySelector(".avatar-user").style.display = "inline";
  document.querySelector(
    ".login-register-link"
  ).innerHTML = ` <div class="dropdown">
                          <span class="header__user-name">${email}</span>
                          <ul class="dropdown-menu">
                              <li class="dropdown-item user-info-btn">Thông tin tài khoản</li>
                              <li class="dropdown-item order-history-btn">Đơn hàng của tôi</li>
                              <li class="dropdown-item logout-btn">Đăng xuất</li>
                            </ul>
                        </div>`;
  // Thiết lập event hover cho dropdown nếu user đã đăng nhập
  const dropdown = document.querySelector(".login-register-link .dropdown");
  dropdown.addEventListener("mouseover", () => {
    dropdown.querySelector(".dropdown-menu").classList.add("show");
  });
  dropdown.addEventListener("mouseout", () => {
    dropdown
      .querySelector(".login-register-link .dropdown-menu")
      .classList.remove("show");
  });

  document.querySelector(".logout-btn").addEventListener("click", () => {
    handleLogoutClick();
  });
  document.querySelector(".order-history-btn").addEventListener("click", () => {
    loadOrderHistory();
  });
  document.querySelector(".user-info-btn").addEventListener("click", () => {
    document.getElementById("register-login").innerHTML = renderUserInfo();
    setupUserInfoForm();
    renderOverlay();
  });
}

function handleClickCartIcon() {
  document.querySelector(".header-cart").addEventListener("click", (event) => {
    event.preventDefault();
    if (!isLogin()) {
      document.getElementById("register-login").innerHTML = Login();
      setUpLoginForm();
      renderOverlay();
      return;
    }
    window.location.href = "./cart.html";
  });
}
