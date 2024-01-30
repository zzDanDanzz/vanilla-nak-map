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
  const feats = window.map.queryRenderedFeatures({ layers: [constants.layerID] });
  console.log("🚀 ~ onQueryRenderedFeatures", feats);
};

export const onQuerySourceFeatures = () => {
  const feats = window.map.querySourceFeatures(constants.sourceID);
  console.log("🚀 ~ onQuerySourceFeatures", feats);
};
