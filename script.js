document.addEventListener("DOMContentLoaded", function () {
  // --------------------------------------------------
  // Food Idea Generator Code
  // --------------------------------------------------
  // Database of common ingredients with categories
  const ingredientDatabase = [
    { name: "Flour", category: "basics" },
    { name: "Sugar", category: "basics" },
    { name: "Salt", category: "basics" },
    { name: "Eggs", category: "basics" },
    { name: "Milk", category: "dairy" },
    { name: "Butter", category: "dairy" },
    { name: "Olive Oil", category: "basics" },
    { name: "Chicken", category: "proteins" },
    { name: "Beef", category: "proteins" },
    { name: "Pork", category: "proteins" },
    { name: "Fish", category: "proteins" },
    { name: "Tofu", category: "proteins" },
    { name: "Rice", category: "basics" },
    { name: "Pasta", category: "basics" },
    { name: "Tomatoes", category: "produce" },
    { name: "Onions", category: "produce" },
    { name: "Garlic", category: "produce" },
    { name: "Potatoes", category: "produce" },
    { name: "Carrots", category: "produce" },
    { name: "Bell Peppers", category: "produce" },
    { name: "Lettuce", category: "produce" },
    { name: "Spinach", category: "produce" },
    { name: "Cheese", category: "dairy" },
    { name: "Yogurt", category: "dairy" },
    { name: "Cream", category: "dairy" },
    { name: "Bread", category: "basics" },
    { name: "Baking Powder", category: "baking" },
    { name: "Baking Soda", category: "baking" },
    { name: "Vanilla Extract", category: "baking" },
    { name: "Chocolate", category: "baking" },
    { name: "Cocoa Powder", category: "baking" },
    { name: "Honey", category: "condiments" },
    { name: "Lemon", category: "produce" },
    { name: "Lime", category: "produce" },
    { name: "Soy Sauce", category: "condiments" },
    { name: "Vinegar", category: "condiments" },
    { name: "Mustard", category: "condiments" },
    { name: "Ketchup", category: "condiments" },
    { name: "Mayonnaise", category: "condiments" },
    { name: "Water", category: "basics" }
  ];

  // Extract common ingredient names for later comparison
  const commonIngredients = ingredientDatabase.map(item => item.name);

  // Database of recipes with required ingredients
  const recipeDatabase = [
    {
      name: "Simple Chocolate Cake",
      ingredients: ["Flour", "Sugar", "Eggs", "Butter", "Chocolate", "Baking Powder", "Milk"],
      description: "A delicious chocolate cake that's perfect for any occasion."
    },
    {
      name: "Basic Bread",
      ingredients: ["Flour", "Water", "Salt", "Yeast"],
      description: "A simple bread recipe that works every time."
    },
    {
      name: "Chocolate Chip Cookies",
      ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Chocolate", "Baking Soda", "Vanilla Extract"],
      description: "Classic chocolate chip cookies that everyone loves."
    },
    {
      name: "Pancakes",
      ingredients: ["Flour", "Eggs", "Milk", "Butter", "Baking Powder", "Sugar"],
      description: "Fluffy pancakes perfect for breakfast."
    },
    {
      name: "Simple Pasta Dish",
      ingredients: ["Pasta", "Tomatoes", "Garlic", "Olive Oil", "Salt"],
      description: "A quick and easy pasta dish."
    },
    {
      name: "Basic Omelette",
      ingredients: ["Eggs", "Milk", "Salt", "Butter"],
      description: "A versatile omelette that you can customize."
    },
    {
      name: "Chocolate Brownies",
      ingredients: ["Flour", "Sugar", "Eggs", "Butter", "Chocolate", "Baking Powder"],
      description: "Rich and fudgy chocolate brownies."
    },
    {
      name: "Garlic Bread",
      ingredients: ["Bread", "Butter", "Garlic", "Salt"],
      description: "Delicious garlic bread to accompany any meal."
    },
    {
      name: "Chocolate Milkshake",
      ingredients: ["Milk", "Chocolate", "Sugar"],
      description: "A refreshing chocolate milkshake."
    },
    {
      name: "Tomato Soup",
      ingredients: ["Tomatoes", "Onions", "Garlic", "Olive Oil", "Water", "Salt"],
      description: "A comforting tomato soup for cold days."
    },
    {
      name: "Chocolate Truffles",
      ingredients: ["Chocolate", "Butter", "Sugar"],
      description: "Simple but elegant chocolate truffles."
    },
    {
      name: "Quick Flatbread",
      ingredients: ["Flour", "Water", "Salt", "Olive Oil"],
      description: "A versatile flatbread that cooks in minutes."
    },
    {
      name: "Basic Muffins",
      ingredients: ["Flour", "Sugar", "Eggs", "Milk", "Butter", "Baking Powder"],
      description: "Simple muffins that you can add your own flavors to."
    }
  ];

  // -------------------------------
  // DOM Elements for Food Generator
  // -------------------------------
  const ingredientsList = document.getElementById("ingredients-list");
  const selectedIngredientsDisplay = document.getElementById("selected-list");
  const customIngredientInput = document.getElementById("custom-ingredient");
  const addIngredientBtn = document.getElementById("add-ingredient-btn");
  const generateBtn = document.getElementById("generate-btn");
  const resultsContainer = document.getElementById("results-container");
  const noResultsMessage = document.getElementById("no-results");
  const ingredientSearchInput = document.getElementById("ingredient-search");
  const categoryTabs = document.querySelectorAll(".category-tab");

  // -------------------------------
  // Variables for tracking state
  // -------------------------------
  let selectedIngredients = [];
  let activeCategory = "all";
  let searchTerm = "";

  // Load ingredients into the list based on active category and search term
  function loadIngredients() {
    ingredientsList.innerHTML = "";

    const filteredIngredients = ingredientDatabase.filter(ingredient => {
      const matchesCategory = activeCategory === "all" || ingredient.category === activeCategory;
      const matchesSearch = searchTerm === "" || ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    filteredIngredients.sort((a, b) => a.name.localeCompare(b.name));

    filteredIngredients.forEach(ingredient => {
      const item = document.createElement("div");
      item.className = "ingredient-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `ing-${ingredient.name.toLowerCase().replace(/\s/g, "-")}`;
      checkbox.value = ingredient.name;
      checkbox.addEventListener("change", updateSelectedIngredients);

      if (selectedIngredients.includes(ingredient.name)) {
        checkbox.checked = true;
      }

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = ingredient.name;

      item.appendChild(checkbox);
      item.appendChild(label);
      ingredientsList.appendChild(item);
    });

    if (filteredIngredients.length === 0) {
      const noResultsDiv = document.createElement("div");
      noResultsDiv.textContent = "No ingredients found. Try a different search or category.";
      noResultsDiv.style.padding = "1rem";
      noResultsDiv.style.color = "#666";
      ingredientsList.appendChild(noResultsDiv);
    }
  }

  // Update the display of selected ingredients
  function updateSelectedIngredients() {
    selectedIngredients = Array.from(
      document.querySelectorAll("#ingredients-list input[type='checkbox']:checked")
    ).map(checkbox => checkbox.value);

    if (selectedIngredients.length > 0) {
      selectedIngredientsDisplay.innerHTML = "";
      selectedIngredients.forEach(ingredient => {
        const tag = document.createElement("span");
        tag.className = "selected-tag";
        tag.textContent = ingredient;

        const removeBtn = document.createElement("span");
        removeBtn.textContent = " ×";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.marginLeft = "3px";
        removeBtn.addEventListener("click", () => {
          const checkbox = document.getElementById(`ing-${ingredient.toLowerCase().replace(/\s/g, "-")}`);
          if (checkbox) {
            checkbox.checked = false;
          }
          updateSelectedIngredients();
        });

        tag.appendChild(removeBtn);
        selectedIngredientsDisplay.appendChild(tag);
      });
    } else {
      selectedIngredientsDisplay.innerHTML = "None selected yet";
    }

    loadIngredients();
  }

  // Add a custom ingredient entered by the user
  function addCustomIngredient() {
    const ingredientName = customIngredientInput.value.trim();
    if (ingredientName && !commonIngredients.includes(ingredientName)) {
      ingredientDatabase.push({
        name: ingredientName,
        category: "basics"
      });
      commonIngredients.push(ingredientName);
      selectedIngredients.push(ingredientName);

      loadIngredients();
      updateSelectedIngredients();
      customIngredientInput.value = "";

      const successMsg = document.createElement("span");
      successMsg.textContent = `Added ${ingredientName}!`;
      successMsg.style.color = "green";
      successMsg.style.marginLeft = "10px";
      const customIngredientContainer = document.querySelector(".custom-ingredient");
      customIngredientContainer.appendChild(successMsg);

      setTimeout(() => {
        if (customIngredientContainer.contains(successMsg)) {
          customIngredientContainer.removeChild(successMsg);
        }
      }, 2000);
    }
  }

  // Generate food ideas based on the selected ingredients
  function generateFoodIdeas() {
    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient");
      return;
    }

    const possibleRecipes = [];

    recipeDatabase.forEach(recipe => {
      const requiredIngredients = recipe.ingredients;
      const missingIngredients = requiredIngredients.filter(
        ingredient => !selectedIngredients.includes(ingredient)
      );
      const matchPercentage =
        ((requiredIngredients.length - missingIngredients.length) / requiredIngredients.length) * 100;

      if (matchPercentage > 0) {
        possibleRecipes.push({
          ...recipe,
          matchPercentage,
          missing: missingIngredients
        });
      }
    });

    possibleRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
    displayResults(possibleRecipes);
  }

  // Display recipe results on the page
  function displayResults(recipes) {
    resultsContainer.innerHTML = "";

    if (recipes.length === 0) {
      noResultsMessage.style.display = "block";
      return;
    }

    noResultsMessage.style.display = "none";

    recipes.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";

      const matchSpan = document.createElement("span");
      matchSpan.className = "recipe-match";
      matchSpan.textContent = `${Math.round(recipe.matchPercentage)}% Match`;

      const title = document.createElement("h3");
      title.className = "recipe-title";
      title.textContent = recipe.name;

      const ingredientsDiv = document.createElement("div");
      ingredientsDiv.className = "recipe-ingredients";
      ingredientsDiv.innerHTML = `<strong>Required:</strong> ${recipe.ingredients.join(", ")}`;

      const description = document.createElement("p");
      description.textContent = recipe.description;

      const missing = document.createElement("p");
      if (recipe.missing.length > 0) {
        missing.innerHTML = `<strong>Missing:</strong> ${recipe.missing.join(", ")}`;
      } else {
        missing.innerHTML = "<strong>Yay you have all the ingredients!</strong>";
      }

      card.appendChild(matchSpan);
      card.appendChild(title);
      card.appendChild(ingredientsDiv);
      card.appendChild(description);
      card.appendChild(missing);

      resultsContainer.appendChild(card);
    });
  }

  // -------------------------------
  // Event Listeners for Food Generator
  // -------------------------------
  addIngredientBtn.addEventListener("click", addCustomIngredient);
  customIngredientInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addCustomIngredient();
    }
  });
  generateBtn.addEventListener("click", generateFoodIdeas);
  ingredientSearchInput.addEventListener("input", () => {
    searchTerm = ingredientSearchInput.value;
    loadIngredients();
  });
  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeCategory = tab.getAttribute("data-category");
      loadIngredients();
    });
  });

  // Initial load
  loadIngredients();
  updateSelectedIngredients();

  // --------------------------------------------------
  // GCash Donation Feature Code
  // --------------------------------------------------
  // These elements are part of the Donation Section in your HTML.
  const donateBtn = document.getElementById("donate-btn");
  const donationModal = document.getElementById("donation-modal");
  const donationClose = document.getElementById("donation-close");

  if (donateBtn && donationModal && donationClose) {
    donateBtn.addEventListener("click", function () {
      donationModal.style.display = "block"; // Show the modal
    });

    donationClose.addEventListener("click", function () {
      donationModal.style.display = "none"; // Hide the modal
    });

    window.addEventListener("click", function (event) {
      if (event.target === donationModal) {
        donationModal.style.display = "none"; // Hide modal if clicked outside
      }
    });
  }
});
