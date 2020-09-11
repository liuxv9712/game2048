var board = new Array();
var score = 0;
//问题：2 2 4 8 左移=》16，应为4 4 8.只计算一次,定义一个数组来判断是否加过，保证只加一次
var hasConflicted = new Array();

//主函数只做一件事：newgame
$(document).ready(function () {
  // 自适应
  adaption();
  // 游戏开始
  newgame();
})
function adaption() {
  if (documentWidth > 500) {
    gridContainerWidth = 500;
    cellSpace = 20;
    cellSideLength = 100;
  }
  $('.grid-container').css('width', gridContainerWidth - 2 * cellSpace);
  $('.grid-container').css('height', gridContainerWidth - 2 * cellSpace);
  $('.grid-container').css('padding', cellSpace);
  $('.grid-container').css('border-radius', 0.06 * gridContainerWidth);

  $('.grid-cell').css('width', cellSideLength);
  $('.grid-cell').css('height', cellSideLength);
  $('.grid-cell').css('border-radius', 0.06 * cellSideLength);
}

function newgame() {
  // 初始化棋盘格
  init();
  //清零分数
  score = 0;
  // 在随机两个格子生成数字
  generateOneNumber();
  generateOneNumber();
}

function init() {
  // 1.对16个格子grid-cell的位置进行赋值
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $('#grid-cell-' + i + '-' + j);
      gridCell.css('top', getPostTop(i, j));
      gridCell.css('left', getPostLeft(i, j));
    }
  }
  // 2.初始化board，使一维数组变为二维数组
  // 4.初始化hasConflicted，使一维数组变为二维数组
  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    hasConflicted[i] = new Array();
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
      hasConflicted[i][j] = false;
    }
  }
  //3. 根据board的值对humber-cell将进行操作
  updateBoardView();
}

function updateBoardView() {
  // 1.先清除原有number-cell格子
  $('.number-cell').remove()
  // 2.根据board元素添加新的number-cell格子
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      $('.grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
      var theNumberCell = $('#number-cell-' + i + '-' + j);
      if (board[i][j] == 0) {
        // 为0时，看不见number-cell
        theNumberCell.css('width', '0px');
        theNumberCell.css('height', '0px');
        // number-cell的位置在grid-cell的中间
        theNumberCell.css('top', getPostTop(i, j) + cellSideLength / 2);
        theNumberCell.css('left', getPostLeft(i, j) + cellSideLength / 2);
      } else {
        // 不为0时，看地见number-cell
        theNumberCell.css('width', cellSideLength);
        theNumberCell.css('height', cellSideLength);
        // number-cell的位置覆盖在grid-cell上面
        theNumberCell.css('top', getPostTop(i, j))
        theNumberCell.css('left', getPostLeft(i, j))
        //设置背景颜色
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
        //显示文字
        theNumberCell.css('color', getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }
      // 新的一轮开始了
      hasConflicted[i][j] = false;
    }
  }
  $('.number-cell').css('line-height', cellSideLength + 'px');
  $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}


function generateOneNumber() {
  // 棋盘上有空间才生成格子
  if (nospace(board)) {
    return false;
  }
  // 随机一个位置：生成0~1之间的浮点数，用floor下取整得到一个浮点数0123，然后用parseInt转换为整数
  var randx = parseInt(Math.floor(Math.random() * 4));
  var randy = parseInt(Math.floor(Math.random() * 4));
  // 优化随机生成格子的位置
  var times = 0;
  // 判断这个位置上的值是否为0，如果是就可以在这个位置上生成新的随机数，如果不是，说明这个位置上有数，就继续循环寻找。
  while (times < 30) {
    if (board[randx][randy] == 0) {
      break;
    }
    randx = parseInt(Math.floor(Math.random() * 4));
    randy = parseInt(Math.floor(Math.random() * 4));
  }
  //人工找到位置
  if (times > 30) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (board[i][j] == 0) {
          randx = i;
          randy = j;
        }
      }
    }
  }


  // 随机一个数字，2048的规则是生成2或者4
  var randNumber = Math.random() > 0.5 ? 2 : 4;
  // 在随机位置显示数字
  board[randx][randy] = randNumber;
  // 通知前端
  showNumberWithAnimation(randx, randy, randNumber);
  return true;
}

// 监听键盘输入
//工作原理：首先设置表达式 n（通常是一个变量）。随后表达式的值会与结构中的每个 case 的值做比较。
//如果存在匹配，则与该 case 关联的代码块会被执行。请使用 break 来阻止代码自动地向下一个 case 运行。
$(document).keydown(function (event) {
  // 阻挡按键本来会产生的效果，这里防止屏幕滚动条上下移动
  event.preventDefault();
  switch (event.keyCode) {
    case 37:
      if (moveLeft()) {
        // setTimeout让动画更流畅
        //生成新的数字
        setTimeout("generateOneNumber()", 200);
        //判断游戏是否结束
        setTimeout("isgameover();", 200);
      }
      break;
    case 38:
      if (moveUp()) {
        //生成新的数字
        setTimeout("generateOneNumber()", 200);
        //判断游戏是否结束
        setTimeout("isgameover();", 200);
      }
      break;
    case 39:
      if (moveRight()) {
        //生成新的数字
        setTimeout("generateOneNumber()", 200);
        //判断游戏是否结束
        setTimeout("isgameover();", 200);
      }
      break;
    case 40:
      if (moveDown()) {
        //生成新的数字
        setTimeout("generateOneNumber()", 200);
        //判断游戏是否结束
        setTimeout("isgameover();", 200);
      }
      break;
    default:
      break;
  }
})

//手机端：监听触摸
document.addEventListener('touchstart', function (event) {
  // event.touches 获取多个手指触碰屏幕的信息，【0】为一个手指
  startx = event.touches[0].pageX;
  starty = event.touches[0].pageY;
});
document.addEventListener('touchmove', function (event) {
  event.preventDefault();
})
document.addEventListener('touchend', function (event) {
  endx = event.changedTouches[0].pageX;
  endy = event.changedTouches[0].pageY;
  var deltax = endx - startx;
  var deltay = endy - starty;

  if (Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth)
    return;

  if (Math.abs(deltax) >= Math.abs(deltay)) {
    if (deltax > 0) {
      // 向右
      if (moveRight()) {
        setTimeout("generateOneNumber()", 200);
        setTimeout("isgameover();", 200);
      }
    } else {
      // 向左
      if (moveLeft()) {
        setTimeout('generateOneNumber()', 200);
        setTimeout("isgameover()", 200);
      }
    }
  } else {
    if (deltay > 0) {
      // 向下
      if (moveDown()) {
        setTimeout("generateOneNumber()", 200);
        setTimeout("isgameover()", 200);
      } else {
        setTimeout("generateOneNumber()", 200);
        setTimeout("isgameover()", 200);
      }
    }
  }
})

function isgameover() {
  // console.log(nomove(board));
  if (nospace(board) && nomove(board)) {
    gameover();
  }
}
function gameover() {
  alert('GAMEOVER!');
}


function moveLeft() {
  if (!canMoveLeft(board)) {
    return false;
  }
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < j; k++) {
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
            showMoveAnimation(i, j, i, k);
            board[i][k] += board[i][j];
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout(updateBoardView(), 200);
  return true;
}
function moveRight() {
  // 如果不能右移直接返回false
  if (!canMoveRight(board)) {
    return false;
  }
  //否则移动
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j >= 0; j--) {
      if (board[i][j] !== 0) {
        for (var k = 3; k > j; k--) {
          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
            showMoveAnimation(i, j, i, k);
            board[i][k] *= 2;
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasConflicted[i][k] = true;//只加一次
            continue;
          }
        }
      }
    }
  }
  setTimeout(updateBoardView(), 200);
  return true;
}
function moveUp() {
  if (!canMoveUp(board)) {
    return false;
  }
  for (var j = 0; j < 4; j++) {
    for (var i = 1; i < 4; i++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) {
          if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
            showMoveAnimation(i, j, k, j);
            board[k][j] += board[i][j];
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200);
  return true;
}
function moveDown() {
  if (!canMoveDown(board)) {
    return false;
  }
  for (var j = 0; j < 4; j++) {
    for (var i = 2; i >= 0; i--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {
          if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
            showMoveAnimation(i, j, k, j);
            board[k][j] *= 2;
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout(updateBoardView(), 200);
  return true;
}


