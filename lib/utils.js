const isContain = function(list, ele) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] === ele) {
      return true;
    }
  }
  return false;
};

const dirSort = function(file1, file2) {
  if (file1[0].type === 'dir' && file2[0].type === 'file') {
    return -1;
  } else if (file1[0].type === 'dir' && file2[0].type === 'dir') {
    return file1[0].name < file2[0].name ? -1 : 1;
  } else if (file1[0].type === 'file' && file2[0].type === 'dir') {
    return 1;
  } else if (file1[0].type === 'file' && file2[0].type === 'file') {
    return file1[0].name < file2[0].name ? -1 : 1;
  }
}

module.exports = {
  isContain,
  dirSort
};
