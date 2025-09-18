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
function renderHome() {
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
    // Case: khi nhấn vào sub menu ở phần header
    const categoryMenuItem = event.target.closest(".category-submenu-item");
    if (categoryMenuItem) {
      const categoryId = categoryMenuItem.dataset.categoryId;
      loadProductPage(categoryId);
      return;
    }
    // Case: Khi nhấn vào mục filter ở trang product theo category
    const categoryFilterElem = event.target.closest(".category-filter-value");
    if (categoryFilterElem) {
      // xóa categoryFilter có trạng thái active trước khi thêm active cho cái hiện tại
      document
        .querySelectorAll(".category-filter-value")
        .forEach((caret) => caret.classList.remove("active"));
      categoryFilterElem.classList.add("active");

      const categoryId = categoryFilterElem.dataset.categoryId;
      filterParams.categoryId = categoryId;
      document.getElementById("product-list-section").innerHTML =
        ProductListProductPage({ pageNumber: 1, ...filterParams });
      return;
    }
    // Case: Nếu nhấn vào "sản phẩm" ở header thì sẽ mặc định filter theo cate-001: thời trang nam
    const liHeader = event.target.closest(".nav-item");

    if (liHeader && !event.target.closest(".category-box")) {
      const tabSelected = liHeader.dataset.tab;

      if (tabSelected === "san-pham") {
        filterParams.categoryId = "cate-001";
        loadProductPage("cate-001");
        return;
      }
    }
    // Case: khi mà click vào 1 sản phẩm bất kì thì sẽ ra trang chi tiết sản phẩm
    const clickedCard = event.target.closest(".product-card");
    if (clickedCard) {
      const productId = clickedCard.dataset.productId;
      document.getElementById("root").innerHTML = ProductDetails(productId);
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

    //Xử lí cho sự kiện khi nhấn vào tabs thông tin ở detail product
    const tabDetailProduct = event.target.closest(".extra-information__tab");
    if (tabDetailProduct) {
      const currentlyActiveTab = document.querySelector(
        ".extra-information__tab.active"
      );
      currentlyActiveTab.classList.remove("active");
      document.getElementById(
        `${currentlyActiveTab.dataset.target}`
      ).hidden = true;

      const tabContent = document.getElementById(
        `${tabDetailProduct.dataset.target}`
      );
      tabDetailProduct.classList.add("active");
      tabContent.hidden = false;
    }
    const selectedVariationValue = event.target.closest(".variation-value");
    if (selectedVariationValue) {
      if (!selectedVariationValue.classList.contains("selected"))
        selectedVariationValue.parentElement
          .querySelectorAll(".variation-value")
          .forEach((value) => value.classList.remove("selected"));

      if (selectedVariationValue.classList.contains("selected")) {
        selectedVariationValue.classList.remove("selected");
      } else {
        selectedVariationValue.classList.add("selected");
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadDataToLocalStorage();
  renderHome();
  setupHome();
});
