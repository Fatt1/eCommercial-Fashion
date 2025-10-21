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
function getColorByName(name) {
  const dbContext = getDbContextFromLocalStorage();
  const color = dbContext.colors.find((c) => c.name === name);
  return color;
}

export { getAllColors, getColorByCode, getColorByName };
