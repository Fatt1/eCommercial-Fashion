import { AdminHeader } from "../AdminHeader/AdminHeader.js";
import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";

export function loadAdminHome() {
  renderAdminHomeHtml();
  setUpHome();
}
function setUpHome() {
  setUpAdminNav();
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
      
    </div>
  `;
}
loadAdminHome();
