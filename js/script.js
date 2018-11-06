//business logic


function Food (name, serving, calories, carbs, sodium, protein, fat, type, fav=false) {
  this.name = name,
  this.serving = serving,
  this.calories = calories,
  this.carbs = carbs,
  this.sodium = sodium,
  this.protein = protein,
  this.fat = fat,
  this.type = type,
  this.fav = fav
}

function displayFoodDetails(pantryDisplay) {
  var foodList = $("ul#pantry");
  var htmlForFoodInfo = "";
  pantryDisplay.foods.forEach(function(food) {
    htmlForFoodInfo += "<li id=" + food.id + ">" + food.name + "</li>";
  });
  foodList.html(htmlForFoodInfo);

};

function displayFoodFavorite(favoriteDisplay) {
  var favList = $("ul#favorites");
  var htmlForFavorites = "";
  favoriteDisplay.pantry.favoriteFoods.forEach(function(food) {
    htmlForFavorites += "<li id=" + food.id + ">" + food.name + "</li>";
  });
  favList.html(htmlForFavorites);

};

function showFood (foodId, pantry) {
  var food = pantry.findFood(foodId);
  $("#show-foods").show();
  $(".new-food-name").html(food.name);
  $(".new-serving-size").html(food.serving);
  $(".new-calories").html(food.calories);
  $(".new-carbohydrates").html(food.carbs);
  $(".new-protein").html(food.sodium);
  $(".new-fats").html(food.protein);
  $(".new-sodium").html(food.fat);
  $(".new-type").html(food.type);
  var favButton = $("#buttons");
  favButton.empty();
  favButton.append("<button class='btn btn-success favoriteButton' id="  + food.id + ">Add to Favorites</button>");
}

function attachFoodListeners(pantry) {
  $("ul#pantry").on("click", "li", function(){
    showFood(this.id, pantry);
    displayFoodDetails(pantry);
  });

  $("#buttons").on("click", ".favoriteButton", function(){
    // add food to fav list
    pantry.foods[this.id -1].fav = true;
    pantry.findFavorite();
    pantry.addFavoriteToDisplay();
  });
};

// Daily pantry list
Pantry.prototype.findFavorite = function(id) {
  for (var i=0; i<this.foods.length; i++) {
    if (this.foods[i]) {
      if (this.foods[i].fav === true) {
        this.favoriteFoods.push(this.foods[i]);
        this.foods[i].fav = false;
        console.log(this.favoriteFoods);
      }
    }
  };
}

Pantry.prototype.addFavoriteToDisplay = function(id) {
  var endIndex = this.favoriteFoods.length - 1;
  console.log(this.favoriteFoods[endIndex].id);
  $("#favorites").append("<li id=" + this.favoriteFoods[endIndex].id+ ">" + this.favoriteFoods[endIndex].name + "</li>");
}

function Pantry() {
  this.foods = [],
  this.currentId = 0,
  this.favoriteFoods = []
}

Pantry.prototype.addFood = function(food) {
  food.id = this.assignId();
  this.foods.push(food);
}

Pantry.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
}

Pantry.prototype.findFood = function(id) {
  for (var i=0; i<this.foods.length; i++) {
      if (this.foods[i].id == id) {
        return this.foods[i];
      }
  }
}

Pantry.prototype.deleteFood = function(id) {
  for (var i=0; i< this.foods.length; i++){
    if (this.foods[i]) {
      if (this.foods[i].id == id) {
        delete this.foods[i];
        return true;
      }
    }
  };
  return false;
}
//example foods
var apple = new Food('apple', '1', '95', '25', '0', '0', '2mg');
var banana = new Food('banana', '1', '105', '27', '1.3', '0.4', '1mg');
var blueberries = new Food('blueberries', '1 cup', '85', '21', '1.1', '0.5', '1mg');
var orange = new Food('orange', '1', '45', '11', '0.9', '0.1', '0.0mg');
var broccoli =  new Food('broccoli', '3 cups', '50', '10', '4.2', '.5', '0.0mg');

//user interface logic
$(document).ready(function(){
  var pantry = new Pantry();
  attachFoodListeners(pantry);
  $("form#new-food").submit(function(event){
    event.preventDefault();
    var inputtedFoodName = $("input#new-food-name").val();
    var inputtedServingSize = parseInt($("input#new-serving-size").val());
    var inputtedCalories = parseInt($("input#new-calories").val());
    var inputtedCarbs = parseInt($("input#new-carbohydrates").val());
    var inputtedProtein = parseInt($("input#new-protein").val());
    var inputtedFat = parseInt($("input#new-fats").val());
    var inputtedSodium = parseInt($("input#new-sodium").val());
    var inputtedTypeOfFood = $("select#typeOfFood").val();
    $("input#new-food-name").val("");
    parseInt($("input#new-serving-size").val(""));
    parseInt($("input#new-calories").val(""));
    parseInt($("input#new-carbohydrates").val(""));
    parseInt($("input#new-protein").val(""));
    parseInt($("input#new-fats").val(""));
    parseInt($("input#new-sodium").val(""));
    $("select#typeOfFood").val("");

    var newFood = new Food(inputtedFoodName, inputtedServingSize, inputtedCalories, inputtedCarbs, inputtedProtein, inputtedFat, inputtedSodium, inputtedTypeOfFood);
    pantry.addFood(newFood);
    displayFoodDetails(pantry);
  })
})
