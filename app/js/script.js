const hamburgerBtn = document.querySelector(".hamburger-button-container"),
    toolsContainer = document.querySelector(".tools-container"),
    pencil = document.querySelector(".pencil"),
    eraser = document.querySelector(".eraser"),
    rectangle = document.querySelector(".rectangle"),
    circle = document.querySelector(".circle"),
    line = document.querySelector(".line"),
    fillColorCheckbox = document.querySelector(".fill-color"),
    shareBtn = document.querySelector(".share-button-container"),
    app = document.querySelector(".app");

let isToolsContainerVisible = false,
    isPencilSelected = true,
    isEraserSelected = false,
    isRectangleSelected = false,
    isCircleSelected = false,
    isLineSelected = false,
    isFillColorSelected = false;

const hideElement = (element) => {
    element.classList.add("hide");
    element.classList.remove("show");
};

const showElement = (element) => {
    element.classList.add("show");
    element.classList.remove("hide");
};

const setSelectedFalseAll = () => {
    isPencilSelected = false;
    isEraserSelected = false;
    isRectangleSelected = false;
    isCircleSelected = false;
    isLineSelected = false;
};

const setOptionsColorGray = () => {
    pencil.style = "color: var(--color-gray)";
    pencil.querySelector("img").src = "/img/pencil.svg";

    eraser.style = "color: var(--color-gray)";
    eraser.querySelector("img").src = "/img/eraser.png";

    rectangle.style = "color: var(--color-gray)";
    rectangle.querySelector("img").src = "/img/rectangle-horizontal.svg";

    circle.style = "color: var(--color-gray)";
    circle.querySelector("img").src = "/img/circle.svg";

    line.style = "color: var(--color-gray)";
    line.querySelector("img").src = "/img/line.png";
};

hamburgerBtn.addEventListener("click", () => {
    isToolsContainerVisible = isToolsContainerVisible === true ? false : true;
    if (isToolsContainerVisible) showElement(toolsContainer);
    else hideElement(toolsContainer);
});

pencil.addEventListener("click", () => {
    setSelectedFalseAll();
    setOptionsColorGray();
    isPencilSelected = true;
    pencil.style = "color: #db4437;";
    pencil.querySelector("img").src = "/img/pencil-selected.svg";
});

eraser.addEventListener("click", () => {
    setSelectedFalseAll();
    setOptionsColorGray();
    isEraserSelected = true;
    eraser.style = "color: #db4437;";
    eraser.querySelector("img").src = "/img/eraser-selected.png";
});

rectangle.addEventListener("click", () => {
    setSelectedFalseAll();
    setOptionsColorGray();
    isRectangleSelected = true;
    rectangle.style = "color: #db4437;";
    rectangle.querySelector("img").src =
        "/img/rectangle-horizontal-selected.svg";
});

circle.addEventListener("click", () => {
    setSelectedFalseAll();
    setOptionsColorGray();
    isCircleSelected = true;
    circle.style = "color: #db4437;";
    circle.querySelector("img").src = "/img/circle-selected.svg";
});

line.addEventListener("click", () => {
    setSelectedFalseAll();
    setOptionsColorGray();
    isLineSelected = true;
    line.style = "color: #db4437;";
    line.querySelector("img").src = "/img/line-selected.png";
});

fillColorCheckbox.addEventListener("click", () => {
    if (isFillColorSelected) isFillColorSelected = false;
    else isFillColorSelected = true;

    const checkbox = fillColorCheckbox.querySelector(".fill-color-checkbox");

    if (isFillColorSelected) checkbox.checked = true;
    else checkbox.checked = false;
});

shareBtn.addEventListener("click", () => {
    const div = document.createElement("div");

    div.setAttribute("class", "share-popup flex flex-dir-col flex-ai-c");

    div.innerHTML = `
        <img
        class="close-share-popup-button"
        src="/img/cross.svg"
        alt="cross"
        />
        <p class="collaboration-text">
            Real-time virtual whiteboard is better when you're together.
        </p>
        <p class="share-this-link-text">
            Share this link with other people.
        </p>
        <div class="copy-link-container flex flex-ai-c">
            <input type="text" disabled />
            <div class="tooltip">
                <div
                    class="copy-link-button-container flex flex-jc-c flex-ai-c"
                >
                    <span class="tooltiptext" id="myTooltip">Copy to clipboard</span>
                    <a class="copy-link-button" href="#">Copy link</a>
                </div>
            </div>
        </div>
        <p class="encryption-message-text">
            🔐 Don't worry, the session uses end-to-end encryption, so
            whatever you draw will stay private.
        </p>
    `;

    app.classList.add("overlay");
    document.body.appendChild(div);

    const closePopupBtn = div.querySelector(".close-share-popup-button");

    closePopupBtn.addEventListener("click", () => {
        app.classList.remove("overlay");
        document.body.removeChild(div);
    });

    const url = window.location.href;

    const copyLinkBtn = div.querySelector(".copy-link-container");
    const input = div.querySelector(".copy-link-container input");

    input.value = url.length > 27 ? url.substring(0, 27) + "..." : url;

    copyLinkBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(url);

        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML =
            "Copied: " + (url.length > 10 ? url.substring(0, 10) + "..." : url);
    });
});
