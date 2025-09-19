import { getDbContextFromLocalStorage } from "../helper/initialData.js";

const dbContext = getDbContextFromLocalStorage();

function getAllBrands() {
  return dbContext.brands;
}

function getBrandById(id) {
  const brand = dbContext.brands.find((b) => b.id === id);
  return brand;
}
function getBrandsByCategoryId(categoryId) {
  const brands = dbContext.brands.filter((b) => b.categoryId === categoryId);
  return brands;
}

export { getAllBrands, getBrandById, getBrandsByCategoryId };
