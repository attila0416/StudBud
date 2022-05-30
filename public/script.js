var DARK_MODE_TEXT = "dark_mode";
var LIGHT_MODE_TEXT = "light_mode";


window.onload = function () {
    loadKanbanBoard();
    checkThemeOnLoad();
    let themeButton = document.getElementById("theme_switch_box");
    themeButton.addEventListener("click", changeTheme);
}


function checkThemeOnLoad() {
    let storedTheme = localStorage.getItem("theme");
    if (storedTheme === null) {
        localStorage.setItem("theme", LIGHT_MODE_TEXT)
        document.getElementById("switch_button_icon").textContent="light_mode";
    } else if (storedTheme === DARK_MODE_TEXT) {
        toggleDarkMode();
        document.getElementById("switch_button_icon").textContent="dark_mode";
    }
}

function toggleDarkMode() {
    const htmlBodySection = document.body;
    htmlBodySection.classList.toggle(DARK_MODE_TEXT);
}

function changeTheme() {
    toggleDarkMode();
    let storedTheme = localStorage.getItem("theme");
    if (storedTheme === LIGHT_MODE_TEXT) {
        localStorage.setItem("theme", DARK_MODE_TEXT)
        document.getElementById("switch_button_icon").textContent="dark_mode";
    } else {
        localStorage.setItem("theme", LIGHT_MODE_TEXT)
        document.getElementById("switch_button_icon").textContent="light_mode";
    }
}


function addColumn() {
    let columnsFromStorage = localStorage.getItem("columns");
    let columns = JSON.parse(columnsFromStorage);
    let numberOfColumns = Object.keys(columns).length;

    if (numberOfColumns < 3) {
        let kanbanBoard = document.getElementById("kanban_board");
        let addKanbanColumn = document.getElementById("add_kanban_column");
        addKanbanColumn.removeEventListener("click", addColumn);
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
    let closeButton = document.getElementsByClassName("close_button");
    for (let j = 0; j < closeButton.length; j++) {
        closeButton[j].addEventListener("click", closeColumn);
    }
}

function closeColumn() {
    let column = this.parentNode.parentNode;
    let columnId = column.id;
    column.remove();
    console.log("hi");

    let columnsFromStorage = localStorage.getItem("columns");
    let columnsParsed = JSON.parse(columnsFromStorage);
    delete columnsParsed[columnId];
    console.log(columnsParsed);
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
    return "<div class='kanban_column main_background' id='column1'>" +
        "<div class='kanban_column_heading'>" +
        "<h3>Task List | </h3>" +
        "</div>" +
        "<div class='task'></div>" +
        "</div>";
}

function addKanbanColumnHTML(columnId) {
    return "<div class='kanban_column main_background' id=" + columnId + " >" +
        "<div class='kanban_column_heading'>" +
        "<h3 contenteditable='true'>" + columnId + " Task List | </h3>" +
        "<button type='button' class='close_button main_text'><span class='material-symbols-rounded md-18'>close</span></button>" +
        "</div>" +
        "<div class='task'></div>" +
        "</div>";
}

function addKanbanColumnAddButtonHTML() {
    return "<button type='button' id='add_kanban_column' class='main_text'>" +
        "<span class='material-symbols-rounded md-18'>add</span> Add column" +
        "</button>";
}