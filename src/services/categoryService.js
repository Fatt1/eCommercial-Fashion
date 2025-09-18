import { generateUniqueId } from "../helper/helper.js";
import { getDbContextFromLocalStorage } from "../helper/initialData.js";
const dbContext = getDbContextFromLocalStorage();
function addCategory(category) {
  const id = generateUniqueId();
  category.id = id;
  dbContext.categories.push(category);
  return category;
}
function getAllCategory() {
  return dbContext.categories;
}

function deleteCategoryById(categoryId) {
  const category = dbContext.categories.find((c) => c.id === categoryId);
  if (!category) return false;
  const newCategories = dbContext.categories.filter((c) => c.id !== categoryId);
  dbContext.categories = newCategories;
  dbContext.saveChanges();
  return true;
}
function updateCategoryById(updatedCategory) {
  const category = dbContext.categories.find(
    (c) => c.id === updatedCategory.id
  );
  if (!category) return false;
  category = updatedCategory;
  dbContext.saveChanges();
  return true;
}
function getCategoryById(categoryId) {
  const category = dbContext.categories.find((c) => c.id === categoryId);
  if (!category) return null;
  const childrenCategory = getSubCategory(categoryId);
  return {
    category,
    childrenCategory,
  };
}
// chỉ lấy category con mức 1 thôi
function getSubCategory(categoryId) {
  const result = dbContext.categories.filter((c) => c.parentId === categoryId);
  return result;
}
// lấy categoryIds con ở tất cả các mức
function getSubCategoryIds(categoryId) {
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
