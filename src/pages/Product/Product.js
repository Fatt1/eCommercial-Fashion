import { filterProducts } from "../../services/productService.js";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import { autoSlideId } from "../../components/Carousel/Carousel.js";
import ProductSection from "./components/ProductSection.js";
import ProductListProductPage from "./components/ProductListProductPage.js";
import PromotionSection, {
  timerIntervalId,
} from "../../components/PromotionSection/Promotion.js";
function renderProduct(categoryId) {
  document.getElementById("root").innerHTML = `
  ${Header()}
     ${ProductSection(categoryId)}
     ${Footer()}
  `;
}
function setupProduct() {
  console.log(
    filterProducts({
      colors: ["color-dark-blue"],
      sizes: ["size-28"],
    })
  );

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
  clearInterval(timerIntervalId);
  clearInterval(autoSlideId);
  window.scrollTo(0, 0);
  renderProduct(categoryId);

  setupProduct();
}

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
