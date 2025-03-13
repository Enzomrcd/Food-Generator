// Main script for the Food Generator application
// Enhanced with better algorithm for food suggestions and improved user interactions

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const generateButton = document.getElementById('generateButton');
    const saveButton = document.getElementById('saveButton');
    const donateButton = document.getElementById('donateButton');
    const cuisineSelect = document.getElementById('cuisine');
    const mealTypeSelect = document.getElementById('mealType');
    const dietSelect = document.getElementById('diet');
    const resultContainer = document.getElementById('result');
    const resultPlaceholder = document.querySelector('.result-placeholder');
    const resultContent = document.querySelector('.result-content');
    const foodNameElement = document.getElementById('foodName');
    const foodDescriptionElement = document.getElementById('foodDescription');
    const cuisineTagElement = document.getElementById('cuisineTag');
    const mealTypeTagElement = document.getElementById('mealTypeTag');
    const dietTagElement = document.getElementById('dietTag');
    const savedDishesList = document.getElementById('savedDishesList');
    
    // Setup hamburger menu
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && event.target !== menuToggle) {
                mainNav.classList.remove('active');
            }
        });
    }
    
    // Setup navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Close mobile menu
            mainNav.classList.remove('active');
        });
    });

    // Initialize saved dishes from localStorage
    let savedDishes = JSON.parse(localStorage.getItem('savedDishes')) || [];
    
    // Render saved dishes on page load
    renderSavedDishes();

    // Event listeners
    generateButton.addEventListener('click', generateFood);
    saveButton.addEventListener('click', saveCurrentDish);
    donateButton.addEventListener('click', openGCashDonation);

    // Current generated dish
    let currentDish = null;

    /**
     * Generate multiple food suggestions based on user selections
     */
    function generateFood() {
        // Get user selections
        const selectedCuisine = cuisineSelect.value;
        const selectedMealType = mealTypeSelect.value;
        const selectedDiet = dietSelect.value;

        // Show loading animation
        resultPlaceholder.innerHTML = '<i class="fas fa-spinner fa-pulse"></i><p>Finding delicious options for you...</p>';
        resultContent.classList.add('hidden');
        
        // Simulate delay for better UX
        setTimeout(() => {
            // Generate 3 food suggestions with enhanced algorithm
            const dishes = getMultipleFoodSuggestions(selectedCuisine, selectedMealType, selectedDiet, 3);
            
            if (dishes && dishes.length > 0) {
                displayMultipleDishes(dishes, selectedCuisine, selectedMealType, selectedDiet);
                
                // Set the first dish as the current dish
                if (dishes[0]) {
                    currentDish = {
                        name: dishes[0].name,
                        description: dishes[0].description,
                        cuisine: selectedCuisine !== 'any' ? selectedCuisine : 'Various',
                        mealType: selectedMealType !== 'any' ? selectedMealType : 'Any Time',
                        diet: selectedDiet !== 'any' ? selectedDiet : 'No Restrictions',
                        tutorialLink: dishes[0].tutorialLink || null
                    };
                }
                
                // Enable save button
                saveButton.disabled = false;
            } else {
                // No dishes found
                resultPlaceholder.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>No dishes found for these criteria. Try different selections.</p>';
                saveButton.disabled = true;
            }
        }, 800);
    }

    /**
     * Enhanced algorithm for finding food suggestions based on user criteria
     */
    function getFoodSuggestion(cuisine, mealType, diet) {
        // Try to find a dish that matches all criteria perfectly
        if (cuisine !== 'any' && mealType !== 'any' && diet !== 'any') {
            if (foodData[cuisine] && 
                foodData[cuisine][mealType] && 
                foodData[cuisine][mealType][diet]) {
                
                const specificDishes = foodData[cuisine][mealType][diet];
                if (specificDishes && specificDishes.length > 0) {
                    return getRandomDish(specificDishes);
                }
            }
        }
        
        // Try to find a dish that matches cuisine and meal type
        if (cuisine !== 'any' && mealType !== 'any') {
            if (foodData[cuisine] && foodData[cuisine][mealType]) {
                // Try to use 'any' diet for this cuisine and meal type
                if (foodData[cuisine][mealType]['any']) {
                    const cuisineMealDishes = foodData[cuisine][mealType]['any'];
                    if (cuisineMealDishes.length > 0) {
                        return getRandomDish(cuisineMealDishes);
                    }
                }
                
                // If there's no 'any' category, just get a random dish from this cuisine and meal type
                // by getting all dishes from all diet types
                let allDishes = [];
                for (const dietType in foodData[cuisine][mealType]) {
                    allDishes = allDishes.concat(foodData[cuisine][mealType][dietType]);
                }
                
                if (allDishes.length > 0) {
                    return getRandomDish(allDishes);
                }
            }
        }
        
        // Try to find a dish that matches cuisine and diet
        if (cuisine !== 'any' && diet !== 'any') {
            let cuisineDietDishes = [];
            
            // Look through all meal types for this cuisine and diet
            if (foodData[cuisine]) {
                for (const type in foodData[cuisine]) {
                    if (foodData[cuisine][type][diet]) {
                        cuisineDietDishes = cuisineDietDishes.concat(foodData[cuisine][type][diet]);
                    }
                }
                
                if (cuisineDietDishes.length > 0) {
                    return getRandomDish(cuisineDietDishes);
                }
            }
        }
        
        // Try to find a dish that matches meal type and diet
        if (mealType !== 'any' && diet !== 'any') {
            let mealDietDishes = [];
            
            // Look through all cuisines for this meal type and diet
            for (const cuisineType in foodData) {
                if (foodData[cuisineType][mealType] && foodData[cuisineType][mealType][diet]) {
                    mealDietDishes = mealDietDishes.concat(foodData[cuisineType][mealType][diet]);
                }
            }
            
            if (mealDietDishes.length > 0) {
                return getRandomDish(mealDietDishes);
            }
        }
        
        // Try to find a dish that matches just the cuisine
        if (cuisine !== 'any' && foodData[cuisine]) {
            let cuisineDishes = [];
            
            for (const type in foodData[cuisine]) {
                for (const dietType in foodData[cuisine][type]) {
                    cuisineDishes = cuisineDishes.concat(foodData[cuisine][type][dietType]);
                }
            }
            
            if (cuisineDishes.length > 0) {
                return getRandomDish(cuisineDishes);
            }
        }
        
        // Try to find a dish that matches just the meal type
        if (mealType !== 'any') {
            // Check general dishes for this meal type
            if (generalDishes[mealType] && generalDishes[mealType].length > 0) {
                return getRandomDish(generalDishes[mealType]);
            }
            
            // If no general dishes, look through all cuisines for this meal type
            let mealTypeDishes = [];
            
            for (const cuisineType in foodData) {
                if (foodData[cuisineType][mealType]) {
                    for (const dietType in foodData[cuisineType][mealType]) {
                        mealTypeDishes = mealTypeDishes.concat(foodData[cuisineType][mealType][dietType]);
                    }
                }
            }
            
            if (mealTypeDishes.length > 0) {
                return getRandomDish(mealTypeDishes);
            }
        }
        
        // Try to find a dish that matches just the diet
        if (diet !== 'any') {
            // Check dietary-specific dishes
            if (dietaryDishes[diet] && dietaryDishes[diet].length > 0) {
                return getRandomDish(dietaryDishes[diet]);
            }
            
            // Look through all cuisines and meal types for this diet
            let dietDishes = [];
            
            for (const cuisineType in foodData) {
                for (const type in foodData[cuisineType]) {
                    if (foodData[cuisineType][type][diet]) {
                        dietDishes = dietDishes.concat(foodData[cuisineType][type][diet]);
                    }
                }
            }
            
            if (dietDishes.length > 0) {
                return getRandomDish(dietDishes);
            }
        }
        
        // If nothing specific was found, return a random general dish
        let allGeneralDishes = [];
        for (const type in generalDishes) {
            allGeneralDishes = allGeneralDishes.concat(generalDishes[type]);
        }
        
        if (allGeneralDishes.length > 0) {
            return getRandomDish(allGeneralDishes);
        }
        
        // If we somehow got here, there are no dishes available
        return null;
    }

    /**
     * Helper function to get a random dish from an array
     */
    function getRandomDish(dishes) {
        const randomIndex = Math.floor(Math.random() * dishes.length);
        return dishes[randomIndex];
    }

    /**
     * Get multiple food suggestions based on criteria
     */
    function getMultipleFoodSuggestions(cuisine, mealType, diet, count) {
        const dishes = [];
        const usedNames = new Set(); // To track unique dishes
        
        // Try to get unique dishes
        for (let i = 0; i < count * 3 && dishes.length < count; i++) {
            const dish = getFoodSuggestion(cuisine, mealType, diet);
            if (dish && !usedNames.has(dish.name)) {
                dishes.push(dish);
                usedNames.add(dish.name);
            }
            
            // If we've tried too many times and can't find enough unique dishes, break
            if (i >= count * 5 && dishes.length > 0) break;
        }
        
        return dishes;
    }

    /**
     * Display multiple dishes in the UI
     */
    function displayMultipleDishes(dishes, cuisine, mealType, diet) {
        // Clear existing content
        resultContent.innerHTML = '';
        
        // Create container for multiple dishes
        const dishesContainer = document.createElement('div');
        dishesContainer.className = 'dishes-container';
        
        // Add each dish
        dishes.forEach((dish, index) => {
            const dishElement = document.createElement('div');
            dishElement.className = 'dish-option';
            dishElement.setAttribute('data-index', index);
            
            // Add active class to first dish
            if (index === 0) {
                dishElement.classList.add('active');
            }
            
            // Create HTML for dish
            const tutorialButton = dish.tutorialLink 
                ? `<a href="${dish.tutorialLink}" target="_blank" class="tutorial-link"><i class="fas fa-video"></i> Watch Tutorial</a>` 
                : '';
                
            dishElement.innerHTML = `
                <h3 class="dish-name">${dish.name}</h3>
                <p class="dish-description">${dish.description}</p>
                <div class="dish-tags">
                    <span class="tag">${cuisine !== 'any' ? capitalizeFirstLetter(cuisine) : 'Various Cuisines'}</span>
                    <span class="tag">${mealType !== 'any' ? capitalizeFirstLetter(mealType) : 'Any Time'}</span>
                    <span class="tag">${diet !== 'any' ? formatDietName(diet) : 'No Restrictions'}</span>
                </div>
                ${tutorialButton}
                <button class="select-dish-btn" data-index="${index}">Select This Dish</button>
            `;
            
            dishesContainer.appendChild(dishElement);
        });
        
        // Add container to result content
        resultContent.appendChild(dishesContainer);
        
        // Add event listeners for select buttons
        const selectButtons = resultContent.querySelectorAll('.select-dish-btn');
        selectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                selectDish(dishes[index], cuisine, mealType, diet);
            });
        });
        
        // Show content, hide placeholder
        resultPlaceholder.classList.add('hidden');
        resultContent.classList.remove('hidden');
    }
    
    /**
     * Select a specific dish from the options
     */
    function selectDish(dish, cuisine, mealType, diet) {
        // Update current dish
        currentDish = {
            name: dish.name,
            description: dish.description,
            cuisine: cuisine !== 'any' ? cuisine : 'Various',
            mealType: mealType !== 'any' ? mealType : 'Any Time',
            diet: diet !== 'any' ? diet : 'No Restrictions',
            tutorialLink: dish.tutorialLink || null
        };
        
        // Highlight the selected dish
        const dishOptions = document.querySelectorAll('.dish-option');
        dishOptions.forEach(option => {
            option.classList.remove('active');
            if (parseInt(option.getAttribute('data-index')) === parseInt(event.target.getAttribute('data-index'))) {
                option.classList.add('active');
            }
        });
        
        // Enable save button
        saveButton.disabled = false;
    }
    
    /**
     * Display a single dish in the UI (legacy function kept for compatibility)
     */
    function displayDish(dish, cuisine, mealType, diet) {
        // Create a single dish display
        resultContent.innerHTML = '';
        
        const dishElement = document.createElement('div');
        dishElement.className = 'dish-option active';
        
        // Add tutorial link if available
        const tutorialButton = dish.tutorialLink 
            ? `<a href="${dish.tutorialLink}" target="_blank" class="tutorial-link"><i class="fas fa-video"></i> Watch Tutorial</a>` 
            : '';
            
        dishElement.innerHTML = `
            <h3 class="dish-name">${dish.name}</h3>
            <p class="dish-description">${dish.description}</p>
            <div class="dish-tags">
                <span class="tag">${cuisine !== 'any' ? capitalizeFirstLetter(cuisine) : 'Various Cuisines'}</span>
                <span class="tag">${mealType !== 'any' ? capitalizeFirstLetter(mealType) : 'Any Time'}</span>
                <span class="tag">${diet !== 'any' ? formatDietName(diet) : 'No Restrictions'}</span>
            </div>
            ${tutorialButton}
        `;
        
        resultContent.appendChild(dishElement);
        
        // Show content, hide placeholder
        resultPlaceholder.classList.add('hidden');
        resultContent.classList.remove('hidden');
    }

    /**
     * Save the current dish to localStorage
     */
    function saveCurrentDish() {
        if (!currentDish) return;
        
        // Check if this dish is already saved (by name)
        const isDuplicate = savedDishes.some(dish => dish.name === currentDish.name);
        
        if (!isDuplicate) {
            // Add timestamp for sorting purposes
            currentDish.savedAt = new Date().getTime();
            
            // Add to saved dishes
            savedDishes.push(currentDish);
            
            // Save to localStorage
            localStorage.setItem('savedDishes', JSON.stringify(savedDishes));
            
            // Update UI
            renderSavedDishes();
            
            // Visual feedback
            saveButton.innerHTML = '<i class="fas fa-check"></i> Saved!';
            saveButton.classList.add('success');
            
            setTimeout(() => {
                saveButton.innerHTML = '<i class="fas fa-bookmark"></i> Save This Dish';
                saveButton.classList.remove('success');
            }, 2000);
        } else {
            // Already saved feedback
            saveButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Already Saved';
            
            setTimeout(() => {
                saveButton.innerHTML = '<i class="fas fa-bookmark"></i> Save This Dish';
            }, 2000);
        }
    }

    /**
     * Render saved dishes in the UI
     */
    function renderSavedDishes() {
        // Clear existing dishes
        savedDishesList.innerHTML = '';
        
        // Sort dishes by saved time (newest first)
        const sortedDishes = [...savedDishes].sort((a, b) => b.savedAt - a.savedAt);
        
        if (sortedDishes.length === 0) {
            savedDishesList.innerHTML = '<p class="no-saved-dishes">You haven\'t saved any dishes yet. Generate and save dishes to see them here.</p>';
            return;
        }
        
        // Add each dish to the UI
        sortedDishes.forEach((dish, index) => {
            const dishElement = document.createElement('div');
            dishElement.className = 'saved-dish';
            // Add tutorial link if available
            const tutorialButton = dish.tutorialLink 
                ? `<a href="${dish.tutorialLink}" target="_blank" class="tutorial-link"><i class="fas fa-video"></i> Watch Tutorial</a>` 
                : '';
                
            dishElement.innerHTML = `
                <h4>${dish.name}</h4>
                <p>${dish.description}</p>
                <div class="food-tags">
                    <span class="tag">${dish.cuisine}</span>
                    <span class="tag">${dish.mealType}</span>
                    <span class="tag">${dish.diet}</span>
                </div>
                ${tutorialButton}
                <button class="delete-dish" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            
            savedDishesList.appendChild(dishElement);
            
            // Add event listener to delete button
            const deleteButton = dishElement.querySelector('.delete-dish');
            deleteButton.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteSavedDish(index);
            });
        });
    }

    /**
     * Delete a saved dish by index
     */
    function deleteSavedDish(index) {
        // Remove the dish
        savedDishes.splice(index, 1);
        
        // Save to localStorage
        localStorage.setItem('savedDishes', JSON.stringify(savedDishes));
        
        // Update UI
        renderSavedDishes();
    }

    /**
     * Helper function to capitalize the first letter of a string
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Format diet name for display (handles hyphenated names)
     */
    function formatDietName(diet) {
        // Split by hyphens and capitalize each word
        return diet.split('-')
            .map(word => capitalizeFirstLetter(word))
            .join('-');
    }
    
    /**
     * Open GCash donation modal with QR code
     * You can customize this with your actual GCash details
     */
    function openGCashDonation() {
        // Your GCash number (replace with your actual GCash number)
        const gcashNumber = "09853754712"; // Replace with your actual GCash number
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'gcash-modal';
        
        // Add content to modal
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>Support CulinaryCompass</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Thank you for supporting CulinaryCompass! Your donation helps us continue developing and improving this tool.</p>
                <div class="gcash-info">
                    <p>GCash Number: <strong>${gcashNumber}</strong></p>
                    <div class="qr-code-container">
                        <img src="gcash.jpeg" alt="GCash QR Code" class="gcash-qr">
                        <p class="qr-caption">Scan QR code to donate</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="open-gcash-app">Open GCash App</button>
            </div>
        `;
        
        // Add modal to body
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Event listener for close button
        const closeBtn = modalContent.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });
        
        // Event listener for clicking outside the modal
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });
        
        // Event listener for open app button
        const openAppBtn = modalContent.querySelector('.open-gcash-app');
        openAppBtn.addEventListener('click', () => {
            // Check if user is on mobile
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                // Attempt to open GCash app
                window.location.href = `gcash://fund_transfer?fund_transfer=${gcashNumber}`;
                
                // Fallback for iOS if the deep link doesn't work
                setTimeout(() => {
                    if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
                        window.location.href = "https://apps.apple.com/ph/app/gcash/id519786303";
                    }
                }, 1000);
            } else {
                alert("This feature works best on mobile devices with the GCash app installed.");
            }
        });
    }
});
