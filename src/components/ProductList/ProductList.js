import ProductCard, {
  handleProductCardClick,
} from "../ProductCard/ProductCard.js";

export default function ProductList({
  products,
  className = "product-list-best-seller",
}) {
  return `
    <div class="${className}">
    ${products.map((value) => ProductCard(value)).join(" ")}
    </div>`;
}

export function handClickProductList() {
  handleProductCardClick();
}
