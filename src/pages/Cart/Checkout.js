import CheckoutItem from "../../components/CheckoutItem/CheckoutItem.js";
import Footer from "../../components/Footer/Footer.js";
import Header, { handleClickHeader } from "../../components/Header/Header.js";
import PaymentMethod, {
  setUpPaymentMethod,
} from "../../components/PaymentMethod/PaymentMethod.js";
import VoucherPopup, {
  setupVoucherPopup,
} from "../../components/VoucherPopup/VoucherPopup.js";
import { formatNumber } from "../../helper/formatNumber.js";
import { checkoutPreview, placeOrder } from "../../services/checkoutService.js";
import PickerLocation from "../../components/PickerLocation/PickerLocation.js";
import { renderAddressForm } from "../../components/AddressFormPopup/AddressFormPopup.js";
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress.js";
import { getDefaultAddress } from "../../services/userService.js";
export const selectedVoucherId = {};
export let checkout = {};
let selectedAddress;
export function renderCheckout() {
  const loggedUser = JSON.parse(localStorage.getItem("user_info"));
  console.log(loggedUser);
  selectedAddress = getDefaultAddress(loggedUser.id);

  checkout.prop = checkoutPreview();
  document.getElementById("root").innerHTML = `
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
          ${DeliveryAddress(selectedAddress)}
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
              ${checkout.prop.itemsCheckout
                .map((checkoutItem) => {
                  return CheckoutItem(
                    checkoutItem.item,
                    checkoutItem.quantity,
                    checkoutItem.rawPrice
                  );
                })
                .join(" ")}
            </div>
          </section>


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
                    <button class="blue-button voucher-btn">Chọn Voucher khác</button>
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
                        Nhận voucher trị giá 15.000<span class="currency">đ</span> nếu đơn hàng bị giao trễ
                        sau 20 tháng 9
                      </div>
                    </div>
                    <button class="shipping-col-3 blue-button">Thay đổi</button>
                  </div>
                </div>
              </div>
              <div class="checkout-box-bot">
                <span>Tổng số tiền (${
                  checkout.prop.totalItems
                } sản phẩm):</span>
                <div>${formatNumber(
                  checkout.prop.totalPrice
                )}<span class="currency">đ</span></div>
              </div>
            </div>
            <div class="checkout-box2 checkout-box">
              <div class="row-1">
                <span class="row-1-col-1">Phương thức thanh toán</span
                ><span class="row-1-col-2">Thanh toán khi nhận hàng</span
                ><button class="row-1-col-3 blue-button">Thay đổi</button>
              </div>
              <div class="row-2">
              ${PaymentMethod()}
                <div class="row-2-info">
                  <div class="payments">
                    <span class="grey-text">Tổng tiền hàng</span>
                    <div id="total-price">
                    <span>${formatNumber(checkout.prop.totalPrice)}</span>
                    <span class="currency">đ</span></div>
                  </div>
                  <div class="payments">
                    <span class="grey-text">Tổng tiền vận chuyển</span>
                    <div><span id="total-shipping">${formatNumber(
                      checkout.prop.feeShipping
                    )}</span><span class="currency">đ</span></div>
                  </div>
                  <div class="payments">
                    <span class="grey-text">Tổng cộng voucher giảm giá</span>
                    <div style="color: orange">-
                    <span id="total-discount">${formatNumber(
                      checkout.prop.totalDiscount
                    )}
                    </span>
                    <span class="currency">đ</span></div>
                  </div>
                  <div class="payments">
                    <span class="grey-text">Tổng thanh toán</span>
                    <div  style="font-size: x-large">
                    <span id="total-checkout">${formatNumber(
                      checkout.prop.totalCheckout
                    )}</span>
                    <span class="currency">đ</span></div>
                  </div>
                </div>
              </div>
              <div class="row-3">
                <div class="order-terms">
                  <span class="grey-text"
                    >Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân
                    theo.</span
                  >
                  <button class="voucher-button">Điều khoản của Diorn</button>
                </div>
                <button class="order-button">Đặt hàng</button>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      ${Footer()}
  `;
  setUpCheckout();
}

function setUpCheckout() {
  document.querySelector(".voucher-btn").addEventListener("click", (event) => {
    document.querySelector(".overlay").classList.add("show");
    const voucherPopup = document.getElementById("voucher-popup");
    voucherPopup.innerHTML = VoucherPopup();
    setupVoucherPopup();

    voucherPopup.style.left =
      document.body.clientWidth / 2 - voucherPopup.clientWidth / 2 + "px";
  });
  document.querySelector(".order-button").addEventListener("click", () => {
    handlePlaceOrder();
  });
  setUpPaymentMethod();
  handleClickHeader();
}

function handlePlaceOrder() {
  console.log(document.querySelector(".payment-method.active"));
  const paymentMethodId = document.querySelector(".payment-method.active")
    .dataset.methodId;
  const loggedUser = JSON.parse(localStorage.getItem("user_info"));
  placeOrder(
    checkout.prop,
    loggedUser.id,
    selectedAddress.street,
    selectedAddress.city,
    selectedAddress.ward,
    selectedAddress.district,
    paymentMethodId
  );
}
