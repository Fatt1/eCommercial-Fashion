import { createPagination } from "../helper/helper.js";
import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../helper/initialData.js";
import { getAllParentCategory } from "./categoryService.js";

await loadDataToLocalStorage();
function filterProductsForPriceManage({
  categoryId,
  priceType,
  priceValue,
  pageSize,
  pageNumber,
}) {
  const dbContext = getDbContextFromLocalStorage();
  let filteredProducts = [...dbContext.products];
  filteredProducts = filteredProducts.filter((p) => {
    let isPriceValueMatch = true;
    if (priceType === "gia-ban") {
      isPriceValueMatch = p.priceInfo.originalPrice >= priceValue;
    } else if (priceType === "gia-von") {
      isPriceValueMatch = p.priceInfo.importPrice >= priceValue;
    } else if (priceType === "loi-nhuan") {
      const profitPercent =
        ((p.priceInfo.originalPrice - p.priceInfo.importPrice) /
          p.priceInfo.importPrice) *
        100;
      isPriceValueMatch = profitPercent >= priceValue;
    }
    let isCategoryMatch = true;
    if (categoryId) {
      const { parentCategories } = getAllParentCategory(p.categoryId);
      isCategoryMatch =
        parentCategories.some((cate) => cate.id === categoryId) ||
        p.categoryId === categoryId;
    }
    return isPriceValueMatch && isCategoryMatch;
  });
  filteredProducts.sort(
    (a, b) => -(new Date(a.updatedAt) - new Date(b.updatedAt))
  );
  return createPagination(filteredProducts, pageSize, pageNumber);
}

export { filterProductsForPriceManage };
