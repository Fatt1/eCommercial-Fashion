import { generateUniqueId } from "../helper/helper.js";
import {
  getDbContextFromLocalStorage,
  loadDataToLocalStorage,
  saveDbContextToLocalStorage,
} from "../helper/initialData.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
await loadDataToLocalStorage();
function addCategory(category) {
  const dbContext = getDbContextFromLocalStorage();
  const id = generateUniqueId();
  const newCategory = new Category(
    id,
    category.name,
    category.image,
    category.parentId,
    category.attributeIds
  );
  // Fix cứng brand cho category, sau này nếu có quản lí brand thì sửa lại
  const brand = new Brand(generateUniqueId(), "No Brand", newCategory.id);
  dbContext.brands.push(brand);
  dbContext.categories.push(newCategory);
  saveDbContextToLocalStorage(dbContext);
  return newCategory;
}
function getAllCategory() {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.categories;
}
function getAllCategoriesByLevel(level = null) {
  const dbContext = getDbContextFromLocalStorage();
  if (level === null || level === 0) {
    return dbContext.categories
      .filter((cate) => cate.parentId === null)
      .map((cate) => ({
        ...cate,
        hasChildren: dbContext.categories.some((c) => c.parentId === cate.id),
      }));
  }
  const categoriesByLevel = [];
  dbContext.categories.forEach((cate) => {
    const categoryLevel = getCategoryLevel(cate.id, dbContext.categories);
    if (categoryLevel === level) {
      const hasChildren = dbContext.categories.some(
        (ca) => ca.parentId === cate.id
      );
      categoriesByLevel.push({ ...cate, hasChildren });
    }
  });
  return categoriesByLevel;
}
function getAllParentCategory(categoryId) {
  const dbContext = getDbContextFromLocalStorage();
  const category = dbContext.categories.find((cate) => cate.id === categoryId);
  const parentCategories = [];
  function getParent(parentId) {
    const parent = dbContext.categories.find((cate) => cate.id === parentId);

    if (parent) {
      parentCategories.push(parent);
      getParent(parent.parentId);
    }
  }
  getParent(category.parentId);
  return { ...category, parentCategories };
}

function getCategoryLevel(categoryId, categories) {
  const category = categories.find((c) => c.id === categoryId);
  if (!category || category.parentId === null) return 0;
  return 1 + getCategoryLevel(category.parentId, categories);
}
function deleteCategoryById(categoryId) {
  const dbContext = getDbContextFromLocalStorage();
  const categoryIndex = dbContext.categories.findIndex(
    (c) => c.id === categoryId
  );
  if (categoryIndex === -1) return false;
  dbContext.categories.splice(categoryIndex, 1);
  saveDbContextToLocalStorage(dbContext);
  return true;
}

function updateCategoryById(updatedCategory) {
  const dbContext = getDbContextFromLocalStorage();
  const category = dbContext.categories.find(
    (c) => c.id === updatedCategory.id
  );
  if (!category) return false;
  Object.assign(category, updatedCategory);
  saveDbContextToLocalStorage(dbContext);
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

function getSubCategory(categoryId, maxLevel = null) {
  const dbContext = getDbContextFromLocalStorage();
  const subCategories = [];
  function findChildren(currentId, currentLevel) {
    if (maxLevel !== null && currentLevel > maxLevel) {
      return;
    }
    const children = dbContext.categories.filter(
      (cate) => cate.parentId === currentId
    );
    for (const child of children) {
      subCategories.push(child);
      findChildren(child.id, currentLevel + 1);
    }
  }
  findChildren(categoryId, 1);
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
function isHasChildren(categoryId) {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.categories.some((cate) => cate.parentId === categoryId);
}
export {
  addCategory,
  getAllCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategoryById,
  getSubCategory,
  getSubCategoryIds,
  getAllCategoriesByLevel,
  getAllParentCategory,
  isHasChildren,
};
