
// JSON data URL
let url = "/meteorites";

 
   
function init() {

  // Use D3 to select the dropdown menu
  let dropdownMenu= d3.select("#selDataset");
          
            //Fetch the JSON data
  d3.json(url).then(function(data) {
    let types = [];
    let years = [];
    for (i = 0; i < data.length; i++) {
        // Set a variable for the sample names
        let type = data[i].recclass;
        let year = data[i].year;
        types.push(type);
        years.push(year);
    };
   
    let unique_types = [];
    years.forEach(item => {
        if (!unique_types.includes(item)) {
          unique_types.push(item);
          unique_types.sort((a, b) => b - a);
        };
    });

      // Add  samples to dropdown menu
      unique_types.forEach((id) => {

          // Log the value of id for each iteration of the loop
          console.log(id);

          dropdownMenu.append("option")
          .text(id)
          .property("value",id);
      });
         // Set the default valuefrom the list
  //let sample_one = unique_types[0];
  let sample_one = 1952;
  dropdownMenu.property("value",1952);

  // Log the value of sample_one
  //  console.log(sample_one);

  // // Build the initial plots
 buildMetadata(sample_one);
 buildBarChart(sample_one);
 buildBubbleChart(sample_one);
 buildPieChart(sample_one);
 buildClassBarChart(sample_one);
  });
          
};
//Pie chart using  chart.js library
function buildPieChart(sample){
  let url_pie = "/meteorites_grpby/"+sample;
  console.log(url_pie);

  d3.json(url_pie).then((data) => {

    var labels = data.map(data => data.fall);
    var data = data.map(data => data.count);
    var colors = ['blue', 'green'];

    var ctx = document.getElementById("PieChart").getContext("2d");

    // Check if a chart already exists on the canvas
   if (window.Pie) {
    window.Pie.destroy(); // Destroy the existing chart if it exists
  }


    window.Pie = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                responsive: true,
                maintainAspectRatio: false, 
                aspectRatio: 0.5 
            }]
        },
        options: {
            title: {
                display: true,
                text: "Meteorite Fall vs Found"
            }
        }
    });

  });

};
//Bar chart using chart.js
function buildClassBarChart(sample){

  let url_bclass= "/meteorites_byclass/"+sample;
  console.log(url_bclass);
  d3.json(url_bclass).then((data) => {

    data.sort((a, b) => b.count - a.count);
    const labels = data.map(data => data.recclass);
    const counts = data.map(data => data.count);




    var ctx = document.getElementById("BarChart").getContext("2d");

    // Check if a chart already exists on the canvas
   if (window.Bar) {
    window.Bar.destroy(); // Destroy the existing chart if it exists
  };
   window.Bar = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
          label: "Count",
          data: counts,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
      }]
    },
    options: {
      title: {
        display: true,
        text: "Distribution of Meteorite by class"
    },
      scales: {
          y: {
              beginAtZero: true
          }
      }
  }
      
  });
});

};





// Function that populates metadata info
function buildMetadata(sample) {

  let url_yr = "/meteorites/"+sample;
console.log(url_yr)

  let metadats =[];
    // Use D3 to retrieve all of the data
    d3.json(url_yr).then((data) => {
      for (i = 0; i < data.length; i++) {
     let metadata ={
      "name":data[i].name,
      "year":data[i].year,
      "mass":data[i].mass,
      "class":data[i].recclass
     
     }
     metadats.push(metadata);
    }
        

        // Filter based on the value of the sample
        //let value = metadats.filter(result => result.year == sample);
          let value = metadats;
        // Log the array of metadata objects after the have been filtered
        // console.log(value)
        
        
        let MassData =[];
        let classData =[];
        let nameData =[];
        let total_meteroites = value.length;
        for ( i =0;i< value.length;i++){
            MassData.push(value[i].mass);
            classData.push(value[i].class);
            nameData.push(value[i].name);
        }
        let total_mass =0;
        
        var max_mass = Math.max(...MassData);
        var min_mass = Math.min(...MassData);
        let unique_class = [];
        classData.forEach(item => {
            if (!unique_class.includes(item)) {
                unique_class.push(item);
            }
        });
        let valueData ={
            "Fell/Found"             :total_meteroites,
            "Types"                  :unique_class.length,
            "Mass(g)"                :"",
            "Max"                    :max_mass,
            "Min"                    :min_mass
           
        }
        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
        });
    });

};

// // Function that builds the bar chart
function buildBarChart(sample) {
  let url_yr = "/meteorites/"+sample;
  console.log(url_yr);
  let sampleInfo = [];

  // Use D3 to retrieve all of the data
  d3.json(url_yr).then((data) => {
      for (let i = 0; i < data.length; i++) {
          let metadata = {
              "name": data[i].name,
              "year": data[i].year,
              "mass": data[i].mass,
              "class": data[i].recclass,
              "id": data[i].id
          };
          sampleInfo.push(metadata);
      }
console.log("sampleInfo",sampleInfo);
      // Filter based on the value of the sample
      //let value = sampleInfo.filter(result => result.year == sample);
      let value = sampleInfo;
      //value.sort((a, b) => b.mass - a.mass);
      console.log('sample',sample);
    console.log('value',value);
      if (value.length === 0) {
          console.error(`No data found for class: ${sample}`);
          return;
      }
  console.log('value',value);
      // Get the first index from the array
      let valueData = value[0];
      let met_names =[];
      let met_years =[];
      let mass_values =[];
      let ids =[];
for(i =0;i<value.length;i++){
  // Get the names, years, and mass
  
   met_names.push(value[i].name);
   met_years.push(value[i].year);
   mass_values.push(value[i].mass);
   //mass_values.sort((a, b) => b - a);
   ids.push(value[i].id);

}
      
  console.log("metnames",met_names);
      // Set top ten items to display in descending order
      let yticks = met_names.slice(0, 10).map(id => ` ${id}`).reverse();
      let xticks = mass_values.slice(0, 10).reverse();
      let labels = met_years.slice(0, 10).reverse();


      // Set up the trace for the bar chart
      let trace = {
          x: xticks,
          y: yticks,
         text:xticks,
          type: "bar",
          orientation: "h",
          mode: "markers",
            marker: {                
                color: xticks,
                colorscale: "YlOrRd",                
                showscale: true // Show color scale
            }
      };

      // Setup the layout
      let layout = {
          title: "Top 10 Largest Metorite",
          xaxis: {title: "Mass(g)"},
          yaxis: {title: "Meteroites"}
      };

      // Call Plotly to plot the bar chart
      Plotly.newPlot("bar", [trace], layout);
  });
};
// // Function that builds the bubble chart
function buildBubbleChart(sample) {
    let url_yr = "/meteorites/"+sample;
    console.log(url_yr);
    // Use D3 to retrieve all of the data
    d3.json(url_yr).then((data) => {
      let sampleInfo =[];
      for (let i = 0; i < data.length; i++) {
          let metadata = {
              "name": data[i].name,
              "year": data[i].year,
              "mass": data[i].mass,
              "class": data[i].recclass,
              "id": data[i].id
          };
          sampleInfo.push(metadata);
      }

      // Filter based on the value of the sample
      //let value = sampleInfo.filter(result => result.year == sample);
        let value = sampleInfo;
      if (value.length === 0) {
          console.error(`No data found for class: ${sample}`);
          return;
      }
  console.log('value',value);
      // Get the first index from the array
      let valueData = value[0];
      let met_names =[];
      let met_years =[];
      let mass_values =[];
      let ids =[];
for(i =0;i<value.length;i++){
  // Get the names, years, and mass
   met_names.push(value[i].name);
   met_years.push(value[i].year);
   mass_values.push(value[i].mass);
   ids.push(value[i].id);

}
let met_names_sorted = met_names.slice(0, 10).map(id => ` ${id}`).reverse();
let mass_values_sorted = mass_values.slice(0, 10).reverse();
//let met_years_sorted = met_years.slice(0, 10).reverse();
  console.log("metnames",met_names);
        // Set up the trace for bubble chart
        let trace1 = {
            x:  met_names_sorted,
            y: mass_values_sorted,
            text: met_names_sorted,
            mode: "markers",
            marker: {
                size:mass_values_sorted.map(mass => Math.sqrt(mass)/2),
                color: mass_values_sorted,
                colorscale: "YlOrRd",                
                showscale: true // Show color scale
            }
        };

        // Set up the layout
        let layout = {
            title: "Meteroites & Mass",
            hovermode: "closest",
            xaxis: {title: "Meteroites"},
            yaxis: {title: "Mass(g)"},
            height: 700,
            width: 1200
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};





// This function is called when a dropdown menu item is selected
function optionChanged(value) {
  // Log the new value
  console.log(value); 

  // Call all functions 
  buildMetadata(value);
  buildBarChart(value);
  buildBubbleChart(value);
  buildPieChart(value);
  buildClassBarChart(value);

    
} ;

            
  



init();