// https://ndb.nal.usda.gov/ndb/search/list

function nutritionTableDraw(formattedData) {
  let formattedHTML = [];

  formattedData.forEach(function(entry) {
    formattedHTML.push(`<tr>
      <td>${entry.display_name}</td>
      <td>${entry.value}${entry.unit}</td>
    </tr>`)});

  $("#food-data").html(formattedHTML.join(""));
}

function nutritionDataGetter(data) {
  const incomingData =  data.nutrients;

  let newData = [
    {nid: "208", display_name: "Calories", value: null, unit: null},
    {nid: "307", display_name: "Sodium", value: null, unit: null},
    {nid: "204", display_name: "Fats", value: null, unit: null},
    {nid: "205", display_name: "Carbohydrates", value: null, unit: null},
    {nid: "203", display_name: "Protein", value: null, unit: null},
    {nid: "269", display_name: "Sugars", value: null, unit: null}
  ];

  for (let i =0; i< newData.length; i++) {
    for (let e in incomingData) {
      if (incomingData[e].nutrient_id === newData[i].nid) {
        newData[i].value = incomingData[e].measures[0].value;
        newData[i].unit = incomingData[e].measures[0].eunit;
      }
    }
  }

  nutritionTableDraw(newData);
}

function nbSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/search/?format=json&q=${q}&sort=n&max=25&offset=0&api_key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(r=> {
      if(r.list.item){
        let htmlOutput = [];
        r.list.item.forEach(function(entry) {
          htmlOutput.push(`<a class="dropdown-item" href="#" id="${entry.ndbno}">${entry.name}</a>`)
        })
        $("#live-search-results").html(htmlOutput.join(""))
        // console.log("NDB Id:",r.list.item)
      }
    }).catch(e=>{
      console.log('error in ndbno query:',e);
      $("#live-search-results").html(`<a class="dropdown-item" href="#" id="full">no results found</a>`)

    })
}

function nutritionSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/V2/reports?ndbno=${q}&&type=b&format=json&api_key=${apiKey}`;

  fetch(url)
    .then(response=>response.json())
    .then(results=>{
      const removeUPC = /.\s[A-Z]{3,}.\s\d*$/g;

      console.log("RAW:",results.foods[0]);

      nutritionDataGetter(results.foods[0].food);

      $("#ingredients").html("<p><strong>Ingredients: </strong>"+results.foods[0].food.ing.desc+"</p>");
      $("th#name").html(results.foods[0].food.desc.name.replace(removeUPC,""));

    }).catch(e=>console.log('error in search:',e))
}

$(function() {
  // $("#live-search-results").removeClass("search-hidden")

  $("#live-search-results").on('click', 'a', function() {
    console.log(this.id)
    nutritionSearch(this.id)
    $("#live-search-results").addClass("search-hidden")

  })

  $("#ndbno").keyup(function() {
    $("#live-search-results").removeClass("search-hidden")

    nbSearch($("#ndbno").val());
  });

  $("#submit").click(function() {
    nutritionSearch($("#ndbno").val())
  });
});
