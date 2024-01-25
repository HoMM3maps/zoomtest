document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('hexCanvas');
    const ctx = canvas.getContext('2d');
    const fixedRowCount = 30;
    const fixedColumnCount = 36.59;
    let hexagons = [];
    const zoomLevels = [30, 45, 60, 75];
    let currentZoomIndex = 0;
    const backgroundImage = new Image();
    backgroundImage.src = 'fog.png'; // Replace with your background image path

    function drawHexagon(x, y, size, highlight = false) {
        ctx.strokeStyle = highlight ? 'yellow' : 'gray';
        ctx.lineWidth = highlight ? 3 : 1;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i - Math.PI / 6;
            ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
        }
        ctx.closePath();
        ctx.stroke();
    }

    function createHexGrid(hexSize) {
        const hexWidth = Math.sqrt(3) * hexSize;
        const hexHeight = 2 * hexSize;
        canvas.width = fixedColumnCount * hexWidth;
        canvas.height = fixedRowCount * hexHeight * 3/4;

        hexagons = [];
        for (let col = 0; col < fixedColumnCount; col++) {
            for (let row = 0; row < fixedRowCount; row++) {
                const x = col * hexWidth + (row % 2) * hexWidth / 2;
                const y = row * hexHeight * 3/4;
                hexagons.push({ x, y, size: hexSize });
            }
        }
        redrawGrid();
    }

    function redrawGrid(highlightedHex = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = ctx.createPattern(backgroundImage, 'repeat');
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        hexagons.forEach(hex => {
            const isHighlighted = highlightedHex && hex.x === highlightedHex.x && hex.y === highlightedHex.y;
            drawHexagon(hex.x, hex.y, hex.size, isHighlighted);
        });
    }

    function isInsideHitbox(point, hexCenter, hexSize) {
        const dx = point.x - hexCenter.x;
        const dy = point.y - hexCenter.y;
        return Math.sqrt(dx * dx + dy * dy) < hexSize;
    }

    function handleEvent(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const highlightedHex = hexagons.find(hex => isInsideHitbox({ x, y }, hex, hex.size));
        redrawGrid(highlightedHex);
    }

    document.getElementById('zoomIn').addEventListener('click', function() {
        if (currentZoomIndex < zoomLevels.length - 1) {
            currentZoomIndex++;
            createHexGrid(zoomLevels[currentZoomIndex]);
        }
    });

    document.getElementById('zoomOut').addEventListener('click', function() {
        if (currentZoomIndex > 0) {
            currentZoomIndex--;
            createHexGrid(zoomLevels[currentZoomIndex]);
        }
    });

    backgroundImage.onload = function() {
        createHexGrid(zoomLevels[currentZoomIndex]);
    };

    window.addEventListener('resize', function() {
        createHexGrid(zoomLevels[currentZoomIndex]);
    });

    canvas.addEventListener('mousemove', handleEvent);
    canvas.addEventListener('touchmove', handleEvent);
});
