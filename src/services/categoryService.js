import { generateUniqueId } from "../helper/helper.js";
import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
} from "../helper/initialData.js";
await loadDataToLocalStorage();
function addCategory(category) {
  const dbContext = getDbContextFromLocalStorage();
  const id = generateUniqueId();
  category.id = id;
  dbContext.categories.push(category);
  return category;
}
function getAllCategory() {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.categories;
}

function deleteCategoryById(categoryId) {
  const dbContext = getDbContextFromLocalStorage();
  const category = dbContext.categories.find((c) => c.id === categoryId);
  if (!category) return false;
  const newCategories = dbContext.categories.filter((c) => c.id !== categoryId);
  dbContext.categories = newCategories;
  dbContext.saveChanges();
  return true;
}
function updateCategoryById(updatedCategory) {
  const dbContext = getDbContextFromLocalStorage();
  const category = dbContext.categories.find(
    (c) => c.id === updatedCategory.id
  );
  if (!category) return false;
  category = updatedCategory;
  dbContext.saveChanges();
  return true;
}
function getCategoryById(categoryId) {
  const dbContext = getDbContextFromLocalStorage();
  const category = dbContext.categories.find((c) => c.id === categoryId);
  if (!category) return null;
  const childrenCategory = getSubCategory(categoryId);
  return {
    category,
    childrenCategory,
  };
}

function getSubCategory(categoryId) {
  const dbContext = getDbContextFromLocalStorage();
  const subCategories = [];
  function findChildren(currentId) {
    const children = dbContext.categories.filter(
      (cate) => cate.parentId === currentId
    );
    for (const child of children) {
      subCategories.push(child);
      findChildren(child);
    }
  }
  findChildren(categoryId);
  return subCategories;
}
// lấy categoryIds con ở tất cả các mức
function getSubCategoryIds(categoryId) {
  const dbContext = getDbContextFromLocalStorage();
  const subCategories = [];
  function findChildren(currentId) {
    const children = dbContext.categories.filter(
      (cate) => cate.parentId === currentId
    );
    for (const child of children) {
      subCategories.push(child.id);
      findChildren(child.id);
    }
  }
  findChildren(categoryId);
  return subCategories;
}

export {
  addCategory,
  getAllCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategoryById,
  getSubCategory,
  getSubCategoryIds,
};
