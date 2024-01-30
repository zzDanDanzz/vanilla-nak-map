const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function waitForStyleToLoad(map) {
  if (map.isStyleLoaded()) return;
  await sleep(1000);
  return waitForStyleToLoad(map);
}
