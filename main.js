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
                showlegend: false, // No mostrar la leyenda para este trazo
                marker: {
                    color: '#ff0000',
                    size: 2,  // Tamaño del punto
                    line: { color: 'black' }
                },
            },
            {
                type: 'scattergeo',
                mode: 'markers',
                lon: [-70.91129],
                lat: [-53.15483],
                marker: {
                    size: 80, // Tamaño del marcador
                    color: 'blue', // Color del marcador
                    opacity: 0.3, // Hacer el círculo transparente
                    symbol: 'circle', // Forma del marcador
                },
                hoverinfo: 'none', // No mostrar información al pasar el mouse
                showlegend: false // No mostrar la leyenda para este trazo
            },
            {
                type: 'scattergeo',
                mode: 'markers',
                lon: [-71.62963],
                lat: [-33.036],
                marker: {
                    size: 80, // Tamaño del marcador
                    color: 'green', // Color del marcador
                    opacity: 0.3, // Hacer el círculo transparente
                    symbol: 'circle', // Forma del marcador
                },
                hoverinfo: 'none', // No mostrar información al pasar el mouse
                showlegend: false // No mostrar la leyenda para este trazo
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


