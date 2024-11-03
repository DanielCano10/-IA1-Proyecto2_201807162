const trainingObjectiveSelect = document.getElementById('trainingObjective');
const specificArgsDiv = document.getElementById('specificArgs');
const algorithmSelect = document.getElementById('algorithmSelect');

//Para regresion lineal
let xTrain = [];
let yTrain = [];
let xpredict=[]
var yPredict;
var linear;
//para arbol
let dTree;
let root;
let arregloArbol = [];
let arbolTrain = [];
let dotStr;
let predictNode;
//para naive bayes
var naive;
var nombres=[];
var cli=[];
var tem=[];
var hum=[];
var vie=[];
var jue=[];

algorithmSelect.addEventListener('change', function () {
    const algorithm = algorithmSelect.value;
    specificArgsDiv.innerHTML = '';

    if (algorithm==='linearRegression'){
        specificArgsDiv.innerHTML = `
            <label for="xRange">Nuevo rango del eje x:</label>
            <input type="text" id="xRange" placeholder="Ingrese rango separado por comas (1,2,3,...)">
        `;
    }else if(algorithm==='decisionTree'){
        specificArgsDiv.innerHTML = `
            <label for="predecirDato">Ingrese nuevos datos para predecir</label>
            <input type="text" id="predecirDato" placeholder="Ingrese nuevas clases para predecir separado por comas (clase1,clase2,clase3,...)">
            <button id="agregarDatos" onclick="addToArray()">Agregar</button>
            <p id="mensaje"></p>
            <p>Datos a predecir: <span id="arrayDisplay">[]</span></p>
            <br />
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
            <label for="datoTemperatura">temperatura:</label>
            <select id="datoTemperatura">
                <option value="calor">calor</option>
                <option value="templado">templado</option>
                <option value="frio">frio</option>
            </select>
            <label for="datoHumedad">humedad:</label>
            <select id="datoHumedad">
                <option value="alta">alta</option>
                <option value="normal">normal</option>
            </select>
            <label for="datoViento">viento:</label>
            <select id="datoViento">
                <option value="no">no</option>
                <option value="si">si</option>
            </select>
            <label for="datoJuega">juega:</label>
            <select id="datoJuega">
                <option value="no">no</option>
                <option value="si">si</option>
            </select>
            
        `;
    }
});


document.getElementById('trainButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput').files[0];
    const algorithm = algorithmSelect.value;
    xTrain=[];
    yTrain=[];
    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const content = event.target.result;
            if (algorithm === 'linearRegression') {
                parseCSVLR(content);
                trainLinearRegression();
            }else if(algorithm==='decisionTree'){
                parseCSVAD(content);
                //console.log(arbolTrain);
                trainDecisionTree();
            }else if(algorithm==='naiveBayes'){
                parseCSVNB(content);
                trainNaives();
            }
            
        };
        reader.readAsText(fileInput);
    } else {
        alert("Por favor seleccione un archivo CSV.");
    }
});

document.getElementById('predictButton').addEventListener('click', function () {
    const algorithm = algorithmSelect.value;
    xpredict=[];
    if (algorithm === 'linearRegression') {
        if (xTrain.length === 0 || yTrain.length === 0) {
            alert("Por favor entrena el modelo primero");
        }else{
            const xRangeInput = document.getElementById("xRange").value;
            if (xRangeInput === "") {
                alert("El campo de rango a predecir esta vacio")
            } else {
                const numbers = xRangeInput.split(",").map(num => Number(num.trim()));
                xpredict.push(...numbers);
                predictLinearRegression();
            }
        }
        
    }else if (algorithm === 'decisionTree'){
        if(arregloArbol.length===0 || arregloArbol===1){
            alert("Por favor ingresa valores para predecir el arbol, los primeros datos son el encabezado");    
        }else{
            predictDecisionTree();
        }
    }
    else if (algorithm === 'naiveBayes'){
        if(nombres.length===0){
            alert("Por favor ingresa valores para predecir , los primeros datos son el encabezado");    
        }else{
            predictNaives();
        }
    }

});

//FUNCIONES PARA LEER LOS ARCHIVOS CSV DE CADA ALGORITMO
function parseCSVLR(content) {
    const lines = content.split('\n');
    for (let i = 1; i < lines.length; i++) { // Skip header
        const [x, y] = lines[i].split(';').map(Number);
        if (!isNaN(x) && !isNaN(y)) {
            xTrain.push(x);
            yTrain.push(y);
        }
    }
}
function parseCSVAD(content) {
    const lines = content.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const arreglonuevo = lines[i].split(',').map(value => value.trim());
        arbolTrain.push(arreglonuevo);
    }
}

function parseCSVNB(content) {
    const lines = content.split('\n');
    nombres = lines[0].split(',').map(value => value.trim());
    for (let i = 1; i < lines.length; i++) {
        const arreglonb = lines[i].split(',').map(value => value.trim());
        cli.push(arreglonb[0]);
        tem.push(arreglonb[1]);
        hum.push(arreglonb[2])
        vie.push(arreglonb[3])
        jue.push(arreglonb[4])
    }
}

//FUNCIONESL PARA EL ENTRENAMIENTO DE CADA ALGRITMO
function trainLinearRegression() {
    linear = new LinearRegression();
    linear.fit(xTrain, yTrain);

    document.getElementById("log").innerHTML = `
        <br>X Train: ${xTrain}<br>
        Y Train: ${yTrain}<br>
    `;

}
function trainDecisionTree() {
    dTree = new DecisionTreeID3(arbolTrain);
    root = dTree.train(dTree.dataset);

    document.getElementById("log").innerHTML = `
        <br>Datos para arbol entrenado: <br>
        <span id="arregloEntrenado"></span>
    `;
    document.getElementById("arregloEntrenado").textContent= JSON.stringify(arbolTrain);

}

function trainLinearRegression() {
    linear = new LinearRegression();
    linear.fit(xTrain, yTrain);

    document.getElementById("log").innerHTML = `
        <br>X Train: ${xTrain}<br>
        Y Train: ${yTrain}<br>
    `;

}
function trainNaives() {
    naive = new NaiveBayes();
    naive.insertCause(nombres[0], cli);
    naive.insertCause(nombres[1], tem);
    naive.insertCause(nombres[2], hum);
    naive.insertCause(nombres[3], vie);
    naive.insertCause(nombres[4], jue);

    let arregloentrenadonb=[nombres,cli,tem,hum,vie,jue]
    document.getElementById("log").innerHTML = `
        <br>Datos para naives: <br>
        <span id="arregloNB"></span>
    `;
    document.getElementById("arregloNB").textContent= JSON.stringify(arregloentrenadonb);

}


//FUNCIONES PARA PREDICCION DE CADA ALGORITMO
function predictLinearRegression() {
    yPredict = linear.predict(xpredict);
    document.getElementById("log").innerHTML = `
        <br>X Train: ${xTrain}<br>
        Y Train: ${yTrain}<br>
        Y Predict: ${yPredict}
    `;

}

function predictDecisionTree() {
    let predict =dTree.predict(arregloArbol, root);
    dotStr=dTree.generateDotString(root);
    predictNode= predict;

    document.getElementById("log2").innerHTML = `
        <br>Datos para prediccion para arbol entrenado: <br>
        <span id="arregloPrediccion"></span>
    `;
    document.getElementById("arregloPrediccion").textContent= JSON.stringify(arregloArbol);
}

function predictNaives() {
    var effect = document.getElementById("objetivoPrediccion").value;
    let my_causes = [];
    my_causes.push(["clima",document.getElementById('datoClima').value])
    my_causes.push(["temperatura",document.getElementById('datoTemperatura').value])
    my_causes.push(["humedad",document.getElementById('datoHumedad').value])
    my_causes.push(["viento",document.getElementById('datoViento').value])
    my_causes.push(["juega",document.getElementById('datoJuega').value])

    var predictionnb = naive.predict(effect, my_causes);

    document.getElementById("log2").innerHTML = `
        <br>Datos resultados de prediccion: <br>
        <span id="predict_result">`+predictionnb[0] + " " + predictionnb[1]+`</span>
    `;
}

//LAS DEMAS FUNCIONES PARA GRAFICAS Y OPERACIONES
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

function drawChartAD() {
    var parsDot = vis.network.convertDot(dotStr);
    var data = {
        nodes: parsDot.nodes,
        edges: parsDot.edges
    }

    var chart =document.getElementById('chart_div');
    var options = {
        layout: {
            hierarchical: {
                levelSeparation: 100,
                nodeSpacing: 100,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed',                    
            },
        },
    };
    var network = new vis.Network(chart, data, options);
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
            alert("Por favor entrena y predice el modelo primero");
        } else {
    
            // Prepare data for Google Charts
            const chartData = joinArrays('x', xTrain, 'yTrain', yTrain, 'yPredict', yPredict);
    
            // Load Google Charts and draw the chart
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(() => drawChart(chartData));
        }
    }else if(algorithm === 'decisionTree'){
        if(arregloArbol.length===0 || arregloArbol===1){
            alert("Por favor ingresa valores para mostrar el arbol");    
        }else{
            drawChartAD();
        }
    }

    
});

function addToArray() {
    const datosArbol = document.getElementById("predecirDato").value;
    const message = document.getElementById("mensaje");
    if(datosArbol===""){
        message.textContent="Esta vacio"
    }else{
        const valoresarbol = datosArbol.split(",").map(num => String(num.trim()));
        let arregloaux = [];
        arregloaux.push(...valoresarbol);
        arregloArbol.push(arregloaux);
        message.textContent=""
        console.log(arregloArbol)
        document.getElementById("arrayDisplay").textContent= JSON.stringify(arregloArbol);
    }
    document.getElementById("predecirDato").value="";
}
