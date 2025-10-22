/**
 * ViaItalia Frontend Integration Example
 * यह file आपके existing recommendation form को backend के साथ integrate करने के लिए है
 * 
 * Instructions:
 * 1. इस code को अपने "recommendation form.js" file में add करें
 * 2. या एक separate file में रखकर HTML में include करें
 * 3. Backend server का URL check करें (localhost:3000)
 */

// Backend API base URL
const API_BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Form submission handler - existing form के साथ integrate करें
 */
function setupFormSubmission() {
    const form = document.querySelector('.trip-form');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (form && submitBtn) {
        form.addEventListener('submit', handleFormSubmission);
        console.log('✅ ViaItalia backend integration ready!');
    } else {
        console.error('❌ Form elements not found');
    }
}

/**
 * Form submission को handle करता है और backend को data send करता है
 */
async function handleFormSubmission(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    try {
        // Show loading state
        submitBtn.textContent = 'Generating Recommendation...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = collectFormData();
        
        // Validate data
        if (!validateFormData(formData)) {
            throw new Error('Please fill all required fields');
        }
        
        console.log('📤 Sending data to backend:', formData);
        
        // Send to backend
        const recommendation = await generateRecommendation(formData);
        
        console.log('📥 Received recommendation:', recommendation);
        
        // Store recommendation data
        localStorage.setItem('travelRecommendation', JSON.stringify(recommendation));
        
        // Show success message
        showSuccessMessage('Recommendation generated successfully!');
        
        // Redirect to result page after 2 seconds
        setTimeout(() => {
            window.location.href = 'Result.html';
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error:', error);
        showErrorMessage(error.message || 'Failed to generate recommendation');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Form से data collect करता है
 */
function collectFormData() {
    // Destination
    const destination = document.getElementById('destination-input')?.value;
    
    // Start date
    const startDate = document.getElementById('date-picker')?.value;
    
    // Number of days
    const days = parseInt(document.querySelector('.counter-value')?.textContent) || 1;
    
    // Budget - selected radio button
    const budgetRadio = document.querySelector('input[name="budget"]:checked');
    const budget = budgetRadio ? 
        budgetRadio.nextElementSibling.querySelector('.card-title').textContent.toLowerCase() : 'medium';
    
    // Companion - selected radio button
    const companionRadio = document.querySelector('input[name="companion"]:checked');
    const companion = companionRadio ? 
        companionRadio.nextElementSibling.querySelector('.card-title').textContent.toLowerCase() : 'solo';
    
    // Activities - all checked checkboxes
    const activityCheckboxes = document.querySelectorAll('input[name="activity"]:checked');
    const activities = Array.from(activityCheckboxes).map(checkbox => 
        checkbox.nextElementSibling.querySelector('.card-title-bold').textContent
    );
    
    // Food preference - selected radio button
    const foodRadio = document.querySelector('input[name="food"]:checked');
    const foodPreference = foodRadio ? 
        foodRadio.parentElement.querySelector('.radio-label').textContent.toLowerCase().replace(/[^a-z]/g, '') : 'nonvegetarian';
    
    // Additional preferences
    const additionalPreferences = document.querySelector('.form-textarea')?.value || '';
    
    return {
        destination,
        startDate,
        days,
        budget,
        companion,
        activities,
        foodPreference,
        additionalPreferences
    };
}

/**
 * Form data को validate करता है
 */
function validateFormData(data) {
    if (!data.destination) {
        showErrorMessage('Please select a destination');
        return false;
    }
    
    if (!data.startDate) {
        showErrorMessage('Please select travel date');
        return false;
    }
    
    if (data.days < 1 || data.days > 30) {
        showErrorMessage('Please select valid number of days (1-30)');
        return false;
    }
    
    if (!data.budget) {
        showErrorMessage('Please select budget preference');
        return false;
    }
    
    if (!data.companion) {
        showErrorMessage('Please select travel companion');
        return false;
    }
    
    if (!data.activities || data.activities.length === 0) {
        showErrorMessage('Please select at least one activity');
        return false;
    }
    
    if (!data.foodPreference) {
        showErrorMessage('Please select food preference');
        return false;
    }
    
    return true;
}

/**
 * Backend API को call करता है
 */
async function generateRecommendation(formData) {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }
    
    if (!result.success) {
        throw new Error(result.message || 'Failed to generate recommendation');
    }
    
    return result.data;
}

/**
 * Success message show करता है
 */
function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Error message show करता है
 */
function showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * API Health check - backend available है या नहीं
 */
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Backend is running and healthy');
            return true;
        } else {
            console.error('❌ Backend health check failed');
            return false;
        }
    } catch (error) {
        console.error('❌ Backend is not reachable:', error.message);
        showErrorMessage('Backend server is not running. Please start the server first.');
        return false;
    }
}

/**
 * Destinations को backend से load करता है
 */
async function loadDestinations() {
    try {
        const response = await fetch(`${API_BASE_URL}/destinations`);
        const result = await response.json();
        
        if (result.success && result.data) {
            updateDestinationDropdown(result.data);
            console.log('✅ Destinations loaded from backend');
        }
    } catch (error) {
        console.warn('⚠️ Could not load destinations from backend:', error.message);
        // Use default destinations if backend is not available
    }
}

/**
 * Destination dropdown को update करता है
 */
function updateDestinationDropdown(destinations) {
    const dropdownList = document.getElementById('destination-list');
    
    if (dropdownList && destinations.length > 0) {
        // Clear existing options
        dropdownList.innerHTML = '';
        
        // Add new destinations
        destinations.forEach(dest => {
            const li = document.createElement('li');
            li.textContent = dest.CityName;
            dropdownList.appendChild(li);
        });
        
        // Re-attach click events
        document.querySelectorAll('#destination-list li').forEach(item => {
            item.addEventListener('click', () => {
                const input = document.getElementById('destination-input');
                const dropdown = document.getElementById('destination-list');
                const arrow = document.getElementById('dropdown-arrow');
                
                input.value = item.textContent;
                dropdown.style.display = 'none';
                arrow.style.transform = 'translateY(-50%) rotate(0deg)';
            });
        });
    }
}

/**
 * Page load पर initialize करें
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 ViaItalia Frontend Integration Starting...');
    
    // Check if backend is running
    const isBackendHealthy = await checkBackendHealth();
    
    if (isBackendHealthy) {
        // Load destinations from backend
        await loadDestinations();
        
        // Setup form submission
        setupFormSubmission();
        
        console.log('✅ ViaItalia integration complete!');
    } else {
        console.error('❌ Backend integration failed - please start the backend server');
    }
});

/**
 * Result page के लिए utility function
 * Result.html में recommendation data को display करने के लिए
 */
function loadRecommendationOnResultPage() {
    // यह function Result.html page में use करें
    const recommendationData = localStorage.getItem('travelRecommendation');
    
    if (recommendationData) {
        const recommendation = JSON.parse(recommendationData);
        console.log('📊 Loading recommendation data:', recommendation);
        
        // यहाँ आप अपने Result.html के elements को populate कर सकते हैं
        // Example:
        // document.querySelector('.destination-name').textContent = recommendation.destination.name;
        // document.querySelector('.destination-description').textContent = recommendation.destination.description;
        
        return recommendation;
    } else {
        console.warn('⚠️ No recommendation data found');
        return null;
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateRecommendation,
        loadRecommendationOnResultPage,
        checkBackendHealth
    };
}