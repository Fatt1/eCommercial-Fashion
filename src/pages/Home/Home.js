import Carousel from "../../components/Carousel/Carousel.js";
import Header from "../../components/Header/Header.js";
import { setupCarousel } from "../../components/Carousel/Carousel.js";
import PromotionSection, {
  setupPromotion,
} from "../../components/PromotionSection/Promotion.js";
import CategorySection, {
  setupCategorySection,
} from "./components/CategorySection.js";
import ProductDetails from "../Product/ProductDetails.js";
import BestSeller from "./components/BestSeller.js";
import Footer from "../../components/Footer/Footer.js";
import ReviewSection from "../Home/components/ReviewSection.js";
import { getAllProducts } from "../../services/productService.js";
import { loadDataToLocalStorage } from "../../helper/initialData.js";
import { filterParams, loadProductPage } from "../Product/Product.js";
import ProductListProductPage from "../Product/components/ProductListProductPage.js";

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
  handleClickHome();
}
function handleClickHome() {
  document.addEventListener("click", (event) => {
    const categoryMenuItem = event.target.closest(".category-submenu-item");
    if (categoryMenuItem) {
      const categoryId = categoryMenuItem.dataset.categoryId;

      loadProductPage(categoryId);
      return;
    }
    const categoryFilterElem = event.target.closest(".category-filter-value");
    if (categoryFilterElem) {
      console.log(categoryFilterElem);

      const categoryId = categoryFilterElem.dataset.categoryId;
      filterParams.categoryId = categoryId;
      document.getElementById("product-list-section").innerHTML =
        ProductListProductPage({ pageNumber: 1, ...filterParams });
      return;
    }
    const liHeader = event.target.closest(".nav-item");

    if (liHeader && !event.target.closest(".category-box")) {
      const tabSelected = liHeader.dataset.tab;

      if (tabSelected === "san-pham") {
        filterParams.categoryId = "cate-001";
        loadProductPage("cate-001");
        return;
      }
    }
    const clickedCard = event.target.closest(".product-card");
    if (clickedCard) {
      document.getElementById("root").innerHTML = ProductDetails(1);
      window.scrollTo(0, 0);
      return; // Dừng hàm nếu đã xử lý
    }

    // Xử lý sự kiện cho pagination-btn
    const paginationBtnClicked = event.target.closest(".pagination-btn");
    if (paginationBtnClicked) {
      const pageNumber = Number(paginationBtnClicked.dataset.index);
      document.querySelector("#product-list-section").innerHTML =
        ProductListProductPage({ pageNumber, ...filterParams });
      return; // Dừng hàm nếu đã xử lý
    }

    // Xử lý sự kiện cho caret-toggle
    const caretToggle = event.target.closest(".caret-toggle");
    if (caretToggle) {
      caretToggle.parentElement.nextElementSibling.classList.toggle("show");

      return; // Dừng hàm nếu đã xử lý
    }
  });
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadDataToLocalStorage();
  render();
  setupHome();
});
