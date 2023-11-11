// uses MAPBOX EXPRESSIONS 
const circleColor = [
  "case",
  ["has", "rxlevel"],
  [
    "interpolate",
    ["linear"],
    ["get", "rxlevel"],
    -100,
    "#7FFF00",
    -75,
    "#DC143C",
    -50,
    "#008b74",
    -25,
    "#ff009d",
    -0,
    "#00eeff",
    100,
    "red",
  ],
  "black",
];

const constants = {
  "circle-color": circleColor,
};

export default constants;
