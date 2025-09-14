import {
  getAllProducts,
  getAllProductWithPagination,
  getProductById,
} from "../../services/productService.js";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import Carousel, { setupCarousel } from "../../components/Carousel/Carousel.js";
import ProductSection from "./components/ProductSection.js";
import ProductDetails from "./ProductDetails.js";

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
    getAllProductWithPagination({
      searchKey: "Quần",
      priceFrom: 250000,
      priceTo: 500000,
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
}
document.addEventListener("DOMContentLoaded", async () => {
  render();
  setup();
});

function handleClick() {
  document.addEventListener("click", (event) => {
    const clickedCard = event.target.closest(".product-card");
    if (clickedCard) {
      document.getElementById("root").innerHTML = ProductDetails(1);
      window.scrollTo(0, 0);
    }
  });
}
