import { getDbContextFromLocalStorage } from "../helper/initialData.js";
import { createPagination, generateUniqueId } from "../helper/helper.js";
import { ORDER_BY } from "../constant/Constant.js";
import { getSubCategoryIds } from "./categoryService.js";
const dbContext = getDbContextFromLocalStorage();

function addProduct(product) {
  const id = generateUniqueId();
  product.id = id;
  dbContext.products.push(product);
  dbContext.saveChanges();
  return product;
}

function getAllProducts({ pageSize = 5, pageNumber = 1 }) {
  return createPagination(dbContext.products, pageSize, pageNumber);
}
function filterProducts({
  categoryId,
  pageSize = 5,
  pageNumber = 1,
  searchKey,
  priceFrom,
  priceTo,
  colors,
  sizes,
  sortBy = "createAt",
  order,
}) {
  let filterProducts = [...dbContext.products];
  // Filter by searchKey
  const subCategoryIds = getSubCategoryIds(categoryId);
  const allRelatedCategoryIds = [categoryId, ...subCategoryIds];
  console.log(allRelatedCategoryIds);
  filterProducts = filterProducts.filter((p) => {
    let isMatchingCategoryId;
    if (!categoryId) isMatchingCategoryId = true;
    else {
      isMatchingCategoryId = allRelatedCategoryIds.includes(p.categoryId);
    }

    // Lọc theo searchKey
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
      isMatchingSearchKey &&
      isMatchingCategoryId
    );
  });

  filterProducts.sort((a, b) => {
    // ... logic sắp xếp như cũ ...
    if (sortBy === "createdAt") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === "price") {
      if (order === ORDER_BY.ascending) {
        return a.priceInfo.currentlyPrice - b.priceInfo.currentlyPrice;
      } else return -(a.priceInfo.currentlyPrice - b.priceInfo.currentlyPrice);
    }
    return 0;
  });

  return createPagination(filterProducts, pageSize, pageNumber);
}

function getProductById(id) {
  const product = dbContext.products.find((p) => p.id === id);

  product.skus = getSkusByProductId(product.id);
  return product;
}
function deleteProductById(id) {
  const product = dbContext.products.find((p) => p.id === id);
  if (!product) return false;
  // xóa sản phẩm thành công
  const updatedProducts = products.filter((p) => p.id !== idToRemove);
  dbContext.products = updatedProducts;
  dbContext.saveChanges();
  return true;
}
function updateProductById(id, updateProduct) {
  const product = dbContext.products.find((p) => p.id === id);
  if (!product) return false;
  product = updateProduct;
  dbContext.saveChanges();
  return true;
}
function getSkusByProductId(productId) {
  const skusVariation = dbContext.skus.filter(
    (sku) => sku.productId === productId
  );
  return skusVariation;
}

export {
  getAllProducts,
  getProductById,
  filterProducts,
  deleteProductById,
  updateProductById,
  addProduct,
};
