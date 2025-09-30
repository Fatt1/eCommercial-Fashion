import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../helper/initialData.js";

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
  const brands = dbContext.brands.filter((b) => b.categoryId === categoryId);
  return brands;
}

export { getAllBrands, getBrandById, getBrandsByCategoryId };
