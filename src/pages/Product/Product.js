import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import Carousel, { setupCarousel } from "../../components/Carousel/Carousel.js";
import PromotionSection, {
  setupPromotion,
} from "../../components/PromotionSection/Promotion.js";
import ProductSection from "./components/ProductSection.js";
function render() {
  document.getElementById("root").innerHTML = `
  ${Header()}
  ${Carousel()}
  <h2 class="header-text main-content">KHUYẾN MÃI HÔM NAY</h2>
     ${PromotionSection()}
     ${ProductSection()}
     ${Footer()}
  `;
}
function setup() {
  setupCarousel();
  setupPromotion();
  document.querySelector(".dropdown").addEventListener("mouseover", () => {
    document.querySelector(".dropdown-menu").classList.add("show");
  });
  document.querySelector(".dropdown").addEventListener("mouseout", () => {
    document.querySelector(".dropdown-menu").classList.remove("show");
  });
  document.querySelectorAll(".caret").forEach((caret) =>
    caret.addEventListener("click", () => {
      caret.classList.toggle("active");
    })
  );
}
document.addEventListener("DOMContentLoaded", () => {
  render();
  setup();
});
