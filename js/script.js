//business logic

function Food (name, serving, calories, carbs, sodium, protein, fat, type) {

  this.name = name,
  this.serving = serving,
  this.calories = calories,
  this.carbs = carbs,
  this.sodium = sodium,
  this.protein = protein,
  this.fat = fat,
  this.type = type
}
console.log(Food);

function displayFoodDetails(pantryDisplay) {
  var foodList = $("ul#pantry");
  var htmlForFoodInfo = "";
  pantryDisplay.foods.forEach(function(food) {
    htmlForFoodInfo += "<li id=" + food.id + ">" + food.name + "</li>";
  });
  foodList.html(htmlForFoodInfo)
};

function showFood (foodId) {
  var food = pantry.findFood(foodId);
  $("#pantry").show();
  $(".new-food-name").html(food.name);
  $(".new-serving-size").html(food.servivng);
  $(".new-calories").html(food.calories);  $(".new-food-name").html(food.name);
  $(".new-carbohydrates").html(food.carbs);
  $(".new-protein").html(food.sodium);
  $(".new-fats").html(food.protein);  $(".new-food-name").html(food.name);
  $(".new-sodium").html(food.fat);
  $("#typeOfFood").html(food.type);
  var buttons = $("#buttons");
  buttons.empty();
  buttons.append("<button class='favoriteButton' id=" +  + food.id + ">Add to Favorites</button>");

}
function attachContactListeners() {
  $("ul#contacts").on("click", "li", function(){
    showContact(this.id);
  });
  $("#buttons").on("click", ".deleteButton", function(){
    addressBook.deleteContact(this.id);
    $("#show-contact").hide();
    displayContactDetails(addressBook);
  });
};

//Favorites LIst
var favorites = new FavoriteFoods();

function FavoriteFoods() {
  this.favorites = [],
  this.currentId = 0
}

FavoriteFoods.prototype.addFavorite = function(favorite) {
  favorite.id = this.assignId();
  this.favorites.push(favorite);
}

FavoriteFoods.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
}

FavoriteFoods.prototype.findFavorite = function(id) {
  for (var i=0; i<this.favorites.length; i++) {
    if (this.favorites[i]) {
      if (this.favorites[i].id == id) {
        return this.favorites[i];
      }
    }
  };
  return false;
}
// Daily pantry list
var pantry = new Pantry();

function Pantry() {
  this.foods = [],
  this.currentId = 0
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
    if (this.foods[i]) {
      if (this.foods[i].id == id) {
        return this.foods[i];
      }
    }
  };
  return false;
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


var apple = new Food('apple', '1', '95', '25', '0', '0', '2mg');
var banana = new Food('banana', '1', '105', '27', '1.3', '0.4', '1mg');
var blueberries = new Food('blueberries', '1 cup', '85', '21', '1.1', '0.5', '1mg');
var orange = new Food('orange', '1', '45', '11', '0.9', '0.1', '0.0mg');
var broccoli =  new Food('broccoli', '3 cups', '50', '10', '4.2', '.5', '0.0mg');


//user interface logic
$(document).ready(function(){
  //attachContactListeners();
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

    var newFood = new Food(inputtedFoodName, inputtedServingSize, inputtedCalories, inputtedCarbs, inputtedProtein, inputtedFat, inputtedSodium, inputtedTypeOfFood);
    pantry.addFood(newFood);
    console.log(newFood);
    console.log(pantry);



    displayFoodDetails(pantry);
  })
  // $("form#new-food").submit(function(event){
  //   event.preventDefault();
  //   var inputtedFoodName = $("input#new-food-name").val();
  //   var inputtedServingSize = parseInt($("input#new-serving-size").val());
  //   var inputtedCalories = parseInt($("input#new-calories").val());
  //   var inputtedCarbs = parseInt($("input#new-carbohydrates").val());
  //   var inputtedProtein = parseInt($("input#new-protein").val());
  //   var inputtedFat = parseInt($("input#new-fats").val());
  //   var inputtedSodium = parseInt($("input#new-sodium").val());
  //   var inputtedTypeOfFood = $("select#typeOfFood").val();
  //
  //   var newFood = new Food(inputtedFoodName, inputtedServingSize, inputtedCalories, inputtedCarbs, inputtedProtein, inputtedFat, inputtedSodium, inputtedTypeOfFood);
  //   favorites.addFavorite(newFood);
  //
  //   console.log(favorites);
  //
  // })
})
