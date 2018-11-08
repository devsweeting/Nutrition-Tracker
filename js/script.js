//business logic
function nutritionTableDraw(formattedData) {
  let formattedHTML = [];

  formattedData.forEach(function(entry) {
    if (entry.nid) {
      formattedHTML.push(`<tr>
        <td>${entry.display_name}</td>
        ${entry.value ? (`<td>${entry.value} ${entry.unit}</td>`):(`<td>N/A</td>`)}
      </tr>`);
    }});

  $(".nutrition-info").show();
  $("#food-data").html(formattedHTML.join(""));
}

function sendToForm(data) {
  const removeUPC = /.\s[A-Z]{3,}.\s\d*$/g;
  // console.log(data);
  $("input#new-food-name").val(data[0].raw.desc.name.replace(removeUPC,""));
  $("input#new-calories").val(data[1].value);
  $("input#new-sodium").val(data[2].value);
  $("input#new-fats").val(data[3].value);
  $("input#new-carbohydrates").val(data[4].value);
  $("input#new-protein").val(data[5].value);

  $("p#serving-num").html("1")

  data[0].raw.ing ? ($("#ingredients").html("<small><strong>Ingredients: </strong>"+data[0].raw.ing.desc+"</small>")):($("#ingredients").html("<small><strong>Ingredients: </strong>Ingredients not provided</small>"));
}

function nutritionDataGetter(data) {
  let parsedData = [
    {raw: data},
    {nid: "208", display_name: "Calories", value: null, unit: null},
    {nid: "307", display_name: "Sodium", value: null, unit: null},
    {nid: "204", display_name: "Fats", value: null, unit: null},
    {nid: "205", display_name: "Carbohydrates", value: null, unit: null},
    {nid: "203", display_name: "Protein", value: null, unit: null},
    {nid: "269", display_name: "Sugars", value: null, unit: null}
  ];

  for (let i =0; i< parsedData.length; i++) {
    for (let e in data.nutrients) {
      if (data.nutrients[e].nutrient_id === parsedData[i].nid) {
        parsedData[i].value = data.nutrients[e].measures[0].value;
        parsedData[i].unit = data.nutrients[e].unit;
      }
    }
  }
  // nutritionTableDraw(parsedData);
  pantry1.foodInDisplay=parsedData;
  sendToForm(parsedData);

}

function nbSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/search/?format=json&q=${q}&sort=r&max=50&offset=0&api_key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(r=> {

      if(r.list.item){

        let htmlOutput = [];
        r.list.item.forEach(function(entry) {
          htmlOutput.push(`<a class="dropdown-item" href="#" id="${entry.ndbno}">${entry.name}</a>`);
        })
        $("#live-search-results").html(htmlOutput.join(""));
      }
    }).catch(e=>{
      $("#live-search-results").html(`<a class="dropdown-item" href="#" id="full">no results found</a>`);
    });
}

function nutritionSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/V2/reports?ndbno=${q}&&type=b&format=json&api_key=${apiKey}`;

  fetch(url)
    .then(response=>response.json())
    .then(results=>{
      const removeUPC = /.\s[A-Z]{3,}.\s\d*$/g;
      nutritionDataGetter(results.foods[0].food);

      $("th#name").html(results.foods[0].food.desc.name.replace(removeUPC,""));

    }).catch(e=>{
      // console.log('no search results')
    });
}

function Food (name, calories, carbs, sodium, protein, fat, fav=false, serving) {
  this.name = name,
  this.calories = calories,
  this.carbs = carbs,
  this.sodium = sodium,
  this.protein = protein,
  this.fat = fat,
  this.fav = fav,
  this.serving = serving
}
// Daily pantry list

function Pantry() {
  this.foods = [],
  this.currentId = 0,
  this.favoriteFoods = [],
  this.foodInDisplay
}

Pantry.prototype.addFood = function(food) {
  food.id = this.assignId();
  this.foods.push(food);
}

Pantry.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
}

Pantry.prototype.deleteFood = function(foodAtIndex) {
  delete this.foods[foodAtIndex];
}
//user interface logic

function ui_showFoodDetails(food) {
  $("#show-foods").show();
  $("#food-buttons").empty();

  $(".new-food-name").html(food.name);
  $(".new-servings").html(food.serving);
  $(".new-calories").html(food.calories);
  $(".new-carbohydrates").html(food.carbs);
  $(".new-protein").html(food.protein);
  $(".new-fats").html(food.fat);
  $(".new-sodium").html(food.sodium);




  $("#food-buttons").append(`<i class="fas fa-grin-hearts fav-heart" food-id="${food.id}" id="heart-${food.id}"></i>`);

  $("#food-buttons").append(`<i class="delete-food fas fa-trash-alt" food-id="${food.id}" id="${food.id}"></i>`);
}

function ui_nutritionProgress(allPantry) {
  const foodsArray = allPantry.foods;

  let daily_calories=0;
  let daily_carbs=0;
  let daily_fat=0;
  let daily_protein=0;
  let daily_sodium=0;

  const dailyVals = {
    calories: 2000,
    carbs: 300,
    fat: 50,
    protein: 50,
    sodium: 2300
  }

  for (var i = 0; i< foodsArray.length; i++) {
    if (foodsArray[i]) {
      daily_calories += parseInt(foodsArray[i].calories);
      daily_carbs += parseInt(foodsArray[i].carbs);
      daily_fat += parseInt(foodsArray[i].fat);
      daily_protein += parseInt(foodsArray[i].protein);
      daily_sodium += parseInt(foodsArray[i].sodium);
    }
  }

  let computerDailyVals = {
    calories: Math.floor((daily_calories/dailyVals.calories)*100),
    carbs: Math.floor((daily_carbs/dailyVals.carbs)*100),
    fat: Math.floor((daily_fat/dailyVals.fat)*100),
    protein: Math.floor((daily_protein/dailyVals.protein)*100),
    sodium: Math.floor((daily_sodium/dailyVals.sodium)*100)
  }

  $("#calories-prg").css("width", computerDailyVals.calories+"%");
  $("#carbs-prg").css("width", computerDailyVals.carbs+"%");
  $("#fat-prg").css("width", computerDailyVals.fat+"%");
  $("#protein-prg").css("width", computerDailyVals.protein+"%");
  $("#sodium-prg").css("width", computerDailyVals.sodium+"%");

  $("#calories-num").html(`<small>${computerDailyVals.calories}% daily value</small>`);
  $("#carbs-num").html(`<small>${computerDailyVals.carbs}% daily value</small>`);
  $("#fat-num").html(`<small>${computerDailyVals.fat}% daily value</small>`);
  $("#protein-num").html(`<small>${computerDailyVals.protein}% daily value</small>`);
  $("#sodium-num").html(`<small>${computerDailyVals.sodium}% daily value</small>`);

  if (computerDailyVals.calories > 100) {
    $("#calories-num").css("color", "#ff8383");
  } else {
    $("#calories-num").css("color", "#adadad");
  }
  if (computerDailyVals.carbs > 100) {
    $("#carbs-num").css("color", "#ff8383");
  } else {
    $("#carbs-num").css("color", "#adadad");
  }
  if (computerDailyVals.fat > 100) {
    $("#fat-num").css("color", "#ff8383");
  } else {
    $("#fat-num").css("color", "#adadad");
  }
  if (computerDailyVals.protein > 100) {
    $("#protein-num").css("color", "#ff8383");
  } else {
    $("#protein-num").css("color", "#adadad");
  }
  if (computerDailyVals.sodium > 100) {
    $("#sodium-num").css("color", "#ff8383");
  } else {
    $("#sodium-num").css("color", "#adadad");
  }

}

function ui_displayFood(pantryDisplay) {
  // adds the food into a bulleted list
  var foodList = $("ul#pantry");
  var htmlForFoodInfo = "";
  pantryDisplay.foods.forEach(function(food) {
    htmlForFoodInfo += "<li class='list-group-item' id=" + food.id + ">" + food.name + "</li>";
  });

  foodList.html(htmlForFoodInfo);
  ui_nutritionProgress(pantryDisplay);
};

function addFoodToLog(pantry, inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat, fav=false, serving) {
  pantry.addFood(new Food(inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat,fav=false, serving));
  ui_displayFood(pantry);
}

function ui_FoodFavsDraw(pantry) {
  $("#food-favorites").empty();
  pantry.favoriteFoods.forEach(function(fav){
    $("#food-favorites").append(`<li class="list-group-item" id="${fav.id}">${fav.name}</li>`)
  })

}
var pantry1 = new Pantry();

$(document).ready(function(){

  $("#clear-form").click(function() {
    $("input#new-food-name").val("");
    $("input#new-calories").val("");
    $("input#new-carbohydrates").val("");
    $("input#new-protein").val("");
    $("input#new-fats").val("");
    $("input#new-sodium").val("");
    $("p#serving-num").html("1")
  })

  $("ul#food-favorites").on("click", "li", function(){
    $("#show-foods").hide();
    let idToFind = parseInt(this.id);
    let favFood;

    for (let i=0; i < pantry1.favoriteFoods.length; i++) {

      if (pantry1.favoriteFoods[i].id === idToFind) {
        favFood = pantry1.favoriteFoods[i];
        }
    }
    $("input#new-food-name").val(favFood.name);
    $("input#new-calories").val(favFood.calories);
    $("input#new-carbohydrates").val(favFood.carbs);
    $("input#new-protein").val(favFood.protein);
    $("input#new-fats").val(favFood.fat);
    $("input#new-sodium").val(favFood.sodium);

    $("p#serving-num").html(favFood.serving)

  });

  $("ul#pantry").on("click", "li", function(){
    // listens for within daily food log and shows food's details
    ui_showFoodDetails(pantry1.foods[this.id-1]);
  });

  $(".food-log").on('click','.fav-heart', function() {
    pantry1.foods[$(this).attr('food-id')-1].fav = true;
    pantry1.favoriteFoods.push(pantry1.foods[$(this).attr('food-id')-1]);
    ui_FoodFavsDraw(pantry1);
    return false;
  });

  $(".food-log").on('click','.delete-food', function() {
    pantry1.deleteFood($(this).attr('food-id')-1);
    $("#show-foods").hide();
    ui_displayFood(pantry1);
    return false;
  });

  $("#ingredient-list-button").click(function(){
    $("#show-ingredients-text").toggle();
    $("#hide-ingredients-text").toggle();
    $("#ingredients").toggle();
  });

  $("form#new-food").submit(function(event){
    event.preventDefault();
    $("#show-foods").hide();

    var inputtedFoodName = $("input#new-food-name").val();
    var inputtedCalories = $("input#new-calories").val();
    var inputtedCarbs = $("input#new-carbohydrates").val();
    var inputtedProtein = $("input#new-protein").val();
    var inputtedFat = $("input#new-fats").val();
    var inputtedSodium = $("input#new-sodium").val();
    var displayedServing = $("p#serving-num").html();


    addFoodToLog(pantry1, inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat, fav=false, displayedServing);
    $("input").val("");
    $("p#serving-num").html("1")

    $("#ingredients").empty();
    $("#ingredients").hide();

    $("#hide-ingredients-text").hide();
    $("#show-ingredients-text").show();
  });

  $("#live-search-results").on('click', 'a', function() {
    nutritionSearch(this.id);
    $("#live-search-results").addClass("search-hidden");
  });

  $("input#ndbno").keyup(function(event) {
    $("#live-search-results").removeClass("search-hidden");
    $("#show-foods").hide();

    nbSearch($("#ndbno").val());

    event.key === "Escape" ? ($("#live-search-results").addClass("search-hidden")):(null);
  });

  $("#servings").on("click","i",function() {
    let current = parseInt($("#serving-num").html());

    if (this.id === "plus-serve") {
      current++
    }

    if (this.id === "minus-serve") {
      if (current>1) {
        current--;
      }
    }
    $("#serving-num").html(current)

    if ($("input#new-food-name").val()) {
      let base_cals = pantry1.foodInDisplay[1].value;
      let base_sodium = pantry1.foodInDisplay[2].value;
      let base_fats = pantry1.foodInDisplay[3].value;
      let base_carbs = pantry1.foodInDisplay[4].value;
      let base_protein = pantry1.foodInDisplay[5].value;

      $("input#new-calories").val(base_cals*current);
      $("input#new-carbohydrates").val(base_carbs*current);
      $("input#new-protein").val(base_protein*current);
      $("input#new-fats").val(base_fats*current);
      $("input#new-sodium").val(base_sodium*current);
    }

  });

});
