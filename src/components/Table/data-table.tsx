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
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Column } from "@/pages/Menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  containerColumns?: Column[]
  onAddRow?: () => void
  showAddButton?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  containerColumns = [],
  onAddRow,
  showAddButton = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

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
                        }).format(sum)}
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