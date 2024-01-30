import constants from "./constants.js";
import config from "./config.js";
import {
  waitForStyleToLoad,
  onQueryRenderedFeatures,
  onQuerySourceFeatures,
} from "./utils.js";

let pbfUrl, useCache, baseMapStylePath, map;

// copied from https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-rtl-text/
mapboxgl.setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
  null,
  true // Lazy load the plugin
);

const queryRenderedFeaturesBtn = document.getElementById(
  "queryRenderedFeatures"
);
const querySourceFeaturesBtn = document.getElementById("querySourceFeatures");

function initializeMap() {
  map = new mapboxgl.Map({
    container: "map",
    // tiles for the base map
    style: config.baseUrl + baseMapStylePath,
    center: [51.404887883449874, 35.703222244402],
    zoom: 12,
    hash: true,
    transformRequest: (url) => {
      const isBaseMapTile = url.startsWith(config.baseUrl);

      const headers = isBaseMapTile
        ? {
            "x-api-key": config.apiKey,
          }
        : {};

      return {
        url,
        headers,
      };
    },
  });

  window.map = map;

  queryRenderedFeaturesBtn.addEventListener("click", onQueryRenderedFeatures);
  querySourceFeaturesBtn.addEventListener("click", onQuerySourceFeatures);
}

function removeMap() {
  map && map?.remove?.();
  window.map = undefined;
  queryRenderedFeaturesBtn.removeEventListener(
    "click",
    onQueryRenderedFeatures
  );
  querySourceFeaturesBtn.removeEventListener("click", onQuerySourceFeatures);
}

function removeFeatures() {
  map.getLayer(constants.layerID) && map.removeLayer(constants.layerID);
  map.getSource(constants.sourceID) && map.removeSource(constants.sourceID);
}

async function addFeatures() {
  await waitForStyleToLoad(map);

  removeFeatures();

  map.addSource(constants.sourceID, {
    type: "vector",
    tiles: [pbfUrl + "?data_from_cache=" + (useCache ? "1" : "0")],
  });

  map.addLayer({
    id: constants.layerID,
    source: constants.sourceID,
    "source-layer": "default",
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

  pbfUrl = elements.pbfUrl.value;
  baseMapStylePath = elements.baseMapStylePath.value;
  useCache = elements.useCache.checked;

  removeMap();
  initializeMap();
  addFeatures();
});
