import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../helper/initialData.js";

await loadDataToLocalStorage();
function getAllSizes() {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.sizes;
}
function getSizeById(id) {
  const dbContext = getDbContextFromLocalStorage();
  const size = dbContext.sizes.find((c) => c.id === id);
  return size;
}

export { getAllSizes, getSizeById };
