import ProductCard from "../ProductCard/ProductCard.js";

export default function ProductList({ products, className }) {
  return `
    <div class="${className}">
    ${products.map((value) => ProductCard(value))}
    </div>
  `;
}
