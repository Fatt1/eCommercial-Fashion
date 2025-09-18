import { getDbContextFromLocalStorage } from "../helper/initialData.js";

const dbContext = getDbContextFromLocalStorage();

function getAllAttributes() {
  return dbContext.attributes;
}

function getAttributeById(id) {
  const attribute = dbContext.attributes.find((a) => a.id === id);
  return attribute;
}

export { getAllAttributes, getAttributeById };
