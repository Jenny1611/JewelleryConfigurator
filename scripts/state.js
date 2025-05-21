let settings = {
  ring: {
    material: 'gold',
    color: 'YellowGold'
  },
  stone: {
    material: 'stone',
    color: 'White', visible: true
  }
};

function changeSettings(path, value) {
  const keys = path.split(".");
  let obj = settings;

  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }

  obj[keys.at(-1)] = value;
}

export { settings, changeSettings };