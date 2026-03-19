"use client"

import { useState, useEffect } from "react"
import { trainerApi } from "@/lib/api"
import type { Trainer, TrainerService } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash, Plus, DollarSign, Loader2, Save } from "lucide-react"

export function TrainerServicesManager() {
  const { user } = useAuth()
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  const [newServiceName, setNewServiceName] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newPriceType, setNewPriceType] = useState<"fixed" | "hourly" | "custom">("fixed")
  const [newIsActive, setNewIsActive] = useState(true)

  const fetchTrainer = async () => {
    try {
      const trainers = await trainerApi.getTrainers()
      const myTrainer = trainers.find((t: any) => 
        t.userId === user?.id || t.userId === user?._id || t.userId?._id === user?._id || t.userId?._id === user?.id
      )
      if (myTrainer) {
        setTrainer(myTrainer)
      }
    } catch (e) {
      console.error("Failed to fetch trainer data", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchTrainer()
    }
  }, [user])

  const handleAddService = async () => {
    if (!trainer || !trainer._id || !newServiceName.trim()) return
    try {
      setLoading(true)
      await trainerApi.addTrainerService(trainer._id, {
        serviceName: newServiceName,
        price: newPrice === "" ? null : Number(newPrice),
        priceType: newPriceType,
        isActive: newIsActive
      })
      await fetchTrainer()
      setIsAdding(false)
      setNewServiceName("")
      setNewPrice("")
      setNewPriceType("fixed")
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!trainer || !trainer._id) return
    try {
      setLoading(true)
      await trainerApi.deleteTrainerService(trainer._id, serviceId)
      await fetchTrainer()
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  const handleUpdateServiceField = async (service: TrainerService, field: keyof TrainerService, value: any) => {
    if (!trainer || !trainer._id || !service._id) return
    try {
      // Optimistic update could go here
      const updatedData = { ...service, [field]: value }
      await trainerApi.updateTrainerService(trainer._id, service._id, updatedData)
      await fetchTrainer()
    } catch (e) {
      console.error(e)
    }
  }

  if (loading && !trainer) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!trainer) {
    return <div className="text-sm text-muted-foreground p-2">Trainer profile not found on the server. Please ensure your account is registered as a trainer.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Services & Pricing</Label>
        {!isAdding && (
          <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Service
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="border rounded-md p-4 bg-muted/30 space-y-4 mb-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 lg:col-span-2">
              <Label>Service Name <span className="text-destructive">*</span></Label>
              <Input 
                placeholder="e.g. Dog Walking" 
                value={newServiceName} 
                onChange={e => setNewServiceName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Price (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="number" 
                  className="pl-8" 
                  placeholder="e.g. 25" 
                  value={newPrice} 
                  onChange={e => setNewPrice(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newPriceType} onValueChange={(v: any) => setNewPriceType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                   <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Switch checked={newIsActive} onCheckedChange={setNewIsActive} id="new-active" />
              <Label htmlFor="new-active">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAddService} disabled={loading || !newServiceName.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />} Save
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {trainer.services.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 text-center border rounded-md border-dashed">
            No services added yet.
          </p>
        ) : (
          trainer.services.map((serviceObj: any, idx: number) => {
            // Handle legacy strings
            const isLegacy = typeof serviceObj === "string"
            const service: TrainerService = isLegacy 
              ? { serviceName: serviceObj, priceType: "fixed", isActive: true } 
              : serviceObj
              
            const key = service._id || `legacy-${idx}`

            return (
              <div key={key} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center border rounded-md p-3 relative group transition-colors hover:bg-muted/10">
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-sm">{service.serviceName}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {service.price ? (
                      <span className="flex items-center font-medium text-foreground">
                        <DollarSign className="h-3 w-3" />
                        {service.price} {service.priceType === 'hourly' ? '/ hr' : ''}
                      </span>
                    ) : (
                      <span className="italic">Contact for price</span>
                    )}
                    {isLegacy && <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase" style={{fontSize: '10px'}}>Legacy</span>}
                    {!service.isActive && <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive uppercase" style={{fontSize: '10px'}}>Inactive</span>}
                  </div>
                </div>

                {!isLegacy && service._id && (
                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center space-x-2 mr-2">
                      <Label htmlFor={`active-${service._id}`} className="text-xs sr-only">Active</Label>
                      <Switch 
                        id={`active-${service._id}`} 
                        checked={service.isActive} 
                        onCheckedChange={(v) => handleUpdateServiceField(service, 'isActive', v)}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteService(service._id!)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
