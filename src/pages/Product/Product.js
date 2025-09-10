import Header from "../../components/Header/Header.js";
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
  `;
}
function setup() {
  setupCarousel();
  setupPromotion();
}
document.addEventListener("DOMContentLoaded", () => {
  render();
  setup();
});
