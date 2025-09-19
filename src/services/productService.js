import { getDbContextFromLocalStorage } from "../helper/initialData.js";
import { createPagination, generateUniqueId } from "../helper/helper.js";
import { ORDER_BY } from "../constant/Constant.js";
import { getColorByCode } from "./colorService.js";
import { getSubCategoryIds } from "./categoryService.js";
import { getSizeById } from "./sizeService.js";
import { getAttributeById } from "./attributeService.js";
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
  brandIds,
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
      colors.size == 0 ||
      p.variations.some((opt) => {
        return (
          opt.name === "Màu sắc" &&
          opt.variationOptions.some((variationOpt) =>
            colors.has(variationOpt.id)
          )
        );
      });

    //Lọc theo size
    const isMatchingSize =
      !sizes ||
      sizes.size == 0 ||
      p.variations.some((opt) => {
        return (
          opt.name === "Kích thước" &&
          opt.variationOptions.some((variationOpt) => sizes.has(variationOpt))
        );
      });
    // lọc theo brand
    const isMatchingBrand =
      !brandIds || brandIds.size == 0 || brandIds.has(p.brandId);
    return (
      isMatchingColor &&
      isMatchingPrice &&
      isMatchingSize &&
      isMatchingSearchKey &&
      isMatchingCategoryId &&
      isMatchingBrand
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
  if (!product) return null;
  // lấy sku của product
  product.skus = getSkusByProductId(product.id);

  // lấy thông tin attribute của product
  product.attributes.forEach((attribute) => {
    const attributeValue = getAttributeById(attribute.attributeId);
    attribute.name = attributeValue.name;
  });
  // lấy thông tin variation như là màu sắc, kích thước
  product.variations.forEach((variation) => {
    if (variation.name === "Màu sắc") {
      variation.variationOptions.forEach((option) => {
        const color = getColorByCode(option.id);
        option.name = color.name;
      });
    } else if (variation.name === "Kích thước") {
      variation.variationOptions.forEach((option) => {
        const size = getSizeById(option.id);
        option.name = size.name;
      });
    }
  });
  // kiểm tra xem giá có phải hay không và tính toán phần trăm giảm giá
  let salePercentage = Math.round(
    (1 - product.priceInfo.currentlyPrice / product.priceInfo.originalPrice) *
      100
  );

  product.salePercentage = salePercentage;
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

function getProductsByCategoryId(categoryId) {
  const categoryProducts = dbContext.products.filter(
    (p) => p.categoryId === categoryId
  );
  return categoryProducts;
}

export {
  getAllProducts,
  getProductById,
  filterProducts,
  deleteProductById,
  updateProductById,
  addProduct,
  getProductsByCategoryId,
};
