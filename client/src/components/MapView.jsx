import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function MapView({ tasks, workers }) {

  return (

    <MapContainer
      center={[17.3850, 78.4867]}
      zoom={13}
      style={{ height: "400px" }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* TASK MARKERS */}

      {tasks.map(task => (

        task.location && (

          <Marker key={task.id} position={task.location}>

            <Popup>
              {task.title}
              <br/>
              Team: {task.team || "Unassigned"}
            </Popup>

          </Marker>

        )

      ))}

      {/* WORKER LOCATIONS */}

      {workers.map(worker => (

        <Marker key={worker.id} position={worker.location}>

          <Popup>
            Worker {worker.id}
            <br/>
            Team: {worker.team}
          </Popup>

        </Marker>

      ))}

    </MapContainer>

  )
}

export default MapView