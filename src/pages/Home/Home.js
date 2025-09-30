import Carousel from "../../components/Carousel/Carousel.js";
import Header, { handleClickHeader } from "../../components/Header/Header.js";
import { setupCarousel } from "../../components/Carousel/Carousel.js";
import PromotionSection, {
  setupPromotion,
} from "../../components/PromotionSection/Promotion.js";
import CategorySection, {
  setupCategorySection,
} from "./components/CategorySection.js";

import BestSeller, { setUpBestSeller } from "./components/BestSeller.js";
import Footer from "../../components/Footer/Footer.js";
import ReviewSection from "../Home/components/ReviewSection.js";
import { getBestSellerWith3Categories } from "../../services/productService.js";

import { handClickProductList } from "../../components/ProductList/ProductList.js";
import { updateCartQuantity } from "../../services/cartService.js";

function renderHome() {
  const result = getBestSellerWith3Categories();
  const root = document.getElementById("root");
  root.innerHTML = `
  ${Header("trang-chu")}
  ${Carousel()}
   <h2 class="header-text main-content">KHUYẾN MÃI HÔM NAY</h2>
   ${PromotionSection()}
   ${CategorySection()}
   ${BestSeller({ result })}
   ${ReviewSection()}
   ${Footer()}
   
  `;
}
function setupHome() {
  setUpBestSeller();
  setupCarousel();
  setupPromotion();
  setupCategorySection();
  handleClickHome();
  handleClickHeader();

  handClickProductList();
  updateCartQuantity("cart-quantity");
}
function handleClickHome() {
  document.addEventListener("click", (event) => {
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

    // Xử lí sự kiên khi nhấn vào variation options
    const selectedVariationValue = event.target.closest(".variation-value");
    if (selectedVariationValue) {
      // Case: Nếu mà người dùng nhấn vào các option khác thì sẽ xóa đi các value đc selected
      if (!selectedVariationValue.classList.contains("selected"))
        selectedVariationValue.parentElement
          .querySelectorAll(".variation-value")
          .forEach((value) => value.classList.remove("selected"));

      // Case: Nếu người dùng nhấn lại vào cái value đang đc selected thì sẽ kh còn selected nữa
      if (selectedVariationValue.classList.contains("selected")) {
        selectedVariationValue.classList.remove("selected");
      } else {
        selectedVariationValue.classList.add("selected");
      }
      return;
    }
  });
}
renderHome();
setupHome();
