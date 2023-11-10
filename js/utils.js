
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function waitForStyleToLoad(map) {
  if (map.isStyleLoaded()) return;
  await sleep(1000);
  return waitForStyleToLoad(map);
}

export function getTileUrl({ tileStyleUrl, sources }) {
  const [_sourceID] = Object.keys(sources);
  const [baseUrl] = tileStyleUrl.split("mym/styles");
  const SPLIT_STR = "tile/layers/";
  const [tileUrl] = sources[_sourceID].tiles;
  const [_, path] = tileUrl.split(SPLIT_STR);
  return `${baseUrl}${SPLIT_STR}${path}`;
}