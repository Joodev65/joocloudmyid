// Global variables
let currentOrder = {};
let selectedPaymentMethod = '';

// DOM loaded event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupModals();
    
    // Add logo error handling
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.onerror = function() {
            this.style.display = 'none';
        };
    }
}

// Mobile menu functionality
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Modal setup
function setupModals() {
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const orderModal = document.getElementById('orderModal');
        const paymentModal = document.getElementById('paymentModal');
        
        if (event.target === orderModal) {
            closeOrderModal();
        }
        if (event.target === paymentModal) {
            closePaymentModal();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeOrderModal();
            closePaymentModal();
        }
    });
}

// Open order modal
function openOrderModal(productName, price, description) {
    currentOrder = {
        product: productName,
        price: price,
        description: description,
        timestamp: new Date().toISOString()
    };
    
    document.getElementById('modalTitle').textContent = productName;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('buyerNotes').value = '';
    
    document.getElementById('orderModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus on the notes textarea for better UX
    setTimeout(() => {
        document.getElementById('buyerNotes').focus();
    }, 300);
}

// Close order modal
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentOrder = {};
}

// Show payment options
function showPaymentOptions() {
    const notes = document.getElementById('buyerNotes').value;
    currentOrder.notes = notes;
    
    closeOrderModal();
    document.getElementById('paymentModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Reset payment selection
    resetPaymentSelection();
}

// Close payment modal
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentSelection();
}

// Reset payment selection
function resetPaymentSelection() {
    selectedPaymentMethod = '';
    document.querySelectorAll('.payment-method-card').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('paymentDetails').style.display = 'none';
}

// Select payment method
function selectPayment(method) {
    selectedPaymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.payment-method-card').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    event.target.closest('.payment-method-card').classList.add('selected');
    
    // Show payment details
    showPaymentDetails(method);
}

// Show payment details based on selected method
function showPaymentDetails(method) {
    const paymentDetails = document.getElementById('paymentDetails');
    const methodTitle = document.getElementById('paymentMethodTitle');
    const methodDetails = document.getElementById('paymentMethodDetails');
    const paymentIconDisplay = document.getElementById('paymentIconDisplay');
    const orderSummary = document.getElementById('orderSummary');
    
    // Set order summary in the new card format
    orderSummary.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div>
                <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 5px;">${currentOrder.product}</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: rgba(255,255,255,0.9);">${currentOrder.price}</div>
            </div>
            <div style="font-size: 2rem; opacity: 0.3;">
                <i class="fas fa-shopping-cart"></i>
            </div>
        </div>
        ${currentOrder.notes ? `<div style="padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 0.9rem; border-left: 3px solid rgba(255,255,255,0.3);"><strong>Notes:</strong> ${currentOrder.notes}</div>` : ''}
    `;
    
    // Set payment method details with new format
    switch(method) {
        case 'qris':
    methodTitle.textContent = 'QRIS';
    paymentIconDisplay.innerHTML = '<i class="fas fa-qrcode"></i>';
    paymentIconDisplay.className = 'payment-icon-large qris-icon';
    methodDetails.innerHTML = `
        <div style="text-align: center; padding: 20px; background: #fff; border-radius: 12px;">
            <div style="font-size: 1rem; color: #555; margin-bottom: 12px;">Scan QR Code dengan aplikasi e-wallet</div>
            <img src="https://files.catbox.moe/3kchau.jpg" alt="QRIS Payment" style="max-width: 250px; border-radius: 12px; margin-bottom: 15px;">
            <div style="font-size: 0.9rem; color: #888; margin-bottom: 10px;">No. BRN (jika diminta): <strong id="brnCode">123456677</strong></div>
            <button onclick="copyBRN()" style="padding: 8px 16px; background-color: #108ee9; color: white; border: none; border-radius: 6px; font-size: 0.9rem; cursor: pointer;">
                Salin BRN
            </button>
            <div style="margin-top: 15px; font-size: 0.9rem; color: #555;">
                Amount: <span style="font-weight: 700; color: #108ee9;">${currentOrder.price}</span>
            </div>
        </div>
    `;
    break;
            
        case 'dana':
            methodTitle.textContent = 'DANA';
            paymentIconDisplay.innerHTML = '<i class="fas fa-wallet"></i>';
            paymentIconDisplay.className = 'payment-icon-large dana-icon';
            methodDetails.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">Transfer to DANA Number</div>
                    <div style="font-size: 1.4rem; font-weight: 700; color: #108ee9; padding: 15px; background: #f0f9ff; border-radius: 12px; border: 2px dashed #108ee9;">
                        083822438936
                    </div>
                    <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                        Amount: <span style="font-weight: 700; color: #108ee9;">${currentOrder.price}</span>
                    </div>
                </div>
            `;
            break;
            
        case 'gopay':
            methodTitle.textContent = 'GoPay';
            paymentIconDisplay.innerHTML = '<i class="fas fa-mobile-alt"></i>';
            paymentIconDisplay.className = 'payment-icon-large gopay-icon';
            methodDetails.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">Transfer to GoPay Number</div>
                    <div style="font-size: 1.4rem; font-weight: 700; color: #00aa13; padding: 15px; background: #f0f9f0; border-radius: 12px; border: 2px dashed #00aa13;">
                        083822438936
                    </div>
                    <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                        Amount: <span style="font-weight: 700; color: #00aa13;">${currentOrder.price}</span>
                    </div>
                </div>
            `;
            break;
            
        case 'bri':
    methodTitle.textContent = 'BRI';
    paymentIconDisplay.innerHTML = '<i class="fas fa-university"></i>';
    paymentIconDisplay.className = 'payment-icon-large bri-icon';
    methodDetails.innerHTML = `
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 12px; margin-bottom: 15px;">
            <div style="font-size: 1rem; color: #666; margin-bottom: 10px;">Bank Transfer via BRI</div>
            <div style="font-size: 1.4rem; font-weight: 700; color: #004080; padding: 15px; background: #e9f1ff; border-radius: 12px; border: 2px dashed #004080;">
                123456677
            </div>
            <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                Amount: <span style="font-weight: 700; color: #004080;">${currentOrder.price}</span>
            </div>
        </div>
    `;
    break;
    
    paymentDetails.style.display = 'block';
    
    // Scroll to payment details
    setTimeout(() => {
        paymentDetails.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Confirm transfer and redirect to WhatsApp
function confirmTransfer() {
    if (!selectedPaymentMethod) {
        alert('Please select a payment method first');
        return;
    }
    
    // Prepare WhatsApp message
    const message = formatWhatsAppMessage();
    const phoneNumber = '6283140962760'; // WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Close modal and redirect
    closePaymentModal();
    
    // Add loading state
    const button = event.target;
    button.classList.add('loading');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        button.classList.remove('loading');
        button.innerHTML = '<i class="fas fa-whatsapp"></i> Complete Payment via WhatsApp';
    }, 1000);
}

// Format WhatsApp message
function formatWhatsAppMessage() {
    const orderTime = new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let paymentMethodText = '';
    switch(selectedPaymentMethod) {
        case 'qris':
            paymentMethodText = 'QRIS';
            break;
        case 'dana':
            paymentMethodText = 'DANA (083822438936)';
            break;
        case 'gopay':
            paymentMethodText = 'GoPay (083822438936)';
            break;
        case 'bri':
            paymentMethodText = 'BRI Bank Transfer';
            break;
    }
    
    const message = `🛍️ *NEW ORDER - JOOCODE OFFICIAL*

📦 *Product:* ${currentOrder.product}
💰 *Price:* ${currentOrder.price}
💳 *Payment Method:* ${paymentMethodText}
📅 *Order Time:* ${orderTime}

${currentOrder.notes ? `📝 *Customer Notes:*\n${currentOrder.notes}\n\n` : ''}📋 *Order Status:* Payment Completed ✅

${selectedPaymentMethod === 'qris' ? '🔍 *Request:* Please send QRIS QR Code\n\n' : ''}${selectedPaymentMethod === 'bri' ? '🏦 *Request:* Please send BRI account details\n\n' : ''}💡 *Next Steps:*
- I will send payment proof shortly
- Please confirm and provide the service/product
- Thank you for your service!

*Joocode Official Customer* 🙏`;

    return message;
}

// Open WhatsApp for general contact
function openWhatsApp() {
    const phoneNumber = '6283140962760';
    const message = `Hello Joocode Official! 👋

I'm interested in your services. Could you please provide more information about:

🔹 Available hosting packages
🔹 Custom development services  
🔹 Current promotions or discounts
🔹 Technical support options

Thank you for your time! 😊

Best regards,
*Potential Customer*`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const notificationStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.product-card, .service-category');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', handleScrollAnimations);

// Performance optimization - Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling for failed operations
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Please try again or contact support.', 'error');
});

// Service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key handling
    if (e.key === 'Escape') {
        closeOrderModal();
        closePaymentModal();
    }
    
    // Enter key handling in forms
    if (e.key === 'Enter' && e.target.tagName === 'TEXTAREA') {
        e.preventDefault();
        const continueBtn = document.querySelector('.continue-btn');
        if (continueBtn && continueBtn.offsetParent !== null) {
            continueBtn.click();
        }
    }
});

// Analytics and tracking (placeholder for future implementation)
function trackEvent(eventName, eventData) {
    // This can be connected to Google Analytics, Facebook Pixel, etc.
    console.log('Event tracked:', eventName, eventData);
}

// Track order events
function trackOrderStart(productName) {
    trackEvent('order_start', { product: productName });
}

function trackPaymentMethod(method) {
    trackEvent('payment_method_selected', { method: method });
}

function trackOrderComplete(orderData) {
    trackEvent('order_complete', orderData);
}

// Add tracking to existing functions
const originalOpenOrderModal = openOrderModal;
openOrderModal = function(productName, price, description) {
    trackOrderStart(productName);
    return originalOpenOrderModal.call(this, productName, price, description);
};

const originalSelectPayment = selectPayment;
selectPayment = function(method) {
    trackPaymentMethod(method);
    return originalSelectPayment.call(this, method);
};

const originalConfirmTransfer = confirmTransfer;
confirmTransfer = function() {
    trackOrderComplete(currentOrder);
    return originalConfirmTransfer.call(this);
};
