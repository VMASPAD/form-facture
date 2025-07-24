import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
function Templates() {
  return (
    <div>
      <ScrollArea className="h-[40rem] w-full rounded-md border p-2">
        {/* Plantilla 1: Océano Azul Minimalista */}
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-3 rounded-lg shadow-md border border-blue-200">
          <h1 className="text-start text-xl font-serif font-bold text-blue-900 tracking-tight">Océano Azul Minimalista (1)</h1>
          <p className="text-start text-sm text-blue-800 font-medium mt-1">Elegante y sereno</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-10 h-10 bg-blue-700 rounded shadow-sm border border-blue-800"></div>
            <div className="w-10 h-10 bg-sky-600 rounded shadow-sm border border-sky-700"></div>
            <div className="w-10 h-10 bg-blue-600 rounded shadow-sm border border-blue-700"></div>
            <div className="w-10 h-10 bg-cyan-600 rounded shadow-sm border border-cyan-700"></div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Plantilla 2: Verde Bosque Profesional */}
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 p-3 rounded-lg shadow-lg border border-green-300 relative">
          <div className="absolute top-1 right-1 text-lg opacity-30">🌿</div>
          <h1 className="text-start text-xl font-bold text-green-800 transform hover:scale-105 transition-transform">Verde Bosque Profesional (2)</h1>
          <p className="text-start text-sm text-green-700 font-semibold mt-1">Natural y profesional</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded shadow-md border border-green-500 hover:transform hover:scale-110 transition-transform"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded shadow-md border border-emerald-400 hover:transform hover:scale-110 transition-transform"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-emerald-800 rounded shadow-md border border-green-600 hover:transform hover:scale-110 transition-transform"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded shadow-md border border-emerald-500 hover:transform hover:scale-110 transition-transform"></div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Plantilla 3: Naranja Atardecer Moderno */}
        <div className="bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 p-3 rounded-xl shadow-lg border-2 border-orange-300 relative animate-pulse">
          <div className="absolute top-1 right-1 text-lg opacity-40">💳</div>
          <h1 className="text-start text-xl font-extrabold text-orange-800 transform hover:translate-x-2 transition-transform">Naranja Atardecer Moderno (3)</h1>
          <p className="text-start text-sm text-orange-700 font-medium mt-1">Dinámico y moderno</p>
          <div className="flex flex-row gap-1 mt-3">
            <div className="w-14 h-8 bg-gradient-to-r from-orange-600 to-amber-500 rounded-lg transform hover:translate-y-1 transition-transform"></div>
            <div className="w-14 h-8 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-lg transform hover:translate-y-1 transition-transform"></div>
            <div className="w-14 h-8 bg-gradient-to-r from-orange-500 to-red-400 rounded-lg transform hover:translate-y-1 transition-transform"></div>
            <div className="w-14 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg transform hover:translate-y-1 transition-transform"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 4: Púrpura Real Elegante */}
        <div className="bg-white p-3 rounded border border-purple-200 shadow-sm relative bg-grid-pattern">
          <div className="absolute top-1 right-1 text-lg opacity-40">💎</div>
          <div className="absolute inset-0 opacity-5 bg-grid-sm bg-purple-300"></div>
          <h1 className="text-start text-lg font-bold text-purple-900 tracking-tight relative z-10 hover:scale-105 transform transition-transform">Púrpura Real Elegante (4)</h1>
          <p className="text-start text-xs text-purple-700 font-medium mt-1 relative z-10">Elegante y real</p>
          <div className="flex flex-row gap-1 mt-3 relative z-10">
            <div className="w-12 h-6 bg-purple-800 rounded-sm hover:scale-110 transform transition-transform"></div>
            <div className="w-12 h-6 bg-purple-600 rounded-sm hover:scale-110 transform transition-transform"></div>
            <div className="w-12 h-6 bg-purple-500 rounded-sm hover:scale-110 transform transition-transform"></div>
            <div className="w-12 h-6 bg-violet-500 rounded-sm hover:scale-110 transform transition-transform"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 5: Teal Corporativo */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-3 rounded border-2 border-teal-300 shadow-lg relative animate-shimmer">
          <div className="absolute top-1 right-1 text-lg opacity-40">🏦</div>
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-teal-200 to-transparent rounded-r-lg opacity-50"></div>
          <h1 className="text-start text-lg font-bold text-teal-900 font-sans relative z-10">Teal Corporativo (5)</h1>
          <p className="text-start text-xs text-teal-800 font-medium mt-1 relative z-10">Profesional y corporativo</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-teal-800 rounded-sm border border-teal-700"></div>
            <div className="w-10 h-8 bg-teal-600 rounded-sm border border-teal-500"></div>
            <div className="w-10 h-8 bg-cyan-600 rounded-sm border border-cyan-500"></div>
            <div className="w-10 h-8 bg-teal-500 rounded-sm border border-teal-400"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 6: Rosa Dorado Lujo */}
        <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-3 rounded border border-rose-300 shadow-md relative animate-pulse">
          <div className="absolute top-1 right-1 text-lg opacity-40">🌹</div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-20 h-20 bg-rose-400 rounded-full transform rotate-12"></div>
          </div>
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-400 rounded-l"></div>
          <h1 className="text-start text-lg font-bold text-rose-800 relative z-10 tracking-wider transform rotate-1">Rosa Dorado Lujo (6)</h1>
          <p className="text-start text-xs text-rose-700 font-medium mt-1 relative z-10">Lujoso y elegante</p>
          <div className="flex flex-row gap-1 mt-3 relative z-10">
            <div className="w-12 h-7 bg-rose-600 rounded-sm border border-rose-500 transform hover:rotate-6 transition-transform"></div>
            <div className="w-12 h-7 bg-pink-500 rounded-sm border border-pink-400 transform hover:rotate-6 transition-transform"></div>
            <div className="w-12 h-7 bg-rose-500 rounded-sm border border-rose-400 transform hover:rotate-6 transition-transform"></div>
            <div className="w-12 h-7 bg-pink-600 rounded-sm border border-pink-500 transform hover:rotate-6 transition-transform"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 7: Negro Medianoche Premium */}
        <div className="bg-gradient-to-tr from-gray-900 to-black p-3 rounded-xl shadow-lg relative border border-gray-700">
          <div className="absolute top-1 right-1 text-lg opacity-40">⚡</div>
          <div className="absolute top-2 right-2 w-12 h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full opacity-30 transform rotate-12"></div>
          <div className="absolute bottom-0 right-0 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-gray-600 rounded"></div>
          <h1 className="text-start text-lg font-bold text-gray-100 transform -rotate-1 font-mono">Negro Medianoche Premium (7)</h1>
          <p className="text-start text-xs text-gray-300 font-medium mt-1">Tecnológico y premium</p>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-11 h-8 bg-gradient-to-br from-gray-800 to-black rounded border border-gray-600"></div>
            <div className="w-11 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded border border-purple-500"></div>
            <div className="w-11 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded border border-blue-500"></div>
            <div className="w-11 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded border border-green-400"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 8: Amarillo Dorado Vibrante */}
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-3 rounded-lg border border-yellow-300 shadow-sm relative">
          <div className="absolute top-1 right-1 text-lg opacity-40 animate-spin">⭐</div>
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-1 h-full w-full">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-6 bg-yellow-600 rounded-sm border border-amber-700 transform rotate-3"></div>
            <div>
              <h1 className="text-start text-lg font-bold text-yellow-900 font-sans">Amarillo Dorado Vibrante (8)</h1>
              <p className="text-start text-xs text-yellow-800 font-medium">Vibrante y energético</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-3">
            <div className="w-10 h-7 bg-yellow-600 rounded border border-yellow-700 transform hover:rotate-12 transition-transform"></div>
            <div className="w-10 h-7 bg-amber-600 rounded border border-amber-700 transform hover:rotate-12 transition-transform"></div>
            <div className="w-10 h-7 bg-yellow-500 rounded border border-yellow-600 transform hover:rotate-12 transition-transform"></div>
            <div className="w-10 h-7 bg-amber-500 rounded border border-amber-600 transform hover:rotate-12 transition-transform"></div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Plantilla 9: Rosa Coral Creativo */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-3 rounded border-2 border-pink-300 shadow-md relative">
          <div className="absolute top-1 right-1 text-lg opacity-40">🌸</div>
          <div className="absolute inset-0 opacity-5">
            <div className="w-16 h-16 bg-pink-400 rounded-full absolute top-1 left-1"></div>
            <div className="w-12 h-12 bg-rose-400 rounded-full absolute bottom-2 right-2"></div>
            <div className="w-8 h-8 bg-pink-500 rounded-full absolute top-4 right-4"></div>
          </div>
          <div className="absolute top-2 right-2 px-2 py-1 bg-pink-600 text-white text-xs rounded font-medium transform rotate-6">CREATIVO</div>
          <h1 className="text-start text-lg font-bold text-pink-900 relative z-10 transform rotate-2">Rosa Coral Creativo (9)</h1>
          <p className="text-start text-xs text-pink-800 font-medium mt-1 relative z-10">Creativo y expresivo</p>
          <div className="flex flex-row gap-2 mt-3 relative z-10">
            <div className="w-10 h-8 bg-pink-600 rounded-sm transform rotate-3"></div>
            <div className="w-10 h-8 bg-rose-500 rounded-sm transform -rotate-3"></div>
            <div className="w-10 h-8 bg-pink-500 rounded-sm transform rotate-6"></div>
            <div className="w-10 h-8 bg-rose-600 rounded-sm transform -rotate-6"></div>
          </div>
        </div>

        <Separator className="my-4" />

       
      </ScrollArea>
    </div>
  )
}

export default Templates