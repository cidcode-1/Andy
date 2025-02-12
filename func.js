document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    
    const searchButton = document.querySelector(".searchbutton");
    const searchInput = document.querySelector(".searchs");

    if (searchButton) {
        searchButton.addEventListener("click", fetchData);
    } else {
        console.error(" Error: .searchbutton not found!");
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                fetchData();
            }
        });
    } else {
        console.error(" Error: .searchs input field not found!");

    }

    document.addEventListener("DOMContentLoaded", function () {
        const searchInput = document.querySelector(".searchs");
        const searchButton = document.querySelector(".searchbutton");
    
       
        searchButton.addEventListener("click", fetchData);
    
        
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                fetchData();
            }
        });
    });
    
    async function fetchData() {
        try {
            const searchfoods = document.querySelector(".searchs").value.trim().toLowerCase();
    
            if (!searchfoods) {
                alert("Please enter a search term.");
                return;
            }
    
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchfoods}`);
    
            if (!response.ok) {
                throw new Error("Could not fetch resource");
            }
    
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    function displayResults(data) {
        const heroImage = document.querySelector(".hero-image-wrapper img");
        const foodName = document.querySelector(".title");
        const foodDescription = document.querySelector(".details");
        const recipeButton = document.querySelector(".buttonfav");
    
        if (data.meals) {
            const firstMeal = data.meals[0];
    
            heroImage.src = firstMeal.strMealThumb;
            heroImage.alt = firstMeal.strMeal;
            foodName.textContent = firstMeal.strMeal;
    
            
            const shortInstructions = firstMeal.strInstructions.substring(0, 200) + "...";
            foodDescription.innerHTML = `${shortInstructions} <a href="#" class="see-more">See More</a>`;
    
            // "See More" event (show full instructions)
            document.querySelector(".see-more").addEventListener("click", function (event) {
                event.preventDefault();
                foodDescription.innerHTML = firstMeal.strInstructions;
            });
    
            // "See Recipe" button event (replace details with ingredients)
            recipeButton.addEventListener("click", function (event) {
                event.preventDefault();
                foodDescription.innerHTML = generateIngredientsList(firstMeal);
            });
        } else {
            heroImage.src = "imgs/default.png";
            heroImage.alt = "No Meal Found";
            foodName.textContent = "No Results Found";
            foodDescription.textContent = "Sorry, no meal found for your search.";
        }
    }
    
    
    function generateIngredientsList(meal) {
        let ingredientsList = "<h3>Ingredients:</h3><ul>";
    
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
    
            if (ingredient && ingredient.trim() !== "") {
                ingredientsList += `<li>${measure} ${ingredient}</li>`;
            }
        }
    
        ingredientsList += "</ul>";
        return ingredientsList;
    }
    
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menuCloseButton = document.querySelector("#menu-close-button");

    if (menuOpenButton && menuCloseButton) {
        menuOpenButton.addEventListener("click", () => {
            document.body.classList.toggle("show-mobile-menu");
        });

        menuCloseButton.addEventListener("click", () => {
            document.body.classList.remove("show-mobile-menu");
        });
    } else {
        console.error(" Error: Menu buttons not found!");
    }

    fetchCategories();

  
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (category) {
        const categoryTitle = document.getElementById("category-title");
        if (categoryTitle) {
            categoryTitle.textContent = category;
            fetchMealsByCategory(category);
        } else {
            console.error(" Error: #category-title not found!");
        }
    } else {
        console.error(" No category found in the URL!");
    }
});


async function fetchData() {
    try {
        const searchfoods = document.querySelector(".searchs").value.trim().toLowerCase();

        if (!searchfoods) {
            alert("Please enter a search term.");
            return;
        }

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchfoods}`);
        if (!response.ok) throw new Error("Could not fetch resource");

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error(" Error fetching data:", error);
    }
}


async function fetchCategories() {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        console.log(" Fetched Categories:", data.categories);

        const categoryContainer = document.getElementById("category-container");
        if (!categoryContainer) {
            console.error(" Error: #category-container not found!");
            return;
        }

        categoryContainer.innerHTML = ""; // Clear previous content

        data.categories.forEach(category => {
            const categoryCard = document.createElement("div");
            categoryCard.classList.add("category-card");

            categoryCard.innerHTML = `
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                <h3>${category.strCategory}</h3>
                <p>${category.strCategoryDescription.substring(0, 100)}...</p>
            `;

            categoryCard.addEventListener("click", () => {
                console.log("🔹 Clicked Category:", category.strCategory);
                window.location.href = `2ndpage.html?category=${category.strCategory}`;
            });

            categoryContainer.appendChild(categoryCard);
        });
    } catch (error) {
        console.error(" Error fetching categories:", error);
    }
}


async function fetchMealsByCategory(category) {
    try {
        const mealsContainer = document.getElementById("meals-container");
        if (!mealsContainer) {
            console.error(" Error: #meals-container not found!");
            return;
        }

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        if (!response.ok) throw new Error("Failed to fetch meals");

        const data = await response.json();
        console.log(" Fetched meals:", data);

        mealsContainer.innerHTML = ""; 

        if (!data.meals) {
            mealsContainer.innerHTML = "<p>No meals found for this category.</p>";
            return;
        }

        data.meals.forEach(meal => {
            const mealCard = document.createElement("div");
            mealCard.classList.add("meal-card");

            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">
                <h3 class="meal-name" >${meal.strMeal}</h3>
            `;

            mealsContainer.appendChild(mealCard);
        });
    } catch (error) {
        console.error(" Error fetching meals:", error);
    }
}

//18aaeca841d6f732fc0a5d23c0c1583b api key
const apikey = "18aaeca841d6f732fc0a5d23c0c1583b";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".searcher input");
const searchBtn = document.querySelector(".searcher button");
const weatherIcon = document.querySelector(".weather-icon");
const mealsContainer = document.querySelector(".meals-container"); // Ensure this exists in HTML

async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apikey}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error("City not found");

        console.log("Weather Data:", data);

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.floor(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

        if (data.weather[0].main === "Clouds") {
            weatherIcon.src = "imgs/clouds.png";
        } else if (data.weather[0].main === "Clear") {
            weatherIcon.src = "imgs/clear.png";
        } else if (data.weather[0].main === "Rain") {
            weatherIcon.src = "imgs/rain.png";
        } else if (data.weather[0].main === "Drizzle") {
            weatherIcon.src = "imgs/drizzle.png";
        } else if (data.weather[0].main === "Mist") {
            weatherIcon.src = "imgs/mist.png";
        } else {
            weatherIcon.src = "imgs/default.png"; 
        }

        return data.main.temp; // ✅ Return temperature so it can be used

    } catch (error) {
        console.log("Error fetching weather:", error);
        alert("City not found! Please enter a valid city.");
        return null; // Return null if there's an error
    }
}

searchBtn.addEventListener("click", async () => {
    const temp = await checkWeather(searchBox.value); // ✅ Get temperature correctly
    if (temp !== null) { // ✅ Ensure temp is valid before calling fetchMeals
        if (temp > 31) {
            fetchMeals("beef"); // Fetch meals for hot weather
        } else if (temp < 20) {
            fetchMeals("chicken"); // Fetch meals for cold weather
        }
    }
});

async function fetchMeals(category) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        if (!response.ok) throw new Error("Failed to fetch meals");

        const data = await response.json();
        console.log(`Fetched ${category} meals:`, data);

        mealsContainer.innerHTML = "";  

        data.meals.forEach(meal => {
            const mealElement = document.createElement("div");
            mealElement.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">
            `;
            mealsContainer.appendChild(mealElement);
        });

    } catch (error) {
        console.log("Error fetching meals:", error);
    }
}





























/*
async function fetchData(){
    try {

        const pokemonname = document.getElementById("categories").onclick

        const response  = await fetch(`www.themealdb.com/api/json/v1/1/categories.php
}`);
        if(!response.ok){
            throw new error("could not fetch resource");
        }
        const data = await response.json();
        const pokemonsprite = data.sprites.front_default;
        const imageElement = document.getElementById("pokemonsprite")


        imageElement.src = pokemonsprite;
        imageElement.style = display = "block";


    } catch (error) {
        console.log(error)
        
    }
}*/




