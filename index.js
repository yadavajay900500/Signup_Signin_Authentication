const server = require("./server");
const PORT = 1616;

server.listen(PORT,()=> {
    console.log(`Server Started on http://localhost:${PORT}`);
})
