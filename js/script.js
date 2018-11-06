// https://ndb.nal.usda.gov/ndb/search/list

function nutritionTableDraw(tableData) {
  console.log(tableData)
}

function nutritionDataGetter(data) {
  const incomingData =  data.nutrients;
  // nutrient_id: "208" (cals)
  // nutrient_id: "307" (sodium)
  // nutrient_id: "204" (fat)
  // nutrient_id: "205" (carbs)
  // nutrient_id: "203" (protein)
  // nutrient_id: "269" (sugars)
  const capturedData = ["208","307","204","205","203","269"];
  let returnedData = [];

  for (let i =0; i< capturedData.length; i++) {
    for (let e in incomingData) {
      if (incomingData[e].nutrient_id === capturedData[i]) {
        returnedData.push(incomingData[e])
      }
    }
  }
  nutritionTableDraw(returnedData)
  return returnedData
}

function nbSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/search/?format=json&q=${q}&sort=n&max=25&offset=0&api_key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(r=> {
      // console.log(r)
      if(r.list.item){
        r.list.item.forEach(result => {
          console.log("name: ",result.name,"ndbno:",result.ndbno)
        })

        console.log("NDB Id:",r.list.item)

      }
    }).catch(e=>console.log('error in ndbno query:',e))
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

    })
}

$(function() {
  $("#ndbno").keyup(function() {
    nbSearch($("#ndbno").val());
  });

  $("#submit").click(function() {
    nutritionSearch($("#ndbno").val())
  });
});
