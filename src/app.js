const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories) 
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)

  if(!repository) {
    response.status(400).json({message: 'Repositório não encontrado!'})
  }

  repository.title = title || repository.title
  repository.url = url || repository.url
  repository.techs = techs || repository.techs

  return response.json(repository) 
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.map(repository => repository.id).indexOf(id);

  if(index < 0) {
    response.status(400).json({message: 'Repositório não encontrado!'})
  }

  repositories.splice(index, 1)

  return response.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository) {
    response.status(400).json({message: 'Repositório não encontrado!'})
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
