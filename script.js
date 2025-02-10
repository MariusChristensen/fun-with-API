document
  .getElementById("generateBtn")
  .addEventListener("click", getRandomRecipe);

async function getRandomRecipe() {
  const button = document.getElementById("generateBtn");
  button.disabled = true;
  button.textContent = "Finding something tasty...";

  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();
    const recipe = data.meals[0];
    displayRecipe(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
  } finally {
    button.disabled = false;
    button.textContent = "Surprise Me!";
  }
}

function displayRecipe(recipe) {
  // Display recipe name
  document.getElementById("recipeName").textContent = recipe.strMeal;

  // Handle image display
  const recipeImage = document.getElementById("recipeImage");
  const existingFallback = document.querySelector(".image-fallback");

  // Remove any existing fallback
  if (existingFallback) {
    existingFallback.remove();
  }

  // Reset image display and set new source
  recipeImage.style.display = "block";
  recipeImage.src = recipe.strMealThumb;

  displayIngredients(recipe);
  displayInstructions(recipe);
}

function displayIngredients(recipe) {
  const ingredientsList = document.getElementById("ingredientsList");
  ingredientsList.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = `${measure} ${ingredient}`;
      ingredientsList.appendChild(li);
    }
  }
}

function displayInstructions(recipe) {
  const instructions = document.getElementById("instructions");
  instructions.innerHTML = "";

  // Split instructions into steps using multiple patterns
  const instructionText = recipe.strInstructions
    .replace(/(\d+\.\s)/g, "|||$1") // Mark numbered steps
    .replace(/([.!?]+)\s+(?=[A-Z])/g, "$1|||") // Split on end punctuation followed by capital letter
    .split("|||")
    .filter((step) => {
      const cleanStep = step.replace(/^\d+\.\s*/, "").trim();
      return cleanStep.length > 2 && !/^[.\s]*$/.test(cleanStep);
    })
    .map((step) => step.trim());

  // Create ordered list for steps
  const ol = document.createElement("ol");
  let stepNumber = 1;

  instructionText.forEach((step) => {
    const cleanStep = step.replace(/^\d+\.\s*/, "").trim();
    if (cleanStep && cleanStep.length > 2 && !/^[.\s]*$/.test(cleanStep)) {
      const li = document.createElement("li");
      li.textContent = cleanStep;
      ol.appendChild(li);
      stepNumber++;
    }
  });

  // If no valid steps were found, display the original text
  if (stepNumber === 1) {
    const li = document.createElement("li");
    li.textContent = recipe.strInstructions;
    ol.appendChild(li);
  }

  instructions.appendChild(ol);
}

// Handle image errors
document.getElementById("recipeImage").onerror = function () {
  this.style.display = "none";

  // Remove any existing fallback first
  const existingFallback = document.querySelector(".image-fallback");
  if (existingFallback) {
    existingFallback.remove();
  }

  // Add new fallback
  const fallbackText = document.createElement("div");
  fallbackText.className = "image-fallback";
  fallbackText.innerHTML = "🍳";
  this.parentNode.appendChild(fallbackText);
};

// Add keyboard shortcut
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();
    getRandomRecipe();
  }
});

// Generate initial recipe
getRandomRecipe();
