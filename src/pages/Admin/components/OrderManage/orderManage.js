import { AdminNav, setUpAdminNav } from "../AdminNav/AdminNav.js";
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
const orderStatusTranslation = {
  PENDING: "Chờ xác nhận",
  SHIPPING: "Đang vận chuyển",
  DELIVERED: "Chờ giao hàng",
  COMPLETED: "Hoàn thành",
  CANCELED: "Đã hủy",
};
let filter = { pageNumber: 1, pageSize: 5 };
function renderOrderManage() {
  const result = filterOrdersByAdmin({ pageSize: filter.pageSize });
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
                    class="search-bar order-search-bar"
                  />
                  <button class="order-search-btn">SEARCH</button>
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
                <button class="active" data-status="all">Tất cả</button>
                <button data-status="${
                  ORDER_STATUS.PENDING
                }">Chờ xác nhận</button>
                <button data-status="${
                  ORDER_STATUS.SHIPPING
                }">Vận chuyển</button>
                <button data-status="${
                  ORDER_STATUS.DELIVERED
                }">Chờ giao hàng</button>
                <button data-status="${
                  ORDER_STATUS.COMPLETED
                }">Hoàn thành</button>
              </div>
              <div class="order-date-filter">
                <span>Từ</span>
                <input placeholder="mm/dd/yy" type="date" />
                <span>Đến</span>
                <input placeholder="mm/dd/yy" type="date" />
                <button class="filter-by-date-btn">Lọc</button>
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

  document
    .querySelector(".order-table-container")
    .appendChild(renderPagination(result.totalPages, filter.pageNumber));
}

function OrderItem(orderItem) {
  const paymentMethod = getPaymentMethodById(orderItem.paymentMethodId);
  const isOrderFinished =
    orderItem.status === ORDER_STATUS.COMPLETED ||
    orderItem.status === ORDER_STATUS.CANCELED;

  return `
  <tr>
    <td>${orderItem.id}</td>
    <td>${orderItem.fullName}</td>
    <td>${formatDate(orderItem.updatedAt)}</td>
    <td>${formatNumber(orderItem.totalPrice)}đ</td>
    <td>${formatNumber(orderItem.totalCheckout)}đ</td>
    <td>${paymentMethod.name}</td>
    <td>${orderStatusTranslation[orderItem.status]}</td>
    <td>
      <p class="order-details-link" data-order-id="${
        orderItem.id
      }">Xem chi tiết</p>
      <p class="update-status-link ${
        isOrderFinished ? "disabled" : ""
      }" data-order-id="${orderItem.id}" ${
    isOrderFinished ? 'style="opacity: 0.5; cursor: not-allowed;"' : ""
  }>Cập nhật trạng thái</p>
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
        <div class="modal-body order-detail-table">
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
           <tr>
              <th>Mã đơn hàng</th>
              <th>Khách hàng</th>
              <th>Thời gian tạo đơn</th>
              <th>Tổng tiền</th>
              <th>Tổng tiền thanh toán</th>
              <th>Phương thức thanh toán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
           </tr>
          </thead>
          <tbody>
            ${orderItems.map((item) => OrderItem(item)).join("")}
          </tbody>
        </table>
      
`;
}

export function loadOrderPage() {
  filter = { pageNumber: 1, pageSize: 5 };
  renderOrderManage();
  setUpOrderTableEventListeners();

  handleClickFilterByStatus();
  handleClickFilterByDate();
  setUpAdminNav();
  handleClickSearchOrder();
}

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
function renderPagination(totalPages, pageNumber) {
  let paginationDiv = document.createElement("div");
  paginationDiv.classList.add("pagination");
  // Logic để tạo các nút phân trang dựa trên filter.pageNumber và filter.pageSize
  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= totalPages; i++) {
    const pageSpan = document.createElement("span");
    pageSpan.classList.add("page-item");
    if (i === pageNumber) {
      pageSpan.classList.add("active");
    }
    pageSpan.textContent = i;
    pageSpan.addEventListener("click", () => {
      const result = filterOrdersByAdmin({
        ...filter,
        pageNumber: i,
      });
      const allOrders = result.items;
      document.querySelector(".order-table-container").innerHTML =
        OrderTable(allOrders);
      setUpOrderTableEventListeners();
      document
        .querySelector(".order-table-container")
        .appendChild(renderPagination(result.totalPages, i));
    });
    fragment.appendChild(pageSpan);
  }
  paginationDiv.appendChild(fragment);
  return paginationDiv;
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
      // Kiểm tra nếu link bị disabled thì không làm gì
      if (link.classList.contains("disabled")) {
        return;
      }

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
            value="${ORDER_STATUS.SHIPPING}" 
            ${order.status === ORDER_STATUS.SHIPPING ? "selected" : ""}
          >
            Vận chuyển
          </option>
          <option 
            value="${ORDER_STATUS.DELIVERED}" 
            ${order.status === ORDER_STATUS.DELIVERED ? "selected" : ""}
          >
            Chờ giao hàng
          </option>
          <option 
            value="${ORDER_STATUS.COMPLETED}" 
            ${order.status === ORDER_STATUS.COMPLETED ? "selected" : ""}
          >
            Hoàn thành
          </option>
          <option 
            value="${ORDER_STATUS.CANCELED}" 
            ${order.status === ORDER_STATUS.CANCELED ? "selected" : ""}
          >
            Đã hủy
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

function handleClickFilterByStatus() {
  document.querySelectorAll(".order-status-btns button").forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("data-status");
      document
        .querySelector(".order-status-btns button.active")
        .classList.remove("active");
      button.classList.add("active");
      filter["status"] = status === "all" ? null : status;
      const result = filterOrdersByAdmin(filter);
      const allOrders = result.items;
      document.querySelector(".order-table-container").innerHTML =
        OrderTable(allOrders);
      setUpOrderTableEventListeners();
      document
        .querySelector(".order-table-container")
        .appendChild(renderPagination(result.totalPages, filter.pageNumber));
    });
  });
}

function handleClickFilterByDate() {
  document
    .querySelector(".filter-by-date-btn")
    .addEventListener("click", () => {
      const dateInputs = document.querySelectorAll(".order-date-filter input");
      const startDate = dateInputs[0].value;
      const endDate = dateInputs[1].value;
      filter["startDate"] = startDate ? startDate : null;
      filter["endDate"] = endDate ? endDate : null;
      const result = filterOrdersByAdmin(filter);
      const allOrders = result.items;
      document.querySelector(".order-table-container").innerHTML =
        OrderTable(allOrders);
      setUpOrderTableEventListeners();
      document
        .querySelector(".order-table-container")
        .appendChild(renderPagination(result.totalPages, filter.pageNumber));
    });
}
function handleClickSearchOrder() {
  document.querySelector(".order-search-btn").addEventListener("click", () => {
    const searchInput = document.querySelector(".order-search-bar").value;
    filter["searchKey"] = searchInput ? searchInput : null;
    const result = filterOrdersByAdmin(filter);
    const allOrders = result.items;
    document.querySelector(".order-table-container").innerHTML =
      OrderTable(allOrders);
    setUpOrderTableEventListeners();
    document
      .querySelector(".order-table-container")
      .appendChild(renderPagination(result.totalPages, filter.pageNumber));
  });
}
