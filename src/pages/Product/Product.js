import {
  filterProducts,
  getAllProducts,
  getProductById,
} from "../../services/productService.js";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import Carousel, { setupCarousel } from "../../components/Carousel/Carousel.js";
import ProductSection from "./components/ProductSection.js";
import ProductDetails from "./ProductDetails.js";
import ProductListProductPage from "./components/ProductListProductPage.js";
import PromotionSection, {
  setupPromotion,
} from "../../components/PromotionSection/Promotion.js";
function render(categoryId) {
  document.getElementById("root").innerHTML = `
  ${Header()}
  ${Carousel()}
  <h2 class="header-text main-content">KHUYẾN MÃI HÔM NAY</h2>
     ${PromotionSection()}
     ${ProductSection(categoryId)}
     ${Footer()}
  `;
}
function setup() {
  console.log(
    filterProducts({
      colors: ["color-dark-blue"],
      sizes: ["size-28"],
    })
  );
  setupPromotion();
  setupCarousel();

  document.querySelector(".dropdown").addEventListener("mouseover", () => {
    document.querySelector(".dropdown-menu").classList.add("show");
  });
  document.querySelector(".dropdown").addEventListener("mouseout", () => {
    document.querySelector(".dropdown-menu").classList.remove("show");
  });

  handleSortByPrice();
}
export const filterParams = {};
export function loadProductPage(categoryId) {
  render(categoryId);
  setup();
}
document.addEventListener("DOMContentLoaded", async () => {
  render();
  setup();
});

function handleSortByPrice() {
  document.querySelectorAll(".sort-by-price").forEach((elem) =>
    elem.addEventListener("click", (event) => {
      const li = event.target;
      document.querySelector(".price-btn").textContent = li.textContent;
      li.classList.add("active");
      const order = li.dataset.order;
      const sortBy = li.dataset.sortBy;
      filterParams.order = order;
      filterParams.sortBy = sortBy;

      document.querySelector("#product-list-section").innerHTML =
        ProductListProductPage({ ...filterParams });
    })
  );
}
