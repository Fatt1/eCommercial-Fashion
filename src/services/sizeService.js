import { getDbContextFromLocalStorage } from "../helper/initialData.js";

const dbContext = getDbContextFromLocalStorage();
function getAllSizes() {
  return dbContext.sizes;
}
function getSizeById(id) {
  const size = dbContext.sizes.find((c) => c.id === id);
  return size;
}

export { getAllSizes, getSizeById };
