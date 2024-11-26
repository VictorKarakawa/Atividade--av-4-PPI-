const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'minhaSenhaSecreta',
  resave: false,
  saveUninitialized: true
}));

let produtos = [];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/login');
  });
  

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  req.session.usuario = req.body.usuario;
  res.cookie('ultimoAcesso', new Date().toLocaleString(), { maxAge: 86400000 });
  res.redirect('/cadastro');
});

app.get('/cadastro', (req, res) => {
  if (!req.session.usuario) return res.redirect('/login');
  res.render('cadastro', {
    usuario: req.session.usuario,
    ultimoAcesso: req.cookies.ultimoAcesso || 'Nenhum acesso registrado.'
  });
});

app.post('/cadastro', (req, res) => {
  if (!req.session.usuario) return res.redirect('/login');
  const { codigoBarras, descricao, precoCusto, precoVenda, validade, estoque, fabricante } = req.body;
  const produto = { codigoBarras, descricao, precoCusto, precoVenda, validade, estoque, fabricante };
  produtos.push(produto);
  res.redirect('/tabela');
});

app.get('/tabela', (req, res) => {
  if (!req.session.usuario) return res.redirect('/login');
  const ultimoAcesso = req.cookies.ultimoAcesso || 'Nenhum acesso registrado.';
  res.render('tabela', {
    produtos,
    usuario: req.session.usuario,
    ultimoAcesso: ultimoAcesso
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('ultimoAcesso');
    res.redirect('/login');
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
