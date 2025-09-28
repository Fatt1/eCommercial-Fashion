import CheckoutItem from "../../components/CheckoutItem/CheckoutItem.js";
import Footer from "../../components/Footer/Footer.js";
import Header from "../../components/Header/Header.js";
export function renderCheckout() {
  return `
  ${Header("san-pham")}

     <div class="checkout">
        <!-- inform-bar -->
        <div class="inform-bar main-content">
          <div>
            <img class="inform-bar-icon" src="../assets/inform-icon.svg" />
          </div>
          <div class="vertical-line"></div>
          <div class="inform-bar-text">THANH TOÁN</div>
        </div>

        <!-- checkout summary  -->
        <div class="main-content">
          <section class="checkout-summary">
            <div class="checkout-info">
              <div class="product-main">Sản Phẩm</div>
              <div class="product-size">Kích Cỡ</div>
              <div class="product-color">Màu Sắc</div>
              <div class="product-price">Đơn Giá</div>
              <div class="product-quantity">Số Lượng</div>
              <div class="product-total">Thành tiền</div>
            </div>
            <div class="checkout-item-container">
              ${CheckoutItem()}
            </div>
          </section>

          <main class="content">
            <!-- nội dung dài ở đây -->
          </main>

          <!-- total money cal  -->

          <!--Fashion-checkout-->
          <section class="fashion-checkout">
            <div class="checkout-box1 checkout-box">
              <div class="checkout-box-top">
                <div class="checkout-top-left">
                  <span>Lời nhắn: </span>
                  <input
                    type="text"
                    class="notes-for-seller"
                    placeholder="Lưu ý cho người bán..."
                  />
                </div>
                <div class="checkout-top-right">
                  <div class="checkout-top-right__voucher">
                    <div class="voucher-items">
                      <span
                        ><img src="../assets/Voucher.svg" style="width: 30px"
                      /></span>
                      <span>Voucher</span>
                    </div>
                    <button class="blue-button">Chọn Voucher khác</button>
                  </div>
                  <div class="checkout-top-right__shipping">
                    <div class="shipping-col-1">Phương thức vận chuyển:</div>
                    <div class="shipping-col-2">
                      <div class="grey-text">Nhanh</div>
                      <div class="shipping-date-secured">
                        <span
                          ><img
                            src="../assets/shipping.png"
                            style="width: 20px"
                        /></span>
                        <span
                          >Đảm bảo nhận hàng từ 16 tháng 9 đến 20 tháng 9</span
                        >
                      </div>
                      <div class="grey-text">
                        Nhận voucher trị giá 15.000đ nếu đơn hàng bị giao trễ
                        sau 20 tháng 9
                      </div>
                    </div>
                    <button class="shipping-col-3 blue-button">Thay đổi</button>
                  </div>
                </div>
              </div>
              <div class="checkout-box-bot">
                <span>Tổng số tiền (0 sản phẩm):</span>
                <div>0đ</div>
              </div>
            </div>
            <div class="checkout-box2 checkout-box">
              <div class="row-1">
                <span class="row-1-col-1">Phương thức thanh toán</span
                ><span class="row-1-col-2">Thanh toán khi nhận hàng</span
                ><button class="row-1-col-3 blue-button">Thay đổi</button>
              </div>
              <div class="row-2">
                <div class="payment-methods">
                  <div class="payment-method active">
                    Thanh toán khi nhận hàng
                  </div>
                  <div class="payment-method">Paypal</div>
                </div>
                <div class="row-2-info">
                  <div class="payments">
                    <span class="grey-text">Tổng tiền hàng</span>
                    <div>0đ</div>
                  </div>
                  <div class="payments">
                    <span class="grey-text">Tổng tiền vận chuyển</span>
                    <div>0đ</div>
                  </div>
                  <div class="payments">
                    <span class="grey-text">Tổng cộng voucher giảm giá</span>
                    <div style="color: orange">0đ</div>
                  </div>
                  <div class="payments">
                    <span class="grey-text">Tổng thanh toán</span>
                    <div style="font-size: x-large">0đ</div>
                  </div>
                </div>
              </div>
              <div class="row-3">
                <div class="order-terms">
                  <span class="grey-text"
                    >Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân
                    theo.</span
                  >
                  <button class="blue-button">Điều khoản của Diorn</button>
                </div>
                <button class="order-button">Đặt hàng</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      ${Footer()}
  `;
}
