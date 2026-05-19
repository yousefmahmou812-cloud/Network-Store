// Global variables
let allProducts = [];
let cart = [];
let currentSelectedModel = null;
let currentProductId = null;
let currentFilter = 'all';

// Load cart from API
async function loadCart() {
    try {
        const res = await fetch('http://localhost:3001/cart');
        if (res.ok) cart = await res.json();
        else cart = [];
    } catch (err) { cart = []; }
    updateCartCount();
    if (document.getElementById('cartItems')) displayCart();
}

// Update cart counter
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

// Fetch products
fetch('products.json')
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        if (document.getElementById('products')) {
            displayProducts(allProducts);
            populatePricingTable(allProducts);
            updateProductCount(allProducts.length);
        }
        if (document.getElementById('featured')) displayFeatured(allProducts);
    })
    .catch(err => console.error('Error loading products:', err));

// Update product count display
function updateProductCount(count) {
    const el = document.getElementById('productCount');
    if (el) el.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
}

// Populate pricing table
function populatePricingTable(products) {
    const tableBody = document.getElementById('pricing-table-body');
    if (!tableBody) return;
    let allModels = [];
    products.forEach(p => {
        p.models.forEach(m => {
            allModels.push({ productName: p.name, modelName: m.modelName, price: m.price, description: m.specs });
        });
    });
    const shuffled = allModels.sort(() => 0.5 - Math.random()).slice(0, 5);
    let output = '';
    shuffled.forEach(m => {
        output += `<tr><td style="padding:12px;border:1px solid #333;">${m.productName} - ${m.modelName}</td>
        <td style="padding:12px;border:1px solid #333;">$${m.price}</td>
        <td style="padding:12px;border:1px solid #333;">${m.description}</td></tr>`;
    });
    tableBody.innerHTML = output;
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('products');
    if (!container) return;
    updateProductCount(products.length);
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#aaa;grid-column:1/-1;padding:40px;">No products found.</p>';
        return;
    }
    let output = '';
    products.forEach(p => {
        output += `
        <div class="product-card" onclick="openDetails(${p.id})">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <div class="product-price">From $${p.basePrice}</div>
                <button class="btn btn-primary">View Details</button>
            </div>
        </div>`;
    });
    container.innerHTML = output;
}

// Display featured products
function displayFeatured(products) {
    const container = document.getElementById('featured');
    if (!container) return;
    const shuffled = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
    let output = '';
    shuffled.forEach(p => {
        output += `
        <div class="product-card" onclick="openDetails(${p.id})">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <div class="product-price">From $${p.basePrice}</div>
                <button class="btn btn-primary">View Details</button>
            </div>
        </div>`;
    });
    container.innerHTML = output;
}

// Open product details modal
function openDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    currentProductId = productId;
    currentSelectedModel = null;
    let modelsHTML = '<option value="">Select Model...</option>';
    product.models.forEach((model, index) => {
        modelsHTML += `<option value="${index}">${model.modelName} - $${model.price}</option>`;
    });
    const detailsHTML = `
    <div class="details-container">
        <div class="details-image">
            <img id="modalImage" src="${product.image}" alt="${product.name}">
        </div>
        <div class="details-info">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="model-selector">
                <label>Select Model:</label>
                <select id="modelSelect" onchange="updateModelDetails(this.value)">${modelsHTML}</select>
            </div>
            <div id="modelSpecs" class="model-specs" style="display:none;">
                <h4>Specifications:</h4>
                <p id="specsText"></p>
                <p class="details-price" id="modelPrice"></p>
            </div>
            <div class="quantity-selector">
                <button onclick="decreaseQuantity()">−</button>
                <input type="number" id="quantity" value="1" min="1" readonly>
                <button onclick="increaseQuantity()">+</button>
            </div>
            <div class="details-buttons">
                <button class="btn btn-primary btn-glow" onclick="addToCart('${productId}')">Add to Cart</button>
                <button class="btn btn-outline" onclick="closeModal()">Close</button>
            </div>
        </div>
    </div>`;
    document.getElementById('detailsContainer').innerHTML = detailsHTML;
    document.getElementById('detailsModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Update modal when model selected
function updateModelDetails(modelIndex) {
    const product = allProducts.find(p => p.id === currentProductId);
    const specsContainer = document.getElementById('modelSpecs');
    const modalImage = document.getElementById('modalImage');
    if (modelIndex === '' || !product.models[modelIndex]) {
        specsContainer.style.display = 'none';
        currentSelectedModel = null;
        if (modalImage) modalImage.src = product.image;
        return;
    }
    const model = product.models[modelIndex];
    currentSelectedModel = model;
    document.getElementById('specsText').textContent = model.specs;
    document.getElementById('modelPrice').textContent = `Price: $${model.price}`;
    if (modalImage) modalImage.src = model.image || product.image;
    specsContainer.style.display = 'block';
}

function increaseQuantity() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1;
}
function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
}

// Add to cart via API
function addToCart(productId) {
    if (!currentSelectedModel) { alert('Please select a model first!'); return; }
    const product = allProducts.find(p => p.id == productId);
    const quantity = parseInt(document.getElementById('quantity').value);
    const existingItem = cart.find(item => item.productId == productId && item.modelName === currentSelectedModel.modelName);
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        fetch(`http://localhost:3001/cart/${existingItem.id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
        }).then(() => { showToast(`Updated ${existingItem.modelName} quantity!`); loadCart(); closeModal(); })
          .catch(() => alert("Error updating cart. Make sure json-server is running."));
    } else {
        const cartItem = {
            id: Date.now().toString(), productId, name: product.name,
            modelName: currentSelectedModel.modelName, price: currentSelectedModel.price,
            quantity, image: product.image, specs: currentSelectedModel.specs
        };
        fetch('http://localhost:3001/cart', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartItem)
        }).then(() => { showToast('Item added to cart!'); loadCart(); closeModal(); })
          .catch(() => alert("Error adding to cart. Make sure json-server is running."));
    }
}

// Close modal
function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
    document.body.style.overflow = '';
}

// Search
function searchProduct() {
    const query = document.getElementById('search').value.toLowerCase();
    let filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
    if (currentFilter !== 'all') filtered = filtered.filter(p => p.category === currentFilter);
    displayProducts(filtered);
}

function clearSearch() {
    document.getElementById('search').value = '';
    if (currentFilter === 'all') displayProducts(allProducts);
    else displayProducts(allProducts.filter(p => p.category === currentFilter));
}

// Filter by category
function filterCategory(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if (category === 'all') displayProducts(allProducts);
    else displayProducts(allProducts.filter(p => p.category === category));
}

// Sort products
function sortProducts() {
    const sortVal = document.getElementById('sortSelect').value;
    let products = currentFilter === 'all' ? [...allProducts] : allProducts.filter(p => p.category === currentFilter);
    switch (sortVal) {
        case 'price-low': products.sort((a, b) => a.basePrice - b.basePrice); break;
        case 'price-high': products.sort((a, b) => b.basePrice - a.basePrice); break;
        case 'name-az': products.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    displayProducts(products);
}

// Display cart
function displayCart() {
    const cartContainer = document.getElementById('cartItems');
    const totalSpan = document.getElementById('total');
    if (!cartContainer) return;
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div style="text-align:center;padding:60px 20px;"><p style="font-size:48px;margin-bottom:20px;">🛒</p><h3 style="color:#aaa;">Your cart is empty</h3><p style="color:#555;margin-top:10px;">Browse our products to find what you need</p><a href="products.html" class="btn btn-primary" style="margin-top:20px;">Shop Now</a></div>';
        totalSpan.textContent = '0';
        return;
    }
    let output = '', total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        output += `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name} (${item.modelName})</h3>
                <p>Quantity: ${item.quantity} × $${item.price}</p>
            </div>
            <div class="cart-item-price">
                <div class="price">$${itemTotal}</div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        </div>`;
    });
    cartContainer.innerHTML = output;
    totalSpan.textContent = total;
}

// Remove from cart
function removeFromCart(id) {
    fetch(`http://localhost:3001/cart/${id}`, { method: 'DELETE' })
        .then(() => { showToast('Item removed'); loadCart(); })
        .catch(() => alert("Error removing from cart."));
}

// Clear entire cart
async function clearCart() {
    if (cart.length === 0) { alert('Cart is already empty!'); return; }
    if (!confirm('Clear all items from cart?')) return;
    for (const item of cart) {
        await fetch(`http://localhost:3001/cart/${item.id}`, { method: 'DELETE' });
    }
    showToast('Cart cleared!');
    loadCart();
}

// Checkout
async function checkout() {
    if (cart.length === 0) { alert("Cart is empty!"); return; }
    for (const item of cart) {
        await fetch(`http://localhost:3001/cart/${item.id}`, { method: 'DELETE' });
    }
    showToast("Thank you for your purchase! 🎉");
    loadCart();
}

// Contact form validation
async function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const errorMsg = document.getElementById('error');
    const successMsg = document.getElementById('success');
    errorMsg.textContent = '';
    successMsg.textContent = '';
    if (!name) { errorMsg.textContent = 'Name is required'; return false; }
    if (!email) { errorMsg.textContent = 'Email is required'; return false; }
    if (!email.includes('@')) { errorMsg.textContent = 'Please enter a valid email'; return false; }
    if (!message) { errorMsg.textContent = 'Message is required'; return false; }
    try {
        const response = await fetch('http://localhost:3001/contacts', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: Date.now().toString(), name, email, message, date: new Date().toISOString() })
        });
        if (response.ok) {
            successMsg.textContent = 'Message sent successfully! We\'ll get back to you soon.';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
        } else { errorMsg.textContent = 'Failed to send. Please try again.'; }
    } catch (err) { errorMsg.textContent = 'Error connecting to server. Make sure json-server is running.'; }
    return false;
}

// Flash sale offer list
const offers = [
    {
        image: "images/router.jpg",
        title: "Cisco Enterprise Router - PRO",
        desc: "Ultimate networking experience. Limited time!",
        oldPrice: "$599",
        newPrice: "$299"
    },
    {
        image: "images/switch.jpg",
        title: "Ubiquiti UniFi Managed Switch",
        desc: "Supercharge your office connectivity with 24-Port Gigabit.",
        oldPrice: "$399",
        newPrice: "$199"
    },
    {
        image: "images/Firewall.jpg",
        title: "Fortigate Next-Gen Firewall",
        desc: "Enterprise-grade threat protection for your network.",
        oldPrice: "$799",
        newPrice: "$399"
    },
    {
        image: "images/access point.jpg",
        title: "Cisco Meraki Cloud Access Point",
        desc: "Seamless high-speed WiFi coverage for large areas.",
        oldPrice: "$299",
        newPrice: "$149"
    }
];
let currentOfferIndex = 0;

// Flash sale offer modal
function changeText(btn) {
    let offerModal = document.getElementById('offerModal');
    if (!offerModal) {
        offerModal = document.createElement('div');
        offerModal.id = 'offerModal';
        offerModal.className = 'modal';
        document.body.appendChild(offerModal);
    }
    
    const offer = offers[currentOfferIndex];
    currentOfferIndex = (currentOfferIndex + 1) % offers.length;
    
    offerModal.innerHTML = `
        <div class="modal-content" style="text-align:center; max-width:500px; border-color:rgba(255,68,68,0.5);">
            <span class="close" onclick="document.getElementById('offerModal').style.display='none';document.body.style.overflow=''" style="color:#ff4444;">&times;</span>
            <h2 style="color:#ff4444;font-size:32px;margin:20px 0;">🔥 Flash Sale! 🔥</h2>
            <img src="${offer.image}" alt="Flash Sale" style="width:100%;max-width:280px;border-radius:12px;margin-bottom:20px;border:2px solid rgba(255,68,68,0.3);">
            <h3 style="color:#fff;">${offer.title}</h3>
            <p style="color:#aaa;margin:10px 0;">${offer.desc}</p>
            <div style="font-size:28px;font-weight:bold;margin:15px 0;">
                <span style="text-decoration:line-through;color:#555;font-size:18px;margin-right:10px;">${offer.oldPrice}</span>
                <span style="color:#ff4444;">${offer.newPrice}</span>
            </div>
            <button class="btn btn-danger btn-glow" style="padding:14px 40px;font-size:16px;" onclick="document.getElementById('offerModal').style.display='none';document.body.style.overflow='';showToast('🎉 Offer claimed! Check your cart.');">Claim Offer Now!</button>
        </div>`;
        
    offerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    btn.textContent = "New Offer Active! 🔥";
    btn.style.background = "linear-gradient(135deg,#ff4444,#cc0000)";
    btn.style.color = "#fff";
    btn.style.border = "none";
}

// Toast notification
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(100px);background:linear-gradient(135deg,#6366f1,#0ea5e9);color:#fff;padding:14px 30px;border-radius:10px;font-weight:600;z-index:9999;transition:transform 0.4s;box-shadow:0 8px 30px rgba(14,165,233,0.4);';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(100px)'; }, 3000);
}

// Accurate Speed test using real file download
function runSpeedTest() {
    const btn = document.getElementById('scanBtn');
    const speedNum = document.getElementById('speedNumber');
    const speedBar = document.getElementById('speedBar');
    const result = document.getElementById('scanResult');
    
    btn.disabled = true;
    btn.textContent = 'Testing...';
    result.textContent = 'Connecting to server...';
    speedNum.textContent = '0.0';
    speedBar.style.width = '0%';
    
    // Animate a "connecting" phase
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        if (progress <= 25) {
            speedBar.style.width = progress + '%';
        }
    }, 100);

    // Using a known 5MB public image for accurate speed calculation
    const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg" + "?cacheBust=" + new Date().getTime();
    const downloadSize = 5245329; // Exact size in bytes
    
    const startTime = new Date().getTime();
    const download = new Image();
    
    download.onload = function() {
        clearInterval(progressInterval);
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // seconds
        
        const bitsLoaded = downloadSize * 8;
        const speedBps = bitsLoaded / duration;
        const speedKbps = speedBps / 1024;
        const speedMbps = speedKbps / 1024;
        
        speedBar.style.width = '100%';
        
        // Animate the final number display
        let start = 0;
        const steps = 30;
        const increment = speedMbps / steps;
        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            start += increment;
            speedNum.textContent = start.toFixed(1);
            if (currentStep >= steps) {
                clearInterval(timer);
                speedNum.textContent = speedMbps.toFixed(1);
                
                btn.disabled = false;
                btn.textContent = 'Test Again';
                
                if (speedMbps > 100) {
                    result.textContent = `${speedMbps.toFixed(1)} Mbps — Excellent! Perfect for enterprise networking.`;
                } else if (speedMbps > 50) {
                    result.textContent = `${speedMbps.toFixed(1)} Mbps — Good speed. Fast enough for most tasks.`;
                } else {
                    result.textContent = `${speedMbps.toFixed(1)} Mbps — Fair. Consider upgrading your router!`;
                }
            }
        }, 30);
    };
    
    download.onerror = function() {
        clearInterval(progressInterval);
        result.textContent = 'Error during speed test. Please check your connection.';
        btn.disabled = false;
        btn.textContent = 'Test Again';
        speedBar.style.width = '0%';
    };
    
    result.textContent = 'Downloading 5MB test file...';
    download.src = imageUrl;
}

// Scroll to features
function scrollToFeatures() {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Newsletter subscribe
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail');
    const msg = document.getElementById('newsletterMsg');
    if (!email.value || !email.value.includes('@')) {
        msg.style.color = '#ff4444';
        msg.textContent = 'Please enter a valid email.';
        return;
    }
    msg.style.color = '#44ff88';
    msg.textContent = 'Subscribed successfully! 🎉';
    email.value = '';
}

// FAQ toggle
function toggleFaq(item) {
    item.classList.toggle('open');
}

// Live chat
function openLiveChat() {
    let overlay = document.querySelector('.chat-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'chat-overlay';
        overlay.style.display = 'block';
        overlay.innerHTML = `
        <div class="chat-box">
            <div class="chat-header">
                <span>💬 Live Chat</span>
                <span style="cursor:pointer" onclick="this.closest('.chat-overlay').style.display='none'">✕</span>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="chat-msg bot">Hi! 👋 How can I help you today?</div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chatInput" placeholder="Type a message..." onkeypress="if(event.key==='Enter')sendChatMsg()">
                <button onclick="sendChatMsg()">Send</button>
            </div>
        </div>`;
        document.body.appendChild(overlay);
    } else {
        overlay.style.display = 'block';
    }
}

function sendChatMsg() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const text = input.value.trim();
    if (!text) return;
    messages.innerHTML += `<div class="chat-msg user">${text}</div>`;
    input.value = '';
    setTimeout(() => {
        const responses = [
            "Thanks for your message! Our team will assist you shortly.",
            "Great question! Let me check that for you.",
            "I'd recommend checking our Products page for the latest deals!",
            "Our support team is available 24/7. Can I help with anything else?",
            "For technical issues, please email support@netstore.com with details."
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        messages.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    messages.scrollTop = messages.scrollHeight;
}

// Hero particles
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        container.appendChild(particle);
    }
}

// Animated counter for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const steps = 50;
        const increment = target / steps;
        let current = 0;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.floor(increment * step), target);
            if (target >= 1000) counter.textContent = (current / 1000).toFixed(current >= target ? 0 : 1) + 'k+';
            else if (target === 99) counter.textContent = current + '.9%';
            else if (target === 24) counter.textContent = current + '/7';
            else counter.textContent = current + '+';
            if (step >= steps) clearInterval(timer);
        }, duration / steps);
    });
}

// Init
window.onload = function () {
    loadCart();
    createParticles();
    animateCounters();
    setupStatClicks();
    
    // About page initializers
    initScrollReveal();
    initTimelineScroll();
    initAboutNetworkCanvas();
};

// Team Connect Modal Functions
function openConnectModal(name, role, email, avatarClass, initials) {
    const modal = document.getElementById('connectModal');
    if (!modal) return;
    const avatar = document.getElementById('modalAvatar');
    const nameEl = document.getElementById('modalName');
    const roleEl = document.getElementById('modalRole');
    const emailEl = document.getElementById('modalEmail');
    
    avatar.className = 'team-avatar ' + avatarClass;
    avatar.textContent = initials;
    nameEl.textContent = name;
    roleEl.textContent = role;
    emailEl.textContent = email;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeConnectModal() {
    const modal = document.getElementById('connectModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
    const form = document.getElementById('connectForm');
    if (form) form.reset();
}

function copyEmail() {
    const emailText = document.getElementById('modalEmail').textContent;
    navigator.clipboard.writeText(emailText).then(() => {
        showToast('✉️ Email copied to clipboard!');
    }).catch(err => {
        showToast('Failed to copy email.');
    });
}

function sendTeamMessage(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    
    setTimeout(() => {
        showToast('✉️ Message sent successfully!');
        closeConnectModal();
        btn.disabled = false;
        btn.textContent = originalText;
    }, 1200);
    return false;
}

// Stats Click Handler to re-run animations
function setupStatClicks() {
    const items = document.querySelectorAll('.stat-item');
    items.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const counter = item.querySelector('.stat-number');
            if (!counter) return;
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const duration = 1000;
            const steps = 30;
            const increment = target / steps;
            let step = 0;
            const timer = setInterval(() => {
                step++;
                current = Math.min(Math.floor(increment * step), target);
                if (target >= 1000) counter.textContent = (current / 1000).toFixed(current >= target ? 0 : 1) + 'k+';
                else if (target === 99) counter.textContent = current + '.9%';
                else if (target === 24) counter.textContent = current + '/7';
                else counter.textContent = current + '+';
                if (step >= steps) clearInterval(timer);
            }, duration / steps);
        });
    });
}

// Scroll Reveal Observer
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
    });
    
    revealElements.forEach(el => observer.observe(el));
}

// Timeline Scroll Sync
function initTimelineScroll() {
    const track = document.querySelector('.timeline-container');
    const progressBar = document.getElementById('timelineProgress');
    const dots = document.querySelectorAll('.timeline-dot');
    
    if (!track || !progressBar) return;
    
    function updateTimeline() {
        const rect = track.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate percentages
        const startOffset = windowHeight * 0.75;
        const totalHeight = rect.height;
        const scrolled = startOffset - rect.top;
        
        let percentage = (scrolled / totalHeight) * 100;
        percentage = Math.max(0, Math.min(percentage, 100));
        
        progressBar.style.height = percentage + '%';
        
        dots.forEach(dot => {
            const dotRect = dot.getBoundingClientRect();
            if (dotRect.top < windowHeight * 0.75) {
                dot.classList.add('active-dot');
            } else {
                dot.classList.remove('active-dot');
            }
        });
    }
    
    window.addEventListener('scroll', updateTimeline);
    window.addEventListener('resize', updateTimeline);
    updateTimeline();
}

// Canvas Network Particle Background
function initAboutNetworkCanvas() {
    const canvas = document.getElementById('aboutNetworkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    
    const particles = [];
    const particleCount = 45;
    const connectionDistance = 110;
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    let mouse = { x: null, y: null };
    const heroSection = document.querySelector('.about-hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        heroSection.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = (1 - dist / connectionDistance) * 0.15;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
            
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    const opacity = (1 - dist / 150) * 0.25;
                    ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        if (!canvas) return;
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    });
}

// Milestone routing & modal logic
const milestoneData = {
    founded: {
        title: "Founded & Humble Beginnings",
        year: "2010",
        icon: "🌱",
        body: `
            <p>Our journey began in 2010 in a small, cozy office in Cairo, Egypt. Founded by Ahmed Hassan, our goal was simple: to make enterprise-grade networking components accessible to local businesses.</p>
            <p style="margin-top: 12px;">Starting with just a team of three and a tiny inventory of refurbished routers, we focused heavily on personalized customer service and engineering expertise, setting the core foundation of what Network Store represents today.</p>
            <div style="display: flex; gap: 16px; margin-top: 20px; background: rgba(99, 102, 241, 0.05); padding: 16px; border-radius: var(--border-radius-sm); border: 1px solid rgba(99, 102, 241, 0.15);">
                <div style="flex: 1; text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary);">3</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Co-Founders</div>
                </div>
                <div style="flex: 1; text-align: center; border-left: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary);">50+</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Initial Clients</div>
                </div>
            </div>
        `,
        actionText: "Meet the Founders 👥",
        action: function() {
            closeMilestoneModal();
            const grid = document.querySelector('.team-grid');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        }
    },
    expansion: {
        title: "Regional Expansion",
        year: "2015",
        icon: "🗺️",
        body: `
            <p>By 2015, we broke regional barriers and expanded our logistics footprint to Riyadh, Saudi Arabia, and Dubai, UAE. This allowed us to deliver critical enterprise components within 24 hours across the Gulf region.</p>
            <p style="margin-top: 12px;">We established direct partnerships with leading manufacturers, ensuring 100% genuine components and opening dedicated support offices to provide local, certified assistance.</p>
            <div style="margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 0.9rem; color: var(--text-main);">Logistics Speed Boost</span>
                    <span style="font-size: 0.9rem; color: var(--accent-primary); font-weight: 700;">+300%</span>
                </div>
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                    <div style="width: 100%; height: 100%; background: var(--gradient-primary);"></div>
                </div>
            </div>
        `,
        actionText: "Contact our Regional Hubs 📞",
        action: function() {
            window.location.href = 'contact.html';
        }
    }
};

let currentMilestoneType = null;

function openMilestoneModal(type) {
    const modal = document.getElementById('milestoneModal');
    if (!modal) return;
    const data = milestoneData[type];
    if (!data) return;
    
    currentMilestoneType = type;
    
    document.getElementById('milestoneIcon').textContent = data.icon;
    document.getElementById('milestoneTitle').textContent = data.title;
    document.getElementById('milestoneYear').textContent = data.year;
    document.getElementById('milestoneBody').innerHTML = data.body;
    
    const actBtn = document.getElementById('milestoneActionButton');
    actBtn.textContent = data.actionText;
    
    actBtn.onclick = function() {
        if (milestoneData[currentMilestoneType] && typeof milestoneData[currentMilestoneType].action === 'function') {
            milestoneData[currentMilestoneType].action();
        }
    };
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeMilestoneModal() {
    const modal = document.getElementById('milestoneModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

function routeMilestone(destination) {
    if (destination === 'products') {
        window.location.href = 'products.html';
    } else if (destination === 'contact') {
        window.location.href = 'contact.html';
    }
}
