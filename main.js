// Lee el archivo CSV para los datos de ubicación
fetch('datos/data_filtrada_8k.csv')
    .then(response => response.text())
    .then(csvText => {
        const rows = csvText.split('\n').slice(1); // Omitir la primera fila (encabezados)
        const birdData = rows.map(row => {
            const columns = row.split(',');
            return {
                lat: parseFloat(columns[8]),
                lng: parseFloat(columns[9]),
                species: columns[2],
            };
        });

        const validData = birdData.filter(d => !isNaN(d.lat) && !isNaN(d.lng));
        const latitudes = validData.map(d => d.lat);
        const longitudes = validData.map(d => d.lng);

        const initialData = [
            {
                type: 'choropleth',
                locations: ['CHL'],
                z: [0],
                colorscale: [[0, '#ddd'], [1, '#ddd']],
                showscale: false,
                hoverinfo: 'skip',
            },
            {
                type: 'scattergeo',
                mode: 'markers',
                lon: longitudes,
                lat: latitudes,
                hoverinfo: 'text',
                text: validData.map(d => d.species),
                showlegend: false,
                marker: {
                    color: '#555',
                    size: 2,
                    line: { color: 'black' }
                },
            },
        ];

        const layout = {
            geo: {
                scope: 'south america',
                showland: false,
                countrywidth: 0,
                lonaxis: { range: [-64, -76] },
                lataxis: { range: [-18, -59] }
            },
            width: 600,
            height: 800,
            margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
            dragmode: false
        };

        Plotly.newPlot('myMap', initialData, layout, { scrollZoom: false, displayModeBar: false });

        const birdsData = [
            { name: "Black Vulture", image: "fotos/Black Vulture.jpg", audio: "audios/Black Vulture.mp3" },
            { name: "Chilean Mockingbird", image: "fotos/Chilean Mockingbird.jpg", audio: "audios/Chilean Mockingbird.wav" },
            { name: "Chilean Swallow", image: "fotos/Chilean swallow.jpg", audio: "audios/Chilean Swallow.wav" },
            { name: "Cordilleran Canastero", image: "fotos/Cordilleran Canastero.jpg", audio: "audios/Cordilleran Canastero.mp3" },
            { name: "Correndera Pipit", image: "fotos/Correndera Pipit.jpg", audio: "audios/Correndera Pipit.wav" },
            { name: "Dolphin Gull", image: "fotos/Dolphin Gull.jpg", audio: "audios/Dolphin Gull.mp3" },
            { name: "Gray-breasted Seedsnipe", image: "fotos/Grey-breasted Seedsnipe.jpg", audio: "audios/Grey-breasted Seedsnipe.mp3" },
            { name: "Kelp Gull", image: "fotos/Kelp Gull.jpg", audio: "audios/Kelp Gull.wav" },
            { name: "Magellanic Tapaculo", image: "fotos/Magellanic Tapaculo.jpg", audio: "audios/Magellanic Tapaculo.wav" },
            { name: "Oasis Hummingbird", image: "fotos/Oasis Hummungbird.jpg", audio: "audios/Oasis Hummingbird.mp3" },
            { name: "Patagonian Sierra Finch", image: "fotos/Patagonian Sierra Finch.jpg", audio: "audios/Patagonian Sierra Finch.wav" },
            { name: "Sooty Shearwater", image: "fotos/Sooty Shearwater.jpg", audio: "audios/Sooty Shearwater.mp3" },
            { name: "Torrent Duck", image: "fotos/Torrent Duck.jpg", audio: "audios/Torrent Duck.wav" },
            { name: "Cattle Egret", image: "fotos/Western Cattle Egret.jpg", audio: "audios/Western Cattle Egret.mp3" }
        ];

        const birdSlider = document.getElementById("birdSlider");
        let selectedBird = null;
        let currentAudio = null; // Variable para almacenar el audio actual

        function createMap(selectedBird) {
            const birdLocations = validData.filter(d => d.species === selectedBird);
            const latitudes = birdLocations.map(d => d.lat);
            const longitudes = birdLocations.map(d => d.lng);
        
            const data = [
                {
                    type: 'choropleth',
                    locations: ['CHL'],
                    z: [0],
                    colorscale: [[0, '#ddd'], [1, '#ddd']],
                    showscale: false,
                    hoverinfo: 'skip',
                },
                {
                    type: 'scattergeo',
                    mode: 'markers',
                    lon: longitudes,
                    lat: latitudes,
                    hoverinfo: 'text',
                    text: birdLocations.map(() => selectedBird),
                    showlegend: false,
                    marker: {
                        color: 'red',
                        size: 5,
                        line: { color: 'black' }
                    },
                },
            ];
        
            const layout = {
                geo: {
                    scope: 'south america',
                    showland: false,
                    countrywidth: 0,
                    lonaxis: { range: [-64, -76] },
                    lataxis: { range: [-18, -59] }
                },
                width: 600,
                height: 800,
                margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
                dragmode: false
            };
        
            Plotly.newPlot('myMap', data, layout, { scrollZoom: false, displayModeBar: false });
        }

        birdsData.forEach(bird => {
            const birdElement = document.createElement("div");
            birdElement.classList.add("bird");
            birdElement.innerHTML = `
                <img src="${bird.image}" alt="${bird.name}">
                <div class="bird-info">
                    <p class="bird-name">${bird.name}</p>
                </div>
            `;

            birdElement.addEventListener("click", () => {
                if (selectedBird === bird.name) {
                    selectedBird = null;
                    Plotly.newPlot('myMap', initialData, layout, { scrollZoom: false, displayModeBar: false });
                    
                    // Detener el audio actual si se deselecciona el pájaro
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                } else {
                    selectedBird = bird.name;
                    createMap(bird.name);
                    
                    // Detener el audio actual antes de reproducir uno nuevo
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }

                    // Reproducir el nuevo audio correspondiente al pájaro seleccionado
                    currentAudio = new Audio(bird.audio);
                    currentAudio.play().catch(error => {
                        console.error("Error al reproducir el audio:", error);
                    });
                }
            });

            birdSlider.appendChild(birdElement);
        });
    });




