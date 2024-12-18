const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

canvas.width = Math.min(window.innerWidth * 0.9, 800); 
canvas.height = 600;

const vertexInput = document.getElementById("vertexCount");
const edgeInput = document.getElementById("edgeCount");
const loopInput = document.getElementById("loopCount");
const generateButton = document.getElementById("generateGraphBtn");
const clearButton = document.getElementById("clearGraphBtn");
const toggleDirectedButton = document.getElementById("toggleDirectedBtn");

let vertices = []; // Store vertices {x, y, id}
let edges = []; // Store edges {startVertex, endVertex}
let loops = []; // Store loops {vertex}
let isDirected = false; // Whether the graph is directed or not

// Generate the graph based on user input
generateButton.addEventListener("click", () => {
  const vertexCount = parseInt(vertexInput.value);
  const edgeCount = parseInt(edgeInput.value);
  const loopCount = parseInt(loopInput.value);

  if (isNaN(vertexCount) || isNaN(edgeCount) || vertexCount <= 0 || edgeCount < 0) {
    alert("Please enter valid numbers for vertices and edges!");
    return;
  }

  if (edgeCount > vertexCount * (vertexCount - 1) / 2) {
    alert("Too many edges for the given number of vertices. Try a smaller number of edges.");
    return;
  }

  if (!isNaN(loopCount) && loopCount > vertexCount) {
    alert("The number of loops cannot exceed the number of vertices.");
    return;
  }

 
  vertices = [];
  edges = [];
  loops = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  generateVertices(vertexCount);

  generateEdges(edgeCount);

  
  if (!isNaN(loopCount) && loopCount > 0) {
    generateLoops(loopCount);
  }
});


clearButton.addEventListener("click", () => {
  vertices = [];
  edges = [];
  loops = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});


toggleDirectedButton.addEventListener("click", () => {
  isDirected = !isDirected;
  updateGraphTypeDisplay();
  ctx.clearRect(0, 0, canvas.width, canvas.height);  
  
  generateGraph(); 
});


function updateGraphTypeDisplay() {
  const graphTypeDisplay = document.getElementById("graphTypeDisplay");
  graphTypeDisplay.textContent = isDirected ? "Graph Type: Directed" : "Graph Type: Undirected";
}

function generateVertices(vertexCount) {
  const minDistance = 50; 

  for (let i = 1; i <= vertexCount; i++) {
    let x, y;
    let validPosition = false;

    while (!validPosition) {
      x = Math.random() * (canvas.width - 100) + 50;
      y = Math.random() * (canvas.height - 100) + 50;

      validPosition = vertices.every(
        (v) => Math.sqrt((x - v.x) ** 2 + (y - v.y) ** 2) >= minDistance
      );
    }

    vertices.push({ x, y, id: i });
    drawVertex(x, y, i);
  }
}


function generateEdges(edgeCount) {
  const edgeSet = new Set();

  while (edges.length < edgeCount) {
    const startIndex = Math.floor(Math.random() * vertices.length);
    const endIndex = Math.floor(Math.random() * vertices.length);

    if (startIndex !== endIndex) {
      const edgeKey = [startIndex, endIndex].sort().join("-");
      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        const startVertex = vertices[startIndex];
        const endVertex = vertices[endIndex];
        edges.push({ startVertex, endVertex });
        drawEdge(startVertex, endVertex);
      }
    }
  }
}


function generateLoops(loopCount) {
  const loopSet = new Set();

  while (loops.length < loopCount) {
    const vertexIndex = Math.floor(Math.random() * vertices.length);

    if (!loopSet.has(vertexIndex)) {
      loopSet.add(vertexIndex);
      const vertex = vertices[vertexIndex];
      loops.push(vertex);
      drawLoop(vertex);
    }
  }
}


function drawVertex(x, y, id) {
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fillStyle = "#3498db";
  ctx.fill();
  ctx.strokeStyle = "#2c3e50";
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "16px Arial";
  ctx.fillText(id, x, y);
  ctx.closePath();
}


function drawEdge(startVertex, endVertex) {
  ctx.beginPath();
  ctx.moveTo(startVertex.x, startVertex.y);
  ctx.lineTo(endVertex.x, endVertex.y);

  if (isDirected) {
    
    const angle = Math.atan2(endVertex.y - startVertex.y, endVertex.x - startVertex.x);
    const arrowSize = 10;

    ctx.lineTo(endVertex.x - arrowSize * Math.cos(angle - Math.PI / 6), endVertex.y - arrowSize * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(endVertex.x, endVertex.y);
    ctx.lineTo(endVertex.x - arrowSize * Math.cos(angle + Math.PI / 6), endVertex.y - arrowSize * Math.sin(angle + Math.PI / 6));
  }

  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}


function drawLoop(vertex) {
  const loopRadius = 20; 
  const offsetAngle = Math.PI / 4; 

  const loopX = vertex.x + 20 * Math.cos(offsetAngle); 
  const loopY = vertex.y + 20 * Math.sin(offsetAngle);

 
  ctx.beginPath();
  ctx.arc(loopX, loopY, loopRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#28a745"; 
  ctx.lineWidth = 4; 
  ctx.stroke();
}


function generateGraph() {
  const vertexCount = parseInt(vertexInput.value);
  const edgeCount = parseInt(edgeInput.value);
  const loopCount = parseInt(loopInput.value);

  if (isNaN(vertexCount) || isNaN(edgeCount) || vertexCount <= 0 || edgeCount < 0) {
    alert("Please enter valid numbers for vertices and edges!");
    return;
  }

  if (edgeCount > vertexCount * (vertexCount - 1) / 2) {
    alert("Too many edges for the given number of vertices. Try a smaller number of edges.");
    return;
  }

  if (!isNaN(loopCount) && loopCount > vertexCount) {
    alert("The number of loops cannot exceed the number of vertices.");
    return;
  }

  // Clear previous graph
  vertices = [];
  edges = [];
  loops = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  generateVertices(vertexCount);

  
  generateEdges(edgeCount);

  
  if (!isNaN(loopCount) && loopCount > 0) {
    generateLoops(loopCount);
  }
}