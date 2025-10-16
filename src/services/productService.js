import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
  saveDbContextToLocalStorage,
} from "../helper/initialData.js";
import { createPagination, generateUniqueId } from "../helper/helper.js";
import { ORDER_BY } from "../constant/Constant.js";
import { getColorByCode } from "./colorService.js";
import { getCategoryById, getSubCategoryIds } from "./categoryService.js";
import { getSizeById } from "./sizeService.js";
import { getAttributeById } from "./attributeService.js";

await loadDataToLocalStorage();

function addProduct(product) {
  const dbContext = getDbContextFromLocalStorage();
  const id = generateUniqueId();
  product.id = id;
  let skus = product.skus;
  skus.forEach((sku) => {
    sku.id = generateUniqueId();
    dbContext.skus.push(sku);
  });
  delete product.skus;
  dbContext.products.push(product);

  saveDbContextToLocalStorage(dbContext);
  return product;
}
function updatePriceProductById(productId) {}

// Lấy danh sách thông tin sản phẩm
function getAllProductForAdmin({ pageSize = 5, pageNumber = 1 }) {
  const dbContext = getDbContextFromLocalStorage();
  const products = dbContext.products.map((p) => {
    return {
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      thumbnail: p.thumbnail,
      status: p.status,
      createdAt: p.createdAt,
      priceInfo: p.priceInfo,
      desc: p.desc,
    };
  });
  products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return createPagination(products, pageSize, pageNumber);
}

function filterProductsForAdmin({
  searchKey,
  pageSize = 5,
  pageNumber = 1,
  status,
}) {
  const dbContext = getDbContextFromLocalStorage();
  let filterProducts = [];

  filterProducts = dbContext.products
    .filter((p) => {
      let isMatchingStatus = !status || p.status === status;
      let isMatchingSearchKey =
        !searchKey ||
        p.name.toLowerCase().includes(searchKey.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchKey.toLowerCase());
      return isMatchingStatus && isMatchingSearchKey;
    })
    .map((p) => {
      return {
        id: p.id,
        name: p.name,
        categoryId: p.categoryId,
        thumbnail: p.thumbnail,
        status: p.status,
        createdAt: p.createdAt,
        priceInfo: p.priceInfo,
        desc: p.desc,
      };
    });
  filterProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return createPagination(filterProducts, pageSize, pageNumber);
}

function getAllProducts({ pageSize = 5, pageNumber = 1 }) {
  const dbContext = getDbContextFromLocalStorage();
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
    sortBy = "createdAt",
    order,
    brandIds,
    searchKey,
  },
  isGetGroupsFilter = false
) {
  const dbContext = getDbContextFromLocalStorage();
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

export function filterProductByName(name, pageNumber = 1, pageSize = 5) {
  return searchProducts({ searchKey: name, pageNumber, pageSize });
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
    const salePercentage = getSalePercentage(
      p.priceInfo.originalPrice,
      p.priceInfo.currentlyPrice
    );
    if (salePercentage > 0) {
      p.salePercentage = salePercentage;
      p.isSale = true;
    }
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
    if (sortBy === "createdAt") {
      return -(new Date(a.createdAt) - new Date(b.createdAt));
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
    sortBy = "createdAt",
    order,
    brandIds,
  },
  isGetGroupsFilter = false
) {
  const dbContext = getDbContextFromLocalStorage();
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
  const dbContext = getDbContextFromLocalStorage();
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
  if (product.priceInfo.originalPrice === 0) return 0;
  // kiểm tra xem giá có phải hay không và tính toán phần trăm giảm giá
  let salePercentage = Math.round(
    (1 - product.priceInfo.currentlyPrice / product.priceInfo.originalPrice) *
      100
  );

  product.salePercentage = salePercentage;
  return {
    ...product,
    status: product.status,
  };
}
function getSalePercentage(originalPrice, currentlyPrice) {
  return Math.round((1 - currentlyPrice / originalPrice) * 100);
}
function deleteProductById(id) {
  const dbContext = getDbContextFromLocalStorage();
  const product = dbContext.products.find((p) => p.id === id);
  if (product === null) return false;
  // xóa sản phẩm thành công
  product.status = "deleted";
  saveDbContextToLocalStorage(dbContext);
  return true;
}

function updateProductById(id, updateProduct) {
  const dbContext = getDbContextFromLocalStorage();
  const product = dbContext.products.find((p) => p.id === id);
  if (!product) return false;
  product = updateProduct;
  saveDbContextToLocalStorage(dbContext);
  return true;
}
function getSkusByProductId(productId) {
  const dbContext = getDbContextFromLocalStorage();
  const skusVariation = dbContext.skus.filter(
    (sku) => sku.productId === productId
  );
  return skusVariation;
}

// Lấy tất cả product theo categoryId và các category con của nó luôn
function getProductsByCategoryId(categoryId) {
  const subCategoryIds = getSubCategoryIds(categoryId);
  const allRelatedCategory = [subCategoryIds, categoryId];
  const dbContext = getDbContextFromLocalStorage();
  const categoryProducts = dbContext.products.filter((p) =>
    allRelatedCategory.includes(p.categoryId)
  );
  return categoryProducts;
}

function getDetailOneSku(sku, productId) {
  const dbContext = getDbContextFromLocalStorage();
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
function getBestSellerWith3Categories() {
  const bestSellerCategoriesId = ["cate-001", "cate-002"];
  const result = [];
  bestSellerCategoriesId.forEach((id) => {
    const products = getProductsByCategoryId(id);
    const bestSeller = products
      .slice(0, 6)
      .map((p) => {
        const salePercentage = getSalePercentage(
          p.priceInfo.originalPrice,
          p.priceInfo.currentlyPrice
        );
        if (salePercentage > 0) {
          p.salePercentage = salePercentage;
          p.isSale = true;
        }
        return p;
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const { category } = getCategoryById(id);
    result.push({
      categoryName: category.name,
      categoryId: category.id,
      products: bestSeller,
    });
  });
  return result;
}
export {
  filterProductsForAdmin,
  getAllProductForAdmin,
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
  getBestSellerWith3Categories,
};
