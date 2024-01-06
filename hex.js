const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
let scale = 0.5;
let hexRadius = 60;
const zoomLevels = [0.5, 0.7, 1, 1.5];
let currentZoomLevel = 1;
const horizontalSpacing = -16;
const verticalSpacing = -15;
const rowOffset = 53;
const numberOfRows = 20; // Adjusted number of rows
const numberOfColumns = 31; // Adjusted number of columns
let hexagons = [];

function drawHex(x, y, radius) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i + Math.PI / 6;
    const hx = x + radius * Math.cos(angle);
    const hy = y + radius * Math.sin(angle);
    ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function zoomIn() {
  if (currentZoomLevel < zoomLevels.length - 1) {
    currentZoomLevel++;
    scale = zoomLevels[currentZoomLevel];
    updateCanvasSize();
    redraw();
    updateZoomDisplay();
  }
}

function zoomOut() {
  if (currentZoomLevel > 0) {
    currentZoomLevel--;
    scale = zoomLevels[currentZoomLevel];
    updateCanvasSize();
    redraw();
    updateZoomDisplay();
  }
}

function updateCanvasSize() {
  const width = numberOfColumns * (2 * hexRadius + horizontalSpacing) + rowOffset;
  const height = numberOfRows * (Math.sqrt(3) * hexRadius + verticalSpacing);
  canvas.width = width * scale;
  canvas.height = height * scale;
}

function initializeHexGrid() {
  hexagons = [];

  for (let q = 0; q < numberOfColumns; q++) {
    for (let r = 0; r < numberOfRows; r++) {
      const x = q * (2 * hexRadius + horizontalSpacing) + (r % 2) * rowOffset;
      const y = r * (Math.sqrt(3) * hexRadius + verticalSpacing);
      hexagons.push({ x, y, radius: hexRadius });
    }
  }
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  for (let i = 0; i < hexagons.length; i++) {
    const { x, y, radius } = hexagons[i];
    drawHex(x, y, radius);
  }
}

function updateZoomDisplay() {
  document.getElementById('zoomDisplay').innerText = `Zoom Level: ${scale}`;
}

document.getElementById('zoomOutButton').addEventListener('click', zoomOut);
document.getElementById('zoomInButton').addEventListener('click', zoomIn);

window.addEventListener('resize', () => {
  updateCanvasSize();
  initializeHexGrid();
  redraw();
});

updateCanvasSize();
initializeHexGrid();
redraw();
updateZoomDisplay();