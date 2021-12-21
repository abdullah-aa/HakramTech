const SQUARES_PER_EDGE = 10;
let SCORE_COUNTER = 0;
const YELLOW = "yellow";
const BLACK = "black";
const PURPLE = "purple";

const PLAY_DIV = document.getElementById("playDiv");
const SCORE_BOARD = document.getElementById("scoreSpan");
const BLOCKS = [];
for (let counter = 0; counter < SQUARES_PER_EDGE; counter++) {
    BLOCKS.push([]);
}
const randomizer = max => Math.floor(Math.random() * max);

const blockIterator = iterAction => {
    for (let rowCounter = SQUARES_PER_EDGE - 1; rowCounter >= 0; rowCounter--) {
        for (let columnCounter = SQUARES_PER_EDGE - 1; columnCounter >= 0; columnCounter--) {
            iterAction(rowCounter, columnCounter);
        }
    }
};

const updateScore = newScore => {
    SCORE_BOARD.innerHTML = `${newScore} points!`
}

blockIterator((rowCounter, columnCounter) => {
    let newDiv = document.createElement('div');

    newDiv.classList.add("black");
    newDiv.addEventListener("touchend", event => {
        [
            { color: YELLOW, points: 10 },
            // { color: PURPLE, points: -10 },
        ].forEach(rule => {
            if (event.target.classList.contains(rule.color)) {
                SCORE_COUNTER += rule.points;
                updateScore(SCORE_COUNTER);
                event.target.classList.remove(rule.color);
                event.target.classList.add(BLACK);
            }
        });
    });

    BLOCKS[rowCounter][columnCounter] = newDiv;
    PLAY_DIV.append(newDiv);
});

const reset = currentDiv => {
    currentDiv.classList.remove(YELLOW);
    // currentDiv.classList.remove(PURPLE);
    currentDiv.classList.add(BLACK);
}

function throwGold() {
    let newActives = [];
    blockIterator((rowCounter, columnCounter) =>{
        let currentDiv = BLOCKS[rowCounter][columnCounter];
        // if (currentDiv.classList.contains(PURPLE) || currentDiv.classList.contains(YELLOW)) {
        if (currentDiv.classList.contains(YELLOW)) {
            reset(currentDiv);
            if (rowCounter > 0) {
                newActives.push(
                    {
                        row: rowCounter - 1,
                        column: columnCounter,
                        color: YELLOW
                    }
                );
            }
        }
    });

    for (let topCounter = 0; topCounter < SQUARES_PER_EDGE; topCounter++) {
        if (randomizer(10) > 8) {
            BLOCKS[9][topCounter].classList.add(YELLOW);
        }
    }
    newActives.forEach(newActive => {
        BLOCKS[newActive.row][newActive.column].classList = newActive.color;
    });
    // window.requestAnimationFrame(throwGold);
}

// window.requestAnimationFrame(throwGold);

setInterval(throwGold, 400);
