
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Hybridge Blog API funcionando correctamente',
    estado: 'online',
    version: '1.0.0'
  });
});

// Lista temporal de autores y publicaciones
let authors = [];
let posts = [];
let nextAuthorId = 1;
let nextPostId = 1;

// AUTORES

app.get('/api/authors', (req, res) => {
  res.json(authors);
});

app.get('/api/authors/:id', (req, res) => {
  const author = authors.find(a => a.id === Number(req.params.id));
  if (!author) return res.status(404).json({ error: 'Autor no encontrado' });
  res.json(author);
});

app.post('/api/authors', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });

  const author = { id: nextAuthorId++, name };
  authors.push(author);
  res.status(201).json(author);
});

app.patch('/api/authors/:id', (req, res) => {
  const author = authors.find(a => a.id === Number(req.params.id));
  if (!author) return res.status(404).json({ error: 'Autor no encontrado' });

  Object.assign(author, req.body, { id: author.id });
  res.json(author);
});

app.delete('/api/authors/:id', (req, res) => {
  const index = authors.findIndex(a => a.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Autor no encontrado' });

  authors.splice(index, 1);
  res.status(204).send();
});

// PUBLICACIONES

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Publicacion no encontrada' });
  res.json(post);
});

app.post('/api/posts', (req, res) => {
  const { title, content, authorId } = req.body;

  if (!title || !content || !authorId) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const author = authors.find(a => a.id === Number(authorId));
  if (!author) return res.status(404).json({ error: 'Autor no encontrado' });

  const post = { id: nextPostId++, title, content, authorId: author.id };
  posts.push(post);
  res.status(201).json(post);
});

app.patch('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Publicacion no encontrada' });

  Object.assign(post, req.body, { id: post.id });
  res.json(post);
});

app.delete('/api/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Publicacion no encontrada' });

  posts.splice(index, 1);
  res.status(204).send();
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}`);
});
