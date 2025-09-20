import Header, { handleClickHeader } from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import { autoSlideId } from "../../components/Carousel/Carousel.js";
import ProductSection from "./components/ProductSection.js";
import ProductListProductPage from "./components/ProductListProductPage.js";
import { timerIntervalId } from "../../components/PromotionSection/Promotion.js";
import { handleClickProductSection } from "./components/ProductSection.js";
function renderProduct(categoryId) {
  document.getElementById("root").innerHTML = `
  ${Header("san-pham")}
    
     ${ProductSection(categoryId)}
     ${Footer()}
  `;
}
function setupProduct() {
  document.querySelector(".dropdown").addEventListener("mouseover", () => {
    document.querySelector(".dropdown-menu").classList.add("show");
  });
  document.querySelector(".dropdown").addEventListener("mouseout", () => {
    document.querySelector(".dropdown-menu").classList.remove("show");
  });

  handleSortByPrice();
  handleClickHeader();
  handleClickProductSection();
}
export let filterParams = {};
export function loadProductPage(categoryId) {
  filterParams = { categoryId };
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
