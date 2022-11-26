const express = require("express"),
    path = require("path"),
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server),
    port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "app")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
    socket.on("startDrawing", (data) => {
        io.emit("startDrawing", data);
    });

    socket.on("drawing", (data) => {
        io.emit("drawing", data);
    });

    socket.on("drawLine", (data) => {
        io.emit("drawLine", data);
    });

    socket.on("drawRectangle", (data) => {
        io.emit("drawRectangle", data);
    });

    socket.on("drawCircle", (data) => {
        io.emit("drawCircle", data);
    });

    socket.on("resetPoints", (data) => {
        io.emit("resetPoints", data);
    });

    socket.on("clearCanvas", (data) => {
        io.emit("clearCanvas", data);
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
