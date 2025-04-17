const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const dotenv = require('dotenv');

dotenv.config(); // carregar as variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}))

app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
}));

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));
app.use('/', require('./routes/default'));



app.listen(PORT, () => {
    console.info({
        api: 'API',
        version: '1.0.0',
        status: 'running',
        port: PORT,
        url: process.env.BASE_URL,
    });
});