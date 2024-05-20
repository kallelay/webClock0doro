/********************************
	Original code requested by Ahmed Yahia Kallel using ChatGPT 3.5 in VB.NET, which undergone quite a huge optimization
	New code is generated using Claude AI from VB.NET, manually optimized
	The code is documented using ChatGPT 4.0o
**********************************/

// Set work and break durations in seconds
let WORK_TIME = localStorage.getItem('WORK_TIME') ? parseInt(localStorage.getItem('WORK_TIME')) * 60 : 25 * 60;
let BREAK_TIME = localStorage.getItem('BREAK_TIME') ? parseInt(localStorage.getItem('BREAK_TIME')) * 60 : 5 * 60;


// Define mode constants
const MODES = {
    BREAK: 0,
    WORK: 1,
    INVALID: -1
};

// Initialize state variables
let isPaused = true;
let currentMode = MODES.WORK;
let curTime = WORK_TIME;
let tickCounter = 0;

// Update the pause button icon based on the paused state
function updatePauseButton() {
    if (!isPaused) {
        $('#btnPause').html('<i class="material-icons">pause</i>');
    } else {
        $('#btnPause').html('<i class="material-icons">play_arrow</i>');
    }
}

// Start the pomodoro timer with an optional mode parameter
function startPomodoro(setMode = MODES.INVALID) {
    isPaused = false;

    if (setMode === MODES.WORK) {
        currentMode = MODES.WORK;
        curTime = WORK_TIME;
    } else if (setMode === MODES.BREAK) {
        currentMode = MODES.BREAK;
        curTime = BREAK_TIME;
    }

    updateTimer();
    updatePauseButton();
    playSound();
}

// Toggle the paused state of the pomodoro timer
function pausePomodoro() {
    isPaused = !isPaused;
    if (!isPaused) {
        startPomodoro();
    }
    updateTimer();
    updatePauseButton();
    if (!isPaused) {
        playSound();
    }
}

// Stop the pomodoro timer and reset the current time
function stopPomodoro() {
    if (currentMode === MODES.BREAK) {
        curTime = BREAK_TIME;
    } else {
        curTime = WORK_TIME;
    }
    updateTimer();
    isPaused = true;
    updatePauseButton();
}

// Play a sound based on the current mode
function playSound() {
    const alarmStop = 'alarm1_stop.wav';
    const alarmStart = 'alarm1_start.wav';
    if ($('#chkSound').is(':checked')) {
        try {
            if (currentMode === MODES.BREAK) {
                new Audio(alarmStop).play();
            } else {
                new Audio(alarmStart).play();
            }
        } catch (ex) {
            console.error(ex);
        }
    }
}

// Update the timer display and switch modes if needed
function updateTimer() {
    if (!isPaused) {
        curTime--;
        if (curTime <= 0) {
            currentMode = currentMode === MODES.BREAK ? MODES.WORK : MODES.BREAK;
            curTime = currentMode === MODES.BREAK ? BREAK_TIME : WORK_TIME;
            playSound();
        }
    }

    const minutes = Math.floor(curTime / 60);
    const seconds = curTime % 60;
    $('#lblTime').text(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

    updateClockFace();
}

// Update the analog clock face based on the current time
function updateClockFace() {
	w = $("#panel1").width();
    const canvas = document.createElement('canvas');
    const sq = w - 2; // Size of the square canvas
    const hrHand = 30 * w/150; // Hour hand length
    const mnHand = 40 * w/150; // Minute hand length
    const scHand = 50 * w/150; // Second hand length
    const hrnumpos = sq / 2.45 ; // Position for hour numbers
    const numfnt = (14 * w / 175)+ 'px Arial'; // Font for hour numbers

    canvas.width = canvas.height = sq;
    const ctx = canvas.getContext('2d');
    ctx.translate(1, 1);

    // Draw the remaining time arc
    if (!isPaused) {
        if (currentMode === MODES.BREAK) {
            ctx.beginPath();
            ctx.arc(sq / 2, sq / 2, sq / 2, -Math.PI / 2, (-Math.PI / 2) + (curTime / BREAK_TIME * 2 * Math.PI));
            ctx.strokeStyle = 'palevioletred';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(sq / 2, sq / 2, sq / 2, -Math.PI / 2, (-Math.PI / 2) + (curTime / WORK_TIME * 2 * Math.PI));
            ctx.strokeStyle = 'lawngreen';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    // Draw the clock face
    ctx.beginPath();
    ctx.arc(sq / 2, sq / 2, sq / 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Draw the transparent overlay for the current mode
    if (!isPaused) {
        if (currentMode === MODES.BREAK) { // Break mode (transparent)
            ctx.beginPath();
            ctx.moveTo(sq / 2, sq / 2);
            ctx.arc(sq / 2, sq / 2, sq / 2, (-Math.PI / 2) + ((new Date().getMinutes() + new Date().getSeconds() / 60) / 60 * 2 * Math.PI), (-Math.PI / 2) + ((new Date().getMinutes() + new Date().getSeconds() / 60) / 60 * 2 * Math.PI) + (curTime / 3600 * 2 * Math.PI));
            ctx.fillStyle = 'rgba(255, 192, 192, 0.4)';
            ctx.fill();
        } else { // Work mode (transparent)
            ctx.beginPath();
            ctx.moveTo(sq / 2, sq / 2);
            ctx.arc(sq / 2, sq / 2, sq / 2, (-Math.PI / 2) + ((new Date().getMinutes() + new Date().getSeconds() / 60) / 60 * 2 * Math.PI), (-Math.PI / 2) + ((new Date().getMinutes() + new Date().getSeconds() / 60) / 60 * 2 * Math.PI) + (curTime / 3600 * 2 * Math.PI));
            ctx.fillStyle = 'rgba(180, 255, 201, 0.3)';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(sq / 2, sq / 2);
            ctx.arc(sq / 2, sq / 2, sq / 2, (-Math.PI / 2) + ((new Date().getMinutes() + new Date().getSeconds() / 60) / 60 * 2 * Math.PI) + (curTime / 3600 * 2 * Math.PI), (-Math.PI / 2) + ((new Date().getMinutes() + new Date().getSeconds() / 60) / 60 * 2 * Math.PI) + (curTime / 3600 * 2 * Math.PI) + (BREAK_TIME / 3600 * 2 * Math.PI));
            ctx.fillStyle = 'rgba(255, 192, 192, 0.4)';
            ctx.fill();
        }
    }

    // Draw the outer circle of the clock
    ctx.beginPath();
    ctx.arc(sq / 2, sq / 2, sq / 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw hour marks and numbers
    for (let k = 1; k <= 12; k++) {
        ctx.beginPath();
        ctx.arc((sq / 2) + Math.cos(-Math.PI / 2 + (k / 12) * 2 * Math.PI) * (sq / 2), (sq / 2) + Math.sin(-Math.PI / 2 + (k / 12) * 2 * Math.PI) * (sq / 2), 1, 0, 2 * Math.PI);
        ctx.fillStyle = 'ghostwhite';
        ctx.fill();
        ctx.font = numfnt;
        const dimString = ctx.measureText(k);
        ctx.fillText(k, (sq / 2) + Math.cos(-Math.PI / 2 + (k / 12) * 2 * Math.PI) * hrnumpos - (dimString.width / 2), (sq / 2) + Math.sin(-Math.PI / 2 + (k / 12) * 2 * Math.PI) * hrnumpos + 2);
    }

    // Calculate angles for hour, minute, and second hands
    const hourAngle = ((new Date().getHours() % 12) + new Date().getMinutes() / 60) * Math.PI / 6;
    const minuteAngle = (new Date().getMinutes() + new Date().getSeconds() / 60) * Math.PI / 30;
    const secondAngle = new Date().getSeconds() * Math.PI / 30;

    // Draw hour hand
    ctx.beginPath();
    ctx.moveTo(sq / 2, sq / 2);
    ctx.lineTo((sq / 2) + Math.cos(hourAngle - Math.PI / 2) * hrHand, (sq / 2) + Math.sin(hourAngle - Math.PI / 2) * hrHand);
    ctx.strokeStyle = 'ghostwhite';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw minute hand
    ctx.beginPath();
    ctx.moveTo(sq / 2, sq / 2);
    ctx.lineTo((sq / 2) + Math.cos(minuteAngle - Math.PI / 2) * mnHand, (sq / 2) + Math.sin(minuteAngle - Math.PI / 2) * mnHand);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw second hand
    ctx.beginPath();
    ctx.moveTo(sq / 2, sq / 2);
    ctx.lineTo((sq / 2) + Math.cos(secondAngle - Math.PI / 2) * scHand, (sq / 2) + Math.sin(secondAngle - Math.PI / 2) * scHand);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw center point
    ctx.beginPath();
    ctx.arc(sq / 2, sq / 2, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'dimgray';
    ctx.fill();

    // Display the updated clock
    $('#panel1').html(canvas);
}

// Update the background color of the panel based on the current mode and state
function updatePanelColor() {
    const curMode = (isPaused ? 2 : 0) + currentMode;
    let backgroundColor;
    let textColor;
    let text;

    if (isPaused) { // Paused
        backgroundColor = `rgba(60, 60, 60, ${1 + (tickCounter % 100) / 100})`;
        textColor = `rgba(${Math.cos(tickCounter / 100 * 2 * Math.PI) * 64 + 164}, ${Math.cos(tickCounter / 100 * 2 * Math.PI) * 64 + 164}, ${Math.cos(tickCounter / 100 * 2 * Math.PI) * 64 + 164})`;
        text = 'Paused';
    } else if (curMode === MODES.WORK) { // Work mode
        backgroundColor = `rgba(63, 75, 63, ${1 + (tickCounter % 100) / 100})`;
        textColor = `rgba(${Math.cos(tickCounter / 100 * 2 * Math.PI) * 28 + 184}, ${Math.cos(tickCounter / 100 * 2 * Math.PI) * 28 + 194}, ${Math.cos(tickCounter / 100 * 2 * Math.PI) * 28 + 184})`;
        text = 'Work Time';
    } else { // Break mode
        backgroundColor = `rgba(75, 63, 63, ${1 + (tickCounter % 100) / 100})`;
        textColor = `rgba(${Math.cos(tickCounter / 100 * 2 * Math.PI) * 28 + 194}, ${Math.cos(tickCounter / 100 * 2 * Math.PI) * 28 + 184}, ${Math.cos(tickCounter / 100 * 2 * Math.PI) * 28 + 184})`;
        text = 'Break Time';
    }

    // Apply the background color and text color to the panel
    $('#panel2').css('background-color', backgroundColor);
    $('#panel2').text(text);
    $('#panel2').css('color', textColor);
}

// Synchronize the timer to start at the top of the hour
function synchronize() {
	now = new Date();
    remainingTime = 3600 - (now.getMinutes() * 60 + now.getSeconds());
    curTime0 = remainingTime % (BREAK_TIME + WORK_TIME);
	
	 isPaused = false;
	
    if (curTime0 < BREAK_TIME) {
        currentMode = MODES.BREAK;
		curTime = curTime0;
    } else {
        currentMode = MODES.WORK;
        curTime = curTime0 - BREAK_TIME;
    }
	
    updateTimer();
    updatePauseButton();
}

// Set up event handlers and intervals when the document is ready
$(document).ready(function () {
    setInterval(updateTimer, 1000); // Update the timer every second
    setInterval(updatePanelColor, 100); // Update the panel color every 100 milliseconds
    setInterval(function () {
        tickCounter++;
        if (!isPaused) {
            $('#lblTime').css('color', 'ghostwhite');
        } else {
            const r = Math.cos(tickCounter / 100 * 2 * Math.PI) * 64 + 164;
            $('#lblTime').css('color', `rgba(${r}, ${r}, ${r})`);
        }
    }, 90); // Update the time label color every 90 milliseconds

    // Attach event handlers to buttons
    $('#btnPause').click(pausePomodoro);
    $('#btnStop').click(stopPomodoro);
    $('#btnBreak').click(function () {
        startPomodoro(MODES.BREAK);
    });
    $('#btnWork').click(function () {
        startPomodoro(MODES.WORK);
    });
    $('#syncbt').click(synchronize);
    $('#btnSettings').click(function () {
        // Open settings dialog
    });
});


// Open and close modal logic
const modal = document.getElementById("settingsModal");
const btnSettings = document.getElementById("btnSettings");
const spanClose = document.getElementsByClassName("close")[0];

btnSettings.onclick = function() {
    document.getElementById('workTimeInput').value = WORK_TIME / 60;
    document.getElementById('breakTimeInput').value = BREAK_TIME / 60;
	//modal.style.display = "block";
	$("#settingsModal").fadeIn();
    
}

spanClose.onclick = function() {
    //modal.style.display = "none";
	$("#settingsModal").fadeOut();
}

window.onclick = function(event) {
    if (event.target == modal) {
	$("#settingsModal").fadeOut();
    }
}

// Save settings logic
document.getElementById('saveSettings').onclick = function() {
    let newWorkTime = parseInt(document.getElementById('workTimeInput').value);
    let newBreakTime = parseInt(document.getElementById('breakTimeInput').value);
    
    if (newWorkTime > 0 && newBreakTime > 0) {
        WORK_TIME = newWorkTime * 60;
        BREAK_TIME = newBreakTime * 60;

        localStorage.setItem('WORK_TIME', newWorkTime);
        localStorage.setItem('BREAK_TIME', newBreakTime);

        curTime = currentMode === MODES.WORK ? WORK_TIME : BREAK_TIME;
        updateTimer();

        modal.style.display = "none";
    } else {
        alert("Please enter valid times greater than 0.");
    }
}

