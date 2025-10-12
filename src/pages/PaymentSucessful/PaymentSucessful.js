import Footer from "../../components/Footer/Footer.js";
import Header, { handleClickHeader } from "../../components/Header/Header.js";
import { ORDER_STATUS } from "../../constant/Constant.js";
import { updateStatusOrder } from "../../services/orderService.js";
import { loadOrderHistory } from "../OrderHistory/OrderHistory.js";

function renderPaymentSuccessfulHtml() {
  const root = document.getElementById("root");
  root.innerHTML = `
  ${Header("trang-chu")}
  <div class="payment-successful">
    <div class="main-content">
      <div class="payment-successful-box">
         <h2 class="payment-successful-text">Bạn đã đặt hàng thành công!</h2>
         <p class="order-link">Quay lại trang chủ</p>
      </div>
    </div>   
  </div>
  ${Footer()}
  `;
}
function setUpPaymentSuccessfulPage() {
  handleClickHeader();
  updateOrder();
  const orderLink = document.querySelector(".order-link");
  orderLink.addEventListener("click", () => {
    loadOrderHistory();
  });
}
function loadPaymentSuccessfulPage() {
  renderPaymentSuccessfulHtml();
  setUpPaymentSuccessfulPage();
}
loadPaymentSuccessfulPage();
function updateOrder() {
  const tempOrder = JSON.parse(localStorage.getItem("temp_order"));
  updateStatusOrder(tempOrder.id, ORDER_STATUS.PENDING);
  localStorage.removeItem("temp_order");
  // còn 1 phần là sẽ xóa đi các sản phẩm đã mua trong cart;
  const cart = JSON.parse(localStorage.getItem("cart"));
  const newCart = cart.filter((c) => c.tick === false);
  localStorage.setItem("cart", JSON.stringify(newCart));
  document.querySelector(".cart-quantity").textContent = newCart.length;
}
