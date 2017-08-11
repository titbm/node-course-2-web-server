const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

// Подключение папки с повторяющимися частями html-страниц (такими как footer)
hbs.registerPartials(__dirname + '/views/partials');
// Подключение шаблонизатора hadlebars к express
app.set('view engine', 'hbs');

// Заглушка для всех страниц сайта ("Cайт на реконструкции...")
// app.use((req, res, next) => {
//   res.render('maintance.hbs');
// });

// Все файлы в папке public доступны по именеи через слэш после адреса сайта.
// __dirname - переменная node, которая содержит путь к текущему модулю
app.use(express.static(__dirname + '/public'));

// .use() - cоздание прослойки между запросом от браузера и ответом от сервера (middleware)
// next() - указывает на завершение функции. Без next() сервер никак не отреагирует
// на запрос (не сработают функции .get())
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    console.error('Unable to append server.log');
  });
  next();
});

app.get('/', (req, res) => {
  // .send() - автоматически отправляет ответ с типом text/html, если в качестве
  // аргумента - строка, с типом application/json - если аргумент - объект.

  // res.send('<h1>Hello express</h1>');
  //
  // res.send({
  //   name: 'Andrew',
  //   likes: 'Biking Cities'.split(' ')
  // });
  res.render('home.hbs', {
    pageTitle: 'Home page',
    currentYear: new Date().getFullYear(),
    welcomeMessage: 'Some text here...'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page',
    currentYear: new Date().getFullYear()
  });
});

app.listen(3000, () => {
  console.log(`Server is up on port on 3000...`);
});
