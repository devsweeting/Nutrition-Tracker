//business logic

function Food (name, serving, calories, carbs, sodium, protein, fat){

this.name = name,
this.serving = serving,
this.calories = calories,
this.carbs = carbs,
this.sodium = sodium,
this.protein = protein,
this.fat = fat
}
console.log(Food);

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

var pantry = new Pantry();




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

    var newFood = new Food(inputtedFoodName, inputtedServingSize, inputtedCalories, inputtedCarbs, inputtedProtein, inputtedFat, inputtedSodium);
    pantry.addFood(newFood);
    // displayContactDetails(addressBook);
  })
})
