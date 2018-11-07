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

  $("input#new-food-name").val(data[0].raw.desc.name.replace(removeUPC,""));
  $("input#new-calories").val(data[1].value);
  $("input#new-sodium").val(data[2].value);
  $("input#new-fats").val(data[3].value);
  $("input#new-carbohydrates").val(data[4].value);
  $("input#new-protein").val(data[5].value);

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
  sendToForm(parsedData);

}

function nbSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/search/?format=json&q=${q}&sort=r&max=50&offset=0&api_key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(r=> {

      if(r.list.item){
        // if (r.list.item.length===1) {
        //   pressing enter will run nutritionSeach function with only captures result
        //   console.log('only one result:',r.list.item[0].ndbno)
        // }
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

      $("#ingredients").html("<p><strong>Ingredients: </strong>"+results.foods[0].food.ing.desc+"</p>");
      $("th#name").html(results.foods[0].food.desc.name.replace(removeUPC,""));

    }).catch(e=>{
      // console.log('no search results')
    });
}

function Food (name, calories, carbs, sodium, protein, fat, fav=false) {
  this.name = name,
  this.calories = calories,
  this.carbs = carbs,
  this.sodium = sodium,
  this.protein = protein,
  this.fat = fat,
  this.fav = fav
}
// Daily pantry list

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

Pantry.prototype.deleteFood = function(foodAtIndex) {
  delete this.foods[foodAtIndex];
}
//user interface logic

function ui_showFoodDetails(food) {
  $("#show-foods").show();
  $("#food-buttons").empty();

  $(".new-food-name").html(food.name);
  $(".new-calories").html(food.calories);
  $(".new-carbohydrates").html(food.carbs);
  $(".new-protein").html(food.protein);
  $(".new-fats").html(food.fat);
  $(".new-sodium").html(food.sodium);

  $("#food-buttons").append(`<button type="button" name="button" class="fav-heart" food-id="${food.id}" id="heart-${food.id}">♥️</button>`);

  $("#food-buttons").append(`<button type="button" name="button" class="delete-food" food-id="${food.id}" id="${food.id}">Delete</button>`)
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

  console.log(computerDailyVals);
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

function addFoodToLog(pantry, inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat) {

  pantry.addFood(new Food(inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat));
  ui_displayFood(pantry);
}

function ui_FoodFavsDraw(pantry) {
  $("#food-favorites").empty();
  pantry.favoriteFoods.forEach(function(fav){
    $("#food-favorites").append(`<li class="list-group-item" id="${fav.id}">${fav.name}</li>`)
  })

}

$(document).ready(function(){
  var pantry1 = new Pantry();

  $("ul#food-favorites").on("click", "li", function(){
    $("#show-foods").hide();
    // console.log("clicked on food fav list", pantry1.favoriteFoods)

    let favFood = pantry1.favoriteFoods[this.id-1];

    $("input#new-food-name").val(favFood.name);
    $("input#new-calories").val(favFood.calories);
    $("input#new-carbohydrates").val(favFood.carbs);
    $("input#new-protein").val(favFood.protein);
    $("input#new-fats").val(favFood.fat);
    $("input#new-sodium").val(favFood.sodium);

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

  $("form#new-food").submit(function(event){
    event.preventDefault();
    $("#show-foods").hide();

    var inputtedFoodName = $("input#new-food-name").val();
    var inputtedCalories = $("input#new-calories").val();
    var inputtedCarbs = $("input#new-carbohydrates").val();
    var inputtedProtein = $("input#new-protein").val();
    var inputtedFat = $("input#new-fats").val();
    var inputtedSodium = $("input#new-sodium").val();

    addFoodToLog(pantry1, inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat);
    $("input").val("");

    // $("#ingredientList").click(function(){
    //   $(".addSymbol").toggle();
    //   $(".subSymbol").toggle();
    //   $(".ingredients").toggle();


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

  // $("#submit").click(function() {
  //   nutritionSearch($("#ndbno").val());
  // });
});
