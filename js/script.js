import { apiKey } from "../env.js";
import constants from "./constants.js";
import { getTileUrl, waitForStyleToLoad } from "./utils.js";

// example source and layer id.
const sourceID = "source-id";
const layerID = "layer-id";

let map, tileStyleUrl;

// copied from https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-rtl-text/
mapboxgl.setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
  null,
  true // Lazy load the plugin
);

function initializeMap() {
  map = new mapboxgl.Map({
    container: "map",
    // tiles for the base map
    style: "https://map.ir/vector/styles/main/mapir-xyz-light-style.json",
    center: [51.404887883449874, 35.703222244402],
    zoom: 12,
    hash: true,
    transformRequest: (url) => {
      // add api key to header when requesting base map tiles
      if (url.startsWith("https://map.ir")) {
        return {
          url,
          headers: {
            // YOUR API KEY
            "x-api-key": apiKey,
          },
        };
      }

      return {
        url,
      };
    },
  });
}

function removeFeatures() {
  map.getLayer(layerID) && map.removeLayer(layerID);
  map.getSource(sourceID) && map.removeSource(sourceID);
}

async function addFeatures() {
  const res = await fetch(tileStyleUrl, {
    method: "GET",
    headers: {
      "x-api-key": constants["x-api-key"],
    },
  });

  const { sources, layers } = await res.json();

  const tileUrl = getTileUrl({ tileStyleUrl, sources });

  await waitForStyleToLoad(map);

  removeFeatures();

  map.addSource(sourceID, {
    type: "vector",
    tiles: [tileUrl],
  });

  // only need the source layer name from the layer data (the rest, we can define as we wish)
  const sourceLayer = layers[0]["source-layer"];

  map.addLayer({
    id: layerID,
    source: sourceID,
    "source-layer": sourceLayer,
    type: "circle",
    paint: {
      "circle-radius": 5,
      "circle-color": constants["circle-color"],
    },
  });
}

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const elements = e.target.elements;

  tileStyleUrl = elements.tileStyleUrl.value;

  if (map) {
    addFeatures();
  } else {
    initializeMap();
    addFeatures();
  }
});
