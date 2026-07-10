"use client"

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Place } from "../types/place"
import { useEffect, useRef } from "react"

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34], // Ajusta el globo de texto para que salga arriba del pin
  shadowSize: [41, 41],
})

interface MapProps {
  places: Place[]
  onMapClick: (lat: number, lng: number) => void
  activePlace: Place | null
}

const defaultCenter: [number, number] = [4.088044, -72.957247]

// Componente que controla el movimiento de la cámara y los popups
function MapController({ activePlace }: { activePlace: Place | null }) {
  const map = useMap()

  useEffect(() => {
    if (activePlace) {
      // Si hay un lugar seleccionado, "volamos" hacia allá con un nivel de zoom 12
      map.flyTo([activePlace.latitude, activePlace.longitude], 12, {
        duration: 1,
      })
    } else {
      map.flyTo(defaultCenter, 6, {
        duration: 0.5,
      })
      // map.setView(defaultCenter, 6) // Vuelve al inicio
    }
  }, [activePlace, map])

  return null
}

// Componente invisible que escucha los clics en el mapa
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function Map({ places, onMapClick, activePlace }: MapProps) {

  // Referencias para cada pin, para poder abrir su popup automáticamente
  const markerRefs = useRef<{ [key: string]: L.Marker }>({})
  const previouslyActiveRef = useRef<string | null>(null)

  useEffect(() => {
    // Si activePlace cambia, buscamos su pin en nuestras referencias y le decimos que abra el popup
    if (activePlace && markerRefs.current[activePlace.id]) {
      markerRefs.current[activePlace.id].openPopup()
    } else if (!activePlace && previouslyActiveRef.current) {
      markerRefs.current[previouslyActiveRef.current].closePopup()
    }
    previouslyActiveRef.current = activePlace?.id || null
  }, [activePlace])

  return (
    <MapContainer
      center={defaultCenter}
      zoom={6}
      className="w-full h-full rounded-lg shadow-md z-0 cursor-crosshair"
    >
      <TileLayer
        attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Escuchador de eventos */}
      <MapClickHandler onMapClick={onMapClick} />

      {/* Controlador del mapa */}
      <MapController activePlace={activePlace} />

      {places.map((place) => (
        <Marker 
          key={place.id} 
          position={[place.latitude, place.longitude]} 
          icon={customIcon}
          ref={(ref) => { if (ref) markerRefs.current[place.id] = ref }}
        >
          <Popup>
            <div>
              <h3 className="font-bold text-lg mb-1">{place.name}</h3>
              {place.visited_date && (
                <p className="text-sm text-gray-600 mb-2">Visita: {place.visited_date}</p>
              )}
              {place.notes && <p className="text-sm italic">"{place.notes}"</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
