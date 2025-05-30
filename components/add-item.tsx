"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddItemProps {
  onAddItem: (item: any) => void
  onClose: () => void
}

export default function AddItem({ onAddItem, onClose }: AddItemProps) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Verduras")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !price) return

    onAddItem({
      name,
      quantity,
      price: Number.parseFloat(price),
      category,
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Agregar Producto</h1>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              placeholder="Ingresa el nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Verduras">Verduras</SelectItem>
                <SelectItem value="Lácteos">Lácteos</SelectItem>
                <SelectItem value="Carnes">Carnes</SelectItem>
                <SelectItem value="Panadería">Panadería</SelectItem>
                <SelectItem value="Despensa">Despensa</SelectItem>
                <SelectItem value="Congelados">Congelados</SelectItem>
                <SelectItem value="Hogar">Hogar</SelectItem>
                <SelectItem value="Otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio Estimado ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Agregar a la Lista
          </Button>
        </form>
      </div>
    </div>
  )
}
