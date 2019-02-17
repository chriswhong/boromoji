const fs = require('fs-extra');
const puppeteer = require('puppeteer');

// get all of the geojson filenames from /data
const filenames = fs.readdirSync('data');

// the puppeteer viewport will be a square with this many pixels on a side
const dimension = 128;

const addGeojsonLayer = (geojson) => {
  const polygon = L.geoJSON(geojson, {
    style: {
      fillColor: "#408b40",
      weight: 0,
      fillOpacity: 1,
    }
  }).addTo(mymap);
  mymap.fitBounds(polygon.getBounds())
}

const takeScreenshot = async (filename, htmlPath, outputPath) => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      height: dimension,
      width: dimension,
    },
  });
  const page = await browser.newPage();
  page.on('error', console.error);

  await page.goto(`file://${__dirname}/${htmlPath}`, { waitUntil : 'networkidle0' });

  const geojson = await fs.readJson(`data/${filename}`);

  await page.evaluate(addGeojsonLayer, geojson);

  await page.screenshot({
    fullPage: true,
    path: outputPath,
  });
  return browser.close();
};

const getHTML = (filename) => {
  return `
    <!doctype html>

    <html lang="en">
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" />
      <style>
        html, body, #mapid {
          height: 100%;
          width: 100%;
          margin: 0;
          background-color: #9ee3e3;
        }

        .leaflet-control-attribution {
          display: none;
        }
      </style>
    </head>

    <body>
      <div id="mapid"></div>
      <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"></script>
      <script>
        const mymap = L.map('mapid', {
          zoomControl: false
        });
      </script>
    </body>
    </html>
  `;
};

async function processFiles(filenames) {
  filenames.forEach(async (filename) => {

    // build web page for this geojson
    const html = getHTML(filename);

    const boroname = filename.split('.')[0]

    // save the html file in /tmp
    const htmlPath = `tmp/${boroname}.html`;
    await fs.outputFile(htmlPath, html);

    // load the html in puppeteer and save a screenshot
    const outputPath = `output/${boroname}.jpg`;
    await takeScreenshot(filename, htmlPath, outputPath);
  })
}

processFiles(filenames);
