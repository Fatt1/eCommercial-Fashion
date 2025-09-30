import Header, { handleClickHeader } from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import { autoSlideId } from "../../components/Carousel/Carousel.js";
import ProductSection from "./components/ProductSection.js";
import { timerIntervalId } from "../../components/PromotionSection/Promotion.js";
import { handleClickProductSection } from "./components/ProductSection.js";
import { updateCartQuantityStraight } from "../../services/cartService.js";
function renderProduct(categoryId) {
  document.getElementById("root").innerHTML = `
  ${Header("san-pham")}
    
     ${ProductSection(categoryId)}
     ${Footer()}
     
  `;
}
function setupProduct() {
  document.body.style.backgroundColor = "white";
  document
    .querySelector(".right-sort-bar .dropdown")
    .addEventListener("mouseover", () => {
      document
        .querySelector(".right-sort-bar .dropdown-menu")
        .classList.add("show");
    });
  document
    .querySelector(".right-sort-bar .dropdown")
    .addEventListener("mouseout", () => {
      document
        .querySelector(".right-sort-bar .dropdown-menu")
        .classList.remove("show");
    });
  handleClickHeader();
  handleClickProductSection();
  updateCartQuantityStraight();
}
export let filterParams = {};
export let isSearching = false;
export function loadProductPage(categoryId, isSearchPage = false) {
  clearInterval(timerIntervalId);
  clearInterval(autoSlideId);
  window.scrollTo(0, 0);
  isSearching = isSearchPage;
  renderProduct(categoryId);

  setupProduct(isSearchPage);
}
