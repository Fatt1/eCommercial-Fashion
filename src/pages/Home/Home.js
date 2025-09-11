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

const products = [
  {
    img: "../assets/category-1.jpg",
    name: "Áo khoác kaki hai lớp mangto",
    sale: 15,
    salePrice: 447000,
    originalPrice: 550000,
  },
  {
    img: "../assets/category-2.jpg",
    name: "Áo khoác dạ tweed phong cách Hàn Quốc",
    sale: 10,
    salePrice: 447000,
    originalPrice: 447000,
  },
  {
    img: "../assets/category-3.jpg",
    name: "Đầm maxi hai dây dáng xòe",
    sale: 20,
    salePrice: 399.0,
    originalPrice: 499.0,
  },
  {
    img: "../assets/category-4.jpg",
    name: "Quần jeans ống rộng cạp cao",
    sale: 5,
    salePrice: 285.0,
    originalPrice: 300.0,
  },
  {
    img: "../assets/category-5.jpg",
    name: "Chân váy tennis xếp ly",
    sale: 25,
    salePrice: 225.0,
    originalPrice: 300.0,
  },
  {
    img: "../assets/category-6.jpg",
    name: "Áo sơ mi lụa tay bồng",
    sale: 12,
    salePrice: 352.0,
    originalPrice: 400.0,
  },
  {
    img: "../assets/category-7.jpg",
    name: "Túi xách da đeo chéo",
    sale: 18,
    salePrice: 820.0,
    originalPrice: 1000.0,
  },
];
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
document.addEventListener("DOMContentLoaded", () => {
  render();
  setupHome();
});
