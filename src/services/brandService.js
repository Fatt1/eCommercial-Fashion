import { getDbContextFromLocalStorage } from "../helper/initialData.js";

const dbContext = getDbContextFromLocalStorage();

function getAllBrands() {
  return dbContext.brands;
}

function getBrandById(id) {
  const brand = dbContext.brands.find((b) => b.id === id);
  return brand;
}

export { getAllBrands, getBrandById };
