// const SQUARE_EDGE = 32;
const SQUARES_PER_EDGE = 10;
const COLORS = ["black", "yellow"];
const PLAY_DIV = document.getElementById("playDiv");
const BLOCKS = [];

const randomizer = max => Math.floor(Math.random() * max);

for (let rowCounter = 0; rowCounter < SQUARES_PER_EDGE; rowCounter++) {
    BLOCKS.push([]);
    for (let columnCounter = 0; columnCounter < SQUARES_PER_EDGE; columnCounter++) {
        let newDiv = document.createElement('div');

        let color = COLORS[randomizer(COLORS.length)];
        newDiv.classList.add(color);
        if (color === "yellow") {
            newDiv.addEventListener("touchstart", () => newDiv.classList.add("touched"));
        }
        BLOCKS[rowCounter].push(color);

        PLAY_DIV.append(newDiv);
    }
}

function reset() {
    Array.from(PLAY_DIV.children).forEach(block => block.classList.remove("touched"));
}

// Array.from(PLAY_DIV.children).forEach(div => {
//     let data = JSON.parse
// });
    