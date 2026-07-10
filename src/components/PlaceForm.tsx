"use client"

import { useState, useEffect } from "react"
import type { Place } from "../types/place"

interface PlaceFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialCoords?: { lat: number, lng: number } | null
  placeToEdit?: Place | null
}

export default function PlaceForm({ isOpen, onClose, onSuccess, initialCoords, placeToEdit }: PlaceFormProps) {
  const [name, setName] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [notes, setNotes] = useState("")
  const [info, setInfo] = useState("")
  const [visitedDate, setVisitedDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (placeToEdit) {
      setName(placeToEdit.name);
      setLatitude(placeToEdit.latitude.toString());
      setLongitude(placeToEdit.longitude.toString());
      setNotes(placeToEdit.notes || "");
      setInfo(placeToEdit.info || "");
      setVisitedDate(placeToEdit.visited_date);
    } else if (initialCoords) {
      setLatitude(initialCoords.lat.toFixed(6));
      setLongitude(initialCoords.lng.toFixed(6));
    } else if (!isOpen) {
      // Limpiar al cerrar
      setName("");
      setLatitude("");
      setLongitude("");
      setNotes("");
      setInfo("");
      setVisitedDate("");
    }
  }, [initialCoords, isOpen, placeToEdit])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const placeData: Place = {
      id: placeToEdit ? placeToEdit.id : crypto.randomUUID(),
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      notes,
      info,
      visited_date: visitedDate,
      created_at: new Date().toISOString(),
      updated_at: placeToEdit ? placeToEdit.updated_at : new Date().toISOString(),
    }

    try {
      const method = placeToEdit ? "PUT" : "POST";

      const response = await fetch("/api/places", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(placeData),
      })

      if (response.ok) {
        // Limpiamos el formulario
        setName("")
        setLatitude("")
        setLongitude("")
        setNotes("")
        setInfo("")
        setVisitedDate("")

        onSuccess() // Recarga la lista
        onClose()   // Cierra el modal
      } else {
        console.error("Error al guardar")
      }
    } catch (error) {
      console.error("Error de red:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-mist-950/90 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-mist-800">{placeToEdit ? "Editar Lugar" : "Nuevo Lugar"}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              required
              type="text"
              className="w-full border p-2 rounded mt-1 text-mist-800 placeholder-mist-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Latitud</label>
              <input
                required
                type="number"
                step="any"
                className="w-full border p-2 rounded mt-1 text-mist-800 placeholder-mist-400"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Ej: 5.06889"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Longitud</label>
              <input
                required
                type="number"
                step="any"
                className="w-full border p-2 rounded mt-1 text-mist-800 placeholder-mist-400"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Ej: -75.51738"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date Visited</label>
            <input
              required
              type="date"
              className="w-full border p-2 rounded mt-1 text-mist-800 placeholder-mist-400"
              value={visitedDate}
              onChange={(e) => setVisitedDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notas en mapa (Opcional)</label>
            <textarea
              className="w-full border p-2 rounded mt-1 h-24 text-mist-800"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Info en lista (Opcional)</label>
            <textarea
              className="w-full border p-2 rounded mt-1 h-24 text-mist-800"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : placeToEdit ? "Actualizar" : "Guardar Lugar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
