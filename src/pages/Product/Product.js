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

function render() {
  document.getElementById("root").innerHTML = `
  ${Header()}
  ${Carousel()}
  <h2 class="header-text main-content">KHUYẾN MÃI HÔM NAY</h2>
     
     ${ProductSection()}
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
  setupCarousel();
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
  handleClick();
  handleSortByPrice();
}
document.addEventListener("DOMContentLoaded", async () => {
  render();
  setup();
});
const filterParams = {};
function handleClick() {
  document.addEventListener("click", (event) => {
    const clickedCard = event.target.closest(".product-card");
    if (clickedCard) {
      document.getElementById("root").innerHTML = ProductDetails(1);
      window.scrollTo(0, 0);
    }
  });
  document.addEventListener("click", (event) => {
    const paginationBtnClicked = event.target.closest(".pagination-btn");

    if (paginationBtnClicked) {
      const pageNumber = Number(paginationBtnClicked.dataset.index);
      console.log(pageNumber);
      console.log(document.querySelector("#product-list-section"));
      document.querySelector("#product-list-section").innerHTML =
        ProductListProductPage({ pageNumber, ...filterParams });
    }
  });
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
