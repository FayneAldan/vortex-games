const Promise = require('bluebird');
const { util } = require('vortex-api');
const Registry = require('winreg');

function findGame() {
  return new Promise((resolve, reject) => {
    if (Registry === undefined) {
      // linux ? macos ?
      return reject(new Error('No registry'));
    }

    let regKey = new Registry({
      hive: Registry.HKLM,
      key: '\\Software\\Wow6432Node\\Bethesda Softworks\\Fallout4',
    });

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
  .catch(err =>
    util.steam.findByName('Fallout 4')
      .then(game => game.gamePath)
  );
}

let tools = [
  {
    id: 'FO4Edit',
    name: 'FO4Edit',
    logo: 'fo3edit.png',
    executable: () => 'FO4Edit.exe',
    requiredFiles: [
      'FO4Edit.exe',
    ],
  },
  {
    id: 'WryeBash',
    name: 'Wrye Bash',
    logo: 'wrye.png',
    executable: () => 'Wrye Bash.exe',
    requiredFiles: [
      'Wrye Bash.exe',
    ],
  },
  {
    id: 'f4se',
    name: 'Fallout 4 Script Extender',
    shortName: 'F4SE',
    executable: () => 'f4se_loader.exe',
    requiredFiles: [
      'f4se_loader.exe',
    ],
    relative: true,
  },
];

function main(context) {
  context.registerGame({
    id: 'fallout4',
    name: 'Fallout 4',
    mergeMods: true,
    queryPath: findGame,
    supportedTools: tools,
    queryModPath: () => 'data',
    logo: 'gameart.png',
    executable: () => 'Fallout4.exe',
    requiredFiles: [
      'Fallout4.exe',
    ],
    environment: {
      SteamAPPId: '377160',
    },
    details: {
      steamAppId: 377160,
    }
  });

  return true;
}

module.exports = {
  default: main,
};
