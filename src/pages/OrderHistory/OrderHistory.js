import Footer from "../../components/Footer/Footer.js";
import Header, { handleClickHeader } from "../../components/Header/Header.js";
import { timerIntervalId } from "../../components/PromotionSection/Promotion.js";
import { autoSlideId } from "../../components/Carousel/Carousel.js";
function renderOrderHistoryHtml() {
  const root = document.getElementById("root");
  root.innerHTML = `
  ${Header("trang-chu")}
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
            <a href="#" class="active">Tất cả</a>
            <a href="#">Chờ xác nhận</a>
            <a href="#">Vận chuyển</a>
            <a href="#">Chờ giao hàng</a>
            <a href="#">Hoàn thành</a>
            <a href="#">Đã hủy</a>
          </div>
        </div>

        <!-- Đơn hàng 1 -->
        <section class="order">
          <div class="order-header">
            <span>Đã hủy</span>
          </div>
          <div class="order-body">
            <img src="../assets/large-img-detail.png" alt="sản phẩm" />
            <div class="info">
              <p class="name">ÁO SƠ MI 22X213</p>
              <p>Phân loại hàng: Đen, XL</p>
              <p>x2</p>
            </div>
            <div class="price-block">
              <div class="price-old">557.000đ</div>
              <div class="price">447.000đ</div>
            </div>
          </div>
          <p class="status">Đã hủy bởi bạn</p>
          <div class="order-footer">
            <span>Thành Tiền: <b class="total">447.000đ</b></span>
            <div class="controls">
              <button class="btn primary">Mua lại</button>
              <button class="btn">Chi tiết hủy đơn</button>
              <button class="btn">Liên hệ người bán</button>
            </div>
          </div>
        </section>

        <!-- Đơn hàng 2 -->
        <section class="order">
          <div class="order-header">
            <span>Hoàn thành</span>
          </div>
          <div class="order-body">
            <img src="../assets/large-img-detail.png" alt="sản phẩm" />
            <div class="info">
              <p class="name">ÁO SƠ MI 22X213</p>
              <p>Phân loại hàng: Đen, XL</p>
              <p>x2</p>
            </div>
            <div class="price-block">
              <div class="price-old">557.000đ</div>
              <div class="price">447.000đ</div>
            </div>
          </div>
          <p class="status">Đánh giá ngay</p>
          <div class="order-footer">
            <span>Thành Tiền: <b class="total">447.000đ</b></span>
            <div class="controls">
              <button class="btn primary">Mua lại</button>
              <button class="btn">Đánh giá</button>
              <button class="btn">Liên hệ người bán</button>
            </div>
          </div>
        </section>

      </div>
      
        <!-- footer -->
      ${Footer()}
  `;
}
// Load trang lịch sử mua hàng
export function loadOrderHistory() {
  clearInterval(timerIntervalId);
  clearInterval(autoSlideId);
  renderOrderHistoryHtml();
  setUpOrderHistory();
}
// Thiết lập các sự kiện cho trang lịch sử mua hàng
function setUpOrderHistory() {
  handleClickHeader();
}
