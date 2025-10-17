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
            <a href="#" data-status="${
              ORDER_STATUS.DELIVERED
            }" class="order-tab">Đã giao</a>
            <a href="#" data-status="${
              ORDER_STATUS.COMPLETED
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
        <span>Trạng thái: <b>${order.status}</b></span>
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
          <button class="btn">Xem chi tiết</button>
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
}
