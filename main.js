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
                sciName: columns[3],
                howMany:parseInt(columns[7], 10),
                region: columns[12],
                season: columns[16],
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
                text: validData.map(d => `${d.species}: ${d.howMany} avistamientos`),
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
                showland: true,
                showocean: true,
                landcolor: 'lightgreen', 
                oceancolor: 'lightblue',
                countrywidth: 0,
                lonaxis: { range: [-49, -90] },
                lataxis: { range: [-17, -60] }
            },
            width: 500,
            height: 700,
            margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
            dragmode: false,
            
        };

        Plotly.newPlot('myMap', initialData, layout, { scrollZoom: false, displayModeBar: false });

        const birdsData = [
            { name: "Black Vulture", image: "fotos/Black Vulture.jpg", audio: "audios/Black Vulture.mp3" },
            { name: "Chilean Mockingbird", image: "fotos/Chilean Mockingbird.jpg", audio: "audios/Chilean Mockingbird.wav" },
            { name: "Chilean Swallow", image: "fotos/Chilean swallow.jpg", audio: "audios/Chilean swallow.wav" },
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

        const summaryData = {};

        birdData.forEach(bird => {
            const species = bird.species;

            if (!summaryData[species]) {
                summaryData[species] = {
                    sciName : bird.sciName,
                    count: 0,
                    regionCounts: {},
                };
            }

            summaryData[species].count += bird.howMany;

            if (!summaryData[species].regionCounts[bird.region]) {
                summaryData[species].regionCounts[bird.region] = 0;
            }
            summaryData[species].regionCounts[bird.region] += 1;
        });

        Object.keys(summaryData).forEach(species => {
            const regions = summaryData[species].regionCounts;
            const maxRegion = Object.keys(regions).reduce((a, b) => regions[a] > regions[b] ? a : b);
            summaryData[species].mostSightingsRegion = maxRegion;
        });

        console.log(summaryData[birdsData[0].name])

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
                    text: birdLocations.map(d => `${d.howMany} Avistamientos`),
                    showlegend: false,
                    marker: {
                        color: 'purple',
                        size: 5,
                        line: { color: 'black' }
                    },
                },
            ];
        
            const layout = {
                geo: {
                    scope: 'south america',
                    showland: true,
                    showocean:true,
                    landcolor: 'lightgreen', 
                    oceancolor: 'skyblue',
                    countrywidth: 0,
                    lonaxis: { range: [-50, -90] },
                    lataxis: { range: [-17, -59] }
                },
                width: 500,
                height: 700,
                margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
                dragmode: false,

            };

        
            Plotly.newPlot('myMap', data, layout, { scrollZoom: false, displayModeBar: false });
        }

        function changeTitleMap(bird){
            const selectedBirdText = document.getElementById('selectedBirdText')
            selectedBirdText.innerHTML = `Avistamientos de la Ave: <br>${bird.name}`
        }

        function updateBirdInfo(name, imageSrc) {
            const birdInfo = summaryData[name];

            const description = `
            <strong>Nombre Común:</strong> ${name}<br>
            <strong>Nombre Científico:</strong> ${birdInfo.sciName}<br>
            <strong>Cantidad de Avistamientos:</strong> ${birdInfo.count}<br>
            <strong>Región con más Avistamientos:</strong> ${birdInfo.mostSightingsRegion}
            `;

            document.getElementById('selectedBirdText').textContent = name;
            document.getElementById('birdInfoImage').src = imageSrc;
            document.getElementById('birdInfoDescription').innerHTML = description;

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
            birdElement.addEventListener('click', () => changeTitleMap(bird));
            birdElement.addEventListener('click', () => {
                const birdName = birdElement.querySelector('.bird-name').textContent;
                const birdImage = birdElement.querySelector('img').src;
                
                updateBirdInfo(birdName, birdImage);
            });
            birdSlider.appendChild(birdElement);
        });
    });




