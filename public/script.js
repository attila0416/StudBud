// main function
window.onload = function () {
    // light/dark mode
    checkThemeOnLoad();
    addThemeButtonEventListener();

    // kanban board
    loadKanbanBoard();
    addEventListenerForAddTask();

    // timers: stopwatch and pomodoro
    addStopwatchEventListeners();
    addPomodoroEventListeners();

    // dictionary
    addDictionarySearchLEventListener();
}



// DARK MODE functionality section
var DARK_MODE_TEXT = "dark_mode";
var LIGHT_MODE_TEXT = "light_mode";

// check what theme colour is saved in local storage and change the theme accordingly
function checkThemeOnLoad() {
    let storedTheme = localStorage.getItem("theme");
    if (storedTheme === null) {
        localStorage.setItem("theme", LIGHT_MODE_TEXT)
        document.getElementById("switch_button_icon").textContent = "light_mode";
        setMusicPlayerToLightMode();
    } else if (storedTheme === DARK_MODE_TEXT) {
        toggleDarkMode();
        document.getElementById("switch_button_icon").textContent = "dark_mode";
        setMusicPlayerToDarkMode();
    }
}

// activate dark mode
function toggleDarkMode() {
    const htmlBodySection = document.body;
    htmlBodySection.classList.toggle(DARK_MODE_TEXT);
}

// add event listener for the light/dark mode button
function addThemeButtonEventListener() {
    let themeButton = document.getElementById("theme_switch_box");
    themeButton.addEventListener("click", changeTheme);
}

// change the theme depending on the current active one
function changeTheme() {
    toggleDarkMode();
    let storedTheme = localStorage.getItem("theme");
    if (storedTheme === LIGHT_MODE_TEXT) {
        localStorage.setItem("theme", DARK_MODE_TEXT)
        document.getElementById("switch_button_icon").textContent = "dark_mode";
        setMusicPlayerToDarkMode();
    } else {
        localStorage.setItem("theme", LIGHT_MODE_TEXT)
        document.getElementById("switch_button_icon").textContent = "light_mode";
        setMusicPlayerToLightMode();
    }
}

// set the colour of the embedded music player to light
function setMusicPlayerToLightMode() {
    let music_player = document.getElementById("embedded_music_player");
    music_player.src = "https://open.spotify.com/embed/playlist/471N195f5jAVs086lzYglw?utm_source=generator&theme=white";
}

// set the colour of the embedded music player to dark
function setMusicPlayerToDarkMode() {
    let music_player = document.getElementById("embedded_music_player");
    music_player.src = "https://open.spotify.com/embed/playlist/471N195f5jAVs086lzYglw?utm_source=generator&theme=0";
}



// KANBAN BOARD functionality section
// add a kanban column to the board and change the localstorage accordingly
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
        columns[columnId] = {"name": "Type name here", "tasks": {}};
        localStorage.setItem("columns", JSON.stringify(columns));
        if (numberOfColumns === 1) {
            kanbanBoard.innerHTML += addKanbanColumnHTML(columnId) + addKanbanColumnAddButtonHTML();
        } else if (numberOfColumns === 2) {
            kanbanBoard.innerHTML += addKanbanColumnHTML(columnId);
        }
        addEventListenerForAddColumn();
        addEventListenerForColumnClose();
        addEventListenerForColumnTitleInput();
        addEventListenerForAddTask();
    }
}

// load in the kanban board from localstorage when website starts
function loadKanbanBoard() {
    let columnOneId = 'column1';
    let columns = {};
    columns[columnOneId] = {"name": "Task List", "tasks": {}};
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
        kanbanBoard.innerHTML += addKanbanColumnHTML(key);
    }
    if (numberOfColumns < 3) {
        kanbanBoard.innerHTML += addKanbanColumnAddButtonHTML();
        addEventListenerForAddColumn();
    }
    addEventListenerForColumnClose();
    addEventListenerForColumnTitleInput();
}

// add event listeners for the buttons that enable column adding
function addEventListenerForAddColumn() {
    let addKanbanColumn = document.getElementById("add_kanban_column");
    if (addKanbanColumn != null) {
        addKanbanColumn.addEventListener("click", addColumn);
    }
}

// add event listeners for the buttons that enable column closing
function addEventListenerForColumnClose() {
    let closeButton = document.getElementsByClassName("close_column_button");
    for (let j = 0; j < closeButton.length; j++) {
        closeButton[j].addEventListener("click", closeColumn);
    }
}

// close the columns and make changes to localstorage accordingly
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
    addEventListenerForColumnTitleInput();
    addEventListenerForAddTask();
}

// returns html code for columns which will be dynamically added to the website
function addKanbanColumnHTML(columnId) {
    let columnName = getColumnName(columnId);
    let htmlToBeReturned = `<div class='kanban_column main_background' id=${columnId}>
                                <div class='kanban_column_heading'>`;
    if (columnId === "column1") {
        htmlToBeReturned += `<h3>${columnName}</h3>`;
    } else {
        htmlToBeReturned += `<h3 contenteditable="true" class="title_input">${columnName}</h3>`;
    }

    let numberOfTasks = getNumberOfTasksInColumn(columnId);
    htmlToBeReturned += `<p class="column_title_divider">|</p>
                         <p class="column_task_count">${numberOfTasks}</p>`;

    if (columnId !== "column1") {
        htmlToBeReturned += addCloseColumnButtonHTML();
    }

    htmlToBeReturned += `</div>
                         <div class='tasks_container'><div class="tasks"></div>`;

    if (columnId === "column1") {
        htmlToBeReturned += addTaskButtonHTML();
    }

    htmlToBeReturned += `</div></div>`;

    return htmlToBeReturned;
}

// returns html code for the button that enables column adding which will be dynamically added to the website
function addKanbanColumnAddButtonHTML() {
    return `<button type='button' id='add_kanban_column' class='main_text add_button white_background'>
                <span class='material-symbols-rounded md-18'>add</span> Add column
            </button>`;
}

// get the number of tasks stored under a column from the data base
function getNumberOfTasksInColumn(columnId) {
    let columnsFromStorage = localStorage.getItem("columns");
    let columnsParsed = JSON.parse(columnsFromStorage);
    return Object.keys(columnsParsed[columnId]["tasks"]).length;
}

// return the html code for the Close Column button that will be dynamically added to the website
function addCloseColumnButtonHTML() {
    return `<button type='button' class='close_column_button general_circle_button main_text'>
                <span class='material-symbols-rounded md-18'>close</span>
            </button>`;
}

// return the html code for the Add Task button that will be dynamically added to the website
function addTaskButtonHTML() {
    return `<button type='button' id='add_task_button' class='main_text add_button main_background'>
                <span class='material-symbols-rounded'>add</span> Add task
            </button>`;
}

// add event listeners for the title of each column
function addEventListenerForColumnTitleInput() {
    let titleInput = document.getElementsByClassName("title_input");
    for (let j = 0; j < titleInput.length; j++) {
        titleInput[j].addEventListener("keydown", updateTitleBefore);
        titleInput[j].addEventListener("keyup", updateTitleAfter);
        titleInput[j].addEventListener("click", removePlaceholderForTitle);
        titleInput[j].addEventListener("blur", resetPlaceholderForTitle);
    }
}

var currentTitleBeingEdited = "";
// update the title of the column after key was pressed
function updateTitleAfter(event) {
    if (this.innerHTML.length >= 18 && event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        event.preventDefault();
        this.innerHTML = currentTitleBeingEdited;
        return;
    }
    if (this.innerHTML.length === 0) {
        event.target.focus();
    }
    currentTitleBeingEdited = this.innerHTML;
    updateColumnNameInDatabase(this);
}

// check the title before the key is released and if "Enter" is pressed then release the focus from the input field
function updateTitleBefore(event) {
    currentTitleBeingEdited = this.innerHTML;
    if (event.key === 'Enter') {
        event.preventDefault();
        event.target.blur();
    }
}

// remove the placeholder text that is displayed to the user for the column title
function removePlaceholderForTitle() {
    if (this.innerHTML === "Type name here") {
        this.innerHTML = "";
    }
}

// add back the placeholder text that is displayed to the user for the column title
function resetPlaceholderForTitle() {
    if (this.innerHTML === "") {
        this.innerHTML = "Type name here";
    }
    currentTitleBeingEdited = this.innerHTML;
    updateColumnNameInDatabase(this);
}

// save/update the title of the column in the database
function updateColumnNameInDatabase(currentTitle) {
    let column = currentTitle.parentNode.parentNode;
    let columnId = column.id;
    let columnsFromStorage = localStorage.getItem("columns");
    let columnsParsed = JSON.parse(columnsFromStorage);
    columnsParsed[columnId]["name"] = currentTitleBeingEdited;
    localStorage.setItem("columns", JSON.stringify(columnsParsed));
}

// get the current title of the column from the database
function getColumnName(columnId) {
    let columnsFromStorage = localStorage.getItem("columns");
    let columnsParsed = JSON.parse(columnsFromStorage);
    return columnsParsed[columnId]["name"];
}

// add event listener for the Add Task button
function addEventListenerForAddTask() {
    let addTaskButton = document.getElementById("add_task_button");
    addTaskButton.addEventListener("click", addTaskToTaskList);
}

// add a task to the first column, which is the task List
function addTaskToTaskList() {
    // todo add task
    console.log("add task");
}



// STOPWATCH functionality section
var stopwatchSecond = 0;
var stopwatchMinute = 0;
var stopwatchHour = 0;
var stopwatchStartTimer = null;
var currentActiveStopwatchButton = "Reset";

// add event listeners for the three buttons that control the stopwatch
function addStopwatchEventListeners() {
    let startButton = document.getElementById("stopwatch_start");
    let stopButton = document.getElementById("stopwatch_stop");
    let resetButton = document.getElementById("stopwatch_reset");
    startButton.addEventListener("click", startStopWatch);
    stopButton.addEventListener("click", stopStopwatch);
    resetButton.addEventListener("click", resetStopwatch);
}

// start timer for the stopwatch, which controls the time passed
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

// stop the timer for the stopwatch
function stopStopwatch() {
    if (currentActiveStopwatchButton === "Start") {
        currentActiveStopwatchButton = "Stop";
        clearInterval(stopwatchStartTimer);
        setPropertyOfClass("stopwatch_time_number", "color", "#fe5157")
    }
}

// reset the time passed back to zero
function resetStopwatch() {
    currentActiveStopwatchButton = "Reset";
    stopwatchSecond = 0;
    stopwatchMinute = 0;
    stopwatchHour = 0;
    clearInterval(stopwatchStartTimer);
    setStopwatchTimer("0" + 0, "0" + 0, "0" + 0);
    setPropertyOfClass("stopwatch_time_number", "color", "");
}

// set the time that is displayed to the user
function setStopwatchTimer(hour, minute, second) {
    document.getElementById("stopwatch_hour").innerText = hour;
    document.getElementById("stopwatch_minute").innerText = minute;
    document.getElementById("stopwatch_second").innerText = second;
}

// change the css property of a class
function setPropertyOfClass(className, property, value) {
    let classItems = document.getElementsByClassName(className);
    for (let i = 0; i < classItems.length; i++) {
        let item = classItems[i];
        item.style.setProperty(property, value)
    }
}



// POMODORO functionality section
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

// add event listeners for the buttons that control the pomodoro timer
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

// start the timer for the pomodoro and calculate which pomodoro time it should be showing
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

// count down seconds and minutes for the pomodoro timer
function countdown() {
    if (pomodoroSecondsLeft === 0) {
        pomodoroSecondsLeft = 60;
        pomodoroMinuteLeft--;
    }
    pomodoroSecondsLeft--;
}

// stop the countdown for the pomodoro timer
function stopPomodoro() {
    if (currentActivePomodoroButton === "Start") {
        currentActivePomodoroButton = "Stop";
        clearInterval(pomodoroStartTimer);
        setPropertyOfClass("pomodoro_time_number", "color", "#fe5157");
    }
}

// reset the pomodoro completely, including cycles done and the time passed
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

// update the time period for the session, cycle and breaks
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

// checks if the user input for the time is valid
function isValidTime(value) {
    return value !== "" && value >= 1 && value <= 60;
}

// checks if the user input for the cycles is valid
function isValidCycles(value) {
    return value !== "" && value >= 0 && value <= 99;
}

// set the time that is displayed for the user on the pomodoro timer
function setPomodoroTimer(minute, second) {
    document.getElementById("pomodoro_minute").innerText = minute;
    document.getElementById("pomodoro_second").innerText = second;
}

var pomodoroSettingsActive = false;
// display or remove the pomodoro settings for the user depending on its current state
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

// return the pomodoro settings html that is dynamically inserted into the website
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
                <button type="submit" class="buttons general_buttons" id="pomodoro_update_button">Update</button>
            </form>`;
}

// add event listener to the dictionary search button that sends an API request
function addDictionarySearchLEventListener() {
    let dictionarySearchButton = document.getElementById("dictionary_search");
    dictionarySearchButton.addEventListener("click", dictionaryApiRequest);
}

// send an API request to get the meaning of a word
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
// display the found definitions and synonyms to the user on the website
function showDictionaryResults(meanings_json, word) {
    let dictionary = document.getElementById("dictionary");
    let dictionaryFindingsId = "dictionary_findings" + fingingsId;
    dictionary.innerHTML += `<div id=${dictionaryFindingsId} class="dictionary_findings main_background">
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

// display to the user that no definition was found for the word they searched
function showUnsuccessfulDictionarySearch(word) {
    let dictionary = document.getElementById("dictionary");
    dictionary.innerHTML += `<div id="dictionary_findings" class="dictionary_findings main_background">
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

// delete the value from the input field that user entered a word into after they submitted the form
function resetValueOfInputField(field) {
    field.required = false;
    field.value = "";
    setTimeout(function () {
        field.required = true;
    }, 10);
}

// add an event listener for the close button on each findings field
function addDictionaryCloseButtonsEventListeners() {
    let closeButtons = document.getElementsByClassName("findings_close_button");
    for (let j = 0; j < closeButtons.length; j++) {
        closeButtons[j].addEventListener("click", closeDefinitionFindings);
    }
}

// close the specified findings window
function closeDefinitionFindings() {
    let definitionFindings = this.parentNode;
    definitionFindings.remove();
    addDictionarySearchLEventListener();
    addDictionaryCloseButtonsEventListeners();
}