// Marketplace functionality
let cart = [];
let cartTotal = 0;


const productDatabase = {
    "peace-lily": {
        id: 1,
        name: "Classic Peace Lily",
        price: 29.99,
        originalPrice: 39.99,
        image: "flowers/peace-lily-plant-transparent-background-generative-by-ai_1042753-3416.jpg",
        seller: "Gerome Powell",
        rating: "4.8",
        reviews: 127,
        shipping: "Free shipping",
        description: "A classic peace lily for your home.",
        features: ["Air purifying", "Low maintenance"],
        care: ["Water weekly", "Indirect sunlight"]
    },
    "premium-peace-lily": {
        id: 2,
        name: "Premium Peace Lily",
        price: 45.99,
        originalPrice: null,
        image: "flowers/pngtree-a-peace-lily-plant-png-image_14144988.png",
        seller: "Plant Masters",
        rating: "4.6",
        reviews: 89,
        shipping: "Free shipping over $40",
        description: "A premium, lush peace lily for plant lovers.",
        features: ["Large leaves", "Blooms often"],
        care: ["Keep soil moist", "Bright, indirect light"]
    },
    "tropical-foliage": {
        id: 3,
        name: "Tropical Foliage Mix",
        price: 34.99,
        originalPrice: null,
        image: "flowers/plant.jpg",
        seller: "Urban Jungle",
        rating: "4.9",
        reviews: 156,
        shipping: "Express delivery available",
        description: "A mix of lush tropical foliage plants.",
        features: ["Lush green", "Air purifying"],
        care: ["Keep soil moist", "Indirect light"]
    },
    "succulent-garden": {
        id: 4,
        name: "Delicate Succulent Garden",
        price: 27.99,
        originalPrice: 32.99,
        image: "flowers/close-up-delicate-flowers.jpg",
        seller: "Desert Bloom",
        rating: "4.5",
        reviews: 73,
        shipping: "Same day delivery",
        description: "A beautiful arrangement of delicate succulents.",
        features: ["Low maintenance", "Drought tolerant"],
        care: ["Water sparingly", "Bright light"]
    },
    "designer-lily": {
        id: 5,
        name: "Designer Lily Collection",
        price: 89.99,
        originalPrice: null,
        image: "flowers/lilyy.jpg",
        seller: "Luxury Plants Co.",
        rating: "4.7",
        reviews: 94,
        shipping: "White glove delivery",
        description: "A premium collection of designer lilies.",
        features: ["Premium selection", "Exclusive"],
        care: ["Water regularly", "Indirect light"]
    },
    "luxury-vase": {
        id: 6,
        name: "Luxury Designer Vase Plant",
        price: 129.99,
        originalPrice: null,
        image: "flowers/vase.jpg",
        seller: "Elite Gardens",
        rating: "5.0",
        reviews: 42,
        shipping: "Premium packaging included",
        description: "A luxury plant in a designer vase.",
        features: ["Exclusive vase", "Premium plant"],
        care: ["Water as needed", "Bright, indirect light"]
    }
};



// Initialize marketplace
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartDisplay();
});

function initializeEventListeners() {
    // Cart toggle
    document.getElementById('cart-toggle').addEventListener('click', toggleCart);
    document.getElementById('cart-close').addEventListener('click', closeCart);
    
    // Search functionality
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    // Hero button
    document.querySelector('.hero-btn').addEventListener('click', function() {
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
            
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Category items
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
            
            // Update filter button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            const filterBtn = document.querySelector(`[data-filter="${category}"]`);
            if (filterBtn) filterBtn.classList.add('active');
        });
    });
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            
            addToCart(id, name, price);
            
            // Visual feedback
            e.target.textContent = 'Added!';
            e.target.style.background = '#27ae60';
            setTimeout(() => {
                e.target.textContent = 'Add to Cart';
                e.target.style.background = '#2d5a27';
            }, 1000);
        }
        
        // Quick view buttons
        if (e.target.classList.contains('quick-view')) {
            const productId = e.target.getAttribute('data-id');
            showQuickView(productId);
        }
        
        // Deal buttons
        if (e.target.classList.contains('deal-btn')) {
            document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Modal close
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('quick-view-modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Overlay
    document.getElementById('overlay').addEventListener('click', function() {
        closeCart();
        closeModal();
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', checkout);
}

// Cart functionality
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = Object.values(productDatabase).find(p => p.id === id);
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
            image: product ? product.image : 'flowers/plant.jpg'
        });
    }
    
    cartTotal += price;
    updateCartDisplay();
    
    // Show cart briefly
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.add('open');
    document.getElementById('overlay').classList.add('active');
    
    setTimeout(() => {
        if (!cartSidebar.matches(':hover')) {
            closeCart();
        }
    }, 2000);
}

function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        cartTotal -= item.price * item.quantity;
        cart.splice(itemIndex, 1);
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    cartTotalElement.textContent = cartTotal.toFixed(2);
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 0.5rem;">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

// Product filtering
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Search functionality
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productSeller = product.querySelector('.seller').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productSeller.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
    
    // Scroll to products
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
    
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
}

// Quick view modal
function showQuickView(productId) {
    const product = productDatabase[productId];
    if (!product) return;
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <div class="product-detail">
            <div>
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div>
                <h1>${product.name}</h1>
                <div class="seller" style="margin-bottom: 1rem;">Sold by: ${product.seller}</div>
                <div class="rating" style="margin-bottom: 1rem;">
                    <span class="stars">${product.rating}</span>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="price-section" style="margin-bottom: 1rem;">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="shipping" style="margin-bottom: 1rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg> ${product.shipping}</div>
                <p style="margin-bottom: 1.5rem;">${product.description}</p>
                
                <div class="product-specs">
                    <h4>Key Features:</h4>
                    <ul>
                        ${product.features.map(feature => `<li>• ${feature}</li>`).join('')}
                    </ul>
                    
                    <h4>Care Instructions:</h4>
                    <ul>
                        ${product.care.map(instruction => `<li>• ${instruction}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="margin-top: 2rem;">
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" style="width: 100%; padding: 15px; font-size: 1.1rem;">
                        Add to Cart - $${product.price}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('quick-view-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('quick-view-modal').style.display = 'none';
}

// Checkout functionality
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const orderSummary = cart.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
    alert(`Order Summary:\n\n${orderSummary}\n\nTotal: $${cartTotal.toFixed(2)}\n\nThank you for your order! This is a demo marketplace.`);
    
    // Clear cart
    cart = [];
    cartTotal = 0;
    updateCartDisplay();
    closeCart();
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});