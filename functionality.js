

const usrLoc = document.getElementById('loc');

let center = [53, 10],
    width = 500,
    height = 500;

const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
    });

map = new L.Map('map', {
    layers: [osm],
    center: new L.LatLng(center[0], center[1]),
    zoom: 14,
    zoomOffset: -1,
    minZoom: 1,
});


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
}

function showPosition(position) {
    let nlatidude = position.coords.latitude;
    let nlongitude = position.coords.longitude;
    map.setView([nlatidude, nlongitude], 18);
    alert("Twoja lokalizacja: " + nlatidude + ", " + nlongitude);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Potwierdzono dostep do geolokalizacji");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Nie potwierdzono dostep do geolokalizacji.");
            break;
        
        
    }
}




function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}




function captureMap() {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    pieces = 4;
    puzzleWidth = '120px';
    puzzleHeight = '120px';

    leafletImage(map, function(err, canvas) {
        if (err) {
            console.log(err);
            return;
        }

        let pieceWidth = canvas.width / pieces;
        let pieceHeight = canvas.height / pieces;

        let puzzleContainer = document.getElementById('puzzle');
        puzzleContainer.innerHTML = '';
        let elements = [];

        for (let i = 0; i < pieces; i++) {
            for (let j = 0; j < pieces; j++) {
                let placeholder = document.createElement('div');
                placeholder.className = 'placeholder';
                placeholder.id = 'placeholder-' + i + '-' + j;
                placeholder.style.width = puzzleWidth;
                placeholder.style.height = puzzleHeight;
                placeholder.addEventListener('dragover', (ev) => {
                    ev.preventDefault();
                    placeholder.classList.add('dragover');
                });
                placeholder.addEventListener('dragleave', () => {
                    placeholder.classList.remove('dragover');
                });
                placeholder.addEventListener('drop', (ev) => {
                    ev.preventDefault();
                    placeholder.classList.remove('dragover');
                });
                puzzleContainer.appendChild(placeholder);

                let pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceWidth;
                pieceCanvas.height = pieceHeight;
                let context = pieceCanvas.getContext('2d');
                context.drawImage(canvas, j * pieceWidth, i * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

                let img = document.createElement('img');
                img.className = 'piece';
                img.id = 'piece-' + i + '-' + j;
                img.src = pieceCanvas.toDataURL();
                img.style.width = puzzleWidth;
                img.style.height = puzzleHeight;
                img.draggable = true;
                img.ondragstart = drag;
                img.ondragend = puzzleCheck;
                elements.push(img);
            }
        }

        let elementsContainer = document.getElementById('elements');
        elementsContainer.innerHTML = '';
        shuffleArray(elements);
        elements.forEach(img => elementsContainer.appendChild(img));
    });
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let draggedElementId = ev.dataTransfer.getData("text");
    let draggedElement = document.getElementById(draggedElementId);
    let dropTarget = ev.target;

    if (dropTarget.className === 'placeholder' || dropTarget.id === 'elements')
        dropTarget.appendChild(draggedElement);

    if (ev.target.className === 'piece') {
        swap(draggedElement, dropTarget);
    }
}


function swap(piece1, piece2) {
    let parent1 = piece1.parentNode;
    let next1 = piece1.nextSibling;

    let parent2 = piece2.parentNode;
    let next2 = piece2.nextSibling;

    parent1.insertBefore(piece2, next1);
    parent2.insertBefore(piece1, next2);
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                alert("Gratulacje, udalo ci sie ulozyc");
            } else if (permission === 'denied') {
                alert("Trzeba bylo przycisnosc allow :C");
            } else if (permission === 'default') {
                alert("Zmien opcje w przegladarce.");
            }
        });
    } 
}

function puzzleCheck(ev) {
    let placeholders = document.getElementsByClassName('placeholder');

    
    let allPlacedCorrectly = Array.from(placeholders).every(placeholder => {
        let rowCol = getRowColFromId(placeholder.id);
        let pieceId = 'piece-' + rowCol.row + '-' + rowCol.col;
        return placeholder.firstChild && placeholder.firstChild.id === pieceId;
    });

    
    if (allPlacedCorrectly) {
        console.log("Gratulacje, układanka została poprawnie ułożona!");
        requestNotificationPermission();
    }
}

// Funkcja pom uzyskiwania numeru row i col z id
function getRowColFromId(id) {
    let parts = id.split('-');
    return {
        row: parseInt(parts[1]),
        col: parseInt(parts[2])
    };
}

