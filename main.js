// Lee el archivo CSV
fetch('datos/vis_2022.csv')
    .then(response => response.text())
    .then(csvText => {
        // Convierte el texto CSV en un array de objetos
        const rows = csvText.split('\n').slice(1); // Omitir la primera fila (encabezados)
        const birdData = rows.map(row => {
            const columns = row.split(',');
            return {
                lat: parseFloat(columns[7]),  // Columna 'lat'
                lng: parseFloat(columns[8]),  // Columna 'lng'
                species: columns[1]  // Columna 'comName' (nombre común del pájaro)
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
                marker: {
                    color: '#ff0000',
                    size: 5,  // Tamaño del punto
                    line: { color: 'black' }
                },
            }
        ];

        const layout = {
            geo: {
                scope: 'south america',
                showland: true,
                landcolor: '#e5e5e5',
                countrycolor: '#ffffff',
                projection: {
                    type: 'mercator', // Puedes usar otra proyección si lo deseas
                }
            },
            width: 600,
            height: 800,
            margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
            dragmode: false
        };

        Plotly.newPlot('myMap', data, layout, { scrollZoom: false, displayModeBar: false });
    });

