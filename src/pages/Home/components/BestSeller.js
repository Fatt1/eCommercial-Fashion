import ProductList from "../../../components/ProductList/ProductList.js";

export default function BestSeller({ products }) {
  return `<div class="best-seller">
    <div class="main-content">
      <h2 class="header-text">BÁN CHẠY NHẤT</h2>
      <ul class="category-best-seller">
        <li class="category-best-seller-item">
          <a>MEN</a>
        </li>
        <li class="category-best-seller-item">
          <a>ACCESSORIES</a>
        </li>
        <li class="category-best-seller-item">
          <a>MEN</a>
        </li>
      </ul>
      <a
        style="
              text-align: end;
              display: block;
              font-family: 'Roboto', sans-serif;
              font-size: 2.2rem;
              font-weight: bold;
            "
      >
        XEM THÊM &gt&gt
      </a>
      ${ProductList({ products, className: "product-list-best-seller" })}
    </div>
  </div>`;
}
