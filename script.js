// Get the timer box to reference many times
const $timerBox = $(".timer");
// Get tail box for reference
const $tail = $(".tail");
// Game Timer ID
let gameTimer;
// Boolean to check if game is already running
let isRunning = false;
// Get START/STOP button
const $startGame = $("#startGame");
// Get game canvas ".donkey"
const $gameCanvas = $(".game-canvas");
// Get hitbox
const $hitbox = $(".hitbox");

// Get tail width and heigh to prevent tail from crossing border
const tailWidth = parseInt($tail.width());
const tailHeight = parseInt($tail.height());

// Size of Donkey Div
const MAX_WIDTH = $gameCanvas.width() - tailWidth;
const MAX_HEIGHT = $gameCanvas.height() - tailHeight;

// Gets tail position, removes last two letters "px", and parses as an int to later modify
// Axis values are a string of either "top" or "left"
function getTailPosition(axis) {
  return parseInt($tail.css(axis).slice(0, -2));
}

// Sets new tail position, returning position value to string and adding "px" to conform to CSS requirements
// Axis values are a string of either "top" or "left"
function setTailPosition(axis, value) {
  stringValue = String(value) + "px";
  $tail.css(axis, stringValue);
}

// Arrow button listeners
const upArrowListener = $(".up-arrow").on("click", function () {
  const xPos = getTailPosition("left");
  const yPos = getTailPosition("top");
  const moveValue = 5;
  if (yPos - moveValue >= 0) {
    setTailPosition("top", yPos - moveValue);
  }
});

const downArrowListener = $(".down-arrow").on("click", function () {
  const xPos = getTailPosition("left");
  const yPos = getTailPosition("top");
  const moveValue = 5;
  if (yPos + moveValue <= MAX_HEIGHT) {
    setTailPosition("top", yPos + moveValue);
  }
});

const leftArrowListener = $(".left-arrow").on("click", function () {
  const xPos = getTailPosition("left");
  const yPos = getTailPosition("top");
  const moveValue = 5;
  if (xPos - moveValue >= 0) {
    setTailPosition("left", xPos - moveValue);
  }
});

const rightArrowListener = $(".right-arrow").on("click", function () {
  const xPos = getTailPosition("left");
  const yPos = getTailPosition("top");
  const moveValue = 5;
  if (xPos + moveValue <= MAX_WIDTH) {
    setTailPosition("left", xPos + moveValue);
  }
});

// Key press listener for up, right, down, left and space bar key presses
// Each if statement prevents tail from going beyond the border of the Donkey Div
const keyPressListener = $(document).keydown(function (e) {
  const xPos = getTailPosition("left");
  const yPos = getTailPosition("top");
  const moveValue = 5;
  if ([32, 37, 38, 39, 40].includes(e.which)) {
    // Prevent default keystroke behaviour
    if (e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
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
    // if modal is displayed, space bar will close it
    if (!$(".modal").hasClass("modal-hide")) {
      $(".modal").addClass("modal-hide");
    } else {
      startStopSwitch();
    }
  }
});

// On START/STOP click, run game start/stop switch
$startGame.on("click", startStopSwitch);

function startStopSwitch() {
  if (!isRunning) {
    isRunning = true;
    $startGame.text("STOP");
    $timerBox.toggleClass("display");
    $startGame.toggleClass("start-button-animation");
    startGame();
  } else {
    // ("READY SET GO" phase) No need to evaluate score, simply reset game visuals and timer
    resetGame();
    if ($tail.hasClass("display")) {
      // if tail is displayed on screen... remove tail and Evaluate score
      $tail.removeClass("display");
      endGame();
    }
  }
}

function startTimer() {
  // Game Timer definition
  const timer = () => {
    if (i < readySetGoArray.length) {
      $timerBox.text(readySetGoArray[i]);
      i++;
    } else if (seconds >= 0) {
      // Display the tail on the screen
      $tail.addClass("display");
      $timerBox.text(`Timer: ${seconds}s`);
      seconds--;
    } else {
      startStopSwitch();
    }
  };

  // First, display Ready, Set Go, Then a 10 second countdown
  const readySetGoArray = ["READY...", "SET...", "GO!"];
  let i = 0;
  let seconds = 10;
  // call timer first to circumvent delay of first iteration caused by setInterval
  timer();
  gameTimer = setInterval(timer, 1000);
}

function startGame() {
  // Set tail to random x,y position in bordered area
  const randomX = Math.floor(Math.random() * MAX_WIDTH);
  const randomY = Math.floor(Math.random() * MAX_HEIGHT);
  setTailPosition("left", randomX);
  setTailPosition("top", randomY);

  startTimer();
}

function resetGame() {
  // Reset timer and other displayed items
  // (timerBox text, Tail, isRunning Boolean and Button text)
  clearInterval(gameTimer);
  $timerBox.toggleClass("display");
  $startGame.text("START");
  $startGame.toggleClass("start-button-animation");
  isRunning = false;
}

function endGame() {
  // Check tail position and compare to hitbox
  const xPos = getTailPosition("left");
  const yPos = getTailPosition("top");
  // check hitbox position
  const hitboxLeft = parseInt($hitbox.css("left"));
  const hitboxRight = parseInt($hitbox.css("left")) + $hitbox.width();
  const hitboxTop = parseInt($hitbox.css("top"));
  const hitboxBottom = parseInt($hitbox.css("top")) + $hitbox.height();
  let modalMessage = "";
  // set modal message
  if (
    xPos >= hitboxLeft &&
    xPos <= hitboxRight &&
    yPos >= hitboxTop &&
    yPos <= hitboxBottom
  ) {
    modalMessage = "Congratulations! Great Success!";
  } else {
    modalMessage = "Try Again WOMP WOMP";
  }
  // show modal by removing the .modal-hide class
  $(".modal-message").text(modalMessage);
  $(".modal").removeClass("modal-hide");
  $(".modal-close").on("click", function () {
    $(".modal").addClass("modal-hide");
  });
}
