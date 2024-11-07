// Lee el archivo CSV para los datos de ubicación
fetch('datos/data_filtrada_8k.csv')
    .then(response => response.text())
    .then(csvText => {
        const rows = csvText.split('\n').slice(1);
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

        const birdSlider = document.getElementById("birdSlider");
        let selectedBird = null;

        function createMap(selectedBird) {
            if (selectedBird) {
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
                        marker: {
                            color: 'red',
                            size: 5,
                            line: { color: 'black' }
                        },
                    },
                ];

                Plotly.newPlot('myMap', data, layout, { scrollZoom: false, displayModeBar: false });
            } else {
                Plotly.newPlot('myMap', initialData, layout, { scrollZoom: false, displayModeBar: false });
            }
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
                selectedBird = selectedBird === bird.name ? null : bird.name;
                createMap(selectedBird);
            });

            birdSlider.appendChild(birdElement);
        });
    });



