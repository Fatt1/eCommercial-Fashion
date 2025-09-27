import Header, { handleClickHeader } from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import InformBar from "../../components/InformBar/InformBar.js";
import CartSection from "../../components/CartSection/CartSection.js";
import TotalMoneyCal from "../../components/TotalMoneyCal/TotalMoneyCal.js";
import { renderCartItemContainer } from "../../components/CartItem/CartItem.js";

function renderCart() {
  const root = document.getElementById("root");
  root.innerHTML = `
   ${Header("trang-chu")}
   ${InformBar()}
   ${CartSection()}
   ${TotalMoneyCal()}
   ${Footer()}
  `;
}

function renderCheckout() {
  const root = document.getElementById("root");
  root.innerHTML = `
    ${Header("")}
    ${InformBar()}
      
    ${Footer()}
  `;
}

// export function navigate(page) {
//   if (page === "cart") {
//     renderCart();
//   } else if (page === "checkout") {
//     renderCheckout();
//   } else {
//     console.error("Unknown page:", page);
//   }
// }
// document.querySelector(".buy-now-btn").addEventListener("click", () => {
//   navigate("checkout");
// });

renderCart();
renderCartItemContainer();
