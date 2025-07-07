import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
function Templates() {
  return (
    <div>
      <ScrollArea className="h-[40rem] w-full rounded-md border p-2">
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

        <Separator className="my-4" />

        {/* Plantilla 4: Minimalista Azul Corporativo */}
        <div className="bg-white p-3 rounded border border-blue-200 shadow-sm relative">
          <div className="absolute top-2 right-2 w-8 h-8 bg-blue-700 rounded-full opacity-20"></div>
          <h1 className="text-start text-lg font-bold text-blue-900 tracking-tight">Azul Corporativo (4)</h1>
          <p className="text-start text-xs text-slate-600 font-medium mt-1">Limpio y profesional</p>
          <div className="flex flex-row gap-1 mt-3">
            <div className="w-12 h-6 bg-blue-700 rounded-sm"></div>
            <div className="w-12 h-6 bg-blue-600 rounded-sm"></div>
            <div className="w-12 h-6 bg-slate-500 rounded-sm"></div>
            <div className="w-12 h-6 bg-slate-600 rounded-sm"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 5: Minimalista Verde Suave */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm relative">
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-emerald-100 to-transparent rounded-r-lg opacity-50"></div>
          <h1 className="text-start text-lg font-semibold text-emerald-800">Verde Suave (5)</h1>
          <p className="text-start text-xs text-emerald-700 font-medium mt-1">Amigable y profesional</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-10 h-8 bg-emerald-600 rounded-md"></div>
            <div className="w-10 h-8 bg-green-500 rounded-md"></div>
            <div className="w-10 h-8 bg-emerald-400 rounded-md"></div>
            <div className="w-10 h-8 bg-green-400 rounded-md"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 6: Minimalista Gris Elegante */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-3 rounded border border-slate-300 shadow-md relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-20 h-20 bg-indigo-500 rounded-full"></div>
          </div>
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l"></div>
          <h1 className="text-start text-lg font-bold text-slate-800 relative z-10">Gris Elegante (6)</h1>
          <p className="text-start text-xs text-slate-600 font-medium mt-1 relative z-10">Sofisticado y elegante</p>
          <div className="flex flex-row gap-1 mt-3 relative z-10">
            <div className="w-12 h-7 bg-slate-600 rounded-sm"></div>
            <div className="w-12 h-7 bg-slate-800 rounded-sm"></div>
            <div className="w-12 h-7 bg-indigo-500 rounded-sm"></div>
            <div className="w-12 h-7 bg-purple-500 rounded-sm"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 7: Minimalista Púrpura Moderno */}
        <div className="bg-gradient-to-tr from-purple-50 via-violet-50 to-indigo-50 p-3 rounded-lg shadow-md relative">
          <div className="absolute top-2 right-2 w-12 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded opacity-30 transform rotate-12"></div>
          <div className="absolute bottom-0 right-0 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-purple-200"></div>
          <h1 className="text-start text-lg font-bold text-purple-900">Púrpura Moderno (7)</h1>
          <p className="text-start text-xs text-purple-700 font-medium mt-1">Moderno con gradientes</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-11 h-8 bg-gradient-to-br from-purple-600 to-violet-700 rounded"></div>
            <div className="w-11 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded"></div>
            <div className="w-11 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded"></div>
            <div className="w-11 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 8: Minimalista Naranja Suave */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200 shadow-sm relative">
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-1 h-full w-full">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-orange-400 rounded-full"></div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-6 bg-orange-500 rounded-sm"></div>
            <div>
              <h1 className="text-start text-lg font-semibold text-orange-800">Naranja Suave (8)</h1>
              <p className="text-start text-xs text-orange-700 font-medium">Cálido y acogedor</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-10 h-7 bg-orange-600 rounded"></div>
            <div className="w-10 h-7 bg-orange-500 rounded"></div>
            <div className="w-10 h-7 bg-amber-500 rounded"></div>
            <div className="w-10 h-7 bg-orange-400 rounded"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 9: Minimalista Rosa Profesional */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded border-2 border-pink-200 shadow-md relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-8">
            <div className="w-16 h-16 bg-pink-600 rounded-full"></div>
          </div>
          <div className="absolute top-2 right-2 px-2 py-1 bg-pink-600 text-white text-xs rounded-full font-medium">PRO</div>
          <h1 className="text-start text-lg font-bold text-pink-900 relative z-10">Rosa Profesional (9)</h1>
          <p className="text-start text-xs text-pink-700 font-medium mt-1 relative z-10">Femenino y profesional</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-pink-700 rounded-sm"></div>
            <div className="w-10 h-8 bg-pink-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-rose-500 rounded-sm"></div>
            <div className="w-10 h-8 bg-pink-500 rounded-sm"></div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Templates