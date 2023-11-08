const form = document.getElementById("form");

let map, tileStyleUrl;

const constants = window.constants;
const { sourceID, layerID } = constants;

const fetchTileStyles = async () => {
  const res = await fetch(tileStyle, {
    headers: {
      "x-api-key": constants.headers["x-api-key"],
    },
  });
  const data = await res.json();

  const sources = Object.entries(data.sources).map(([id, { tiles }]) => ({
    id,
    tiles,
  }));

  const tiles = sources[0].tiles;

  if (!tiles) return console.error("NO TILE URL");

  const tileUrl = tiles[0];

  serviceIDRef.current = tileUrl.split("tile/layers/")[1].split("@EPSG")[0];

  const tileUrlParts = tileUrl.split("tile/layers");

  const tileUrlPathPart = tileUrlParts[1];

  const finalTileUrl = `${baseUrl}/tile/layers${tileUrlPathPart}${
    fromCache ? "?data_from_cache=true" : ""
  }`;

  setSourceProps({ type: "vector", tiles: [finalTileUrl] });

  setCircleLayer({
    source: "nak-source",
    "source-layer": data.layers[0]["source-layer"],
    type: "circle",
    paint: constants.styles.CIRLCE_LAYER_PAINT,
  });
};

function initializeMap() {
  map = new mapboxgl.Map({
    container: "map",
    // tiles for the base map
    style: "https://dev.map.ir/vector/styles/main/mapir-xyz-light-style.json",
    center: [51.404887883449874, 35.703222244402],
    zoom: 12,
    transformRequest: (url) => {
      return {
        url,
        headers: { "x-api-key": constants["x-api-key"] },
      };
    },
  });

  updateMap();
}

function removeFeatures() {
  map.getSource(sourceID) && map.removeSource(sourceID);
  map.getLayer(layerID) && map.removeLayer(layerID);
}

function addFeatures() {
  console.log(
    "🚀 ~ file: script.js:30 ~ addFeatures ~ tileStyleUrl:",
    tileStyleUrl
  );
  fetch(tileStyleUrl, {
    method: "GET",
    headers: {
      "x-api-key": constants["x-api-key"],
    },
  });
  // map.addSource(window.sourceID, {
  //   type: "vector",
  //   url: [tileStyleUrl],
  // });

  // map.addLayer({
  //   id: window.layerID,
  //   "source-layer": "poi_label",
  //   type: "circle",
  //   paint: {
  //     // Mapbox Style Specification paint properties
  //   },
  //   layout: {
  //     // Mapbox Style Specification layout properties
  //   },
  // });
}

function updateMap() {
  removeFeatures();
  addFeatures();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const elements = e.target.elements;

  tileStyleUrl = elements.tileStyleUrl.value;

  if (map) {
    updateMap();
  } else {
    initializeMap();
  }
});
