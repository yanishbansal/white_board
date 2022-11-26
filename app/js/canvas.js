const saveAsImgBtn = document.querySelector(".save-as-image-button"),
    clearCanvasBtn = document.querySelector(".clear-canvas-button"),
    colorList = document.querySelectorAll(".color"),
    thicknessSlider = document.querySelector(".thickness-slider"),
    canvas = document.querySelector(".canvas"),
    roughCanvas = rough.canvas(canvas),
    SECRET_KEY = "THIS_IS_MY_SECRET_KEY",
    socket = io();

let strokeWidth = thicknessSlider.value,
    strokeColor = "#3c4043",
    isDrawing = false,
    ctx = canvas.getContext("2d"),
    points = [],
    snapshot;

ctx.lineJoin = ctx.lineCap = "round";

const updateCanvasDimensions = () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
};

const fillCanvasWhite = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const midPointBtw = (p1, p2) => {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2,
    };
};

const startDrawing = (data) => {
    const decryptedX = parseInt(
        CryptoJS.AES.decrypt(data.x, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    const decryptedY = parseInt(
        CryptoJS.AES.decrypt(data.y, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    ctx.lineWidth = data.lineWidth;
    ctx.strokeStyle = data.strokeColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

    points.push({ x: decryptedX, y: decryptedY });
};

const prevBoardState = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.putImageData(snapshot, 0, 0);
};

const resetPoints = (data) => {
    points = data;
};

const drawing = (data) => {
    prevBoardState();

    const decryptedX = parseInt(
        CryptoJS.AES.decrypt(data.x, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    const decryptedY = parseInt(
        CryptoJS.AES.decrypt(data.y, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    points.push({ x: decryptedX, y: decryptedY });

    let p1 = points[0];
    let p2 = points[1];

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);

    for (let i = 1, len = points.length; i < len; i++) {
        let midPoint = midPointBtw(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = points[i];
        p2 = points[i + 1];
    }

    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
};

const drawRectangle = (data) => {
    prevBoardState();

    const decryptedX = parseInt(
        CryptoJS.AES.decrypt(data.x, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    const decryptedY = parseInt(
        CryptoJS.AES.decrypt(data.y, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    let startingCoord = points[0];

    let options = {
        stroke: data.strokeColor,
        fill: data.isFillColorSelected && data.strokeColor,
        fillStyle: data.isFillColorSelected && "hachure",
    };

    roughCanvas.rectangle(
        startingCoord.x,
        startingCoord.y,
        decryptedX - startingCoord.x,
        decryptedY - startingCoord.y,
        options
    );
};

const drawLine = (data) => {
    prevBoardState();

    const decryptedX = parseInt(
        CryptoJS.AES.decrypt(data.x, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    const decryptedY = parseInt(
        CryptoJS.AES.decrypt(data.y, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    let startingCoord = points[0];

    roughCanvas.line(startingCoord.x, startingCoord.y, decryptedX, decryptedY, {
        stroke: data.strokeColor,
    });
};

const drawCircle = (data) => {
    prevBoardState();

    const decryptedX = parseInt(
        CryptoJS.AES.decrypt(data.x, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    const decryptedY = parseInt(
        CryptoJS.AES.decrypt(data.y, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    );

    let startingCoord = points[0];

    let diameter =
        2 *
        Math.sqrt(
            Math.pow(decryptedX - startingCoord.x, 2) +
                Math.pow(decryptedY - startingCoord.y, 2)
        );

    let options = {
        stroke: data.strokeColor,
        fill: data.isFillColorSelected && data.strokeColor,
        fillStyle: data.isFillColorSelected && "hachure",
    };

    roughCanvas.circle(startingCoord.x, startingCoord.y, diameter, options);
};

window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

canvas.addEventListener("mousedown", (evt) => {
    isDrawing = true;

    const data = {
        x: CryptoJS.AES.encrypt(evt.clientX.toString(), SECRET_KEY).toString(),
        y: CryptoJS.AES.encrypt(evt.clientY.toString(), SECRET_KEY).toString(),
        lineWidth: strokeWidth,
        strokeColor: isPencilSelected ? strokeColor : "#fff",
    };

    socket.emit("startDrawing", data);
});

canvas.addEventListener("mousemove", (evt) => {
    if (!isDrawing) return;

    const data = {
        x: CryptoJS.AES.encrypt(evt.clientX.toString(), SECRET_KEY).toString(),
        y: CryptoJS.AES.encrypt(evt.clientY.toString(), SECRET_KEY).toString(),
        isFillColorSelected: isFillColorSelected,
        strokeColor: strokeColor,
    };

    if (isPencilSelected || isEraserSelected) {
        socket.emit("drawing", data);
    } else if (isLineSelected) {
        socket.emit("drawLine", data);
    } else if (isRectangleSelected) {
        socket.emit("drawRectangle", data);
    } else if (isCircleSelected) {
        socket.emit("drawCircle", data);
    }
});

canvas.addEventListener("mouseup", (evt) => {
    if (isDrawing) {
        isDrawing = false;
        socket.emit("resetPoints", []);
    }
});

colorList.forEach((color) => {
    color.addEventListener("click", () => {
        strokeColor = color.classList[0];
        ctx.strokeStyle = strokeColor;
    });
});

thicknessSlider.addEventListener("change", () => {
    strokeWidth = thicknessSlider.value;
    ctx.lineWidth = strokeWidth;
});

eraser.addEventListener("click", () => {
    if (isEraserSelected) ctx.strokeStyle = "#fff";
    else ctx.strokeStyle = strokeColor;
});

saveAsImgBtn.addEventListener("click", () => {
    let URL = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = URL;
    a.download = "board";
    a.click();
});

clearCanvasBtn.addEventListener("click", () => {
    socket.emit("clearCanvas", null);
});

socket.on("startDrawing", (data) => {
    startDrawing(data);
});

socket.on("drawing", (data) => {
    drawing(data);
});

socket.on("drawLine", (data) => {
    drawLine(data);
});

socket.on("drawRectangle", (data) => {
    drawRectangle(data);
});

socket.on("drawCircle", (data) => {
    drawCircle(data);
});

socket.on("resetPoints", (data) => {
    resetPoints(data);
});

socket.on("clearCanvas", (data) => {
    fillCanvasWhite();
});

updateCanvasDimensions();
fillCanvasWhite();
