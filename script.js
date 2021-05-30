// Get tail width and heigh to prevent tail from crossing border
const tailWidth = parseInt($(".tail").width());
const tailHeight = parseInt($(".tail").height());

// Size of Donkey Div
const MAX_WIDTH = 450 - tailWidth;
const MAX_HEIGHT = 500 - tailHeight;

// Gets tail position, removes last two letters "px", and parses as an int to later modify
// Axis values are a string of either "top" or "left"
function getTailPosition(axis) {
  return parseInt($(".tail").css(axis).slice(0, -2));
}

// Sets new tail position, returning position value to string and adding "px" to conform to CSS requirements
// Axis values are a string of either "top" or "left"
function setTailPosition(axis, value) {
  stringValue = String(value) + "px";
  $(".tail").css(axis, stringValue);
}

function validateEndGame() {
  const xPos = getTailPosition("left");
  const yPos = getTailPosition("top");
  console.log("x: " + xPos);
  console.log("y: " + yPos);
  if (xPos >= 220 && xPos <= 300 && yPos >= 235 && yPos <= 315) {
    alert("Congratulations! Great Success!");
  } else {
    alert("Try Again WOMP WOMP");
  }
}

// On START click, start game timer
$("#startGame").on("click", function () {
  const randomX = Math.floor(Math.random() * MAX_WIDTH);
  const randomY = Math.floor(Math.random() * MAX_HEIGHT);
  setTailPosition("left", randomX);
  setTailPosition("top", randomY);

  // Get the timer box to reference many times
  const timerBox = $(".timer");
  // READY SET GO timer
  const readyText = ["READY...", "SET...", "GO!"];
  let i = 0;
  timerBox.text(readyText[i]);
  const readySetGo = window.setInterval(function () {
    i++;
    timerBox.text(readyText[i]);
    if (i === readyText.length - 1) {
      clearInterval(readySetGo);

      // Display the tail on the screen
      $(".tail").css("display", "inherit");

      // Timer until game ends
      let seconds = 10;
      const startTimer = window.setInterval(function () {
        timerBox.text(`Seconds Left: ${seconds}`);
        if (seconds == 0) {
          clearInterval(startTimer);
          validateEndGame();
        }
        seconds--;
      }, 1000);
    }
  }, 1000);
});

// Key press listener for up, right, down, left and space bar key presses
// Each if statement prevents tail from going beyond the border of the Donkey Div
$(document).keydown(function (e) {
  const xPos = getTailPosition("left");
  const yPos = getTailPosition("top");
  const moveValue = 5;
  // Up
  if (e.which == 38 && yPos - moveValue >= 0) {
    setTailPosition("top", yPos - moveValue);
    // Right
  } else if (e.which == 39 && xPos + moveValue <= MAX_WIDTH) {
    setTailPosition("left", xPos + moveValue);
    // Down
  } else if (e.which == 40 && yPos + moveValue <= MAX_HEIGHT) {
    setTailPosition("top", yPos + moveValue);
    // Left
  } else if (e.which == 37 && xPos - moveValue >= 0) {
    setTailPosition("left", xPos - moveValue);
    // Space Bar
  } else if (e.which == 32) {
    // Prevent default Space Bar behaviour
    if (e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    console.log("space bar");
  }
});
