import { AdminNav } from "../AdminNav/AdminNav.js";
import {
  filterOrdersByAdmin,
  getOrderById,
  updateStatusOrder,
} from "../../../../services/orderService.js";
import { getPaymentMethodById } from "../../../../services/paymentMethodService.js";
import { formatNumber } from "../../../../helper/formatNumber.js";
import { ORDER_STATUS } from "../../../../constant/Constant.js";
const overlay = document.querySelector(".overlay");
const overlayContent = document.querySelector(".overlay-content");
function renderOrderManage() {
  const result = filterOrdersByAdmin({});
  const allOrders = result.items;
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="admin">
      ${AdminNav()}
      <div class="admin__main">
        <div class="main-content __admin">
          <!-- OrderHeader -->
            <div class="admin__header" style="margin: 30px 0px">
              <div class="admin__header--left">
                <h1 class="admin__homepage--text">Quản Lý Đơn Hàng</h1>
                <div class="vertical-line"></div>
                <div class="admin__search-bar">
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    class="search-bar"
                  />
                  <button>SEARCH</button>
                </div>
              </div>
              <div class="admin__header--right">
                <img src="../assets/notification-icon.png" class="icon" /><img
                  src="../assets/defaut-avatar.png"
                  class="icon2"
                />ADMIN
              </div>
            </div>
          <!-- OrderStatus -->
          <div class="order-status">
              <div class="order-status-btns">
                <button>Tất cả</button>
                <button>Chờ xác nhận</button>
                <button>Đang chuẩn bị</button>
                <button>Đã giao</button>
                <button>Đã Hủy</button>
                <button>Đơn hàng đã hoàn thành</button>
              </div>
              <div class="order-date-filter">
                <span>Từ</span>
                <input placeholder="mm/dd/yy" type="date" />
                <span>Đến</span>
                <input placeholder="mm/dd/yy" type="date" />
                <button>Lọc</button>
              </div>
            </div>
          <!-- OrderTable -->
            <div class="order-table-container">
              ${OrderTable(allOrders)}
            </div>
        
        </div>
      </div>
    </div>
  `;
}

function OrderItem(orderItem) {
  const paymentMethod = getPaymentMethodById(orderItem.paymentMethodId);
  return `
  <tr>
    <td>${orderItem.id}</td>
    <td>${orderItem.fullName}</td>
    <td>${formatDate(orderItem.updatedAt)}</td>
    <td>${formatNumber(orderItem.totalPrice)}đ</td>
    <td>${formatNumber(orderItem.totalCheckout)}đ</td>
    <td>${paymentMethod.name}</td>
    <td>${orderItem.status}</td>
    <td>
      <p class="order-details-link" data-order-id="${
        orderItem.id
      }">Xem chi tiết</p>
      <p class="update-status-link" data-order-id="${
        orderItem.id
      }">Cập nhật trạng thái</p>
    </td>
  </tr>
  `;
}
function OrderItemDetail(orderItem) {
  return `
     <tr>
        <td>${orderItem.name}
        <p class="order-detail__variation">Phân loại: ${orderItem.sku.name}</p>
        </td>
        <td>${orderItem.quantity}</td>
        <td>${formatNumber(orderItem.originalPrice)}đ</td>
        <td>${formatNumber(orderItem.price)}đ</td>
        <td>${formatNumber(orderItem.price * orderItem.quantity)}đ</td>
    </tr>
  `;
}
function OrderItemDetailTable(items) {
  return `
      <div id="details-modal" class="modal">
        <div class="modal-header">
          <h2>Chi tiết đơn hàng</h2>
        </div>
        <div class="modal-body">
          <table class="modal-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá gốc</th>
                <th>Giá bán</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
             ${items.map((item) => OrderItemDetail(item)).join("")}
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button class="modal-button close-btn">Đóng</button>
        </div>
      </div>
  `;
}
function OrderTable(orderItems) {
  return `

        <table id="order-list-table">
          <thead>
            <th>Mã đơn hàng</th>
            <th>Khách hàng</th>
            <th>Thời gian tạo đơn</th>
            <th>Tổng tiền</th>
            <th>Tổng tiền thanh toán</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </thead>
          <tbody>
            ${orderItems.map((item) => OrderItem(item)).join("")}
          </tbody>
        </table>
        <div class="pagination">
          <span>&lt;</span>
          <span class="page-item active">1</span>
          <span class="page-item">2</span>
          <span class="page-item">3</span>
          <span>&gt;</span>
        </div>
`;
}

export function loadOrderPage() {
  renderOrderManage();
  setUpOrderTableEventListeners();
  setUpOrderManageEventListeners();
}

function setUpOrderManageEventListeners() {}

function formatDate(date) {
  const d = new Date(date);

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  const day = String(d.getDate()).padStart(2, "0");
  // Lưu ý: getMonth() trả về từ 0-11 nên phải +1
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  // 3. Ghép các thành phần lại theo định dạng mong muốn
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

function setUpOrderTableEventListeners() {
  const openDetailsLinks = document.querySelectorAll(".order-details-link");
  openDetailsLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const orderId = link.getAttribute("data-order-id");
      const order = getOrderById(orderId);
      overlayContent.innerHTML = OrderItemDetailTable(order.items);
      setUpOrderDetailModalEventListeners();
      overlayContent.hidden = false;
      overlay.classList.add("show");
    });
  });

  document.querySelectorAll(".update-status-link").forEach((link) => {
    link.addEventListener("click", () => {
      const orderId = link.getAttribute("data-order-id");
      const order = getOrderById(orderId);
      overlayContent.innerHTML = UpdateStatusOrderModal(order);
      setUpUpdateOrderModalEventListeners();
      overlayContent.hidden = false;
      overlay.classList.add("show");
    });
  });
}

function setUpOrderDetailModalEventListeners() {
  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    closeOverlay();
  });
}
function closeOverlay() {
  overlayContent.hidden = true;
  overlayContent.innerHTML = "";
  overlay.classList.remove("show");
}
function UpdateStatusOrderModal(order) {
  console.log(order.status);
  return `
     <div id="update-modal" class="modal">
        <div class="modal-header">
          <h2>Cập nhật đơn hàng</h2>
        </div>
        <div class="modal-body">
          <form class="update-form">
            <div class="form-group">
              <label for="order-id">Mã đơn hàng</label>
              <input type="text" id="order-id" value="${order.id}" disabled />
            </div>
            <div class="form-group">
              <label for="customer-name">Khách hàng</label>
              <input
                type="text"
                id="customer-name"
                value="${order.fullName}"
                disabled
              />
            </div>
            <div class="form-group">
              <label for="order-status-select">Trạng thái</label>
              <select id="order-status-select">
               <option 
            value="${ORDER_STATUS.PENDING}" 
            ${order.status === ORDER_STATUS.PENDING ? "selected" : ""}
          >
            Chờ xác nhận
          </option>
          <option 
            value="${ORDER_STATUS.PROCESSING}" 
            ${order.status === ORDER_STATUS.PROCESSING ? "selected" : ""}
          >
            Đang chuẩn bị
          </option>
          <option 
            value="${ORDER_STATUS.DELIVERED}" 
            ${order.status === ORDER_STATUS.DELIVERED ? "selected" : ""}
          >
            Đã giao
          </option>
          <option 
            value="${ORDER_STATUS.COMPLETED}" 
            ${order.status === ORDER_STATUS.COMPLETED ? "selected" : ""}
          >
            Đã hoàn thành
          </option>
          <option 
            value="${ORDER_STATUS.CANCELED}" 
            ${order.status === ORDER_STATUS.CANCELED ? "selected" : ""}
          >
            Đã Hủy
          </option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="modal-button close-btn">Đóng</button>
          <button class="modal-button save-btn" data-order-id="${
            order.id
          }">Lưu</button>
        </div>
      </div>
  `;
}

function setUpUpdateOrderModalEventListeners() {
  document
    .querySelector("#update-modal .close-btn")
    .addEventListener("click", closeOverlay);

  const saveBtn = document.querySelector("#update-modal .save-btn");
  saveBtn.addEventListener("click", () => {
    // Lưu trạng thái đơn hàng ở đây
    const select = document.querySelector("#order-status-select");
    const orderId = saveBtn.dataset.orderId;
    const newStatus = select.value;
    // Cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
    updateStatusOrder(orderId, newStatus);
    closeOverlay();
    // Tải lại trang quản lý đơn hàng để hiển thị trạng thái mới
    loadOrderPage();
  });
}
