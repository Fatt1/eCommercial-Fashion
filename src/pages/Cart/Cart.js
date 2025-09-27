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

renderCart();
renderCartItemContainer();
