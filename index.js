/* Используя express реализовать клиентскую и серверную стороны для MetaStar на минималках. Возможности, которые должны быть (красным выделены опциональын пункты усложнения):

1. Хранения данных студентов на сервере

2. Возможность увидеть статистику студента, а также персональные данные Интерфейс (поле ввода) для выполнения запросов на сервер с последующей выдачей результат клиенту рядом.

3. Статистика должна состоять из:

a. Его N отметок по X предметам

b. Кол-ва кристалликов

c. Кол-ва монет

d. Процент посещаемости

4. Персональные данные включают:

a. ФИО

b. Возраст

c. Почта

d. Номер телефона

e. Аватарка

5. Статистика по потоку среди всех студентов с возможностью увидеть лучшего по:

a. Среднему баллу

b. Кол-ву кристаллов

c. Кол-ву коинов

Данные студентов зарандомить на стороне сервера :) */

const express = require("express"); 
const path = require("path");
const fs = require("fs");
const url = require("url");

const { randInt , getRandomStudent, templ, createSortArr } = require("./utils/random");
const { get } = require("http");

const app = express();
const port = 3000;

const stTemplates = fs.readFileSync(
  "./templates/student.html",
  "utf-8"
);

const page = fs.readFileSync(
  "./public/index.html",
  "utf-8"
);

const list = fs.readFileSync("./templates/list.html", "utf-8");


app.use((req, res, next) => {
  console.log(`\n--- ${req.url} Time: ${Date.now()} `);
  next(); 
});

app.use(express.static("public"));
app.use(express.json());

app.get("/getStudent", (req, res) => {
  let getStudent = getRandomStudent();
  let i = page.replace("{{content}}", templ(stTemplates, getStudent));
  res.status(200).send(i);
});

  
app.get("/getAllStudents", (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let setting = parsedUrl.query.param;
  let arr = [];
  for(let i = 0; i < randInt(10, 15); i++){
    arr.push(getRandomStudent());
  }
  arr = createSortArr(arr, setting);
  
  let a = list.replace("{{content}}", arr.map((item) => templ(stTemplates, item)).join(""));
  res.status(200).send(a); 
});

app.use((req, res, next) => {
  res.status(404).send("<h1>Not found :(</h1>");
});

app.listen(port);
 