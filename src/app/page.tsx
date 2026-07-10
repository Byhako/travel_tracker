"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import PlaceForm from "../components/PlaceForm"
import type { Place } from "../types/place"

// Importación dinámica: Obligamos a Next.js a no renderizar esto en el servidor (ssr: false)
const MapWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Cargando mapa...</div>,
})

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null)

  const [activePlace, setActivePlace] = useState<Place | null>(null)
  const [placeToEdit, setPlaceToEdit] = useState<Place | null>(null)


  const fetchPlaces = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/places")
      const data = await response.json()
      setPlaces(data)
    } catch (error) {
      console.error("Error loading places:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Al cargar la página, llamamos a nuestra API para leer el archivo local
  useEffect(() => {
    fetchPlaces()
  }, [])

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng })
    setPlaceToEdit(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setPlaceToEdit(null)
    setSelectedCoords(null)
  }

  const handleEdit = (place: Place, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que al hacer clic en Editar se active el click de la lista (volar en el mapa)
    setPlaceToEdit(place);
    setIsFormOpen(true);
  };


  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!window.confirm("¿Estás seguro de eliminar este lugar?")) return;

    try {
      const response = await fetch(`/api/places?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (activePlace?.id === id) setActivePlace(null); // Si el eliminado era el activo, lo limpiamos
        fetchPlaces(); // Recargamos la lista
      }
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  return (
    <main className="flex h-screen bg-gray-900 p-4 gap-4">
      
      {/* PANEL IZQUIERDO: Lista de Lugares */}
      <div className="w-1/4 bg-gray-200 rounded-lg shadow-md p-4 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Mis Lugares ({places.length})</h1>

        <p className="text-sm text-gray-500 mb-4 bg-blue-50 p-2 rounded">
          💡 <strong>Tip:</strong> Clic en el mapa para agregar un lugar.
        </p>

        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mb-4 cursor-pointer" onClick={() => setIsFormOpen(true)}>
          + Nuevo Lugar
        </button>

        {activePlace && (
          <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition mb-4 cursor-pointer" onClick={() => setActivePlace(null)}>
            Desactivar Lugar
          </button>
        )}

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p>Cargando lugares...</p>
          ) : (
            <ul>
              {places.map((place) => (
                <li key={place.id} className={`flex justify-between border-b p-3 cursor-pointer transition ${
                    activePlace?.id === place.id 
                      ? 'bg-blue-100 border-blue-700 shadow-sm'
                      : 'hover:bg-gray-50 border-olive-700'
                  }`}>
                  <div className="flex gap-2" onClick={() => setActivePlace(place)}>
                    <h2 className="font-semibold text-mist-800 leading-[18px] flex items-end">{place.name}</h2>
                    <p className="text-xs text-olive-700 flex items-end">{place.info}</p>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleEdit(place, e)}
                      className="bg-blue-100 px-1 py-1 rounded cursor-pointer border border-blue-100 hover:border-blue-600"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#155dfc" d="M18.58 2.944a2 2 0 0 0-2.828 0L14.107 4.59l5.303 5.303l1.645-1.644a2 2 0 0 0 0-2.829zm-.584 8.363l-5.303-5.303l-8.835 8.835l-1.076 6.38l6.38-1.077z"/></svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(place.id, e)}
                      className="bg-red-100 px-1 py-1 rounded cursor-pointer border border-red-100 hover:border-red-600"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#e7000b" d="M9 17h2V8H9zm4 0h2V8h-2zm-8 4V6H4V4h5V3h6v1h5v2h-1v15z"/></svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* PANEL DERECHO: Mapa */}
      <div className="w-3/4 h-full relative z-0">
        <MapWithNoSSR
          places={places}
          onMapClick={handleMapClick}
          activePlace={activePlace}
        />
      </div>

      {/* Renderizamos el modal */}
      <PlaceForm
        isOpen={isFormOpen}
        onSuccess={fetchPlaces} // Cuando guarde, volverá a hacer el fetch
        onClose={handleCloseForm}
        initialCoords={selectedCoords}
        placeToEdit={placeToEdit}
      />

    </main>
  )
}
