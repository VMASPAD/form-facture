import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
function Templates() {
  return (
    <div>
      <ScrollArea className="h-[30rem] w-full rounded-md border p-2">
        {/* Plantilla 1: Estilo Moderno y Minimalista */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-3 rounded-lg shadow-md">
          <h1 className="text-start text-xl font-bold text-gray-800 tracking-tight">Plantilla Moderna (1)</h1>
          <p className="text-start text-sm text-gray-600 font-light mt-1">Diseño minimalista</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-10 h-10 bg-slate-700 rounded shadow-sm"></div>
            <div className="w-10 h-10 bg-blue-600 rounded shadow-sm"></div>
            <div className="w-10 h-10 bg-indigo-500 rounded shadow-sm"></div>
            <div className="w-10 h-10 bg-purple-500 rounded shadow-sm"></div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Plantilla 2: Estilo Vibrante y Creativo */}
        <div className="bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 p-3 rounded-lg shadow-md">
          <h1 className="text-start text-xl font-black text-purple-800 italic">Plantilla Vibrante (2)</h1>
          <p className="text-start text-sm text-purple-700 font-semibold mt-1">Colores brillantes</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full shadow-md"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-md"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-md"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-md"></div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Plantilla 3: Estilo Profesional Corporativo */}
        <div className="bg-gradient-to-t from-emerald-50 to-teal-50 p-3 rounded border-l-2 border-emerald-600 shadow-sm">
          <h1 className="text-start text-lg font-extrabold text-emerald-800 uppercase tracking-wide">Corporativa (3)</h1>
          <p className="text-start text-xs text-emerald-700 font-medium mt-1">Profesional y confiable</p>
          <div className="flex flex-row gap-1 mt-3">
            <div className="w-14 h-8 bg-emerald-600 rounded-sm"></div>
            <div className="w-14 h-8 bg-teal-600 rounded-sm"></div>
            <div className="w-14 h-8 bg-cyan-600 rounded-sm"></div>
            <div className="w-14 h-8 bg-blue-700 rounded-sm"></div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Templates