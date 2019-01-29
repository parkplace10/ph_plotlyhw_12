function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var sample = d3.select('#selDataset').node().value;
  console.log(sample)


  var metaDataUrl = (`/metadata/${sample}`)
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metaDataUrl).then(function(data){
    console.log(data)

    //set the target location to variable
    var metaDataPanel = d3.select('#sample-metadata');
    //clear existing data
    metaDataPanel.html("");
    //iterate over the sample and add data to the panel
      Object.entries(data).forEach(([key, value]) => {
        var row = metaDataPanel.append("tr");
        var cell = metaDataPanel.append("td");
        cell.text(`${key}: ${value}`);
      });
  });
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker: {
        size: data.sample_values
      }
    };
    
    var bubbleChartData = [trace1];
    
    var bubblelayout = {
      title: 'Marker Size',
      showlegend: false,
      height: 600,
      width: 600
    };
    
    Plotly.newPlot('bubble', bubbleChartData, bubblelayout);


    // @TODO: Build a Pie Chart
    var pieChartData = [{
      values: data.sample_values.sort(function(a, b){return a - b}).slice(0,10),
      labels: data.otu_ids.slice(0,10),
      type: 'pie'
    }];
    
    var pielayout = {
      height: 400,
      width: 500,
      showlegend: true,
      legend: {
        x: 5,
        y: 0.5
      }
    };
    
    Plotly.newPlot('pie', pieChartData, pielayout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });

}

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
