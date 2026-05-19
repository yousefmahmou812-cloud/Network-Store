const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'products.Json');

const oldImages = {
  1: { image: "images/router.jpg", models: ["images/archer_a6.jpg", "images/archer_ax6000.jpg", "images/cisco_rv340.jpg"] },
  2: { image: "images/switch.jpg", models: ["images/tl_sg108.jpg", "images/tl_sg1016.jpg", "images/catalyst_2960.jpg"] },
  3: { image: "images/cable.jpg", models: ["images/cat6_5m.jpg", "images/cat6_10m.jpg", "images/cat6a_20m.jpg"] },
  4: { image: "images/access point.jpg", models: ["images/eap110.jpg", "images/eap225.jpg", "images/meraki_mr33.jpg"] },
  5: { image: "images/Firewall.jpg", models: ["images/fortigate_60f.jpg", "images/fortigate_100f.jpg", "images/pa_220.jpg"] },
  6: { image: "images/switch.jpg", models: ["images/tl_sg108.jpg", "images/tl_sg1016.jpg", "images/catalyst_2960.jpg"] },
  7: { image: "images/network2.jpg", models: ["images/network2.jpg", "images/network devices.jpg", "images/network2.jpg"] },
  8: { image: "images/cable.jpg", models: ["images/cat6_5m.jpg", "images/cat6_10m.jpg", "images/cat6a_20m.jpg"] },
  9: { image: "images/network devices.jpg", models: ["images/network devices.jpg", "images/network2.jpg", "images/jdj.jpg"] },
  10: { image: "images/access point.jpg", models: ["images/eap110.jpg", "images/eap225.jpg", "images/meraki_mr33.jpg"] }
};

try {
  const data = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(data);

  products.forEach(product => {
    if (product.id >= 1 && product.id <= 10) {
      product.image = oldImages[product.id].image;
      if (product.models && Array.isArray(product.models)) {
        product.models.forEach((model, index) => {
          model.image = oldImages[product.id].models[index];
        });
      }
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log('Successfully reverted images for products 1-10.');
} catch (err) {
  console.error('Error updating products:', err);
}
