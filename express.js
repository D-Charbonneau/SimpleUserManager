const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const uuid = require("uuid")

const port = process.env.PORT || 80;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.get("/", (req, res) =>
{
    res.render("index");
})

app.post("/userlist", (req, res) =>
{
    let arr = JSON.parse(fs.readFileSync("users.json"));
    arr.push({ name: req.body.name, lastname: req.body.lastname, email: req.body.email, id: uuid.v4() })
    console.log(req.ip + " has created new user: " + req.body.name);
    fs.writeFileSync("users.json", JSON.stringify(arr));
    res.render("userlist", { userlist: arr });
})

app.get("/userlist", (req, res) =>
{
    let arr = JSON.parse(fs.readFileSync("users.json"));
    res.render("userlist", { userlist: arr });
})

app.get("/:id", (req, res) =>
{
    let arr = JSON.parse(fs.readFileSync("users.json"));
    for (let i = 0; i < arr.length; i++)
    {
        if (arr[i].id == req.params.id)
        {
            arr = arr[i];
            break;
        }
    }
    res.render("user", { user: arr });
})

app.post("/:id", (req, res) =>
{
    let arr = JSON.parse(fs.readFileSync("users.json"));
    let arrIndex = -1;
    for (let i = 0; i < arr.length; i++)
    {
        if (arr[i].id == req.params.id)
        {
            arrIndex = i;
            break;
        }
    }
    arr[arrIndex] = { name: req.body.name, lastname: req.body.lastname, email: req.body.email, id: arr[arrIndex].id };
    fs.writeFileSync("users.json", JSON.stringify(arr));
    res.render("userlist", { userlist: arr });
})

app.listen({ port: port }, () =>
{
    if (!fs.existsSync("users.json"))
    {
        fs.writeFileSync("users.json", JSON.stringify([{ name: "user1", lastname: "lastuser1", email: "user1@yahoomail.com", id: uuid.v4() }]))
    }
    console.log(`Server ready at port ${port}`);
})