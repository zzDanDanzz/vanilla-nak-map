import config from "./config.js";
import constants from "./constants.js";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function waitForStyleToLoad(map) {
  if (map.isStyleLoaded()) return;
  await sleep(1000);
  return waitForStyleToLoad(map);
}

export const onQueryRenderedFeatures = () => {
  const feats = window.map.queryRenderedFeatures({
    layers: [constants.layerID],
  });
  console.log("🚀 ~ onQueryRenderedFeatures", feats);
};

export const onQuerySourceFeatures = () => {
  const feats = window.map.querySourceFeatures(constants.sourceID, {
    sourceLayer: "default",
  });
  console.log("🚀 ~ onQuerySourceFeatures", feats);
};

const getRasterTileUrlFromSource = (sourceID) =>
  sourceID === "mapir-raster"
    ? `${config.baseUrl}/shiveh/xyz/1.0.0/Shiveh:Shiveh@EPSG:3857@png/{z}/{x}/{y}.png`
    : sourceID === "google-satellite"
    ? `${config.baseUrl}/google/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}`
    : sourceID === "google-satellite-label"
    ? `${config.baseUrl}/google/vt/lyrs=y&hl=fa&x={x}&y={y}&z={z}`
    : sourceID === "google-terrain-label"
    ? `${config.baseUrl}/google/vt/lyrs=p&hl=fa&x={x}&y={y}&z={z}`
    : sourceID === "google-terrain-traffic-label"
    ? `${config.baseUrl}/google/vt/lyrs=p,traffic&hl=fa&x={x}&y={y}&z={z}`
    : sourceID === "osm-raster"
    ? "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    : `${config.baseUrl}/shiveh/xyz/1.0.0/Shiveh:Shiveh@EPSG:3857@png/{z}/{x}/{y}.png`;

const generateMapstyleForRaster = (rasterID) => {
  return {
    version: 8,
    sprite: `${config.baseUrl}/vector/styles/main/sprite`,
    glyphs: `${config.baseUrl}/vector/styles/main/glyphs/{fontstack}/{range}.pbf`,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [getRasterTileUrlFromSource(rasterID)],
        tileSize: 256,
        attribution: "",
      },
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
};

export const generateMapStyle = ({ type, sourceID }) => {
  if (type === "vector") {
    return `${config.baseUrl}/vector/styles/main/${sourceID}.json`;
  }

  return generateMapstyleForRaster(sourceID);
};
