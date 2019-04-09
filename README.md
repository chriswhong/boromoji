# boromoji

Create static images of NYC's 5 boroughs using leaflet and puppeteer

![The Bronx](https://github.com/chriswhong/boromoji/blob/master/output/bronx.jpg)
![Brooklyn](https://github.com/chriswhong/boromoji/blob/master/output/brooklyn.jpg)
![Manhattan](https://github.com/chriswhong/boromoji/blob/master/output/manhattan.jpg)
![Staten Island](https://github.com/chriswhong/boromoji/blob/master/output/statenisland.jpg)
![Queens](https://github.com/chriswhong/boromoji/blob/master/output/queens.jpg)


## How to Use

- Install dependencies

```sh
$ yarn
```

- Run `make-boromoji.js`

```sh
node make-boromoji.js
```

- jpgs will appear in `/output`

## How it works

Geojson files for NYC's 5 boroughs are stored in `/data`.  When the script is run, it builds a simple web page for each, including javascript for a simple leaflet.js map, calling `fitBounds()` so the borough boundary will fill the map.

Then puppeteer loads each website into a 128x128 viewport and exports a jpg screenshot to `/output`.
