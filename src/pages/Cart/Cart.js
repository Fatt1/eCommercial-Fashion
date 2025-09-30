import Header, { handleClickHeader } from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import InformBar from "../../components/InformBar/InformBar.js";
import CartSection from "../../components/CartSection/CartSection.js";
import TotalMoneyCal from "../../components/TotalMoneyCal/TotalMoneyCal.js";
import { renderCartItemContainer } from "../../components/CartItem/CartItem.js";
import { renderCheckout } from "./Checkout.js";
import { checkCart } from "../../services/cartService.js";

function renderCart() {
  const root = document.getElementById("root");
  root.innerHTML = `
   ${Header("trang-chu")}
    <div class="cart-container">
    ${InformBar()}
   ${CartSection()}
   ${TotalMoneyCal()}
    </div>
   ${Footer()}
  `;
  handleClickHeader();
}

function handleClickCheckout() {
  document.querySelector(".buy-now-btn").addEventListener("click", () => {
    if (checkCart()) {
      renderCheckout();
    }
  });
}

renderCart();
renderCartItemContainer();
handleClickCheckout();
