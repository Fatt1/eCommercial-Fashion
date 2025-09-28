import {
  checkValidCoupon,
  getAllAvailableDiscounts,
  getDiscountById,
} from "../../services/discountService.js";
import { formatNumber } from "../../helper/formatNumber.js";
import { checkout, selectedVoucherId } from "../../pages/Cart/Checkout.js";
import { checkoutPreview } from "../../services/checkoutService.js";
export default function VoucherPopup() {
  const allAvailableDiscounts = getAllAvailableDiscounts();
  return `<div class="voucher-popup">
    <p class="header-voucher">Chọn voucher</p>
    <div class="voucher-container">
      ${allAvailableDiscounts.map((voucher) => VoucherItem(voucher)).join(" ")}
    </div>
    <div class="voucher-action">
      <button class="return-btn">Trở lại</button>
       <button class="apply-voucher-btn">Áp dụng</button>
      </div>
  </div>`;
}

function VoucherItem(voucher) {
  let selected = "";
  if (selectedVoucherId) {
    selected = selectedVoucherId.voucherId === voucher.id ? "selected" : "";
  }
  return `
  <div>
  <div class="voucher-item">
    <img class="voucher-img" src="../assets/voucher.jpg"></img>
    <div class="voucher-info">
      <p class="voucher-code">${voucher.couponCode}</p>
      <p class="voucher-name">${voucher.name}</p>
      <p class="max-discount">Giảm tối đa ${voucher.maxDiscountValue}</p>
      <p class="min-order">Đơn tối thiểu ${voucher.minDiscountValue}</p>
      <p class="left-time-voucher">Sắp hết hạn: Còn ${voucher.leftTimeDays} ngày</p>
    </div>
      <div data-voucher-id="${voucher.id}" class="voucher-ratio ${selected}"></div>
  </div>
  <div class="error-voucher"></div>
  </div>`;
}

export function setupVoucherPopup() {
  // Set up cho nút quay về
  document.querySelector(".return-btn").addEventListener("click", () => {
    document.querySelector(".overlay").classList.remove("show");
    document.getElementById("voucher-popup").innerHTML = "";
  });

  //Set up cho nút ratio
  document.querySelectorAll(".voucher-ratio").forEach((ratio) =>
    ratio.addEventListener("click", () => {
      document
        .querySelectorAll(".voucher-ratio")
        .forEach((r) => r.classList.remove("selected"));
      clearAllErrorDiscount();
      ratio.classList.add("selected");
    })
  );
  document.querySelector(".apply-voucher-btn").addEventListener("click", () => {
    const selectedRadio = document.querySelector(".voucher-ratio.selected");
    selectedVoucherId.voucherId = selectedRadio.dataset.voucherId;
    const discount = getDiscountById(selectedRadio.dataset.voucherId);
    const rawTotal = checkout.prop.totalPrice;
    const checkDiscount = checkValidCoupon(discount.id, rawTotal);
    if (!checkDiscount.successful) {
      console.log(selectedRadio.closest(".voucher-item").nextElementSibling);
      selectedRadio.closest(".voucher-item").nextElementSibling.innerHTML =
        checkDiscount.message;
      selectedRadio.closest(".voucher-item").nextElementSibling.style.display =
        "block";
      return;
    }
    document.querySelector(".overlay").classList.remove("show");
    document.getElementById("voucher-popup").innerHTML = "";
    document.querySelector(".voucher-btn").innerHTML = discount.name;
    checkout.prop = checkoutPreview(discount.id);
    document.getElementById("total-shipping").innerHTML = formatNumber(
      checkout.prop.feeShipping
    );
    document.getElementById("total-discount").innerHTML = formatNumber(
      checkout.prop.totalDiscount
    );
    document.getElementById("total-checkout").innerHTML = formatNumber(
      checkout.prop.totalCheckout
    );
  });
}

function clearAllErrorDiscount() {
  document
    .querySelectorAll(".error-voucher")
    .forEach((err) => (err.style.display = "none"));
}
