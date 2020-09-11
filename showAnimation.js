// 生成随机数动画
function showNumberWithAnimation(i, j, randNumber) {
  var numberCell = $('#number-cell-' + i + '-' + j);
  numberCell.css('background-color', getNumberBackgroundColor(randNumber));
  numberCell.css('color', getNumberColor(randNumber));
  numberCell.text(randNumber);

  numberCell.animate({
    width: cellSideLength,
    height: cellSideLength,
    top: getPostTop(i, j),
    left: getPostLeft(i, j)
  }, 50)
}
//格子移动动画
function showMoveAnimation(fromx, fromy, tox, toy) {
  var numberCell = $('#number-cell-' + fromx + '-' + fromy);
  numberCell.animate({
    top: getPostTop(tox, toy),
    left: getPostLeft(tox, toy)
  }, 200)
}

//更新分数
function updateScore(score) {
  $('#score').text(score);
}