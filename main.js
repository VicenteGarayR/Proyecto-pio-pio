// Lee el archivo CSV
fetch('datos/data_filtrada_8k_2022.csv')
    .then(response => response.text())
    .then(csvText => {
        // Convierte el texto CSV en un array de objetos
        const rows = csvText.split('\n').slice(1); // Omitir la primera fila (encabezados)
        const birdData = rows.map(row => {
            const columns = row.split(',');
            return {
                lat: parseFloat(columns[8]),  // Columna 'lat'
                lng: parseFloat(columns[9]),  // Columna 'lng'
                species: columns[2]  // Columna 'comName' (nombre común del pájaro)
            };
        });

        // Filtra datos válidos (con latitud y longitud)
        const validData = birdData.filter(d => !isNaN(d.lat) && !isNaN(d.lng));

        const infoContainer = document.getElementById('infoContainer');
        infoContainer.innerHTML = `
            <p><strong>Total de pájaros avistados:</strong> 199462</p>
            <p><strong>Total de especies:</strong> 400</p>
            <p><strong>Región con más avistamientos:</strong> Magallanes, 69906 avistamientos</p>
            <p><strong>Región con más diversidad:</strong> Valparaiso, 198 especies</p>
        `;

        // Extrae latitudes y longitudes de los datos
        const latitudes = validData.map(d => d.lat);
        const longitudes = validData.map(d => d.lng);

        // Agrega los puntos al mapa
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
                text: validData.map(d => d.species), // Mostrar el nombre del pájaro en el hover
                marker: {
                    color: '#ff0000',
                    size: 2,  // Tamaño del punto
                    line: { color: 'black' }
                },
            }
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
        
    });

