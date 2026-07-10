import { NextRequest, NextResponse } from 'next/server'
import type { Place } from "../../../types/place"
import fs from 'fs/promises'
import path from 'path'

// Usamos process.cwd() para asegurar que la ruta siempre apunte a la raíz del proyecto
const filePath = path.join(process.cwd(), 'data', 'places.json')

// Método para LEER los lugares
export async function GET() {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const places = JSON.parse(fileContents)
    return NextResponse.json(places)
  } catch (error) {
    return NextResponse.json({ error: 'Error al leer los datos' }, { status: 500 })
  }
}

// Método para AGREGAR un nuevo lugar
export async function POST(request: NextRequest) {
  try {
    // 1. Recibimos el nuevo lugar desde el frontend
    const newPlace = await request.json()

    // 2. Leemos el archivo actual
    const fileContents = await fs.readFile(filePath, 'utf8')
    const places = JSON.parse(fileContents)

    // 3. Agregamos el nuevo lugar al arreglo
    places.push(newPlace)

    // 4. Sobrescribimos el archivo JSON con los nuevos datos
    await fs.writeFile(filePath, JSON.stringify(places, null, 2), 'utf8')

    return NextResponse.json({ mensaje: 'Lugar guardado con éxito', newPlace }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar el dato' }, { status: 500 })
  }
}

// Método para EDITAR un lugar
export async function PUT(request: NextRequest) {
  try {
    const lugarActualizado = await request.json();
    const fileContents = await fs.readFile(filePath, 'utf8');
    let places = JSON.parse(fileContents);
    
    // Buscamos el lugar por su ID y lo reemplazamos con la nueva información
    places = places.map((place: Place) => 
      place.id === lugarActualizado.id ? { ...lugarActualizado, updated_at: new Date().toISOString() } : place
    );
    
    await fs.writeFile(filePath, JSON.stringify(places, null, 2), 'utf8');
    return NextResponse.json({ mensaje: 'Lugar actualizado' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

// Método para ELIMINAR un lugar
export async function DELETE(request: NextRequest) {
  try {
    // Extraemos el ID de la URL (ej: /api/places?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const fileContents = await fs.readFile(filePath, 'utf8');
    let places = JSON.parse(fileContents);
    
    // Filtramos para conservar todos menos el que queremos eliminar
    places = places.filter((place: Place) => place.id !== id);
    
    await fs.writeFile(filePath, JSON.stringify(places, null, 2), 'utf8');
    return NextResponse.json({ mensaje: 'Lugar eliminado' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
