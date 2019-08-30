function buildMetadata(sample) {

  // var sample = d3.select('#selDataset').property("value");
  var url = `/metadata/${sample}`;

  // Promise Pending
  d3.json(url).then(function(data) {

    console.log("Data Promise: ", data);
  
      // Use d3 to select the panel with id of `#sample-metadata`
  var sampleinput = d3.select("#sample-metadata");
      
      // Use `.html("") to clear any existing metadata
  d3.select("#sample-metadata").html("");
  
     // Use `Object.entries` to add each key and value pair to the panel
  Object.entries(data).forEach(([key, value]) => {
  sampleinput.append("ul").text(`${key}: ${value}`);
  });
  });
};

function buildCharts(sample) {
      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
  var url_pie = `/samples/${sample}`;

  d3.json(url_pie).then(function(data) {

      var pie_data = [{
        values: data['sample_values'].slice(0, 10),
        labels: data['otu_ids'].slice(0, 10),
        hoverinfo: data['otu_labels'].slice(0, 10),
        type: 'pie'
      }];
      
        var layout = {
            height: 500,
            width: 500
          };

          Plotly.newPlot("pie", pie_data, layout);
 
    // Create a Bubble Chart that uses data from your samples route (/samples/<sample>) to display each sample.
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    // @TODO: Build a Bubble Chart using the sample data
   
    var bubble_data = [{
      x: data['sample_values'],
      y: data['otu_ids'],
      text: data['otu_labels'],
      mode: 'markers',
      marker: {
        size: data['sample_values'],
        color: data['otu_ids']
      }
    }];
    
    var bubble_layout = {
      title: 'Bubble',
      showlegend: false,
      height: 600,
      width: 900
    };
    
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

  });

};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
