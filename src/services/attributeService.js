import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../helper/initialData.js";

await loadDataToLocalStorage();

function getAllAttributes() {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.attributes;
}

function getAttributeById(id) {
  const dbContext = getDbContextFromLocalStorage();
  const attribute = dbContext.attributes.find((a) => a.id === id);
  return attribute;
}

export { getAllAttributes, getAttributeById };
