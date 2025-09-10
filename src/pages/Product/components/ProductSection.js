import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb.js";

export default function ProductSection() {
  return `
    <div class="product-section">
        <div class="main-contain">
          ${BreadCrumb()}
        </div>
      </div>
  `;
}
