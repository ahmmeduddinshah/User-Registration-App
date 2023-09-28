const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("./db.json");
const middleWare = jsonServer.defaults({ static: "./build" });

const port = process.env.PORT || 5002;

server.use(middleWare);
server.use(jsonServer.rewriter({ "/URL/*": "/$1" }));

server.use(router);

server.listen(port, () =>
  console.log(`This Server is Running at http://localhost:${port}.`)
);
