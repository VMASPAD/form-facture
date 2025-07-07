"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Column } from "@/pages/Menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  containerColumns?: Column[]
  onAddRow?: () => void
  showAddButton?: boolean
  container?: any
  onUpdateContainer?: (container: any) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  containerColumns = [],
  onAddRow,
  showAddButton = false,
  container,
  onUpdateContainer,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [showPercentageInput, setShowPercentageInput] = useState(container?.percentageEnabled || false)
  const [percentageValue, setPercentageValue] = useState<number>(container?.percentageValue || 21)

  // Update container when percentage settings change
  useEffect(() => {
    if (container && onUpdateContainer) {
      const updatedContainer = {
        ...container,
        percentageEnabled: showPercentageInput,
        percentageValue: percentageValue,
      }
      onUpdateContainer(updatedContainer)
    }
  }, [showPercentageInput, percentageValue])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  // Calculate sums for number columns that have sum enabled
  const calculateSum = (columnId: string): number => {
    const column = containerColumns.find(col => col.id === columnId)
    if (!column || column.type !== 'number' || !column.sum) return 0
    
    return data.reduce((sum, row: any) => {
      const value = row[columnId]
      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0
      return sum + numValue
    }, 0)
  }

  // Calculate total sum of all columns that have sum enabled
  const calculateTotalSum = (): number => {
    return containerColumns
      .filter(col => col.type === 'number' && col.sum)
      .reduce((total, col) => total + calculateSum(col.id), 0)
  }

  // Calculate percentage amount
  const calculatePercentageAmount = (total: number): number => {
    return showPercentageInput ? (total * percentageValue) / 100 : 0
  }

  // Calculate final total (sum + percentage)
  const calculateFinalTotal = (): number => {
    const baseTotal = calculateTotalSum()
    return baseTotal + calculatePercentageAmount(baseTotal)
  }

  const hasSumColumns = containerColumns.some(col => col.type === 'number' && col.sum)

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          placeholder="Buscar en la tabla..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        
        {showAddButton && (
          <Button onClick={onAddRow} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Agregar Fila
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {showAddButton ? (
                    <div className="space-y-2">
                      <p className="text-muted-foreground">No hay datos aún</p>
                      <Button onClick={onAddRow} variant="outline" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Primera Fila
                      </Button>
                    </div>
                  ) : (
                    "No hay resultados."
                  )}
                </TableCell>
              </TableRow>
            )}
            
            {/* Sum Row */}
            {hasSumColumns && data.length > 0 && (
              <TableRow className="bg-muted/50 font-semibold">
                {table.getHeaderGroups()[0].headers.map((header) => {
                  const columnId = header.column.id
                  const column = containerColumns.find(col => col.id === columnId)
                  
                  if (column && column.type === 'number' && column.sum) {
                    const sum = calculateSum(columnId)
                    return (
                      <TableCell key={header.id} className="text-right">
                        Total: {new Intl.NumberFormat("es-ES", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(sum)} $
                      </TableCell>
                    )
                  }
                  
                  if (columnId === containerColumns[0]?.id) {
                    return <TableCell key={header.id}>Total</TableCell>
                  }
                  
                  return <TableCell key={header.id}></TableCell>
                })}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Totals Section with Percentage */}
      {hasSumColumns && data.length > 0 && (
        <div className="bg-card border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-lg">Resumen de Totales</h3>
          
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
              }).format(calculateTotalSum())}
            </span>
          </div>

          {/* Percentage Controls */}
          <div className="space-y-3 border-t pt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="percentage-checkbox"
                checked={showPercentageInput}
                onCheckedChange={(checked) => setShowPercentageInput(checked as boolean)}
              />
              <Label htmlFor="percentage-checkbox" className="text-sm font-medium">
                Agregar porcentaje (IVA, impuestos, etc.)
              </Label>
            </div>

            {showPercentageInput && (
              <div className="flex items-center space-x-2 ml-6">
                <Input
                  type="number"
                  value={percentageValue}
                  onChange={(e) => setPercentageValue(parseFloat(e.target.value) || 0)}
                  className="w-20"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-sm font-medium ml-4">
                  = {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                  }).format(calculatePercentageAmount(calculateTotalSum()))}
                </span>
              </div>
            )}
          </div>

          {/* Final Total */}
          <div className="flex justify-between items-center border-t pt-3">
            <span className="text-lg font-semibold">Total Final:</span>
            <span className="text-lg font-bold text-primary">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
              }).format(calculateFinalTotal())}
            </span>
          </div>
        </div>
      )}

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            de {table.getFilteredRowModel().rows.length} resultados
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
