import Footer from "../../components/Footer/Footer.js";
import Header, { handleClickHeader } from "../../components/Header/Header.js";
import { timerIntervalId } from "../../components/PromotionSection/Promotion.js";
import { autoSlideId } from "../../components/Carousel/Carousel.js";
import {
  getAllOrdersByUserId,
  getOrdersUserIdByStatus,
} from "../../services/orderService.js";
import { getLoggedUser } from "../../services/userService.js";
import { ORDER_STATUS } from "../../constant/Constant.js";
import { formatNumber } from "../../helper/formatNumber.js";
import { getProductById } from "../../services/productService.js";
import { getPaymentMethodById } from "../../services/paymentMethodService.js";

const orderStatusTranslation = {
  [ORDER_STATUS.PENDING]: "Chờ xác nhận",
  [ORDER_STATUS.SHIPPING]: "Đang vận chuyển",
  [ORDER_STATUS.DELIVERED]: "Chờ giao hàng",
  [ORDER_STATUS.COMPLETED]: "Hoàn thành",
  [ORDER_STATUS.CANCELED]: "Đã hủy",
};

let state = {
  orders: [],
  activeTab: "ALL",
};

function renderOrderHistoryHtml() {
  const root = document.getElementById("root");
  root.innerHTML = `
  ${Header()}
       <div class="main-content">
        <div style="margin-top: 150px;" class="inform-bar">
          <div>
            <img class="inform-bar-icon" src="../assets/inform-icon.svg" />
          </div>
          <div class="vertical-line"></div>
          <div
            class="inform-bar-text"
            style="font-family: Geologica, sans-serif"
          >
            LỊCH SỬ MUA HÀNG
          </div>
          <div class="order-tabs">
            <a href="#" data-status="ALL" class="order-tab active">Tất cả</a>
            <a href="#" data-status="${
              ORDER_STATUS.PENDING
            }" class="order-tab">Chờ xác nhận</a>
            <a href="#" data-status="${
              ORDER_STATUS.SHIPPING
            }" class="order-tab">Vận chuyển</a>
            <a href="#" data-status="DELIVERED" class="order-tab">Chờ giao hàng</a>
            <a href="#" data-status="${
              ORDER_STATUS.DELIVERED
            }" class="order-tab">Hoàn thành</a>
            <a href="#" data-status="${
              ORDER_STATUS.CANCELED
            }" class="order-tab">Đã hủy</a>
          </div>
        </div>
        <div class="order-list-container">
          ${renderOrders(state.orders)}
        </div>
      </div>
      
        <!-- footer -->
      ${Footer()}
      <div id="order-detail-popup-container"></div>
  `;
}
// Load trang lịch sử mua hàng
export function loadOrderHistory() {
  clearInterval(timerIntervalId);
  clearInterval(autoSlideId);

  const user = getLoggedUser();
  if (!user) {
    // Nếu người dùng chưa đăng nhập, có thể chuyển hướng hoặc hiển thị thông báo
    // Tạm thời sẽ hiển thị trang trống
    state.orders = [];
  } else {
    state.orders = getAllOrdersByUserId(user.id);
  }

  renderOrderHistoryHtml();
  setUpOrderHistory();
}

function renderOrders(orders) {
  if (orders.length === 0) {
    return `<div class="empty-order">
              <img src="../assets/empty-order-icon.png" alt="Không có đơn hàng">
              <p>Chưa có đơn hàng nào</p>
            </div>`;
  }
  return orders.map((order) => renderSingleOrder(order)).join("");
}

function renderSingleOrder(order) {
  const firstItem = order.items[0];
  const product = getProductById(firstItem.productId);

  return `
    <section class="order" data-order-id="${order.id}">
      <div class="order-header">
        <span>Trạng thái: <b>${orderStatusTranslation[order.status]}</b></span>
      </div>
      <div class="order-body">
        <img src="../assets/products/${product.thumbnail}" alt="sản phẩm" />
        <div class="info">
          <p class="name">${firstItem.name}</p>
          <p>Phân loại hàng: ${firstItem.sku.name}</p>
          <p>x${firstItem.quantity}</p>
          ${
            order.items.length > 1
              ? `<p class="more-items">và ${
                  order.items.length - 1
                } sản phẩm khác...</p>`
              : ""
          }
        </div>
        <div class="price-block">
          ${
            firstItem.originalPrice !== firstItem.price
              ? `<div class="price-old">${formatNumber(
                  firstItem.originalPrice
                )}đ</div>`
              : ""
          }
          <div class="price">${formatNumber(firstItem.price)}đ</div>
        </div>
      </div>
      <div class="order-footer">
        <span>Thành Tiền: <b class="total">${formatNumber(
          order.totalCheckout
        )}đ</b></span>
        <div class="controls">
          <button class="btn primary">Mua lại</button>
          ${
            order.status === ORDER_STATUS.PENDING
              ? `<button class="btn cancel-order-btn" data-order-id="${order.id}">Hủy đơn</button>`
              : ""
          }
          <button class="btn view-detail-btn" data-order-id="${order.id}">Xem chi tiết</button>
        </div>
      </div>
    </section>
  `;
}

// Thiết lập các sự kiện cho trang lịch sử mua hàng
function setUpOrderHistory() {
  handleClickHeader();

  document.querySelectorAll(".order-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".order-tab.active").classList.remove("active");
      tab.classList.add("active");

      const status = tab.dataset.status;
      const user = getLoggedUser();
      if (status === "ALL") {
        state.orders = getAllOrdersByUserId(user.id);
      } else {
        state.orders = getOrdersUserIdByStatus(user.id, status);
      }
      document.querySelector(".order-list-container").innerHTML = renderOrders(
        state.orders
      );
    });
  });

  document.querySelectorAll(".cancel-order-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const orderId = e.target.dataset.orderId;
      const isConfirmed = confirm(
        "Bạn có chắc chắn muốn hủy đơn hàng này không?"
      );
      if (isConfirmed) {
        updateStatusOrder(orderId, ORDER_STATUS.CANCELED);
        // Tải lại trang để cập nhật trạng thái
        loadOrderHistory();
        alert("Đã hủy đơn hàng thành công!");
      }
    });
  });

  document.querySelectorAll(".view-detail-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const orderId = e.target.dataset.orderId;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        showOrderDetailPopup(order);
      }
    });
  });
}

function renderOrderDetailPopup(order) {
  const paymentMethod = getPaymentMethodById(order.paymentMethodId);
  return `
    <div class="order-detail-popup">
      <div class="order-detail-popup__header">
        <h2>Chi Tiết Đơn Hàng</h2>
        <button class="close-popup-btn">&times;</button>
      </div>
      <div class="order-detail-popup__body">
        <div class="order-top-info">
          <div class="order-info-section">
            <p><strong>Mã đơn hàng:</strong> ${order.id}</p>
            <p><strong>Ngày đặt:</strong> ${new Date(
              order.createdAt
            ).toLocaleDateString("vi-VN")}</p>
            <p><strong>Trạng thái:</strong> ${
              orderStatusTranslation[order.status]
            }</p>
          </div>
          <div class="address-section">
            <h4><i class="fa-solid fa-truck-fast"></i> Thông tin giao hàng</h4>
            <p><strong>Tên người nhận:</strong> <strong class="name">${order.fullName}</strong></p>
            <p>Số điện thoại: ${order.phoneNumber}</p>
            <p>Địa chỉ giao hàng: ${order.street}, ${order.ward}, ${order.district}, ${
    order.city
  }</p>
          </div>
        </div>

        <div class="items-section">
          <h4><i class="fa-solid fa-box-open"></i> Sản phẩm</h4>
          ${order.items
            .map((item) => {
              const product = getProductById(item.productId);
              return `
            <div class="order-item">
              <img src="../assets/products/${product.thumbnail}" alt="${
                item.name
              }" />
              <div class="item-info">
                <p class="item-name">${item.name}</p>
                <p class="item-sku">Phân loại: ${item.sku.name}</p>
                <p class="item-quantity">x${item.quantity}</p>
              </div>
              <div class="item-price">${formatNumber(item.price)}đ</div>
            </div>
          `;
            })
            .join("")}
        </div>
        <div class="payment-summary-section">
          <h4><i class="fa-solid fa-receipt"></i> Tổng kết đơn hàng</h4>
          <div class="summary-row">
            <span>Tổng tiền hàng</span>
            <span>${formatNumber(order.totalPrice)}đ</span>
          </div>
          <div class="summary-row">
            <span>Phí vận chuyển</span>
            <span>${formatNumber(order.feeShipping)}đ</span>
          </div>
          <div class="summary-row">
            <span>Giảm giá</span>
            <span>-${formatNumber(order.totalApplyDiscount)}đ</span>
          </div>
          <div class="summary-row total">
            <span>Thành tiền</span>
            <span>${formatNumber(order.totalCheckout)}đ</span>
          </div>
        </div>
        <div class="payment-method-section">
           <h4><i class="fa-solid fa-credit-card"></i> Phương thức thanh toán</h4>
           <p>${paymentMethod.name}</p>
        </div>
      </div>
    </div>
  `;
}

function showOrderDetailPopup(order) {
  const popupContainer = document.getElementById("order-detail-popup-container");
  const overlay = document.querySelector(".overlay");

  popupContainer.innerHTML = renderOrderDetailPopup(order);
  overlay.classList.add("show");
  popupContainer.classList.add("show");
  requestAnimationFrame(() => {
    popupContainer.style.opacity = 1;
    popupContainer.style.transform = "translate(-50%, -50%) scale(1)";
  });

  const closePopup = () => {
    overlay.classList.remove("show");
    popupContainer.classList.remove("show");
    popupContainer.innerHTML = "";
  };

  // Đóng khi click overlay
  overlay.addEventListener("click", closePopup, { once: true });

  // Đóng khi click nút 'x'
  popupContainer
    .querySelector(".close-popup-btn")
    .addEventListener("click", closePopup, { once: true });
}
