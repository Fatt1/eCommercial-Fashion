import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../helper/initialData.js";
import { getAllParentCategory } from "./categoryService.js";

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
function getAttributeByCategoryId(categoryId) {
  const dbContext = getDbContextFromLocalStorage();
  const arrayAttributeIds = [];
  const result = getAllParentCategory(categoryId);
  arrayAttributeIds.push(...result.attributeIds);
  result.parentCategories.forEach((cate) =>
    arrayAttributeIds.push(...cate.attributeIds)
  );
  const attributes = arrayAttributeIds.map((id) =>
    dbContext.attributes.find((att) => att.id === id)
  );
  return attributes;
}

export { getAllAttributes, getAttributeById, getAttributeByCategoryId };
