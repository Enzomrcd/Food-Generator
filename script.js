document.addEventListener('DOMContentLoaded', function() {
    // ----------------------
    // DOM ELEMENTS
    // ----------------------
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

    // Hamburger menu & navigation
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    // ----------------------
    // HAMBURGER MENU SETUP
    // ----------------------
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            mainNav.classList.toggle('active');
        });
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && event.target !== menuToggle) {
                mainNav.classList.remove('active');
            }
        });
    }

    // ----------------------
    // NAVIGATION SETUP
    // ----------------------
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all links and content sections
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            // Set active link and show corresponding section
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            // Close mobile menu if open
            if (mainNav) mainNav.classList.remove('active');
        });
    });

    // ----------------------
    // SAVED DISHES SETUP
    // ----------------------
    let savedDishes = JSON.parse(localStorage.getItem('savedDishes')) || [];
    renderSavedDishes();

    // ----------------------
    // EVENT LISTENERS
    // ----------------------
    generateButton.addEventListener('click', generateFood);
    saveButton.addEventListener('click', saveCurrentDish);
    donateButton.addEventListener('click', openGCashDonation);

    // Current generated dish (object)
    let currentDish = null;

    // ----------------------
    // FOOD GENERATION FUNCTIONS
    // ----------------------

    function generateFood() {
        const selectedCuisine = cuisineSelect.value;
        const selectedMealType = mealTypeSelect.value;
        const selectedDiet = dietSelect.value;

        // Show loading indicator
        resultPlaceholder.innerHTML = '<i class="fas fa-spinner fa-pulse"></i><p>Finding delicious options for you...</p>';
        resultContent.classList.add('hidden');

        // Simulate delay for a better user experience
        setTimeout(() => {
            const dishes = getMultipleFoodSuggestions(selectedCuisine, selectedMealType, selectedDiet, 3);
            if (dishes && dishes.length > 0) {
                displayMultipleDishes(dishes, selectedCuisine, selectedMealType, selectedDiet);
                // Set first dish as current dish
                currentDish = {
                    name: dishes[0].name,
                    description: dishes[0].description,
                    cuisine: selectedCuisine !== 'any' ? selectedCuisine : 'Various',
                    mealType: selectedMealType !== 'any' ? selectedMealType : 'Any Time',
                    diet: selectedDiet !== 'any' ? selectedDiet : 'No Restrictions',
                    tutorialLink: dishes[0].tutorialLink || null
                };
                saveButton.disabled = false;
            } else {
                resultPlaceholder.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>No dishes found for these criteria. Try different selections.</p>';
                saveButton.disabled = true;
            }
        }, 800);
    }

    /**
     * Enhanced algorithm for getting a food suggestion based on criteria.
     * Relies on foodData, generalDishes, and dietaryDishes being defined (in foodData.js).
     */
    function getFoodSuggestion(cuisine, mealType, diet) {
        // Attempt to match all criteria perfectly
        if (cuisine !== 'any' && mealType !== 'any' && diet !== 'any') {
            if (foodData[cuisine] && foodData[cuisine][mealType] && foodData[cuisine][mealType][diet]) {
                const specificDishes = foodData[cuisine][mealType][diet];
                if (specificDishes && specificDishes.length > 0) {
                    return getRandomDish(specificDishes);
                }
            }
        }
        // Match cuisine and meal type
        if (cuisine !== 'any' && mealType !== 'any') {
            if (foodData[cuisine] && foodData[cuisine][mealType]) {
                if (foodData[cuisine][mealType]['any']) {
                    const dishesAnyDiet = foodData[cuisine][mealType]['any'];
                    if (dishesAnyDiet.length > 0) {
                        return getRandomDish(dishesAnyDiet);
                    }
                }
                let allDishes = [];
                for (const dietType in foodData[cuisine][mealType]) {
                    allDishes = allDishes.concat(foodData[cuisine][mealType][dietType]);
                }
                if (allDishes.length > 0) {
                    return getRandomDish(allDishes);
                }
            }
        }
        // Match cuisine and diet
        if (cuisine !== 'any' && diet !== 'any') {
            let cuisineDietDishes = [];
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
        // Match meal type and diet
        if (mealType !== 'any' && diet !== 'any') {
            let mealDietDishes = [];
            for (const cuisineType in foodData) {
                if (foodData[cuisineType][mealType] && foodData[cuisineType][mealType][diet]) {
                    mealDietDishes = mealDietDishes.concat(foodData[cuisineType][mealType][diet]);
                }
            }
            if (mealDietDishes.length > 0) {
                return getRandomDish(mealDietDishes);
            }
        }
        // Match just cuisine
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
        // Match just meal type
        if (mealType !== 'any') {
            if (generalDishes[mealType] && generalDishes[mealType].length > 0) {
                return getRandomDish(generalDishes[mealType]);
            }
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
        // Match just diet
        if (diet !== 'any') {
            if (dietaryDishes[diet] && dietaryDishes[diet].length > 0) {
                return getRandomDish(dietaryDishes[diet]);
            }
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
        // Fallback: return a random dish from generalDishes
        let allGeneralDishes = [];
        for (const type in generalDishes) {
            allGeneralDishes = allGeneralDishes.concat(generalDishes[type]);
        }
        if (allGeneralDishes.length > 0) {
            return getRandomDish(allGeneralDishes);
        }
        return null;
    }

    function getRandomDish(dishes) {
        const randomIndex = Math.floor(Math.random() * dishes.length);
        return dishes[randomIndex];
    }

    function getMultipleFoodSuggestions(cuisine, mealType, diet, count) {
        const dishes = [];
        const usedNames = new Set();
        for (let i = 0; i < count * 3 && dishes.length < count; i++) {
            const dish = getFoodSuggestion(cuisine, mealType, diet);
            if (dish && !usedNames.has(dish.name)) {
                dishes.push(dish);
                usedNames.add(dish.name);
            }
            if (i >= count * 5 && dishes.length > 0) break;
        }
        return dishes;
    }

    // ----------------------
    // DISPLAY FUNCTIONS
    // ----------------------

    function displayMultipleDishes(dishes, cuisine, mealType, diet) {
        resultContent.innerHTML = '';
        const dishesContainer = document.createElement('div');
        dishesContainer.className = 'dishes-container';

        dishes.forEach((dish, index) => {
            const dishElement = document.createElement('div');
            dishElement.className = 'dish-option';
            dishElement.setAttribute('data-index', index);
            if (index === 0) {
                dishElement.classList.add('active');
            }
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

        resultContent.appendChild(dishesContainer);

        // Attach event listeners for each "Select This Dish" button
        const selectButtons = resultContent.querySelectorAll('.select-dish-btn');
        selectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                selectDish(dishes[index], cuisine, mealType, diet, index);
            });
        });

        resultPlaceholder.classList.add('hidden');
        resultContent.classList.remove('hidden');
    }

    // Legacy display function (if needed)
    function displayDish(dish, cuisine, mealType, diet) {
        resultContent.innerHTML = '';
        const dishElement = document.createElement('div');
        dishElement.className = 'dish-option active';
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
        resultPlaceholder.classList.add('hidden');
        resultContent.classList.remove('hidden');
    }

    // When a dish is selected, update currentDish and highlight it
    function selectDish(dish, cuisine, mealType, diet, selectedIndex) {
        currentDish = {
            name: dish.name,
            description: dish.description,
            cuisine: cuisine !== 'any' ? cuisine : 'Various',
            mealType: mealType !== 'any' ? mealType : 'Any Time',
            diet: diet !== 'any' ? diet : 'No Restrictions',
            tutorialLink: dish.tutorialLink || null
        };

        // Highlight selected dish
        const dishOptions = document.querySelectorAll('.dish-option');
        dishOptions.forEach((option, index) => {
            option.classList.toggle('active', index === selectedIndex);
        });

        saveButton.disabled = false;
    }

    // ----------------------
    // SAVED DISHES FUNCTIONS
    // ----------------------

    function saveCurrentDish() {
        if (!currentDish) return;
        const isDuplicate = savedDishes.some(dish => dish.name === currentDish.name);
        if (!isDuplicate) {
            currentDish.savedAt = new Date().getTime();
            savedDishes.push(currentDish);
            localStorage.setItem('savedDishes', JSON.stringify(savedDishes));
            renderSavedDishes();
            saveButton.innerHTML = '<i class="fas fa-check"></i> Saved!';
            saveButton.classList.add('success');
            setTimeout(() => {
                saveButton.innerHTML = '<i class="fas fa-bookmark"></i> Save This Dish';
                saveButton.classList.remove('success');
            }, 2000);
        } else {
            saveButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Already Saved';
            setTimeout(() => {
                saveButton.innerHTML = '<i class="fas fa-bookmark"></i> Save This Dish';
            }, 2000);
        }
    }

    function renderSavedDishes() {
        savedDishesList.innerHTML = '';
        const sortedDishes = [...savedDishes].sort((a, b) => b.savedAt - a.savedAt);
        if (sortedDishes.length === 0) {
            savedDishesList.innerHTML = '<p class="no-saved-dishes">You haven\'t saved any dishes yet. Generate and save dishes to see them here.</p>';
            return;
        }
        sortedDishes.forEach((dish, index) => {
            const dishElement = document.createElement('div');
            dishElement.className = 'saved-dish';
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
        });

        // Attach delete functionality
        const deleteButtons = document.querySelectorAll('.delete-dish');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteDish(index);
            });
        });
    }

    function deleteDish(index) {
        savedDishes.splice(index, 1);
        localStorage.setItem('savedDishes', JSON.stringify(savedDishes));
        renderSavedDishes();
    }

    // ----------------------
    // DONATION FUNCTION
    // ----------------------
    function openGCashDonation() {
        alert("Redirecting to GCash donation page...");
        // Alternatively: window.open('https://your-donation-page.com', '_blank');
    }

    // ----------------------
    // HELPER FUNCTIONS
    // ----------------------
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function formatDietName(diet) {
        return diet.split('-').map(word => capitalizeFirstLetter(word)).join('-');
    }
});
                    
