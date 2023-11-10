const form = document.getElementById("form");

let map, tileStyleUrl;

const constants = window.constants;

const sourceID = "source-id";
const layerID = "layer-id";

function waitForStyleToLoad() {
  return new Promise((resolve, rej) => {
    if (map && map.isStyleLoaded()) return resolve(true);
    setTimeout(waitForStyleToLoad, 1000);
  });
}

function getTileUrl({ tileStyleUrl, sources }) {
  const [_sourceID] = Object.keys(sources);
  const [baseUrl] = tileStyleUrl.split("mym/styles");
  const SPLIT_STR = "tile/layers/";
  const [_, path] = tileUrl.split(SPLIT_STR);
  const [tileUrl] = data.sources[_sourceID].tiles;
  return `${baseUrl}${SPLIT_STR}${path}`;
}

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

async function addFeatures() {
  const res = await fetch(tileStyleUrl, {
    method: "GET",
    headers: {
      "x-api-key": constants["x-api-key"],
    },
  });

  const { sources, layers } = await res.json();

  const tileUrl = getTileUrl({ tileStyleUrl, sources });

  await waitForStyleToLoad();

  removeFeatures();

  map.addSource(sourceID, {
    type: "vector",
    url: [tileUrl],
  });

  // only need the source layer name from the layer data (the rest, we can define as we wish)
  const sourceLayer = layers[0]["source-layer"];

  map.addLayer({
    id: layerID,
    "source-layer": sourceLayer,
    type: "circle",
    paint: {
      "circle-radius": 2,
      "circle-color": "black",
    },
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const elements = e.target.elements;

  tileStyleUrl = elements.tileStyleUrl.value;

  if (map) {
    addFeatures();
  } else {
    initializeMap();
  }
});
