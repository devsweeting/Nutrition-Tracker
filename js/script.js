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

  $("#add-food").click(function() {
    $("input#new-food-name").val(data[0].raw.desc.name.replace(removeUPC,""));
    $("input#new-calories").val(data[1].value)
    $("input#new-sodium").val(data[2].value)
    $("input#new-fats").val(data[3].value)
    $("input#new-carbohydrates").val(data[4].value)
    $("input#new-protein").val(data[5].value)
  });

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
  nutritionTableDraw(parsedData);
  sendToForm(parsedData);

}

function nbSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/search/?format=json&q=${q}&sort=n&max=25&offset=0&api_key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(r=> {

      if(r.list.item){
        if (r.list.item.length===1) {
          // pressing enter will run nutritionSeach function with only captures result
          console.log('only one result:',r.list.item[0].ndbno)
        }
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

    }).catch(e=>console.log('error in search:',e));
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

Pantry.prototype.findFavorite = function(id) {
  for (var i=0; i<this.foods.length; i++) {
    if (this.foods[i]) {
      if (this.foods[i].fav === true) {
        this.favoriteFoods.push(this.foods[i]);
        this.foods[i].fav = false;
      }
    }
  }
}

Pantry.prototype.addFavoriteToDisplay = function(id) {
  var endIndex = this.favoriteFoods.length - 1;
  $("#favorites").append("<li id=" + this.favoriteFoods[endIndex].id+ ">" + this.favoriteFoods[endIndex].name + "</li>");
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

function addFoodToLog(pantry, inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat) {


  pantry.addFood(new Food(inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat));
  displayFoodDetails(pantry);


}


$(document).ready(function(){

  var pantry1 = new Pantry();
  attachFoodListeners(pantry1);


  $("form#new-food").submit(function(event){
    event.preventDefault();

    let inputData = {
      name: $("input#new-food-name").val(),
      calories : parseInt($("input#new-calories").val()),
      carbs : parseInt($("input#new-carbohydrates").val()),
      protein : parseInt($("input#new-protein").val()),
      fat : parseInt($("input#new-fats").val()),
      sodium : parseInt($("input#new-sodium").val())
    }

    console.log(inputData)

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

    addFoodToLog(pantry1, inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat);

    // var newFood = new Food(inputtedFoodName, inputtedCalories, inputtedCarbs, inputtedSodium, inputtedProtein, inputtedFat);
    // pantry.addFood(newFood);
    // displayFoodDetails(pantry);
  });

  $("#live-search-results").on('click', 'a', function() {
    nutritionSearch(this.id);
    $("#live-search-results").addClass("search-hidden");
  });


  $("input#ndbno").keyup(function(event) {
    $("#live-search-results").removeClass("search-hidden");
    nbSearch($("#ndbno").val());

    event.key === "Escape" ? ($("#live-search-results").addClass("search-hidden")):(null);
  });

  $("#submit").click(function() {
    nutritionSearch($("#ndbno").val());
  });
})
