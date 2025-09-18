import {
  getAllCategory,
  getSubCategory,
} from "../../services/categoryService.js";

export default function Header() {
  return ` <header>
        <div class="container">
          <div class="main-content">
            <div class="header-top">
              <nav class="navbar">
                <ul class="navbar-list">
                  <li class="nav-item active"><a href="./home.html">TRANG CHỦ</a></li>
                  <li class="nav-item san-pham-tab" data-tab="san-pham"><a href="#">SẢN PHẨM</a>
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
      console.log(subCategory);
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
