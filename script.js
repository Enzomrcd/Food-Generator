// Main script for the Food Generator application
// Enhanced with better algorithm for food suggestions and improved user interactions

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const generateButton = document.getElementById('generateButton');
    const saveButton = document.getElementById('saveButton');
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

    // Initialize saved dishes from localStorage
    let savedDishes = JSON.parse(localStorage.getItem('savedDishes')) || [];
    
    // Render saved dishes on page load
    renderSavedDishes();

    // Event listeners
    generateButton.addEventListener('click', generateFood);
    saveButton.addEventListener('click', saveCurrentDish);

    // Current generated dish
    let currentDish = null;

    /**
     * Generate a food suggestion based on user selections
     */
    function generateFood() {
        // Get user selections
        const selectedCuisine = cuisineSelect.value;
        const selectedMealType = mealTypeSelect.value;
        const selectedDiet = dietSelect.value;

        // Show loading animation
        resultPlaceholder.innerHTML = '<i class="fas fa-spinner fa-pulse"></i><p>Finding the perfect dish...</p>';
        resultContent.classList.add('hidden');
        
        // Simulate delay for better UX
        setTimeout(() => {
            // Generate food suggestion with enhanced algorithm
            const dish = getFoodSuggestion(selectedCuisine, selectedMealType, selectedDiet);
            
            if (dish) {
                displayDish(dish, selectedCuisine, selectedMealType, selectedDiet);
                currentDish = {
                    name: dish.name,
                    description: dish.description,
                    cuisine: selectedCuisine !== 'any' ? selectedCuisine : 'Various',
                    mealType: selectedMealType !== 'any' ? selectedMealType : 'Any Time',
                    diet: selectedDiet !== 'any' ? selectedDiet : 'No Restrictions'
                };
                
                // Enable save button
                saveButton.disabled = false;
            } else {
                // No dish found
                resultPlaceholder.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>No dish found for these criteria. Try different selections.</p>';
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
     * Display the dish in the UI
     */
    function displayDish(dish, cuisine, mealType, diet) {
        // Update dish information
        foodNameElement.textContent = dish.name;
        foodDescriptionElement.textContent = dish.description;
        
        // Update tags
        cuisineTagElement.textContent = cuisine !== 'any' ? capitalizeFirstLetter(cuisine) : 'Various Cuisines';
        mealTypeTagElement.textContent = mealType !== 'any' ? capitalizeFirstLetter(mealType) : 'Any Time';
        dietTagElement.textContent = diet !== 'any' ? formatDietName(diet) : 'No Restrictions';
        
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
            dishElement.innerHTML = `
                <h4>${dish.name}</h4>
                <p>${dish.description}</p>
                <div class="food-tags">
                    <span class="tag">${dish.cuisine}</span>
                    <span class="tag">${dish.mealType}</span>
                    <span class="tag">${dish.diet}</span>
                </div>
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
});
