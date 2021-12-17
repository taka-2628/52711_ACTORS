document.addEventListener("DOMContentLoaded", () => {
  listenToSearchBtn()
})

function listenToSearchBtn(){
  const searchBtn = document.getElementById("search-btn")
  searchBtn.addEventListener("click", () => {
    hideSPShowForm()
  })
}

function hideSPShowForm(){
  hideIntroSP()
  showForm()
}

function hideIntroSP(){
  document.getElementById("scatter-plot").style.display = "none"
  document.getElementById("search-btn").style.display = "none"
  document.getElementById("sp-legend").style.display = "none"
}

function showForm(){
  document.getElementById("search-your-actor").style.display = "block"
}



d3.json("./data-cleaning/13_actorDeathsAdded.json")
  .then(function(data) {
    dataset = data;
    //console.log(dataset)

    var w = 1600;
		var h = 2000;
    var padding = 100;
		var dataset, xScale, yScale; 

    //We will be using a linear scale instead of time scale here because the time has been to a hour number.
    xScale = d3.scaleLinear()
            .domain([
              d3.min(dataset, function(d) { return d.year_of_birth; }),
              d3.max(dataset, function(d) { return d.year_of_birth; })
            ])
            .range([padding, w - padding]);

    yScale = d3.scaleLinear()
            .domain([
              d3.min(dataset, function(d) { return d.list_of_genre_arr.length; }),
              d3.max(dataset, function(d) { return d.list_of_genre_arr.length; })
            ])
            .range([h - padding, padding]);
        
    d3.select("#scatter-plot").selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text(function(d) {
        return `${d.name} • `
      })
      /*
      .attr("x", function(d) {
        return xScale(d.year_of_birth) + 12 
                //TODO: return the approperiate x value (DONE)
      })
      .attr("y", function(d) {
        
        return yScale(d.list_of_genre_arr.length) + 8
                  //TODO: return the approperiate y value (DONE)
      })
      .attr("font-family", "oswald")
      .attr("font-size", function(d){
        return d.list_of_genre_arr.length / 5
      })
      */
      .style("color", function(d){
        if (d.genre.genre == "Drama"){
          return "#9e003f"
        } else if (d.genre.genre == "History"){
          return "#ffacac"
        } else if (d.genre.genre == "Sport"){
          return "#dcd0cc"
        } else if (d.genre.genre == "Adventure"){
          return "#f34b00"
        } else if (d.genre.genre == "Comedy"){
          return "#f2be62"
        } else if (d.genre.genre == "Film-Noir"){
          return "#625100"
        } else if (d.genre.genre == "Horror"){
          return "#749600"
        } else if (d.genre.genre == "War"){
          return "#2a5b00"
        } else if (d.genre.genre == "Thriller"){
          return "#8bd96d"
        } else if (d.genre.genre == "Biography"){
          return "#7bd8b1"
        } else if (d.genre.genre == "Mystery"){
          return "#00ad7d"
        } else if (d.genre.genre == "Western"){
          return "#019a9d"
        } else if (d.genre.genre == "Animation"){
          return "#79d4e2"
        } else if (d.genre.genre == "Sci-Fi"){
          return "#016692"
        } else if (d.genre.genre == "Action"){
          return "#015fc2"
        } else if (d.genre.genre == "Family"){
          return "#a292ff"
        } else if (d.genre.genre == "Fantasy"){
          return "purple"
        } else if (d.genre.genre == "Crime"){
          return "#a300c8"
        } else if (d.genre.genre == "Musical"){
          return "#ed87ff"
        } else if (d.genre.genre == "Romance"){
          return "#ff60cf";
        }
      })
      .on('click', (d) => {
        hideIntroSP();
        showMap(d);
      })
  });

d3.json("./data-cleaning/13_actorDeathsAdded.json")
      .then(function(data) {
          console.log(data)
              
          const searchForm = document.getElementById("search-form");

          searchForm.addEventListener("submit", (e) => {
              e.preventDefault();
              queryActorName(data, e.target.name.value)
          })
      })
      
function queryActorName(data, input){
    //const match = data.find(element => element.name == input)
    
    let match;
    for (element of data){
      if (element.name.toLowerCase() == input.toLowerCase()){
        match = element
      } else if (element.name_nonaccented.toLowerCase() == input.toLowerCase()){
        match = element
      }
    }
    
    if (match == undefined){
        actorNotFound();
    } else {
        hideSearchForm();
        showMap(match);
    }
}

function actorNotFound(){
    const searchForm = document.getElementById("search-form");
    let alert = document.createElement("div");
    alert.id = "no-actor-match"
    alert.innerHTML = `
        <p>no actor with that name was found</p>
        <p>please try again</p>
    `;    

    searchForm.appendChild(alert);
    searchForm.reset();
}
function hideSearchForm(){
    const favActorSearch = document.getElementById("search-your-actor");
    favActorSearch.style.display = "none";
}
function showMap(match){
    const placeOfBirth = match.place_of_birth.split(", ");
    const city = placeOfBirth[placeOfBirth.length-2];
    const country = placeOfBirth[placeOfBirth.length-1];
    
    const map = document.getElementById("map")
    map.style.display = "block";

    showLabel(city, country);
    locateBirthPlace(city, country);
    setTimeout(showBio(match), 5000); 
    addEventListenerToClick(match)
}

function showBio(match){
  const bio = document.getElementById("bio-cont");
  bio.style.display = "block";

  const titleBio = document.createElement("h2");
  titleBio.textContent = match.name;

  const bioP = document.createElement("p");
  bioP.textContent = match.bio;

  bio.appendChild(titleBio)
  bio.appendChild(bioP)
}

function showLabel(city, country){
  const labelCont = document.getElementById("label")

  const label = document.createElement("div")
  label.innerHTML = `
    <p class="labels">${city}, ${country}</p>
    <p class="labels" id="click">Click to Know More!</p>
  `
  labelCont.appendChild(label)
}

function locateBirthPlace(city, country){
  mapboxgl.accessToken = 'pk.eyJ1IjoiYW1nMjM4MSIsImEiOiJjazg4cnVmYzAwOHAwM2hwNWo4dDF1Mnc0In0.gEE1a0ZeZSRLVTqbmaWlRw';
  const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
  mapboxClient.geocoding
  .forwardGeocode({
  query: `${city}, ${country}`,
  autocomplete: false,
  limit: 1
  })
  .send()
  .then((response) => {
    if (
      !response ||
      !response.body ||
      !response.body.features ||
      !response.body.features.length
    ) {
      console.error('Invalid response:');
      console.error(response);
      return;
    }
    const feature = response.body.features[0];
          
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/amg2381/ckw5quiel0lyn14pkuopquxf4',
      center: feature.center,
      zoom: 10
    });
          
    // Create a marker and add it to the map.
    new mapboxgl.Marker({color: '#999999'}).setLngLat(feature.center).addTo(map);
  });
}

function addEventListenerToClick(match){
  const click = document.getElementById("click")
  click.addEventListener("click", () => {
    goToDonut(match)
  })
}

function goToDonut(match){
  hideMap();
  showCauseOfDeath(match);
  showDonut(match);
  addLabel(match);
}

function hideMap(){
  document.getElementById("map").style.display = "none";
  document.getElementById("bio-cont").style.display = "none";
  document.getElementById("label").style.display = "none";
}

function showCauseOfDeath(match){
  console.log(match)
  const causeOfDeath = document.getElementById("cause-of-death");
  const deathDiv = document.createElement("div")

  if (match.category_of_death != ""){
    deathDiv.innerHTML = `
      <p>${match.name} died in ${match.year_of_death}. The cause of death was ${match.category_of_death}, conforming to the trend for musical actors.<p>
    `
  } else {
    deathDiv.innerHTML = `
      <p>If we compare to other actors in this genre, ${match.name} is most likely to die from: 1. Cancer, 2. Heart Disease, 3. Natural Causes </p>
    `
  }
  causeOfDeath.appendChild(deathDiv);
}

const w = 700
const h = 700
function showDonut(match){  
  Promise.all([ 
    d3.json("./data-cleaning/14_deathCount.json"),
    d3.json("./data-cleaning/15_deathCountsByGenre.json")
  ])
  .then(function(files) {
    const deathCount = files[0];
    const causeOfDeathByGenre = files[1];
    
    console.log(deathCount)

    let deathCountOnly = []
    for (element of deathCount){
      deathCountOnly.push(element.counts)
    }
    
    console.log(causeOfDeathByGenre)
   
    let actorsGenre = match.genre.genre.toLowerCase()

    const deathCountOnlyByGenre = [];
    const deathCauseByGenre = [];

    //console.log(causeOfDeathByGenre)
    for (element of causeOfDeathByGenre){
      if (element.genre == actorsGenre){
        
        for (a of element.countArr){
          deathCountOnlyByGenre.push(a.counts)
          deathCauseByGenre.push(a.countArr)
        }
      }
    }

    

    var svg2 = d3.select("#donut-one")
        .append("svg")
        .attr("width",w)
        .attr("height",h)
    var svg3 = d3.select("#donut-two")
        .append("svg")
        .attr("width",w)
        .attr("height",h)
      
      //define the pie layout this is just to use to make data into percents
      var pie = d3.pie()
      var colorList = ["#9e003f", "#ffacac", "#dcd0cc", "#f34b00", "#f2be62", "#625100", "#749600", "#2a5b00", "#8bd96d", "#7bd8b1", "#00ad7d", "#019a9d", "#79d4e2", "#016692", "#015fc2", "#a292ff", "#321b48", "#a300c8", "#ed87ff", "#ff60cf"]
      
      //drawArc(125, 300, "moviedata", genreCountOnly, colorList, svg1, pie)
      drawArc(125, 300, "moviedata", deathCountOnly, colorList, svg2, pie)
      drawArc(125, 300, "moviedata", deathCountOnlyByGenre, colorList, svg3, pie)
  });
}

function drawArc(inner, outer, className, dataset, colorList, svg, pie){
  var arc = d3.arc().innerRadius(inner).outerRadius(outer)

  svg.selectAll("."+className)
    .data(pie(dataset))
    .enter()
    .append("g")
    .attr("class", className)
    .attr("transform", "translate(" + w/2+ "," + h/2 + ")")
    .append("path")
    .attr("fill", function(d, i) {
      return colorList[i%colorList.length]
    })
    .attr("d", arc)

    
    .on("mouseover", function(d) {

        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5 + h/2;

        //Update the tooltip position and value
        d3.select("#tooltip")
          .style("left", xPosition + "px")
          .style("top", yPosition + "px")			
          .select("#value")
          .text(d);

        //Show the tooltip
        d3.select("#tooltip").classed("hidden", false);

    })
    .on("mouseout", function() {

        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);

    })
    .on("mousemove", function() {
         
        d3.select('#tooltip')
          .style('left', (d3.event.pageX+10) + 'px')
          .style('top', (d3.event.pageY+10) + 'px')
          
     })
}

function addLabel(match){
  const donutOneCont = document.getElementById("donut-one-title")
  const donutTwoCont = document.getElementById("donut-two-title")

  const titleOne = document.createElement("h3");
  const titleTwo = document.createElement("h3");

  titleOne.textContent = "All Actors"
  titleTwo.textContent = `${match.genre.genre} Actors`

  donutOneCont.appendChild(titleOne);
  donutTwoCont.appendChild(titleTwo);
}
