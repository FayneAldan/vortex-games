const Promise = require('bluebird');
const { util } = require('vortex-api');
const Registry = require('winreg');

function findGame() {
  if (Registry === undefined) {
    // linux ? macos ?
    return null;
  }

  let regKey = new Registry({
    hive: Registry.HKLM,
    key: '\\Software\\Wow6432Node\\bethesda softworks\\Morrowind',
  });

  return new Promise((resolve, reject) => {
    regKey.get('Installed Path', (err, result) => {
      if (err !== null) {
        reject(new Error(err.message));
      } else if (result === null) {
        reject(new Error('empty registry key'));
      } else {
        resolve(result.value);
      }
    });
  })
  .catch(err => util.steam.findByName('The Elder Scrolls III: Morrowind')
        .then(game => game.gamePath));
}

let tools = [
];

function main(context) {
  context.registerGame({
    id: 'morrowind',
    name: 'Morrowind',
    mergeMods: true,
    queryPath: findGame,
    supportedTools: tools,
    queryModPath: () => 'Data Files',
    logo: 'gameart.png',
    executable: () => 'morrowind.exe',
    requiredFiles: [
      'morrowind.exe',
    ],
    environment: {
      SteamAPPId: '22320',
    },
    details: {
      steamAppId: 22320,
    },
  });
  return true;
}

module.exports = {
  default: main
};
