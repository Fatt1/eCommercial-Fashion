import { loadAdminHome } from "../AdminHome/AdminHome.js";
import { loadCategoryManagePage } from "../CategoryManage/categoryManage.js";
import { loadOrderPage } from "../OrderManage/orderManage.js";
import { loadPriceManagePage } from "../PriceMange/priceMange.js";
import { loadProductAdmin } from "../ProductManage/productManage.js";
import { loadUserManagePage } from "../UserManage/userManage.js";
import { loadGoodsReceivedNoteList } from "../goodsReceivedNoteManage/goodsReceivedNoteManage.js";

export function AdminNav() {
  return `
      <div class="admin__nav">
          <div class="admin__info">
            <div><img src="../assets/defaut-avatar.png" /></div>
            <div>Admin</div>
            <div>admin@gmail.com</div>
          </div>

          <ul class="admin__category">
            <button class="admin__category--1">
              <li >
                <img class="icon" src="../assets/admin-icon1.png" />Trang Chủ
              </li>
            </button>
            <button class="admin__category--2">
              <li>
                <img class="icon" src="../assets/admin-icon2.png" />Sản Phẩm
              </li>
            </button>
            <button class="admin__category--3">
              <li >
                <img class="icon" src="../assets/admin-icon3.png" />Quản Lý Danh Mục
              </li>
            </button>
            <button class="admin__category--4">
              <li >
                <img class="icon" src="../assets/admin-icon4.png" />Quản lí Giá Bán
              </li>
            </button>
            <button class="admin__category--5">
              <li >
                <img class="icon" src="../assets/admin-icon5.png" />Quản Lý
                Người Dùng
              </li>
            </button>
            <button class="admin__category--6">
              <li >
                <img class="icon" src="../assets/admin-icon6.png" />Quản Lý
                Thống Kê
              </li>
            </button>
            <button class="admin__category--7">
              <li >
                <img class="icon" src="../assets/admin-icon7.png" />Quản Lý Đơn
                Hàng
              </li>
            </button>
            <button class="admin__category--8">
              <li >
                <img class="icon" src="../assets/admin-icon7.png" />Quản Lý Phiếu Nhập
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
  document
    .querySelector(".admin__category--7")
    .addEventListener("click", () => {
      loadOrderPage();
    });
  document
    .querySelector(".admin__category--3")
    .addEventListener("click", () => {
      loadCategoryManagePage();
    });
  document
    .querySelector(".admin__category--4")
    .addEventListener("click", () => {
      loadPriceManagePage();
    });

  document
    .querySelector(".admin__category--5")
    .addEventListener("click", () => {
      loadUserManagePage();
    });
  document
    .querySelector(".admin__category--8")
    .addEventListener("click", () => {
      loadGoodsReceivedNoteList();
    });
}
