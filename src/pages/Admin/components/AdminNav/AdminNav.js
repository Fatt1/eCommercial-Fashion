import { loadAdminHome } from "../AdminHome/AdminHome.js";
import {
  loadProductAdmin,
  renderProductAdminHtml,
  setUpProductManagePlayable,
} from "../ProductManage/productManage.js";

export function AdminNav() {
  return `
      <div class="admin__nav">
          <div class="admin__info">
            <div><img src="../assets/defaut-avatar.png" /></div>
            <div>Admin</div>
            <div>admin@gmail.com</div>
          </div>

          <ul class="admin__category">
            <button>
              <li class="admin__category--1">
                <img class="icon" src="../assets/admin-icon1.png" />Trang Chủ
              </li>
            </button>
            <button>
              <li class="admin__category--2">
                <img class="icon" src="../assets/admin-icon2.png" />Sản Phẩm
              </li>
            </button>
            <button>
              <li class="admin__category--3">
                <img class="icon" src="../assets/admin-icon3.png" />Quản Lý Nhãn
                Hàng
              </li>
            </button>
            <button>
              <li class="admin__category--4">
                <img class="icon" src="../assets/admin-icon4.png" />Quản Lý
                Thuộc Tính
              </li>
            </button>
            <button>
              <li class="admin__category--5">
                <img class="icon" src="../assets/admin-icon5.png" />Quản Lý
                Người Dùng
              </li>
            </button>
            <button>
              <li class="admin__category--6">
                <img class="icon" src="../assets/admin-icon6.png" />Quản Lý
                Thống Kê
              </li>
            </button>
            <button>
              <li class="admin__category--7">
                <img class="icon" src="../assets/admin-icon7.png" />Quản Lý Đơn
                Hàng
              </li>
            </button>
          </ul>
        </div>
  `;
}
export function setUpAdminNav() {
  document
    .querySelector(".admin__category--2")
    .addEventListener("click", () => {
      loadProductAdmin();
    });

  document
    .querySelector(".admin__category--1")
    .addEventListener("click", () => {
      loadAdminHome();
    });
}
