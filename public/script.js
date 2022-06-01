// main function
window.onload = function () {
    checkThemeOnLoad();
    addThemeButtonEventListener();

    loadKanbanBoard();

    addStopwatchEventListeners();
    addPomodoroEventListeners();

    addDictionarySearchLEventListener();
}


// Dark mode functionality
var DARK_MODE_TEXT = "dark_mode";
var LIGHT_MODE_TEXT = "light_mode";

function checkThemeOnLoad() {
    let storedTheme = localStorage.getItem("theme");
    if (storedTheme === null) {
        localStorage.setItem("theme", LIGHT_MODE_TEXT)
        document.getElementById("switch_button_icon").textContent = "light_mode";
    } else if (storedTheme === DARK_MODE_TEXT) {
        toggleDarkMode();
        document.getElementById("switch_button_icon").textContent = "dark_mode";
    }
}

function toggleDarkMode() {
    const htmlBodySection = document.body;
    htmlBodySection.classList.toggle(DARK_MODE_TEXT);
}

function addThemeButtonEventListener() {
    let themeButton = document.getElementById("theme_switch_box");
    themeButton.addEventListener("click", changeTheme);
}

function changeTheme() {
    toggleDarkMode();
    let storedTheme = localStorage.getItem("theme");
    if (storedTheme === LIGHT_MODE_TEXT) {
        localStorage.setItem("theme", DARK_MODE_TEXT)
        document.getElementById("switch_button_icon").textContent = "dark_mode";
    } else {
        localStorage.setItem("theme", LIGHT_MODE_TEXT)
        document.getElementById("switch_button_icon").textContent = "light_mode";
    }
}


// Kanban Column functionality
function addColumn() {
    let columnsFromStorage = localStorage.getItem("columns");
    let columns = JSON.parse(columnsFromStorage);
    let numberOfColumns = Object.keys(columns).length;

    if (numberOfColumns < 3) {
        let kanbanBoard = document.getElementById("kanban_board");
        let addKanbanColumn = document.getElementById("add_kanban_column");
        addKanbanColumn.remove();

        let columnsFromStorage = localStorage.getItem("columns");
        let columnsParsed = JSON.parse(columnsFromStorage);
        let columnKeys = Object.keys(columnsParsed);
        let firstAvailableKeyNumber = 1;
        for (let i = 0; i < columnKeys["length"]; i++) {
            let key = columnKeys[i];
            let currentKeyNumber = parseInt(key.slice(6, key.length));
            if (firstAvailableKeyNumber === currentKeyNumber) {
                firstAvailableKeyNumber = currentKeyNumber + 1;
            }
        }

        let columnId = "column" + firstAvailableKeyNumber.toString();
        if (numberOfColumns === 1) {
            columns[columnId] = {"name": "Type name here", "tasks": []};
            localStorage.setItem("columns", JSON.stringify(columns));
            kanbanBoard.innerHTML += addKanbanColumnHTML(columnId) + addKanbanColumnAddButtonHTML();
        } else if (numberOfColumns === 2) {
            columns[columnId] = {"name": "Type name here", "tasks": []};
            localStorage.setItem("columns", JSON.stringify(columns));
            kanbanBoard.innerHTML += addKanbanColumnHTML(columnId);
        }
        addEventListenerForAddColumn();
        addEventListenerForColumnClose();
    }
}

function loadKanbanBoard() {
    let columnOneId = 'column1';
    let columns = {};
    columns[columnOneId] = {"name": "Type column name here", "tasks": []};
    if (localStorage.getItem("columns") == null) {
        localStorage.setItem("columns", JSON.stringify(columns));
    }
    let columnsFromStorage = localStorage.getItem("columns");
    let columnsParsed = JSON.parse(columnsFromStorage);
    let columnKeys = Object.keys(columnsParsed);
    let numberOfColumns = columnKeys.length;

    let kanbanBoard = document.getElementById("kanban_board");

    for (let i = 0; i < columnKeys.length; i++) {
        let key = columnKeys[i];
        if (key === 'column1') {
            kanbanBoard.innerHTML += addKanbanTaskListHTML(key);
        } else {
            kanbanBoard.innerHTML += addKanbanColumnHTML(key);
        }
    }
    if (numberOfColumns < 3) {
        kanbanBoard.innerHTML += addKanbanColumnAddButtonHTML();
        addEventListenerForAddColumn();
    }
    addEventListenerForColumnClose();
}

function addEventListenerForAddColumn() {
    let addKanbanColumn = document.getElementById("add_kanban_column");
    if (addKanbanColumn != null) {
        addKanbanColumn.addEventListener("click", addColumn);
    }
}

function addEventListenerForColumnClose() {
    let closeButton = document.getElementsByClassName("close_column_button");
    for (let j = 0; j < closeButton.length; j++) {
        closeButton[j].addEventListener("click", closeColumn);
    }
}

function closeColumn() {
    let column = this.parentNode.parentNode;
    let columnId = column.id;
    column.remove();

    let columnsFromStorage = localStorage.getItem("columns");
    let columnsParsed = JSON.parse(columnsFromStorage);
    delete columnsParsed[columnId];
    localStorage.setItem("columns", JSON.stringify(columnsParsed));

    let columnKeys = Object.keys(columnsParsed);
    let numberOfColumns = columnKeys.length;
    let kanbanBoard = document.getElementById("kanban_board");
    if (numberOfColumns === 2) {
        kanbanBoard.innerHTML += addKanbanColumnAddButtonHTML();
    }
    addEventListenerForAddColumn();
    addEventListenerForColumnClose();
}


function addKanbanTaskListHTML() {
    return `<div class='kanban_column main_background' id='column1'>
                <div class='kanban_column_heading'>
                    <h3>Task List | </h3>
                </div>
                <div class='task'></div>
            </div>`;
}

function addKanbanColumnHTML(columnId) {
    return `<div class='kanban_column main_background' id=${columnId}>
                <div class='kanban_column_heading'>
                    <h3 contenteditable='true'> ${columnId} Task List | </h3>
                    <button type='button' class='close_column_button general_circle_button main_text'>
                        <span class='material-symbols-rounded md-18'>close</span>
                    </button>
                </div>
                <div class='task'></div>
            </div>`;
}

function addKanbanColumnAddButtonHTML() {
    return `<button type='button' id='add_kanban_column' class='main_text'>
                <span class='material-symbols-rounded md-18'>add</span> Add column
            </button>`;
}


// Stopwatch functionality
var stopwatchSecond = 0;
var stopwatchMinute = 0;
var stopwatchHour = 0;
var stopwatchStartTimer = null;
var currentActiveStopwatchButton = "Reset";

function addStopwatchEventListeners() {
    let startButton = document.getElementById("stopwatch_start");
    let stopButton = document.getElementById("stopwatch_stop");
    let resetButton = document.getElementById("stopwatch_reset");
    startButton.addEventListener("click", startStopWatch);
    stopButton.addEventListener("click", stopStopwatch);
    resetButton.addEventListener("click", resetStopwatch);
}

function startStopWatch() {
    if (currentActiveStopwatchButton !== "Start") {
        currentActiveStopwatchButton = "Start";

        stopwatchStartTimer = setInterval(() => {
            stopwatchSecond++;
            if (stopwatchSecond === 60) {
                stopwatchSecond = 0;
                stopwatchMinute++;
                if (stopwatchMinute === 60) {
                    stopwatchMinute = 0;
                    stopwatchHour++;
                }
            }

            let second = stopwatchSecond < 10 ? "0" + stopwatchSecond : stopwatchSecond;
            let minute = stopwatchMinute < 10 ? "0" + stopwatchMinute : stopwatchMinute;
            let hour = stopwatchHour < 10 ? "0" + stopwatchHour : stopwatchHour;

            setStopwatchTimer(hour, minute, second);
        }, 1000);
        setPropertyOfClass("stopwatch_time_number", "color", "#30c862")
    }
}

function stopStopwatch() {
    if (currentActiveStopwatchButton === "Start") {
        currentActiveStopwatchButton = "Stop";
        clearInterval(stopwatchStartTimer);
        setPropertyOfClass("stopwatch_time_number", "color", "#fe5157")
    }
}

function resetStopwatch() {
    currentActiveStopwatchButton = "Reset";
    stopwatchSecond = 0;
    stopwatchMinute = 0;
    stopwatchHour = 0;
    clearInterval(stopwatchStartTimer);
    setStopwatchTimer("0" + 0, "0" + 0, "0" + 0);
    setPropertyOfClass("stopwatch_time_number", "color", "");
}

function setStopwatchTimer(hour, minute, second) {
    document.getElementById("stopwatch_hour").innerText = hour;
    document.getElementById("stopwatch_minute").innerText = minute;
    document.getElementById("stopwatch_second").innerText = second;
}

function setPropertyOfClass(className, property, value) {
    let classItems = document.getElementsByClassName(className);
    for (let i = 0; i < classItems.length; i++) {
        let item = classItems[i];
        item.style.setProperty(property, value)
    }
}


// Pomodoro functionality
var session = 25;
var shortBreak = 5;
var cycles = 4;
var longBreak = 30;
var currentActivePomodoroButton = "Reset";
var pomodoroStartTimer = null;

var currentCycle = 0;
var currentPomodoroTimer = "Session";
var pomodoroSecondsLeft = 0;
var pomodoroMinuteLeft = session;

function addPomodoroEventListeners() {
    let startButton = document.getElementById("pomodoro_start");
    let stopButton = document.getElementById("pomodoro_stop");
    let resetButton = document.getElementById("pomodoro_reset");
    let settingsButton = document.getElementById("settings_button");
    startButton.addEventListener("click", startPomodoro);
    stopButton.addEventListener("click", stopPomodoro);
    resetButton.addEventListener("click", resetPomodoro);
    settingsButton.addEventListener("click", activatePomodoroSettings);
}

function startPomodoro() {
    if (currentActivePomodoroButton !== "Start") {
        currentActivePomodoroButton = "Start";
        if (currentPomodoroTimer === "Session") {
            setPropertyOfClass("pomodoro_time_number", "color", "#30c862");
        } else {
            setPropertyOfClass("pomodoro_time_number", "color", "#3f71e6");
        }
        pomodoroStartTimer = setInterval(() => {
            if (currentPomodoroTimer === "Session") {
                countdown();

                if (pomodoroSecondsLeft === 0 && pomodoroMinuteLeft === 0) {
                    pomodoroSecondsLeft = 0;
                    if (currentCycle >= cycles) {
                        currentPomodoroTimer = "Long Break";
                        pomodoroMinuteLeft = longBreak;
                    } else {
                        currentPomodoroTimer = "Short Break";
                        pomodoroMinuteLeft = shortBreak;
                    }
                }
            } else if (currentPomodoroTimer === "Short Break") {
                countdown();

                if (pomodoroSecondsLeft === 0 && pomodoroMinuteLeft === 0) {
                    currentCycle += 1;
                    currentPomodoroTimer = "Session";
                    pomodoroSecondsLeft = 0;
                    pomodoroMinuteLeft = session;
                }
            } else if (currentPomodoroTimer === "Long Break") {
                countdown();

                if (pomodoroSecondsLeft === 0 && pomodoroMinuteLeft === 0) {
                    resetPomodoro();
                    return;
                }
            }

            if (currentPomodoroTimer === "Session") {
                setPropertyOfClass("pomodoro_time_number", "color", "#30c862");
            } else {
                setPropertyOfClass("pomodoro_time_number", "color", "#3f71e6");
            }

            let second = pomodoroSecondsLeft < 10 ? "0" + pomodoroSecondsLeft : pomodoroSecondsLeft;
            let minute = pomodoroMinuteLeft < 10 ? "0" + pomodoroMinuteLeft : pomodoroMinuteLeft;

            setPomodoroTimer(minute, second);
        }, 1000);
    }
}

function countdown() {
    if (pomodoroSecondsLeft === 0) {
        pomodoroSecondsLeft = 60;
        pomodoroMinuteLeft--;
    }
    pomodoroSecondsLeft--;
}

function stopPomodoro() {
    if (currentActivePomodoroButton === "Start") {
        currentActivePomodoroButton = "Stop";
        clearInterval(pomodoroStartTimer);
        setPropertyOfClass("pomodoro_time_number", "color", "#fe5157");
    }
}

function resetPomodoro() {
    currentActivePomodoroButton = "Reset";
    currentCycle = 0;
    pomodoroSecondsLeft = 0;
    pomodoroMinuteLeft = session;
    currentPomodoroTimer = "Session";
    clearInterval(pomodoroStartTimer);
    let minute = session;
    if (minute < 10) {
        minute = "0" + minute;
    }
    setPomodoroTimer(minute, "0" + 0)
    setPropertyOfClass("pomodoro_time_number", "color", "");
}

function updatePomodoroSettings() {
    let sessionValue = document.getElementById("session");
    let shortBreakValue = document.getElementById("short_break");
    let cyclesValue = document.getElementById("cycles");
    let longBreakValue = document.getElementById("long_break");
    if (isValidTime(sessionValue.value) && isValidTime(shortBreakValue.value) && isValidCycles(cyclesValue.value) && isValidTime(longBreakValue.value)) {
        session = sessionValue.value;
        shortBreak = shortBreakValue.value;
        cycles = cyclesValue.value;
        longBreak = longBreakValue.value;
        resetPomodoro();
    }
}

function isValidTime(value) {
    return value !== "" && value >= 1 && value <= 60;
}

function isValidCycles(value) {
    return value !== "" && value >= 0 && value <= 99;
}

function setPomodoroTimer(minute, second) {
    document.getElementById("pomodoro_minute").innerText = minute;
    document.getElementById("pomodoro_second").innerText = second;
}

var pomodoroSettingsActive = false;

function activatePomodoroSettings() {
    if (!pomodoroSettingsActive) {
        let pomodoroSection = document.getElementById("pomodoro_feature");
        pomodoroSection.innerHTML += pomodoroSettingsHTML();
        let updateButton = document.getElementById("pomodoro_update_button");
        updateButton.addEventListener("click", updatePomodoroSettings);
        addPomodoroEventListeners();
        pomodoroSettingsActive = true;
    } else {
        let pomodoroSettings = document.getElementById("pomodoro_settings_form");
        pomodoroSettings.remove();
        addPomodoroEventListeners();
        pomodoroSettingsActive = false;
    }
}

function pomodoroSettingsHTML() {
    return `<!-- POMODORO SETTINGS form -->
            <form id="pomodoro_settings_form" onsubmit="return false">
                <h3 id="pomodoro_settings_title">Pomodoro Settings</h3>
                <ul id="details_section">
                    <!-- Session length input field -->
                    <li>
                        <label for="session" class="pomodoro_label_title">Session (min):</label>
                        <input id="session" class="input_field pomodoro_input_field" name="session" type="number" maxlength="2" min="1" max="60"  value=${session} required>
                    </li>

                    <!-- Short break length input field -->
                    <li>
                        <label for="short_break" class="pomodoro_label_title">Short Break (min):</label>
                        <input id="short_break" class="input_field pomodoro_input_field" name="short_break" type="number" maxlength="2" min="1" max="60"  value=${shortBreak} required>
                    </li>

                    <!-- Cycles -->
                    <li>
                        <label for="cycles" class="pomodoro_label_title">Cycles:</label>
                        <input id="cycles" class="input_field pomodoro_input_field" name="cycles" type="number" maxlength="2" min="0" max="99" value=${cycles} required>
                    </li>

                    <!-- Long break length input field -->
                    <li>
                        <label for="long_break" class="pomodoro_label_title">Long Break (min):</label>
                        <input id="long_break" class="input_field pomodoro_input_field" name="long_break" type="number" maxlength="2" min="1" max="60" value=${longBreak} required>
                    </li>
                </ul>
                <button type="submit" id="pomodoro_update_button" class="buttons general_buttons">Update</button>
            </form>`;
}

function addDictionarySearchLEventListener() {
    let dictionarySearchButton = document.getElementById("dictionary_search");
    dictionarySearchButton.addEventListener("click", dictionaryApiRequest);
}

function dictionaryApiRequest() {
    let wordRequested = document.getElementById("definition");
    if (wordRequested.value !== "") {
        let word = wordRequested.value;
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        // setup request for data collection
        let request = new XMLHttpRequest();

        // open the connection to the API
        request.open('GET', url);

        // handle the data loading
        request.onload = function () {

            // check the outcome of the request
            if (request.status >= 200 && request.status < 400) {
                let meanings = JSON.parse(this.response)[0]["meanings"];
                showDictionaryResults(meanings, word);

            } else {
                showUnsuccessfulDictionarySearch(word);
            }
        }
        // send request
        request.send();

        // reset input field of the searched word
        resetValueOfInputField(wordRequested);
    }
}

var fingingsId = 0;

function showDictionaryResults(meanings_json, word) {
    let dictionary = document.getElementById("dictionary");
    let dictionaryFindingsId = "dictionary_findings" + fingingsId;
    dictionary.innerHTML += `<div id=${dictionaryFindingsId} class="dictionary_findings">
                                <!-- Close the findings window -->
                                <button type='button' class='main_text general_circle_button findings_close_button'>
                                    <span class='material-symbols-rounded'>close</span>
                                </button>
                                <h3 class="searched_word">${word}</h3>
                                <p class="definition_and_synonym">Definitions:</p>
                             </div>`;
    let dictionary_findings = document.getElementById(dictionaryFindingsId);
    for (let i = 0; i < meanings_json["length"]; i++) {
        dictionary_findings.innerHTML += `<p class="definition_type">${meanings_json[i]["partOfSpeech"]}</p>
                                <p class="definition_sentence">${meanings_json[i]["definitions"][0]["definition"]}</p>`;
    }

    let allSynonyms = ``;
    for (let i = 0; i < meanings_json["length"]; i++) {
        if (meanings_json[i]["synonyms"]["length"] !== 0) {
            for (let j = 0; j < meanings_json[i]["synonyms"]["length"]; j++) {
                if (/^[A-Za-z0-9 ]*$/.test(meanings_json[i]["synonyms"][j]) === true) {
                    if (allSynonyms === ``) {
                        allSynonyms += `${meanings_json[i]["synonyms"][j]} `;
                    } else {
                        allSynonyms += `, ${meanings_json[i]["synonyms"][j]}`;
                    }
                }
            }
        }
    }
    if (allSynonyms !== ``) {
        dictionary_findings.innerHTML += `<p class="definition_and_synonym">Synonyms:</p>
                                          <p class="definition_sentence">${allSynonyms}</p>`;
    } else {
        dictionary_findings.innerHTML += `<p class="definition_and_synonym">Synonyms:</p>
                                          <p class="error_sentence">No synonyms were found.</p>`;
    }
    addDictionarySearchLEventListener();
    addDictionaryCloseButtonsEventListeners();
    fingingsId += 1;
}

function showUnsuccessfulDictionarySearch(word) {
    let dictionary = document.getElementById("dictionary");
    dictionary.innerHTML += `<div id="dictionary_findings" class="dictionary_findings">
                                <!-- Close the findings window -->
                                <button type='button' class='main_text general_circle_button findings_close_button'>
                                    <span class='material-symbols-rounded'>close</span>
                                </button>
                                <h3 class="searched_word">${word}</h3>
                                <p class="error_sentence">No results were found for this word.</p>
                             </div>`;
    addDictionarySearchLEventListener();
    addDictionaryCloseButtonsEventListeners();
    fingingsId += 1;
}

function resetValueOfInputField(field) {
    field.required = false;
    field.value = "";
    setTimeout(function () {
        field.required = true;
    }, 10);
}

function addDictionaryCloseButtonsEventListeners() {
    let closeButtons = document.getElementsByClassName("findings_close_button");
    for (let j = 0; j < closeButtons.length; j++) {
        closeButtons[j].addEventListener("click", closeDefinitionFindings);
    }
}

function closeDefinitionFindings() {
    let definitionFindings = this.parentNode;
    definitionFindings.remove();
    addDictionarySearchLEventListener();
    addDictionaryCloseButtonsEventListeners();
}