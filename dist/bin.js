"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
_1.app.get("/", (req, res) => {
    res.send("Server is running on port 4000");
});
_1.app.listen(4000, () => {
    console.log("🚀 Server is running on port 4000");
});
