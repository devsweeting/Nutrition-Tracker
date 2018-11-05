// https://ndb.nal.usda.gov/ndb/search/list

function nutritionOutput(data) {
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
  return returnedData
}

function nbSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/search/?format=json&q=${q}&sort=n&max=25&offset=0&api_key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(r=> {
      console.log(r.list.item)
      return r.list.item
    })
}

function nutritionSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/V2/reports?ndbno=${q}&&type=b&format=json&api_key=${apiKey}`;

  fetch(url)
    .then(response=>response.json())
    .then(results=>{
      // console.log(results.foods[0].food)

      console.log(nutritionOutput(results.foods[0].food));

      $(".output").html(results.foods[0].food.desc.name)
      // return
    })


}


$(function() {
  $("#ndbno").keyup(function() {
    // nbSearch($("#ndbno").val());

  })

  $("#submit").click(function() {
    nutritionSearch($("#ndbno").val())
  });


})
