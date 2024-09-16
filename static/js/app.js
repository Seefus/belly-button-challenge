// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // checking if data pulled in
    console.log("Full data:", data);

    // get the metadata field
    let metadata =data.metadata;

    // Filter the metadata for the object with the desired sample number
    let desiredSample = metadata.filter(item =>item.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let key in desiredSample) {
      panel.append('p').text(`${key}: ${desiredSample[key]}`);
    }
  });
}
//used stack over flow and a lot of help from TA's for the code above

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleField = data.samples;

    // checking sampleField
    console.log("Sample Field:", sampleField);

    // Filter the samples for the object with the desired sample number
    let desiredSampleNumber = sampleField.filter(item => item.id == sample)[0];

    // checking desiredSampleNumber
    console.log("Desired Sample Number:", desiredSampleNumber);

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = desiredSampleNumber.otu_ids;
    let otuLabels = desiredSampleNumber.otu_labels;
    let sampleValues = desiredSampleNumber.sample_values;

    // Log each variable to ensure they are being set correctly
    console.log("otuIds:", otuIds);
    console.log("otuLabels:", otuLabels);
    console.log("sampleValues:", sampleValues);

    // Build a Bubble Chart
    let bubbleLayout ={
      title: "Bacteria Cultures Per Sample",
      xaxis: {title:"OTU ID"},
      yaxis: {title:"Number of Bacteria"},
      hovermode: 'closest',
    };

    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    }];

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otuIds.slice(0,10).map(otuIds => `OTU ${otuIds}`).reverse();


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
      y: yticks,
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type :"bar",
      orientation : "h"
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis : {title:"Number of Bacteria"}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
