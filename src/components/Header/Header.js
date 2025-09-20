import {
  getAllCategory,
  getSubCategory,
} from "../../services/categoryService.js";
import { loadProductPage } from "../../pages/Product/Product.js";
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
              <a class="login-link">Đăng Nhập</a>
              <span style="color: white">|</span>
              <a class="register-link">Đăng Kí</a>
              <div class="header-cart">
               <a href='cart.html'>
                  <img
                    src="../assets/shopping-cart.png"
                    alt="cart-icon"
                    class="cart-icon"
                  />
               </a>
                <span class="cart-quantity">0</span>
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
      const subCategory = getSubCategory(cate.id);

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
        loadProductPage("cate-001");
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
}
