import {
  getAll,
  getAllWithPagination,
  getById,
} from "../repositories/productRepository.js";
function getAllProducts() {
  const products = getAll();

  return products;
}
function getAllProductWithPagination({
  pageSize = 5,
  pageNumber = 1,
  searchKey,
  priceFrom,
  priceTo,
  colors,
  sizes,
}) {
  return getAllWithPagination({
    colors,
    sizes,
    pageSize,
    pageNumber,
    searchKey,
    priceFrom,
    priceTo,
  });
}

function getProductById(id) {
  const product = getById(id);
  return product;
}

export { getAllProducts, getProductById, getAllProductWithPagination };
