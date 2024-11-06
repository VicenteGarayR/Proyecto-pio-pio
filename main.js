// Lee el archivo CSV para los datos de ubicación
fetch('datos/data_filtrada_8k.csv')
    .then(response => response.text())
    .then(csvText => {
        // Convierte el texto CSV en un array de objetos
        const rows = csvText.split('\n').slice(1); // Omitir la primera fila (encabezados)
        const birdData = rows.map(row => {
            const columns = row.split(',');
            return {
                lat: parseFloat(columns[8]),  // Columna 'lat'
                lng: parseFloat(columns[9]),  // Columna 'lng'
                species: columns[2],  // Columna 'comName' (nombre común del pájaro)
            };
        });

        // Filtra datos válidos (con latitud y longitud)
        const validData = birdData.filter(d => !isNaN(d.lat) && !isNaN(d.lng));

        // Extrae latitudes y longitudes de los datos
        const latitudes = validData.map(d => d.lat);
        const longitudes = validData.map(d => d.lng);

        // Datos iniciales para el mapa
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
                text: validData.map(d => d.species), // Mostrar el nombre del pájaro en el hover
                showlegend: false, // No mostrar la leyenda para este trazo
                marker: {
                    color: '#555',
                    size: 2,  // Tamaño del punto
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

        // Crear el mapa inicialmente
        Plotly.newPlot('myMap', initialData, layout, { scrollZoom: false, displayModeBar: false });


        // Lista de pájaros con sus imágenes
        const birdsData = [
            { name: "Black Vulture", image: "fotos/Black Vulture.jpg" },
            { name: "Chilean Mockingbird", image: "fotos/Chilean Mockingbird.jpg" },
            { name: "Chilean Swallow", image: "fotos/Chilean swallow.jpg" },
            { name: "Cordilleran Canastero", image: "fotos/Cordilleran Canastero.jpg" },
            { name: "Correndera Pipit", image: "fotos/Correndera Pipit.jpg" },
            { name: "Dolphin Gull", image: "fotos/Dolphin Gull.jpg" },
            { name: "Gray-breasted Seedsnipe", image: "fotos/Grey-breasted Seedsnipe.jpg" },
            { name: "Kelp Gull", image: "fotos/Kelp Gull.jpg" },
            { name: "Magellanic Tapaculo", image: "fotos/Magellanic Tapaculo.jpg" },
            { name: "Oasis Hummingbird", image: "fotos/Oasis Hummungbird.jpg" },
            { name: "Patagonian Sierra Finch", image: "fotos/Patagonian Sierra Finch.jpg" },
            { name: "Sooty Shearwater", image: "fotos/Sooty Shearwater.jpg" },
            { name: "Torrent Duck", image: "fotos/Torrent Duck.jpg" },
            { name: "Cattle Egret", image: "fotos/Western Cattle Egret.jpg" }
        ];

        // Contenedor para el slider de pájaros
        const birdSlider = document.getElementById("birdSlider");

        // Función para crear el mapa
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
                    text: birdLocations.map(() => selectedBird), // Mostrar el nombre del pájaro en el hover
                    marker: {
                        color: '#555',
                        size: 5,  // Tamaño del punto
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

            // Crear o volver a crear el mapa de Chile con los puntos del pájaro seleccionado
            Plotly.newPlot('myMap', data, layout, { scrollZoom: false, displayModeBar: false });
        }

        // Cargar los pájaros en la barra deslizadora
        birdsData.forEach(bird => {
            const birdElement = document.createElement("div");
            birdElement.classList.add("bird");
            birdElement.innerHTML = `
                <img src="${bird.image}" alt="${bird.name}">
                <div class="bird-info">
                    <p class="bird-name">${bird.name}</p>
                </div>
            `;

            // Agregar evento para mostrar los puntos del pájaro al hacer clic
            birdElement.addEventListener("click", () => {
                createMap(bird.name);  // Llamamos a la función para crear el mapa con los puntos de este pájaro
            });

            birdSlider.appendChild(birdElement);
        });

    });


