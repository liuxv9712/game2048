/**
window.screen.availWidth 返回当前屏幕宽度(空白空间) 系统配置的显示器分辨率不可改
window.screen.availHeight 返回当前屏幕高度(空白空间)
window.screen.width 返回当前屏幕宽度(分辨率值) 自己可改的显示器分辨率
window.screen.height 返回当前屏幕高度(分辨率值)
window.document.body.offsetHeight; 返回当前网页高度
window.document.body.offsetWidth; 返回当前网页宽度
 */

var documentWidth = window.screen.availWidth;
var gridContainerWidth = 0.92 * documentWidth;
var cellSideLength = 0.18 * documentWidth;
var cellSpace = 0.04 * documentWidth;

//设置number-cell的位置top
function getPostTop(i, j) {
  return cellSpace + i * (cellSpace + cellSideLength);
}
//设置number-cell的位置left
function getPostLeft(i, j) {
  return cellSpace + j * (cellSpace + cellSideLength);
}

// 设置number-cell的背景颜色样式
function getNumberBackgroundColor(number) {
  switch (number) {
    case 2: return "#eee4da"; break;
    case 4: return "#ede0c8"; break;
    case 8: return "#f2b179"; break;
    case 16: return "#f59563"; break;
    case 32: return "#f67c5f"; break;
    case 64: return "#f65e3b"; break;
    case 128: return "#edcf72"; break;
    case 256: return "#edcc61"; break;
    case 512: return "#9c0"; break;
    case 1024: return "#33b5e5"; break;
    case 2048: return "#09c"; break;
    case 4096: return "#a6c"; break;
    case 8192: return "#93c"; break;
  }
  return 'black';
}
// 设置number-cell的文字颜色样式
function getNumberColor(number) {
  if (number <= 4) {
    return '#776e65';
  }
  return 'white';
}

// 看看16个格子是否都满了：双重循环遍历每一个格子，只有有一个为0，那就是有空格
function nospace(board) {
  // 遍历board看看是否有0的存在
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] == 0) {
        return false;
      }
    }
  }
  return true;
}

// 是否可移动
function canMoveLeft(board) {
  // 双重循环遍历12个board值
  // 行数4
  for (var i = 0; i < 4; i++) {
    //列数3
    for (var j = 1; j < 4; j++) {
      //如果当前所遍历到的cell不等于0
      if (board[i][j] !== 0) {
        if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
function canMoveRight(board) {
  // 双重循环遍历12个board值
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j >= 0; j--) {
      // 如果当前所遍历的cell不等于0
      if (board[i][j] !== 0) {
        if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
function canMoveUp(board) {
  for (var j = 0; j < 4; j++)
    for (var i = 1; i < 4; i++)
      if (board[i][j] != 0) {
        if (board[i - 1][j] == 0 || board[i][j] == board[i - 1][j]) {
          return true;
        }
      }
  return false;
}
function canMoveDown(board) {
  for (var j = 0; j < 4; j++)
    for (var i = 2; i >= 0; i--)
      if (board[i][j] != 0) {
        if (board[i + 1][j] == board[i][j] || board[i + 1][j] == 0) {
          return true;
        }
      }
  return false;
}

//判断两个格子中间是否有障碍格子
function noBlockHorizontal(row, col1, col2, board) {
  // 看col1与col2之间是否存在不等于0的元素
  for (var i = col1 + 1; i < col2; i++) {
    if (board[row][i] != 0) {
      return false;
    }
  }
  return true;
}
function noBlockVertical(col, row1, row2, board) {
  for (i = row1 + 1; i < row2; i++) {
    if (board[i][col] != 0) {
      return false;
    }
  }
  return true;
}

// 是否还可以移动
function nomove(board) {
  if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)) {
    return false;
  }
  return true;
}