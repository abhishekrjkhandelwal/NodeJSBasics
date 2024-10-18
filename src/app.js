const express = require("express");

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from the server!");
})

app.listen(3016, () => {
    console.log("Server is successfully listening on port 3012...");
});

