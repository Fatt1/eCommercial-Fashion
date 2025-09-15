import Carousel from "../../components/Carousel/Carousel.js";
import Header from "../../components/Header/Header.js";
import { setupCarousel } from "../../components/Carousel/Carousel.js";
import PromotionSection, {
  setupPromotion,
} from "../../components/PromotionSection/Promotion.js";
import CategorySection, {
  setupCategorySection,
} from "./components/CategorySection.js";

import BestSeller from "./components/BestSeller.js";
import Footer from "../../components/Footer/Footer.js";
import ReviewSection from "../Home/components/ReviewSection.js";
import { getAllProducts } from "../../services/productService.js";
import { loadDataToLocalStorage } from "../../helper/initialData.js";

const products = getAllProducts({}).items;
function render() {
  const root = document.getElementById("root");
  root.innerHTML = `
  ${Header()}
  ${Carousel()}
   <h2 class="header-text main-content">KHUYẾN MÃI HÔM NAY</h2>
   ${PromotionSection()}
   ${CategorySection()}
   ${BestSeller({ products })}
   ${ReviewSection()}
   ${Footer()}
  `;
}
function setupHome() {
  setupCarousel();
  setupPromotion();
  setupCategorySection();
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadDataToLocalStorage();
  render();
  setupHome();
});
