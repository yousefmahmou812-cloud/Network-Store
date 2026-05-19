const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'products.Json');

try {
  const data = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(data);
  let counter = 1;

  products.forEach(product => {
    // Generate a consistent image for the product
    product.image = `https://loremflickr.com/600/400/router,network?lock=${product.id * 10}`;
    
    // Generate consistent images for models
    if (product.models && Array.isArray(product.models)) {
      product.models.forEach((model, index) => {
        model.image = `https://loremflickr.com/600/400/router,network?lock=${product.id * 10 + index + 1}`;
      });
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log('Successfully updated products.Json with new image URLs.');
} catch (err) {
  console.error('Error updating products:', err);
}
