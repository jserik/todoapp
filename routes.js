const { json } = require("body-parser");
const express = require("express");
const { gen } = require("n-digit-token");
const router = express.Router();
const fs = require("fs");

const validateRequest = (validationCode) => {
    let isNum = /^\d+$/.test(validationCode);
    try {
        if (isNum && fs.existsSync(`./db/${validationCode}.json`)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

router.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

router.get("/todo", (req, res, next) => {
    const fs = require("fs");

    async function ls(path) {
        const dir = await fs.promises.opendir(path);
        for await (const dirent of dir) {
            console.log(dirent.name);
            try {
                const todoJSON = fs.readFileSync(`${dirent.name}`, "utf8");
                const todo = JSON.parse(todoJSON);
                output = { task: inputTask, isFinished: false, lastEdited: Date.now() };
                output = JSON.stringify(output);
            } catch (err) {
                res.send(err);
            }
        }
        res.json({
            status: "success",
            data: todo,
        });
    }

    res.json(ls("./db/").catch(console.error));
    res.end();
});

router.post("/todo/:id", (req, res, next) => {
    ID = req.params.id;
    try {
        if (validateRequest(ID)) {
            const todoJSON = fs.readFileSync(`./db/${ID}.json`, "utf8");
            const todo = JSON.parse(todoJSON);

            res.json({
                status: "success",
                id: ID,
                data: todo,
            });
        } else {
            res.json({
                status: "failure",
                error: "No Todo with your ID could be found!",
            });
        }
    } catch (err) {
        res.send(err);
    }
});

router.post("/add-todo", (req, res, next) => {
    ID = gen(6);
    inputTask = req.body.task;
    TODO = { task: inputTask, isFinished: false, lastEdited: Date.now() };
    todo = JSON.stringify(TODO);
    try {
        fs.writeFileSync(`./db/${ID}.json`, todo);
    } catch (err) {
        res.json({
            status: "failure",
            error: `Just try again`,
        });
    }
    res.json({
        status: "success",
        id: ID,
    });
    res.end();
});

router.post("/update-todo/:id", (req, res, next) => {});

router.post("/delete-todo/:id", (req, res, next) => {});

module.exports = router;
