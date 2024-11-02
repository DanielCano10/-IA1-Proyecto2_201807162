const trainingObjectiveSelect = document.getElementById('trainingObjective');
const specificArgsDiv = document.getElementById('specificArgs');
const algorithmSelect = document.getElementById('algorithmSelect');

let xTrain = [];
let yTrain = [];
var yPredict;

algorithmSelect.addEventListener('change', function () {
    const algorithm = algorithmSelect.value;
    specificArgsDiv.innerHTML = '';

    //const objective = this.value;

    if (algorithm==='linearRegression'){
        specificArgsDiv.innerHTML = `
            <label for="xRange">Nuevo rango del eje x:</label>
            <input type="text" id="xRange" placeholder="Ingrese rango separado por comas (1,2,3,...)">
        `;
    }else if(algorithm==='decisionTree'){
        specificArgsDiv.innerHTML = `
            <label for="predecirDato">Ingrese nuevos datos para predecir</label>
            <input type="text" id="predecirDato" placeholder="Ingrese nuevas clases para predecir separado por comas(clase1,clase2,clase3,...)">
            <button id="agregarDatos">Agregar</button>
        `;
    }else if(algorithm==='naiveBayes'){
        specificArgsDiv.innerHTML = `
            <label for="objetivoPrediccion">Prediccion:</label>
            <select id="objetivoPrediccion">
                <option value="clima">clima</option>
                <option value="temperatura">temperatura</option>
                <option value="humedad">humedad</option>
                <option value="viento">viento</option>
                <option value="juega">juega</option>
            </select>

            <label for="datoCuando">Cuando:</label>
            <label for="datoClima">clima:</label>
            <select id="datoClima">
                <option value="soleado">soleado</option>
                <option value="nublado">nublado</option>
                <option value="lluvioso">lluvioso</option>
            </select>
        `;
    }
    /*
    if (objective === 'prediction') {
        specificArgsDiv.innerHTML = `
            <label for="xRange">New Range on X-Axis:</label>
            <input type="text" id="xRange" placeholder="Enter range (e.g., 0-100)">
        `;
    } else if (objective === 'classification') {
        specificArgsDiv.innerHTML = `
            <label for="numClasses">Number of Classes:</label>
            <input type="number" id="numClasses" min="2" placeholder="Enter number of classes">
        `;
    } else if (objective === 'trends' || objective === 'patterns') {
        specificArgsDiv.innerHTML = `
            <label for="modelArgs">Model Specific Arguments:</label>
            <input type="text" id="modelArgs" placeholder="Enter model arguments">
        `;
    }
        */
});


document.getElementById('trainButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput').files[0];
    const trainPercentage = document.getElementById('trainPercentage').value;
    const algorithm = algorithmSelect.value;

    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const content = event.target.result;
            parseCSV(content);
            if (algorithm === 'linearRegression') {
                trainLinearRegression();
            }
        };
        reader.readAsText(fileInput);
    } else {
        alert("Please select a CSV file.");
    }
});

function parseCSV(content) {
    const lines = content.split('\n');
    for (let i = 1; i < lines.length; i++) { // Skip header
        const [x, y] = lines[i].split(';').map(Number);
        if (!isNaN(x) && !isNaN(y)) {
            xTrain.push(x);
            yTrain.push(y);
        }
    }
}

function trainLinearRegression() {
    var linear = new LinearRegression();
    linear.fit(xTrain, yTrain);
    yPredict = linear.predict(xTrain);

    // Log the results
    document.getElementById("log").innerHTML = `
        <br>X Train: ${xTrain}<br>
        Y Train: ${yTrain}<br>
        Y Predict: ${yPredict}
    `;

    // Prepare data for Google Charts
    var a = joinArrays('x', xTrain, 'yTrain', yTrain, 'yPredict', yPredict);

    // Load Google Charts and draw the chart
    //google.charts.load('current', { 'packages': ['corechart'] });
    //google.charts.setOnLoadCallback(() => drawChart(a));
}

function drawChart(dataArray) {
    var data = google.visualization.arrayToDataTable(dataArray);
    var options = {
        title: 'Linear Regression',
        seriesType: 'scatter',
        series: { 1: { type: 'line' } }
    };
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}
function joinArrays(labelX, xArray, labelY, yArray, labelYPred, yPredArray) {
    var result = [[labelX, labelY, labelYPred]];
    for (var i = 0; i < xArray.length; i++) {
        result.push([xArray[i], yArray[i], yPredArray[i]]);
    }
    return result;
}
document.getElementById('showGraphsButton').addEventListener('click', function () {

    const algorithm = algorithmSelect.value;

    if (algorithm === 'linearRegression') {
        if (xTrain.length === 0 || yTrain.length === 0) {
            alert("Please train the model first by uploading a CSV file and clicking 'Train Model'.");
        } else {
    
            // Prepare data for Google Charts
            const chartData = joinArrays('x', xTrain, 'yTrain', yTrain, 'yPredict', yPredict);
    
            // Load Google Charts and draw the chart
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(() => drawChart(chartData));
        }
    }

    
});