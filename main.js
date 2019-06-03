const $board = $('#board');

var ROWS = 12
var COLS = 12;

// Võrku tekkitamine
function createBoard(rows, cols) {
  $board.empty();
  for (let i = 0; i < rows; i++) {
    var $row = $('<div>').addClass('row');
    for (let j = 0; j < cols; j++) {
      var $col = $('<div>')
        .addClass('col hidden')
        .attr('data-row', i)
        .attr('data-col', j);
      if (Math.random() < 0.1) {
        $col.addClass('mine');
      }
      $row.append($col);
    }
    $board.append($row);
  }
}

function restart() {
  createBoard(ROWS, COLS);
}

// Mängu lõpp
function gameOver(isWin) {
  let message = null;
  let icon = null;
  if (isWin) {
    message = 'YOU WON!';
    icon = 'fa fa-flag';
  } else {
    message = 'YOU LOST!';
    icon = 'fa fa-bomb';
  }
  $('.col.mine').append(
    $('<i>').addClass(icon)
  );
  $('.col:not(.mine)')
    .html(function() {
      const $cell = $(this);
      const count = getMineCount(
        $cell.data('row'),
        $cell.data('col'),
      );
      return count === 0 ? '' : count;
    })
  $('.col.hidden').removeClass('hidden');
  setTimeout(function() {
    alert(message);
    restart();
  }, 1000);
}

function reveal(oi, oj) {
  var seen = {};

  function helper(i, j) {
    if (i >= ROWS || j >= COLS || i < 0 || j < 0) return;
    var key = `${i} ${j}`
    if (seen[key]) return;
    var $cell =
      $(`.col.hidden[data-row=${i}][data-col=${j}]`);
    var mineCount = getMineCount(i, j);
    if (
      !$cell.hasClass('hidden') || $cell.hasClass('mine')
    ) {
      return;
    }

    $cell.removeClass('hidden');

    if (mineCount) {
      $cell.text(mineCount);
      return;
    }

    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        helper(i + di, j + dj);
      }
    }
  }

  helper(oi, oj);
}

function getMineCount(i, j) {
  let count = 0;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      var ni = i + di;
      var nj = j + dj;
      if (ni >= ROWS || nj >= COLS || nj < 0 || ni < 0) continue;
      var $cell =
        $(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
      if ($cell.hasClass('mine')) count++;
    }
  }
  return count;
}
// Lahti tegemine
$board.on('click', '.col.hidden', function() {
  var $cell = $(this);
  var row = $cell.data('row');
  var col = $cell.data('col');

  if ($cell.hasClass('mine')) {
    gameOver(false);
  } else {
    reveal(row, col);
    var isGameOver = $('.col.hidden').length === $('.col.mine').length
    if (isGameOver) gameOver(true);
  }
})

restart();
