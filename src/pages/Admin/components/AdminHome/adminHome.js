import { AdminHeader } from "../AdminHeader/AdminHeader.js";
import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
import { getLoggedUser } from "../../../../services/userService.js";
import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../../../../helper/initialData.js";
import Category from "../../../../models/Category.js";
export function loadAdminHome() {
  const user = getLoggedUser();
  // Kiểm tra quyền admin
  if (!user || user.role !== "admin") {
    renderUnauthorizedPage();
    return;
  }
  renderAdminHomeHtml();
  setUpHome();
}
function setUpHome() {
  setUpAdminNav();
}
const db = await getDbContextFromLocalStorage();
console.log(JSON.stringify(db.importInvoices));

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

function renderUnauthorizedPage() {
  document.getElementById("root").innerHTML = `
    ${UnAuthorizedPage()}
  `;
}

function UnAuthorizedPage() {
  return `
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
        <button class="btn-home" onclick="window.location.href='./home.html'">
          Về Trang Chủ
        </button>
      </div>
    </div>`;
}
