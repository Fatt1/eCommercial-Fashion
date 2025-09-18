import { getDbContextFromLocalStorage } from "../helper/initialData.js";

const dbContext = getDbContextFromLocalStorage();
function getAllColors() {
  return dbContext.colors;
}
function getColorByCode(code) {
  const color = dbContext.colors.find((c) => c.id === code);
  return color;
}

export { getAllColors, getColorByCode };
