// https://ndb.nal.usda.gov/ndb/search/list

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
    .then(r=> {
      console.log(r.foods[0].food)
      return r.foods[0].food;

    });
}


$(function() {
  $("#ndbno").keyup(function() {
    // console.log($("#ndbno").val())
    nbSearch($("#ndbno").val());
  })

  $("#submit").click(function() {
    let foodItem = $("#ndbno").val();

    nutritionSearch(foodItem)

    // console.log(output)


  });


})
