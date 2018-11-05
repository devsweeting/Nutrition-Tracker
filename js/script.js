// start with search to get NBDNO number:
//
//
//  https://api.nal.usda.gov/ndb/search/?format=json&q=0722252601445&sort=n&max=25&offset=0&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP
//
//  then run basic report:
//
// https://api.nal.usda.gov/ndb/V2/reports?ndbno=45239291&&type=b&format=json&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP
//
//



// fetch('https://api.nal.usda.gov/ndb/reports/?ndbno=01009&type=b&format=xml&api_key=DEMO_KEY')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(JSON.stringify(myJson));
//   });
//
//
//
//   fetch('https://api.nal.usda.gov/ndb/search/?format=json&q=0722252601445&sort=n&max=1&offset=0&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP').then(response=>response.json()).then(x=>console.log(x))
//
//
//
//   fetch('https://api.nal.usda.gov/ndb/V2/reports?ndbno=45239291&&type=b&format=json&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP').then(response=>response.json()).then(x=>console.log(x))
//

  fetch('https://api.nal.usda.gov/ndb/V2/reports?ndbno=45239291&&type=b&format=json&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP').then(response=>response.json()).then(x=>console.log(x.foods[0].food.nutrients))

$(function() {

  $("#submit").click(function() {
    let foodItem = $("#ndbno").val()
    let foodBuilder = `https://api.nal.usda.gov/ndb/V2/reports?ndbno=${foodItem}&&type=b&format=json&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP`

    // 45239291

    console.log(foodItem)

    fetch(`https://api.nal.usda.gov/ndb/V2/reports?ndbno=${foodItem}&&type=b&format=json&api_key=mhNpLtFVjwZ2FqugLnJYF8T4cCKIhiIGTAGOVSvP`).then(response=>response.json()).then((response)=>{
      console.log(response.foods[0].food)

      // $(".output").append(response.foods[0].food.nutrients)
      // $(".output").append(response.foods[0].food.nutrients)
    });



    // $(".output").append()
  });


})
