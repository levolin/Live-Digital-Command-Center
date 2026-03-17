import { useState, useEffect } from "react"
import socket from "./socket"

const teamColors = {
  Alpha: "bg-blue-500",
  Beta: "bg-green-500",
  Gamma: "bg-purple-500"
}

const statusColors = {
  pending: "bg-yellow-500",
  inprogress: "bg-blue-500",
  completed: "bg-gray-600 opacity-60"
}

function App() {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [team, setTeam] = useState("")
  const [role, setRole] = useState("worker")

  useEffect(() => {

  navigator.geolocation.watchPosition((pos)=>{

    socket.emit("workerLocation", {
      id: socket.id,
      team: "Alpha",
      location: [
        pos.coords.latitude,
        pos.coords.longitude
      ]
    })

  })

  socket.on("init", (data) => {
    setTasks(data.tasks)
  })

  socket.on("update", (data) => {
    setTasks(data.tasks)
  })

  return () => {
    socket.off("update")
  }

}, [])

  function createTask() {

    const task = {
      id: Date.now(),
      title,
      team,
      status: "pending"
    }

    socket.emit("createTask", task)

    setTitle("")
    setTeam("")
  }

  function claimTask(id) {

    socket.emit("claimTask", {
      id,
      worker: {
        id: socket.id,
        team: "Alpha"
      }
    })

  }

  function completeTask(id) {
    socket.emit("completeTask", id)
  }

  const activeTasks = tasks.filter(t => t.status !== "completed")
  const completedTasks = tasks.filter(t => t.status === "completed")

  return (

    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Live Digital Command Center
      </h1>

      {/* ROLE SWITCH */}

      <div className="mb-6">

        <label className="mr-4">Role:</label>

        <select
          className="text-black p-1"
          value={role}
          onChange={(e)=>setRole(e.target.value)}
        >
          <option value="worker">Worker</option>
          <option value="manager">Manager</option>
        </select>

      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* MAP */}

        <div className="col-span-2 bg-gray-800 p-4 rounded-xl">

          <h2 className="text-xl font-semibold mb-2">Live Map</h2>

          <div className="h-96 bg-gray-700 flex items-center justify-center rounded">
            Map Area
          </div>

        </div>

        {/* TASK PANEL */}

        <div className="bg-gray-800 p-4 rounded-xl">

          <h2 className="text-xl font-semibold mb-4">Tasks</h2>

          {/* MANAGER TASK CREATION */}

          {role === "manager" && (

            <div className="mb-4">

              <input
                className="w-full mb-2 p-2 text-black"
                placeholder="Task name"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
              />

              <input
                className="w-full mb-2 p-2 text-black"
                placeholder="Team (Alpha/Beta/Gamma)"
                value={team}
                onChange={(e)=>setTeam(e.target.value)}
              />

              <button
                onClick={createTask}
                className="bg-green-600 px-3 py-1 rounded"
              >
                Create Task
              </button>

            </div>

          )}

          {/* ACTIVE TASKS */}

          {activeTasks.map(task => (

            <div
              key={task.id}
              className={`${statusColors[task.status]} text-black p-3 mb-2 rounded`}
            >

              <div className="font-semibold mb-1">
                {task.title}
              </div>

              <div className="flex items-center gap-2 text-sm">

                <span>Team:</span>

                {task.team ? (

                  <span
                    className={`text-white px-2 py-1 rounded text-xs ${teamColors[task.team]}`}
                  >
                    {task.team}
                  </span>

                ) : (

                  <span className="italic">Unassigned</span>

                )}

              </div>

              <div className="mt-2 flex gap-2">

                {role === "worker" && !task.team && (

                  <button
                    onClick={()=>claimTask(task.id)}
                    className="bg-blue-700 text-white px-2 py-1 rounded"
                  >
                    Claim
                  </button>

                )}

                {task.status !== "completed" && (

                  <button
                    onClick={()=>completeTask(task.id)}
                    className="bg-black text-white px-2 py-1 rounded"
                  >
                    Complete
                  </button>

                )}

              </div>

            </div>

          ))}

          {/* COMPLETED TASKS */}

          {completedTasks.map(task => (

            <div
              key={task.id}
              className={`${statusColors.completed} p-3 mb-2 rounded`}
            >

              <div className="line-through">
                {task.title}
              </div>

              <div className="text-xs mt-1">
                Completed by {task.team}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}

export default App

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
