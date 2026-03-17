const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

let tasks = []
let workers = []

io.on("connection", (socket) => {

  socket.emit("init", { tasks, workers })

  socket.on("createTask", (task) => {

    tasks.push(task)
    io.emit("update", { tasks, workers })

  })

  socket.on("assignTask", ({ id, team }) => {

    tasks = tasks.map(t =>
      t.id === id ? { ...t, team } : t
    )

    io.emit("update", { tasks, workers })

  })

  socket.on("claimTask", ({ id, worker }) => {

    tasks = tasks.map(t =>
      t.id === id ? { ...t, team: worker.team, status: "inprogress" } : t
    )

    io.emit("update", { tasks, workers })

  })

  socket.on("completeTask", (id) => {

    tasks = tasks.map(t =>
      t.id === id ? { ...t, status: "completed" } : t
    )

    io.emit("update", { tasks, workers })

  })

  socket.on("workerLocation", (worker) => {

    const index = workers.findIndex(w => w.id === worker.id)

    if(index === -1) workers.push(worker)
    else workers[index] = worker

    io.emit("update", { tasks, workers })

  })

})

server.listen(5000, () => {
  console.log("Server running on 5000")
})