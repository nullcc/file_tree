const fs = require('fs');
const path = require('path');
const program = require('commander');
require('colors-cli/toxic');
import { isContain, dirSort } from './lib/utils';

const fileTree = function(path, noExpendDirs) {
  if (!path) {
    return;
  }
  if (!fs.existsSync(path)) {
    console.error('no such path');
    return;
  }
  const dir = scanDir(path, noExpendDirs)[0];
  dir.files = dir.files.sort(dirSort); // 文件名排序
  const outputs = printDir(dir, 1);
  // 输出结果
  console.log([
    '提示:'.bold.red,
    'dir'.bold.blue,
    'file'.bold.green,
    'link'.bold.red,
    '(+)表示不展开的目录'.bold.blue,
  ].join('  '));
  console.log(path);
  console.log(outputs);
};

const scanDir = function(filePath, noExpendDirs) {
  if (!filePath) {
    return;
  }
  const stats = fs.lstatSync(filePath);
  var files = [];
  if (stats.isDirectory()) { // 目录
    var dirObj = {
      type: 'dir',
      name: getDir(filePath),
      files: []
    };
    const dirFiles = fs.readdirSync(filePath);
    dirObj.files = dirFiles.map((file) => {
      const dirFilePath = `${filePath}/${file}`;
      if (!isContain(noExpendDirs, getDir(file))) {
        return scanDir(dirFilePath, noExpendDirs);
      }
      return [{
        type: 'dir',
        name: file,
        noExpend: true,
        files: []
      }];
    });
    files.push(dirObj);
  } else if (stats.isFile()) { // 文件
    var fileObj = {
      type: 'file',
      name: path.basename(`${filePath}`)
    }
    files.push(fileObj);
  } else if (stats.isSymbolicLink()) { // 软链接
    fs.readlinkSync(filePath)
    var linkObj = {
      type: 'link',
      name: path.basename(`${filePath}`)
    }
    files.push(linkObj);
  }
  return files;
};

const getDir = function (path) {
  const elements = path.split('/');
  return elements[elements.length - 1];
};

const printDir = function (dir, depth) {
  var outputs = "";
  dir.files.forEach(file => {
    var spaces = genSpaces(depth);
    if (file.length > 0 && file[0].type === 'dir') {
      if (file[0].noExpend) {
        outputs += [`${spaces}└──/`, `${file[0].name}(+)`.bold.blue, `\n`].join('');
      } else {
        outputs += [`${spaces}└──/`, `${file[0].name}`.bold.blue, `\n`].join('');
      }
      outputs += printDir(file[0], depth + 1);
    } else if (file.length > 0 && file[0].type === 'file') {
      outputs += [`${spaces}└── `, `${file[0].name}`.bold.green, `\n`].join('');
    } else if (file.length > 0 && file[0].type === 'link') {
      outputs += [`${spaces}└── `, `${file[0].name}`.bold.red, `\n`].join('');
    }
  });
  return outputs;
};

const genSpaces = function(depth) {
  var spaces = "";
  for (var i = 0; i < depth; i++) {
    if (i > 0) {
      spaces += "|   ";
    }
  }
  return spaces;
};

function list(val) {
  return val.split(',');
}

program
  .version('0.0.1')
  .option('-i, --ignores [value]', '不展开显示的目录列表', list)
  .option('-t, --target [value]', '需要解析的目录', '')
  .parse(process.argv);

scanDir(fileTree(program.target, program.ignores));
