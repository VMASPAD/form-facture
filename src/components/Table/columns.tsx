"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { Column } from "@/pages/Menu"

// Dynamic row data type
export type DynamicRow = {
  id: string
  [key: string]: any
}

// Function to create dynamic columns based on container columns
export const createDynamicColumns = (
  columns: Column[],
  onEditRow: (row: DynamicRow) => void,
  onDeleteRow: (id: string) => void
): ColumnDef<DynamicRow>[] => {
  const dynamicColumns: ColumnDef<DynamicRow>[] = columns.map((column) => ({
    accessorKey: column.id,
    header: ({ column: tableColumn }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => tableColumn.toggleSorting(tableColumn.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          {column.name}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ getValue }) => {
      const value = getValue() as any
      
      if (column.type === 'number') {
        const numValue = typeof value === 'number' ? value : parseFloat(value) || 0
        return (
          <div className="text-start font-medium">
            {new Intl.NumberFormat("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(numValue)}
          </div>
        )
      }
      
      return <div>{value || ''}</div>
    },
  }))

  // Add actions column
  dynamicColumns.push({
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditRow(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteRow(row.original.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  })

  return dynamicColumns
}

// Legacy Payment type for backward compatibility
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

// Legacy columns for backward compatibility
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]