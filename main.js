async function fetchData(){
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    try {
        const response = await fetch(url);

        if (!response.ok){
            throw new Error('Erreur HTTP' +response.status);
        }
        return await response.json();
    } catch (error){
        throw error;
    }
}

async function fetchData2(){
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
rawData= fetchData()
console.log(rawData)

fetchData2()
    .then(dataDispo => console.log(dataDispo))

function processData(geodata){

    return geodata.features.map(feature =>({
        coordinates: feature.geometry.coordinates,
        magnitude: feature.properties.mag,
        time: feature.properties.time,
    }));}

function plotMap(earthquakeData){
    const trace1 = {
        locationmode: 'world',
        type : 'scattergeo',

        lon: earthquakeData.map(d => d.coordinates[0]),
        lat: earthquakeData.map(d=> d.coordinates[1]),
        text: earthquakeData.map(d => `Magnitude: ${d.magnitude} Time: ${new Date(d.time)}`),

        marker: {
            size: earthquakeData.map(d => d.magnitude * 4),
            color: earthquakeData.map(d => d.magnitude),
            cmin: 0,
            cmax: 8,
            colorscale: 'Viridis',
            colorbar: {
                title: 'Magnitude'
            }
        }
    };

    const layout1 = {
        title: 'Global Earthquakes in the Last Week',
        geo: {
            scope: 'world',
            projection: {
                type: 'natural earth'
            },
            showland: true,
            landcolor: 'rgb{243,243,243}',
            countrycolor: 'rgb(204,204,204)'

        }
    };
    Plotly.newPlot('earthquakePlot', [trace1],layout1)
}

function plotMagnitude(earthquakeData){
    
    const trace2 = {
        x: earthquakeData.map(d=> d.magnitude),
        type: 'histogram',
        marker: {
            color: 'red',
        }
    };

    const layout2 = {
        title: 'Histogram of Earthquake Magnitudes',
        xaxis: {title: 'Magnitude'},
        yaxis: {title: 'Frequency'}
    };
    Plotly.newPlot('histogramPlot', [trace2],layout2)
    
}

function plotLine(earthquakeData){
    const compteur ={};
    earthquakeData.forEach(d => {
        const date = new Date(d.time).toISOString().split('T')[0];
        if (compteur[date]) {
            compteur[date]++;
        } else {
            compteur[date] = 1;
        }        
    });

    const dates = Object.keys(compteur)
    const earthquakes = Object.values(compteur)
    const trace1 = {
        x:dates,
        y:earthquakes,
        mode: 'lines+markers',

        marker:{
            color:'purple',
        }
    };

    const layout1 ={
        title:'Daily Earthquake Frequency',
        xaxis: {
            title:'Date'},
        yaxis: {
            title:'Number of earthquakes'}
    };
    Plotly.newPlot('frequencyGraph',[trace1],layout1)
}

function PlotmagintudeVSdepth(earthquakeData){
    const magnitude = earthquakeData.map(d => d.magnitude);
    const depth = earthquakeData.map(d=>d.coordinates[2]);
    const trace1 = {
        x: magnitude,
        y:depth,
        mode: 'markers',
        marker:{
            color: 'green'
        }
    };

    const layout = {
        title: 'Magnitude vs Depth',
        xaxis: {
            title:'Magnitude'},
        yaxis: {
            title:'Depth (km)'}
    };
    
    Plotly.newPlot('depthvsMag',[trace1],layout)
}

function plotdata(earthquakeData){
    plotMap(earthquakeData);
    plotMagnitude(earthquakeData);
    plotLine(earthquakeData);
    PlotmagintudeVSdepth(earthquakeData)
}

fetchData2()
    .then(rawData => {
        cleanData=processData(rawData)
        console.log(cleanData)
        })

fetchData2()
        .then(rawData=> processData(rawData))
        .then(cleanData => plotdata(cleanData))
    