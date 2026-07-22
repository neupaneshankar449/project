let count = 0;
let min = 0;
let max = 10;

let increaseBtn = document.getElementById("increaseBtn");
let decreaseBtn = document.getElementById("decreaseBtn");
let display = document.getElementById("count");

increaseBtn.onclick = function () {

    if (count < max) {
        count++;
        display.textContent = count;
    }

    if (count == max) {
        increaseBtn.disabled = true;
        display.style.color = "red";
    }

    decreaseBtn.disabled = false;
};

decreaseBtn.onclick = function () {

    if (count > min) {
        count--;
        display.textContent = count;
    }

    if (count < max) {
        increaseBtn.disabled = false;
        display.style.color = "black";
    }

    if (count == min) {
        decreaseBtn.disabled = true;
    }
};