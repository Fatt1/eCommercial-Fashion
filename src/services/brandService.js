import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../helper/initialData.js";
import {
  getAllCategoriesByLevel,
  getCategoryById,
  getSubCategory,
  getSubCategoryIds,
} from "./categoryService.js";

await loadDataToLocalStorage();

function getAllBrands() {
  return dbContext.brands;
}

function getBrandById(id) {
  const dbContext = getDbContextFromLocalStorage();
  const brand = dbContext.brands.find((b) => b.id === id);
  return brand;
}
function getBrandsByCategoryId(categoryId) {
  const dbContext = getDbContextFromLocalStorage();
  const childrenCategoryIds = getSubCategoryIds(categoryId);
  const allCategoryIds = [categoryId, ...childrenCategoryIds];
  // lọc brand theo categoryId

  const brands = dbContext.brands.filter((b) =>
    allCategoryIds.includes(b.categoryId)
  );
  return brands;
}
function getBrandByName(name) {
  const dbContext = getDbContextFromLocalStorage();
  const brand = dbContext.brands.find((b) => b.name === name);
  return brand;
}

export { getAllBrands, getBrandById, getBrandsByCategoryId, getBrandByName };
