/**
ACTIVITY 8: CODE-TAKER++
MADELINE ZAYTSOFF

*/

"use strict";

$(`#container`).dialog({
  dialogClass: "no-close",
});

$("#text-window").dialog({
  minHeight:400,
  minWidth:500,
  dialogClass: "no-close",
});

$(`#solved-dialog`).dialog({
  autoOpen: false,
  buttons: {
    "I know.": function() {
      $(this).dialog(`close`);
    }
  }
});

$(`.secret`).one(`mouseover`, function(event) {
  $(this).addClass(`found`, 500);
  $(this).draggable({
    helper: `clone`
  })
})

$(`#answer`).droppable({
  drop: function(event, ui) {
    let letter = ui.draggable.text();
    $(this).append(letter);
    ui.draggable.draggable(`disable`);
    ui.draggable.removeClass(`found`);

    if ($(this).text() === `Theremin`) {
      $(`#solved-dialog`).dialog(`open`);
    }
  }
});
