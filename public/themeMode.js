const DARK_MODE = "dark_mode";
const LIGHT_MODE = "light_mode";

window.onload = function () {
    checkThemeOnLoad();
    let themeButton = document.getElementById("theme");
    themeButton.addEventListener("click", changeTheme);
}

function checkThemeOnLoad() {
    let storedTheme = localStorage.getItem("theme");
    if (storedTheme === null) {
        localStorage.setItem("theme", LIGHT_MODE)
    } else if (storedTheme === DARK_MODE) {
        toggleDarkMode();
    }
}

function toggleDarkMode() {
    const htmlBodySection = document.body;
    htmlBodySection.classList.toggle(DARK_MODE);
}

function changeTheme() {
    toggleDarkMode();
    let storedTheme = localStorage.getItem("theme");
    if (storedTheme === LIGHT_MODE) {
        localStorage.setItem("theme", DARK_MODE)
    } else {
        localStorage.setItem("theme", LIGHT_MODE)
    }
}