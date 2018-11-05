// start with search to get NBDNO number:
//
//
//
 https://api.nal.usda.gov/ndb/search/?format=json&q=butter&sort=n&&ds='Standard Reference'max=25&offset=0&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP
//
//  then run basic report:
//
// https://api.nal.usda.gov/ndb/V2/reports?ndbno=45239291&&type=b&format=json&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP
//
//
// start here https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORTV2.md

function nbSearch(q) {
  const apiKey = `mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP`;
  let url = `https://api.nal.usda.gov/ndb/search/?format=json&q=${q}&sort=n&&ds='Standard Reference'max=25&offset=0&api_key=${apiKey}`

  fetch(url).then(response => console.log(response))

}


$(function() {
  $("#ndbno").keyup(function() {
    console.log($("#ndbno").val())
    nbSearch($("#ndbno").val());
  })

  $("#submit").click(function() {
    let foodItem = $("#ndbno").val()
    let foodBuilder = `https://api.nal.usda.gov/ndb/V2/reports?ndbno=${foodItem}&&type=b&format=json&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP`

    let foodResponse;

    // 45239291

    console.log(foodItem)

    fetch(`https://api.nal.usda.gov/ndb/V2/reports?ndbno=${foodItem}&&type=b&format=json&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP`).then(response=>response.json()).then((response)=>{
      foodResponse = response.foods[0].food;
      console.log(response.foods[0].food);

      $(".output").append(foodResponse.desc.name)
      // $(".output").append(response.foods[0].food.nutrients)
    });



    // $(".output").append()
  });


})
