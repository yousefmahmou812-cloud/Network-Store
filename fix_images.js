const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'products.Json');

// Let's use a very reliable image source: loremflickr with tech-related keywords.
// Using a seed to ensure the image stays consistent for the same model.
function getImageUrl(index) {
    return `https://loremflickr.com/600/400/network,server,tech?lock=${index}`;
}

const targetIds = [7, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(data);
    let imageCounter = 100;

    products.forEach(product => {
        if (targetIds.includes(product.id)) {
            imageCounter++;
            product.image = getImageUrl(imageCounter);
            
            if (product.models && Array.isArray(product.models)) {
                product.models.forEach(model => {
                    imageCounter++;
                    model.image = getImageUrl(imageCounter);
                });
            }
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    console.log('Successfully fixed images to use loremflickr.');
} catch (err) {
    console.error('Error updating products:', err);
}
