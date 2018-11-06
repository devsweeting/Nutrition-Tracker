// https://ndb.nal.usda.gov/ndb/search/list

function nutritionTableDraw(tableData) {
  console.log(tableData)

  let rawHTML = `<table class="table table-striped">
      <thead>
        <tr>
          <th scope="col" colspan="2" id="name" >45239291</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Calories</td>
          <td id="cals">cals</td>
        <tr>
          <td>Total fats</td>
          <td id="fats">fats</td>
        </tr>
        <tr>
          <td>Total carbs</td>
          <td id="carbs">carbs</td>
        </tr>
        <tr>
          <td>Protein</td>
          <td id="protein">pro</td>
        </tr>
          <td>Sugars</td>
          <td id="sugars">sugs</td>
        </tr>


      </tbody>
    </table>
    <button type="button" name="button" id="add-food">Add to food tracker</button>`;

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
      console.log(r.list.item)
      // return r.list.item
    })
}

function nutritionSearch(q) {
  const apiKey = 'mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP';
  let url = `https://api.nal.usda.gov/ndb/V2/reports?ndbno=${q}&&type=b&format=json&api_key=${apiKey}`;

  fetch(url)
    .then(response=>response.json())
    .then(results=>{

      nutritionDataGetter(results.foods[0].food);

      $("th#name").html(results.foods[0].food.desc.name)
    })


}


$(function() {
  $("#ndbno").keyup(function() {
    nbSearch($("#ndbno").val());

  })

  $("#submit").click(function() {
    nutritionSearch($("#ndbno").val())
  });


})
