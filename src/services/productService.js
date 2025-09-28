import { getDbContextFromLocalStorage } from "../helper/initialData.js";
import { createPagination, generateUniqueId } from "../helper/helper.js";
import { ORDER_BY } from "../constant/Constant.js";
import { getColorByCode } from "./colorService.js";
import { getSubCategoryIds } from "./categoryService.js";
import { getSizeById } from "./sizeService.js";
import { getAttributeById } from "./attributeService.js";
import { generateAccessToken } from "./paymentService.js";
const dbContext = await getDbContextFromLocalStorage();

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
function searchProducts(
  {
    categoryIds,
    pageSize = 5,
    pageNumber = 1,
    priceFrom,
    priceTo,
    colors,
    sizes,
    sortBy = "createAt",
    order,
    brandIds,
    searchKey,
  },
  isGetGroupsFilter = false
) {
  let filterProducts = [...dbContext.products];
  const result = applyFilter(
    filterProducts,
    {
      priceFrom,
      priceTo,
      colors,
      sizes,
      brandIds,
      searchKey,
      categoryIds,
      sortBy,
      order,
    },
    isGetGroupsFilter
  );
  const paginatedResults = createPagination(
    result.filteredProducts,
    pageSize,
    pageNumber
  );

  return {
    ...paginatedResults,
    colorGroupFilter: result.colorGroupFilter,
    sizeGroupFilter: result.sizeGroupFilter,
    brandGroupFilter: result.brandGroupFilter,
    categoryGroupFilter: result.categoryGroupFilter,
  };
}
function applyFilter(
  filterProducts,
  {
    priceFrom = 0,
    priceTo = Number.MAX_SAFE_INTEGER,
    colors,
    sizes,
    brandIds,
    searchKey,
    categoryIds,
    sortBy,
    order,
  },
  isGetGroupsFilter = false
) {
  const filteredProducts = filterProducts.filter((p) => {
    let isMatchingCategoryId;
    if (!categoryIds || categoryIds.size === 0) isMatchingCategoryId = true;
    else {
      isMatchingCategoryId = categoryIds.has(p.categoryId);
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
          opt.variationOptions.some((variationOpt) =>
            sizes.has(variationOpt.id)
          )
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

  filteredProducts.sort((a, b) => {
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
  const colorGroupFilter = new Set();
  const sizeGroupFilter = new Set();
  const brandGroupFilter = new Set();
  const categoryGroupFilter = new Set();
  if (!isGetGroupsFilter)
    return {
      filteredProducts,
      colorGroupFilter,
      sizeGroupFilter,
      brandGroupFilter,
      categoryGroupFilter,
    };

  filteredProducts.forEach((p) => {
    const colorVariation = p.variations.find((v) => v.name === "Màu sắc");
    if (colorVariation) {
      colorVariation.variationOptions.forEach((opt) => {
        colorGroupFilter.add(opt.id);
      });
    }
    const sizeVariation = p.variations.find((v) => v.name === "Kích thước");
    if (sizeVariation) {
      sizeVariation.variationOptions.forEach((opt) => {
        sizeGroupFilter.add(opt.id);
      });
    }
    brandGroupFilter.add(p.brandId);
    categoryGroupFilter.add(p.categoryId);
    const salePercentage = getSalePercentage(
      p.priceInfo.originalPrice,
      p.priceInfo.currentlyPrice
    );
    if (salePercentage > 0) {
      p.salePercentage = salePercentage;
      p.isSale = true;
    }
  });
  return {
    categoryGroupFilter,
    filteredProducts,
    colorGroupFilter,
    sizeGroupFilter,
    brandGroupFilter,
  };
}
function filterProducts(
  {
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
  },
  isGetGroupsFilter = false
) {
  let filterProducts = [...dbContext.products];
  // Filter by searchKey
  const subCategoryIds = getSubCategoryIds(categoryId);
  const allRelatedCategoryIds = new Set([categoryId, ...subCategoryIds]);

  const result = applyFilter(
    filterProducts,
    {
      categoryIds: allRelatedCategoryIds,
      priceFrom,
      priceTo,
      colors,
      sizes,
      brandIds,
      searchKey,
      sortBy,
      order,
    },
    isGetGroupsFilter
  );

  const paginatedResults = createPagination(
    result.filteredProducts,
    pageSize,
    pageNumber
  );

  return {
    ...paginatedResults,
    colorGroupFilter: result.colorGroupFilter,
    sizeGroupFilter: result.sizeGroupFilter,
    brandGroupFilter: result.brandGroupFilter,
  };
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
function getSalePercentage(originalPrice, currentlyPrice) {
  return Math.round((1 - currentlyPrice / originalPrice) * 100);
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

function getDetailOneSku(sku, productId) {
  const product = dbContext.products.find((p) => p.id === productId);
  const tierIndexes = sku.tierIndexes;

  const selectedDetails = product.variations.map(
    (variation, variationIndex) => {
      const variationName = variation.name;

      const variationOption =
        variation.variationOptions[tierIndexes[variationIndex]];
      let detailVariationOption;
      if (variationName === "Màu sắc") {
        detailVariationOption = getColorByCode(variationOption.id);
        detailVariationOption.variation = "Màu sắc";
      } else if (variationName === "Kích thước") {
        detailVariationOption = getSizeById(variationOption.id);
        detailVariationOption.variation = "Kích thước";
      }
      return detailVariationOption;
    }
  );
  sku.selectedDetails = selectedDetails;
  return sku;
}
export {
  getAllProducts,
  getProductById,
  filterProducts,
  deleteProductById,
  updateProductById,
  addProduct,
  getProductsByCategoryId,
  getSkusByProductId,
  searchProducts,
  getDetailOneSku,
};
