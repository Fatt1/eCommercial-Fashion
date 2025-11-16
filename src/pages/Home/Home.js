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
  handleClickHeader();
  handClickProductList();
}

renderHome();
setupHome();
