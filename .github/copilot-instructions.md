# GitHub Copilot Instructions for eCommercial-Fashion

## Project Overview

This is an eCommerce fashion web application built with vanilla JavaScript, HTML, and CSS. The application uses a component-based architecture without any frontend frameworks (no React, Vue, or Angular).

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Data Storage**: LocalStorage with JSON data files
- **Architecture**: Component-based with separation of concerns
- **Payment Integration**: PayPal sandbox API

## Project Structure

```
src/
├── assets/          # Images, icons, and static resources
├── components/      # Reusable UI components (each with .js and .css)
├── constant/        # Application constants and configuration
├── css/             # Global styles and theme files
├── data/            # JSON data files for initial data
├── helper/          # Utility functions and helpers
├── models/          # Data model classes
├── pages/           # Page-specific components and logic
├── public/          # HTML pages and page-specific styles
├── services/        # Business logic and data access layer
└── main.js          # Application entry point
```

## Coding Guidelines

### Component Structure

Each component should follow this structure:
- Component directory in `src/components/[ComponentName]/`
- JavaScript file: `[ComponentName].js` (PascalCase)
- CSS file: `[componentName].css` (camelCase)
- Export render functions that return HTML strings or DOM elements

### Naming Conventions

- **Classes**: PascalCase (e.g., `Product`, `User`, `OrderService`)
- **Functions**: camelCase (e.g., `getProductById`, `calculateTotal`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ORDER_STATUS`, `DB_CONTEXT_KEY`)
- **CSS Classes**: kebab-case (e.g., `product-card`, `checkout-item`)
- **Files**: 
  - Components: PascalCase for JS (e.g., `Header.js`)
  - Styles: camelCase (e.g., `header.css`)
  - Services: camelCase (e.g., `productService.js`)

### JavaScript Patterns

1. **ES6 Modules**: Use import/export for all modules
   ```javascript
   import { getDbContextFromLocalStorage } from "../helper/initialData.js";
   export function functionName() { }
   ```

2. **Classes**: Use ES6 classes for models
   ```javascript
   export default class Product {
     constructor(id, name, desc, ...) {
       this.id = id;
       this.name = name;
       // ...
     }
   }
   ```

3. **Async/Await**: Prefer async/await over promises
   ```javascript
   async function loadData() {
     await loadDataToLocalStorage();
     // ...
   }
   ```

4. **Data Access**: All data operations go through service layer
   - Services use `getDbContextFromLocalStorage()` to read data
   - Services use `saveDbContextToLocalStorage()` to persist changes
   - Never directly access localStorage in components

### Data Management

- Data is stored in LocalStorage under the key `DB_CONTEXT_KEY`
- Initial data loaded from JSON files in `src/data/`
- All entities have unique IDs generated via `generateUniqueId()`
- Soft deletes: Use `isDeleted` flag instead of removing records

### Service Layer Pattern

Services should:
- Handle all business logic
- Manage data persistence
- Return data objects or transformed results
- Not manipulate DOM directly

Example service structure:
```javascript
function addEntity(entity) {
  const dbContext = getDbContextFromLocalStorage();
  dbContext.entities.push(entity);
  saveDbContextToLocalStorage(dbContext);
  return entity;
}

function getEntityById(id) {
  const dbContext = getDbContextFromLocalStorage();
  return dbContext.entities.find(e => e.id === id);
}
```

### Component Pattern

Components should:
- Export render functions that return HTML or DOM elements
- Handle their own event listeners
- Call services for data operations
- Not contain business logic

Example component structure:
```javascript
export function renderComponent(data) {
  const container = document.createElement('div');
  container.className = 'component-name';
  container.innerHTML = `
    <div class="component-content">
      ${data.content}
    </div>
  `;
  
  // Add event listeners
  container.querySelector('.action-btn').addEventListener('click', () => {
    // Handle action
  });
  
  return container;
}
```

### CSS Guidelines

- Use semantic class names
- Follow BEM-like naming for complex components
- Keep global styles in `src/css/`
- Component-specific styles in component directory
- Use CSS custom properties for theme values when appropriate

### Form Validation

- Use the validation service in `src/services/validation.js`
- Form validation logic in `src/services/formValidator.js`
- Display validation errors inline with form fields

## Common Patterns to Follow

### 1. Pagination
Use `createPagination()` from helper functions:
```javascript
const paginatedData = createPagination(data, page, perPage);
```

### 2. Unique IDs
Always use `generateUniqueId()` for new entities:
```javascript
const newProduct = {
  id: generateUniqueId(),
  name: productName,
  // ...
};
```

### 3. Price Formatting
Use `formatNumber()` from helper functions:
```javascript
import { formatNumber } from './helper/formatNumber.js';
const formattedPrice = formatNumber(price);
```

### 4. Order Status
Use constants from `src/constant/Constant.js`:
```javascript
import { ORDER_STATUS } from './constant/Constant.js';
const order = {
  status: ORDER_STATUS.PENDING,
  // ...
};
```

## Important Considerations

1. **No Build Process**: This project doesn't use bundlers (webpack, vite, etc.)
   - All imports must use full file paths with `.js` extensions
   - No JSX, TypeScript, or preprocessing

2. **Browser Compatibility**: Code runs directly in browsers
   - Use ES6+ features supported by modern browsers
   - Avoid experimental JavaScript features

3. **LocalStorage Limitations**:
   - Size limit (~5-10MB depending on browser)
   - Data persists per origin
   - Handle potential quota exceeded errors

4. **Payment Integration**: 
   - PayPal sandbox credentials in `Constant.js`
   - Never commit production credentials

## Testing Approach

Currently, the project doesn't have automated tests. When adding features:
- Test manually in browser
- Check console for errors
- Verify LocalStorage data integrity
- Test on multiple browsers if possible

## Common Tasks

### Adding a New Component
1. Create directory in `src/components/[ComponentName]/`
2. Create `[ComponentName].js` with render function
3. Create `[componentName].css` with styles
4. Import and use in relevant pages

### Adding a New Page
1. Create HTML file in `src/public/`
2. Create page component in `src/pages/`
3. Link stylesheets in HTML head
4. Import required components and services

### Adding a New Model
1. Create class in `src/models/`
2. Define constructor with all properties
3. Add to initial data in `src/data/` if needed
4. Create corresponding service in `src/services/`

### Modifying Data Structure
1. Update model class
2. Update service functions
3. Update data JSON files if needed
4. Consider migration for existing LocalStorage data

## Resources

- Font Awesome 7.0.1 for icons
- Google Fonts: Geologica, Luxurious Roman, Roboto
- PayPal JavaScript SDK for payments

## Best Practices

1. **Keep components small and focused**: Each component should have a single responsibility
2. **Use descriptive variable names**: Code should be self-documenting
3. **Comment complex logic**: But prefer readable code over comments
4. **Handle errors gracefully**: Add try-catch blocks for critical operations
5. **Validate user input**: Always validate and sanitize user inputs
6. **Maintain consistency**: Follow existing patterns in the codebase
7. **Avoid deep nesting**: Refactor deeply nested code into separate functions
8. **Use array methods**: Prefer map, filter, reduce over traditional loops
9. **Event delegation**: For dynamic content, use event delegation when appropriate
10. **Clean up listeners**: Remove event listeners when components are destroyed

## Security Notes

- Never commit API keys or credentials (except sandbox keys for development)
- Sanitize user inputs before displaying
- Validate data on both client side and consider server-side validation for production
- Use HTTPS in production
- Be cautious with innerHTML - prefer textContent or createElement for user data
