import { createPagination } from "../helper/helper.js";
import { getDbContextFromLocalStorage } from "../helper/initialData.js";
const dbContext = getDbContextFromLocalStorage();
function getAll() {
  return dbContext.products;
}

function getAllWithPagination({
  pageSize,
  pageNumber,
  searchKey,
  orderBy = "createAt",
  colors,
  sizes,
  priceFrom,
  priceTo,
  material,
  categoryId,
}) {
  let filterProducts = [...dbContext.products];
  // Filter by searchKey
  filterProducts = filterProducts.filter((p) => {
    const isMatchingSearchKey =
      !searchKey ||
      p.name.toLowerCase().includes(searchKey.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchKey.toLowerCase());

    const isMatchingPrice =
      (!priceTo && !priceFrom) ||
      (p.priceInfo.currentlyPrice >= priceFrom &&
        p.priceInfo.currentlyPrice <= priceTo);
    const isMatchingColor =
      !colors ||
      p.variations.some((opt) => {
        return (
          opt.name === "Màu sắc" &&
          opt.variationOptions.some((variationOpt) =>
            colors.includes(variationOpt.colorId)
          )
        );
      });

    //Lọc theo size
    const isMatchingSize =
      !sizes ||
      p.variations.some((opt) => {
        return (
          opt.name === "Kích thước" &&
          opt.variationOptions.some((variationOpt) =>
            sizes.includes(variationOpt)
          )
        );
      });
    return (
      isMatchingColor &&
      isMatchingPrice &&
      isMatchingSize &&
      isMatchingSearchKey
    );
  });

  filterProducts.sort((a, b) => {
    // ... logic sắp xếp như cũ ...
    if (orderBy === "createdAt") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (orderBy === "price") {
      return a.priceInfo.currentlyPrice - b.priceInfo.currentlyPrice;
    }
    return 0;
  });

  return createPagination(filterProducts, pageSize, pageNumber);
}

function getById(id) {
  const product = dbContext.products.find((p) => p.id === id);

  product.skus = getSkusByProductId(product.id);
  return product;
}
function deleteById(id) {
  const product = dbContext.products.find((p) => p.id === id);
  if (!product) return false;
  // xóa sản phẩm thành công
  const updatedProducts = products.filter((p) => p.id !== idToRemove);
  db.products = updatedProducts;
  return true;
}

function updateById(id, updateProduct) {
  const product = dbContext.products.find((p) => p.id === id);
  if (!product) return false;
  product = updateProduct;
  return true;
}
function getSkusByProductId(productId) {
  const skusVariation = dbContext.skus.filter(
    (sku) => sku.productId === productId
  );
  return skusVariation;
}
export { getAll, getById, deleteById, updateById, getAllWithPagination };
