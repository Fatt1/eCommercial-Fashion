import { getAllPaymentMethods } from "../../services/paymentMethodService.js";

export default function PaymentMethod() {
  const paymentMethods = getAllPaymentMethods();
  return `
 <div class="payment-methods">
    ${paymentMethods
      .map((method) => {
        return `<div dataset-method-id="${method.id}" class="payment-method ${
          method.name === "Thanh toán khi nhận hàng" ? "active" : ""
        }">
        ${method.name}
  </div>`;
      })
      .join(" ")}    
  </div>`;
}

export function setUpPaymentMethod() {
  document.querySelectorAll(".payment-method").forEach((payment) => {
    payment.addEventListener("click", () => {
      document
        .querySelectorAll(".payment-method")
        .forEach((p) => p.classList.remove("active"));
      payment.classList.add("active");
    });
  });
}
