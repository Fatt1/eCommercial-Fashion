import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb.js";
import ProductList from "../../../components/ProductList/ProductList.js";
import Filter from "./Filter.js";
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
export default function ProductSection() {
  return `
    <div class="product-section">
        <div class="main-content">
          ${BreadCrumb()}
          <div class="product-section-main-content">
            ${Filter()}
            <div class="right-product-section">
                ${ProductList({
                  products,
                  className: "product-list-best-seller",
                })}
            </div>
          </div>
        </div>
      </div>
  `;
}
