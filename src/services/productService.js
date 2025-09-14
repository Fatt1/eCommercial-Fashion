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
}) {
  return getAllWithPagination({
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
