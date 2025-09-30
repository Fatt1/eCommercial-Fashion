import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../helper/initialData.js";

await loadDataToLocalStorage();
function getAllColors() {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.colors;
}
function getColorByCode(code) {
  const dbContext = getDbContextFromLocalStorage();
  const color = dbContext.colors.find((c) => c.id === code);
  return color;
}

export { getAllColors, getColorByCode };
