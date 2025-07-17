import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
function Templates() {
  return (
    <div>
      <ScrollArea className="h-[40rem] w-full rounded-md border p-2">
        {/* Plantilla 1: Clásico */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-3 rounded-lg shadow-md border border-amber-200">
          <h1 className="text-start text-xl font-serif font-bold text-amber-900 tracking-tight">Clásico (1)</h1>
          <p className="text-start text-sm text-amber-800 font-medium mt-1">Elegante y tradicional</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-10 h-10 bg-amber-700 rounded shadow-sm border border-amber-800"></div>
            <div className="w-10 h-10 bg-yellow-600 rounded shadow-sm border border-yellow-700"></div>
            <div className="w-10 h-10 bg-amber-600 rounded shadow-sm border border-amber-700"></div>
            <div className="w-10 h-10 bg-yellow-700 rounded shadow-sm border border-yellow-800"></div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Plantilla 2: CyberPunk */}
        <div className="bg-gradient-to-r from-black via-purple-900 to-black p-3 rounded-lg shadow-lg border border-cyan-400">
          <h1 className="text-start text-xl font-black text-cyan-400 italic transform skew-x-3">CyberPunk (2)</h1>
          <p className="text-start text-sm text-purple-300 font-semibold mt-1">Futurista y rebelde</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded shadow-md border border-cyan-300"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded shadow-md border border-purple-300"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded shadow-md border border-green-300"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded shadow-md border border-yellow-300"></div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Plantilla 3: Artístico */}
        <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-3 rounded-xl shadow-lg border-2 border-dashed border-purple-300">
          <h1 className="text-start text-xl font-extrabold text-purple-800 italic transform rotate-1">Artístico (3)</h1>
          <p className="text-start text-sm text-purple-700 font-medium mt-1">Creativo y expresivo</p>
          <div className="flex flex-row gap-1 mt-3">
            <div className="w-14 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transform rotate-12"></div>
            <div className="w-14 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transform -rotate-12"></div>
            <div className="w-14 h-8 bg-gradient-to-r from-green-500 to-blue-400 rounded-full transform rotate-6"></div>
            <div className="w-14 h-8 bg-gradient-to-r from-red-500 to-purple-500 rounded-full transform -rotate-6"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 4: Minimalista */}
        <div className="bg-white p-3 rounded border border-gray-200 shadow-sm relative">
          <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full opacity-20"></div>
          <h1 className="text-start text-lg font-light text-gray-900 tracking-tight">Minimalista (4)</h1>
          <p className="text-start text-xs text-slate-600 font-light mt-1">Limpio y simple</p>
          <div className="flex flex-row gap-1 mt-3">
            <div className="w-12 h-6 bg-gray-800 rounded-sm"></div>
            <div className="w-12 h-6 bg-gray-600 rounded-sm"></div>
            <div className="w-12 h-6 bg-gray-400 rounded-sm"></div>
            <div className="w-12 h-6 bg-gray-200 rounded-sm"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 5: Gótico */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-3 rounded-lg border-l-4 border-red-600 shadow-lg relative">
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-red-900 to-transparent rounded-r-lg opacity-50"></div>
          <h1 className="text-start text-lg font-bold text-red-400 font-serif">Gótico (5)</h1>
          <p className="text-start text-xs text-gray-300 font-medium mt-1">Oscuro y misterioso</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-10 h-8 bg-black rounded-md border border-red-600"></div>
            <div className="w-10 h-8 bg-gray-900 rounded-md border border-red-500"></div>
            <div className="w-10 h-8 bg-red-900 rounded-md border border-red-400"></div>
            <div className="w-10 h-8 bg-red-700 rounded-md border border-red-300"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 6: SCIFI */}
        <div className="bg-gradient-to-br from-cyan-900 to-blue-900 p-3 rounded border border-cyan-400 shadow-md relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-20 h-20 bg-cyan-400 rounded-full"></div>
          </div>
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-400 rounded-l"></div>
          <h1 className="text-start text-lg font-bold text-cyan-300 relative z-10 tracking-wider">SCIFI (6)</h1>
          <p className="text-start text-xs text-cyan-200 font-medium mt-1 relative z-10">Tecnológico y futurista</p>
          <div className="flex flex-row gap-1 mt-3 relative z-10">
            <div className="w-12 h-7 bg-cyan-500 rounded-sm border border-cyan-300"></div>
            <div className="w-12 h-7 bg-blue-500 rounded-sm border border-blue-300"></div>
            <div className="w-12 h-7 bg-teal-500 rounded-sm border border-teal-300"></div>
            <div className="w-12 h-7 bg-cyan-600 rounded-sm border border-cyan-400"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 7: PlayFul */}
        <div className="bg-gradient-to-tr from-yellow-100 via-pink-100 to-purple-100 p-3 rounded-xl shadow-lg relative">
          <div className="absolute top-2 right-2 w-12 h-8 bg-gradient-to-r from-rainbow-600 to-violet-600 rounded-full opacity-30 transform rotate-12"></div>
          <div className="absolute bottom-0 right-0 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-pink-200 rounded"></div>
          <h1 className="text-start text-lg font-bold text-pink-700 transform -rotate-1">PlayFul (7)</h1>
          <p className="text-start text-xs text-purple-600 font-medium mt-1">Divertido y colorido</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-11 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full transform rotate-12"></div>
            <div className="w-11 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-full transform -rotate-12"></div>
            <div className="w-11 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full transform rotate-6"></div>
            <div className="w-11 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform -rotate-6"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 8: Rústico */}
        <div className="bg-gradient-to-r from-sky-100 to-blue-100 p-3 rounded-lg border border-sky-300 shadow-sm relative">
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-1 h-full w-full">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-blue-600 rounded-full"></div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-6 bg-sky-700 rounded-sm border border-blue-800"></div>
            <div>
              <h1 className="text-start text-lg font-bold text-blue-900 font-serif">Rústico (8)</h1>
              <p className="text-start text-xs text-blue-800 font-medium">Natural y terrenal</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-10 h-7 bg-sky-800 rounded border border-blue-900"></div>
            <div className="w-10 h-7 bg-blue-700 rounded border border-sky-800"></div>
            <div className="w-10 h-7 bg-sky-700 rounded border border-blue-800"></div>
            <div className="w-10 h-7 bg-blue-700 rounded border border-sky-800"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 9: Formal */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-3 rounded border-2 border-slate-300 shadow-md relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-16 h-16 bg-slate-700 rounded-full"></div>
          </div>
          <div className="absolute top-2 right-2 px-2 py-1 bg-slate-700 text-white text-xs rounded font-medium">FORMAL</div>
          <h1 className="text-start text-lg font-bold text-slate-900 relative z-10">Formal (9)</h1>
          <p className="text-start text-xs text-slate-700 font-medium mt-1 relative z-10">Serio y profesional</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-slate-800 rounded-sm"></div>
            <div className="w-10 h-8 bg-slate-700 rounded-sm"></div>
            <div className="w-10 h-8 bg-slate-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-slate-500 rounded-sm"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 10: Futurista */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-3 rounded-lg border border-electric-blue shadow-lg relative">
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-6 gap-1 h-full w-full">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
          <h1 className="text-start text-lg font-bold text-cyan-300 relative z-10 tracking-widest">FUTURISTA (10)</h1>
          <p className="text-start text-xs text-indigo-200 font-medium mt-1 relative z-10">Avanzado y moderno</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded"></div>
            <div className="w-10 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded"></div>
            <div className="w-10 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded"></div>
            <div className="w-10 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 11: Formal Colorido */}
        <div className="bg-gradient-to-br from-white to-blue-50 p-3 rounded border border-blue-200 shadow-md relative">
          <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-20"></div>
          <h1 className="text-start text-lg font-bold text-blue-900 relative z-10">Formal Colorido (11)</h1>
          <p className="text-start text-xs text-blue-700 font-medium mt-1 relative z-10">Profesional con vida</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-blue-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-green-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-orange-500 rounded-sm"></div>
            <div className="w-10 h-8 bg-purple-500 rounded-sm"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 12: Formal Gris */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded border border-gray-300 shadow-md relative">
          <div className="absolute top-2 right-2 w-8 h-8 bg-gray-500 rounded-full opacity-20"></div>
          <h1 className="text-start text-lg font-bold text-gray-800 relative z-10">Formal Gris (12)</h1>
          <p className="text-start text-xs text-gray-600 font-medium mt-1 relative z-10">Neutral y elegante</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-gray-700 rounded-sm"></div>
            <div className="w-10 h-8 bg-gray-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-gray-500 rounded-sm"></div>
            <div className="w-10 h-8 bg-gray-400 rounded-sm"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 13: Formal Rojo */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-3 rounded border border-red-200 shadow-md relative">
          <div className="absolute top-2 right-2 w-8 h-8 bg-red-600 rounded-full opacity-20"></div>
          <h1 className="text-start text-lg font-bold text-red-900 relative z-10">Formal Rojo (13)</h1>
          <p className="text-start text-xs text-red-700 font-medium mt-1 relative z-10">Elegante y llamativo</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-red-700 rounded-sm"></div>
            <div className="w-10 h-8 bg-red-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-rose-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-red-500 rounded-sm"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 14: Formal Celeste */}
        <div className="bg-gradient-to-br from-sky-50 to-cyan-50 p-3 rounded border border-sky-200 shadow-md relative">
          <div className="absolute top-2 right-2 w-8 h-8 bg-sky-500 rounded-full opacity-20"></div>
          <h1 className="text-start text-lg font-bold text-sky-900 relative z-10">Formal Celeste (14)</h1>
          <p className="text-start text-xs text-sky-700 font-medium mt-1 relative z-10">Fresco y confiable</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-sky-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-sky-500 rounded-sm"></div>
            <div className="w-10 h-8 bg-cyan-500 rounded-sm"></div>
            <div className="w-10 h-8 bg-sky-400 rounded-sm"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 15: Formal Azul */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded border border-blue-200 shadow-md relative">
          <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full opacity-20"></div>
          <h1 className="text-start text-lg font-bold text-blue-900 relative z-10">Formal Azul (15)</h1>
          <p className="text-start text-xs text-blue-700 font-medium mt-1 relative z-10">Clásico y profesional</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-blue-700 rounded-sm"></div>
            <div className="w-10 h-8 bg-blue-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-indigo-600 rounded-sm"></div>
            <div className="w-10 h-8 bg-blue-500 rounded-sm"></div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Templates