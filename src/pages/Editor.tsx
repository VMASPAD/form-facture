import { createDynamicColumns, DynamicRow } from '@/components/Table/columns'
import { DataTable } from '@/components/Table/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Container, Column } from '@/pages/Menu'
import { ParseTable } from '@/lib/parse'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Plus, Trash2, ArrowLeft, Save, FileText, CreditCard, ChevronUp, ChevronDown, Edit } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'

function Editor() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const containerId = searchParams.get('id')
  
  const [container, setContainer] = useState<Container | null>(null)
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false)
  const [isEditRowDialogOpen, setIsEditRowDialogOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<DynamicRow | null>(null)
  const [newColumn, setNewColumn] = useState({ name: '', type: 'text' as 'text' | 'number', sum: false })
  const [editingRowData, setEditingRowData] = useState<Record<string, any>>({})
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  
  // Estados para transferencias
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isAddTransferColumnDialogOpen, setIsAddTransferColumnDialogOpen] = useState(false)
  const [isEditTransferRowDialogOpen, setIsEditTransferRowDialogOpen] = useState(false)
  const [editingTransferRow, setEditingTransferRow] = useState<DynamicRow | null>(null)
  const [newTransferColumn, setNewTransferColumn] = useState({ name: '', type: 'text' as 'text' | 'number', sum: false })
  const [editingTransferRowData, setEditingTransferRowData] = useState<Record<string, any>>({})
  
  // Estados para editar columnas
  const [isEditColumnDialogOpen, setIsEditColumnDialogOpen] = useState(false)
  const [editingColumn, setEditingColumn] = useState<Column | null>(null)
  const [editingColumnName, setEditingColumnName] = useState('')

  // Load container from localStorage
  useEffect(() => {
    if (!containerId) {
      navigate('/menu')
      return
    }

    const savedContainers = localStorage.getItem('formFactureContainers')
    if (savedContainers) {
      const containers: Container[] = JSON.parse(savedContainers)
      const foundContainer = containers.find(c => c.id === containerId)
      if (foundContainer) {
        setContainer(foundContainer)
      } else {
        navigate('/menu')
      }
    } else {
      navigate('/menu')
    }
  }, [containerId, navigate])

  // Save container to localStorage
  const saveContainer = (updatedContainer: Container) => {
    const savedContainers = localStorage.getItem('formFactureContainers')
    if (savedContainers) {
      const containers: Container[] = JSON.parse(savedContainers)
      const updatedContainers = containers.map(c => 
        c.id === updatedContainer.id ? updatedContainer : c
      )
      localStorage.setItem('formFactureContainers', JSON.stringify(updatedContainers))
      setContainer(updatedContainer)
    }
  }

  const addColumn = () => {
    if (!container || newColumn.name.trim() === '') return

    const column: Column = {
      id: Date.now().toString(),
      name: newColumn.name,
      type: newColumn.type,
      sum: newColumn.type === 'number' ? newColumn.sum : undefined
    }

    const updatedContainer = {
      ...container,
      columns: [...container.columns, column]
    }

    saveContainer(updatedContainer)
    setNewColumn({ name: '', type: 'text', sum: false })
    setIsAddColumnDialogOpen(false)
  }

  const deleteColumn = (columnId: string) => {
    if (!container) return

    const updatedContainer = {
      ...container,
      columns: container.columns.filter(col => col.id !== columnId),
      data: container.data.map(row => {
        const newRow = { ...row }
        delete newRow[columnId]
        return newRow
      })
    }

    saveContainer(updatedContainer)
  }

  const toggleColumnSum = (columnId: string) => {
    if (!container) return

    const updatedContainer = {
      ...container,
      columns: container.columns.map(col => 
        col.id === columnId && col.type === 'number' 
          ? { ...col, sum: !col.sum }
          : col
      )
    }

    saveContainer(updatedContainer)
  }

  const addRow = () => {
    if (!container) return

    const newRow: DynamicRow = {
      id: Date.now().toString()
    }

    // Initialize with default values based on column types
    container.columns.forEach(col => {
      newRow[col.id] = col.type === 'number' ? 0 : ''
    })

    const updatedContainer = {
      ...container,
      data: [...container.data, newRow]
    }

    saveContainer(updatedContainer)
  }

  const editRow = (row: DynamicRow) => {
    setEditingRow(row)
    setEditingRowData({ ...row })
    setIsEditRowDialogOpen(true)
  }

  const saveEditRow = () => {
    if (!container || !editingRow) return

    const updatedContainer = {
      ...container,
      data: container.data.map(row => 
        row.id === editingRow.id ? editingRowData : row
      )
    }

    saveContainer(updatedContainer)
    setIsEditRowDialogOpen(false)
    setEditingRow(null)
    setEditingRowData({})
  }

  const deleteRow = (rowId: string) => {
    if (!container) return

    const updatedContainer = {
      ...container,
      data: container.data.filter(row => row.id !== rowId)
    }

    saveContainer(updatedContainer)
  }

  const handleEditRowChange = (columnId: string, value: string) => {
    const column = container?.columns.find(col => col.id === columnId)
    let processedValue: any = value

    if (column?.type === 'number') {
      processedValue = value === '' ? 0 : parseFloat(value) || 0
    }

    setEditingRowData({
      ...editingRowData,
      [columnId]: processedValue
    })
  }

  // Funciones para transferencias
  const addTransferColumn = () => {
    if (!container || newTransferColumn.name.trim() === '') return

    const column: Column = {
      id: Date.now().toString(),
      name: newTransferColumn.name,
      type: newTransferColumn.type,
      sum: newTransferColumn.type === 'number' ? newTransferColumn.sum : undefined
    }

    const updatedContainer = {
      ...container,
      transferColumns: [...(container.transferColumns || []), column]
    }

    saveContainer(updatedContainer)
    setNewTransferColumn({ name: '', type: 'text', sum: false })
    setIsAddTransferColumnDialogOpen(false)
  }

  const deleteTransferColumn = (columnId: string) => {
    if (!container) return

    const updatedContainer = {
      ...container,
      transferColumns: (container.transferColumns || []).filter(col => col.id !== columnId),
      transferData: (container.transferData || []).map(row => {
        const newRow = { ...row }
        delete newRow[columnId]
        return newRow
      })
    }

    saveContainer(updatedContainer)
  }

  const toggleTransferColumnSum = (columnId: string) => {
    if (!container) return

    const updatedContainer = {
      ...container,
      transferColumns: (container.transferColumns || []).map(col => 
        col.id === columnId && col.type === 'number' 
          ? { ...col, sum: !col.sum }
          : col
      )
    }

    saveContainer(updatedContainer)
  }

  const addTransferRow = () => {
    if (!container) return

    const newRow: DynamicRow = {
      id: Date.now().toString()
    }

    // Initialize with default values based on column types
    ;(container.transferColumns || []).forEach(col => {
      newRow[col.id] = col.type === 'number' ? 0 : ''
    })

    const updatedContainer = {
      ...container,
      transferData: [...(container.transferData || []), newRow]
    }

    saveContainer(updatedContainer)
  }

  const editTransferRow = (row: DynamicRow) => {
    setEditingTransferRow(row)
    setEditingTransferRowData({ ...row })
    setIsEditTransferRowDialogOpen(true)
  }

  const saveEditTransferRow = () => {
    if (!container || !editingTransferRow) return

    const updatedContainer = {
      ...container,
      transferData: (container.transferData || []).map(row => 
        row.id === editingTransferRow.id ? editingTransferRowData : row
      )
    }

    saveContainer(updatedContainer)
    setIsEditTransferRowDialogOpen(false)
    setEditingTransferRow(null)
    setEditingTransferRowData({})
  }

  const deleteTransferRow = (rowId: string) => {
    if (!container) return

    const updatedContainer = {
      ...container,
      transferData: (container.transferData || []).filter(row => row.id !== rowId)
    }

    saveContainer(updatedContainer)
  }

  const handleEditTransferRowChange = (columnId: string, value: string) => {
    const column = container?.transferColumns?.find(col => col.id === columnId)
    let processedValue: any = value

    if (column?.type === 'number') {
      processedValue = value === '' ? 0 : parseFloat(value) || 0
    }

    setEditingTransferRowData({
      ...editingTransferRowData,
      [columnId]: processedValue
    })
  }

  // Funciones para gestión de columnas
  const moveColumn = (columnId: string, direction: 'up' | 'down') => {
    if (!container) return

    const columns = [...container.columns]
    const currentIndex = columns.findIndex(col => col.id === columnId)
    
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= columns.length) return
    
    // Intercambiar posiciones
    [columns[currentIndex], columns[newIndex]] = [columns[newIndex], columns[currentIndex]]
    
    const updatedContainer = {
      ...container,
      columns
    }

    saveContainer(updatedContainer)
  }

  const openEditColumn = (column: Column) => {
    setEditingColumn(column)
    setEditingColumnName(column.name)
    setIsEditColumnDialogOpen(true)
  }

  const saveEditColumn = () => {
    if (!container || !editingColumn || editingColumnName.trim() === '') return

    const updatedContainer = {
      ...container,
      columns: container.columns.map(col => 
        col.id === editingColumn.id 
          ? { ...col, name: editingColumnName.trim() }
          : col
      )
    }

    saveContainer(updatedContainer)
    setIsEditColumnDialogOpen(false)
    setEditingColumn(null)
    setEditingColumnName('')
  }

  // Funciones auxiliares para calcular totales
  const calculateColumnSum = (columnId: string): number => {
    if (!container) return 0
    const column = container.columns.find(col => col.id === columnId)
    if (!column || column.type !== 'number' || !column.sum) return 0
    
    return container.data.reduce((sum, row: any) => {
      const value = row[columnId]
      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0
      return sum + numValue
    }, 0)
  }

  const calculateTotalSum = (): number => {
    if (!container) return 0
    return container.columns
      .filter(col => col.type === 'number' && col.sum)
      .reduce((total, col) => total + calculateColumnSum(col.id), 0)
  }

  const calculatePercentageAmount = (total: number): number => {
    if (!container?.percentageEnabled || !container?.percentageValue) return 0
    return (total * container.percentageValue) / 100
  }

  const calculateFinalTotal = (): number => {
    const baseTotal = calculateTotalSum()
    return baseTotal + calculatePercentageAmount(baseTotal)
  }

  const handleGenerateHTML = async () => {
    if (!container) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Calcular totales para incluir en el PDF
      const subtotal = calculateTotalSum();
      const percentageAmount = calculatePercentageAmount(subtotal);
      const finalTotal = calculateFinalTotal();
      
      const totalInfo = {
        subtotal,
        percentage: container.percentageValue || 0,
        percentageAmount,
        finalTotal,
        hasPercentage: container.percentageEnabled || false
      };
      
      const htmlString = await ParseTable(container, false, totalInfo, {
        transferColumns: container.transferColumns || [],
        transferRows: container.transferData || []
      });
      console.log('HTML generado:', htmlString);
      
      // Preparar el payload para la API con el total final
      const payload = {
        name: `${container.title.replace(/\s+/g, '_')}_factura`,
        content: htmlString,
        template: container.template,
        totalAmount: finalTotal // Enviar el total final al servidor
      };
      console.log(payload)
      // Hacer fetch a la API para generar PDF
      const response = await fetch('https://pdfconvertor.hermesbackend.xyz/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      }
      
      // Obtener el binario del PDF
      const pdfBlob = await response.blob();
      
      // Crear URL para el PDF
      const url = URL.createObjectURL(pdfBlob);
      
      // Crear enlace para descargar el PDF
      const a = document.createElement('a');
      a.href = url;
      a.download = `${container.title.replace(/\s+/g, '_')}_factura.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Factura generada exitosamente.`);
      console.log('PDF generado y descargado exitosamente');
      await handleDeletePDF()
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error("Error al generar PDF. Se descargó HTML como alternativa.");
      
      // Fallback: descargar HTML si falla la API
      const htmlString = await ParseTable(container, false, undefined, {
        transferColumns: container.transferColumns || [],
        transferRows: container.transferData || []
      });
      const blob = new Blob([htmlString], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${container.title.replace(/\s+/g, '_')}_factura.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Error al generar PDF. Se descargó HTML como alternativa.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareFile = async () => {
    if (!container) return;
    
    console.log(isSharing)
    setIsSharing(true);
    try {
      // Calcular totales para incluir en el archivo compartido
      const subtotal = calculateTotalSum();
      const percentageAmount = calculatePercentageAmount(subtotal);
      const finalTotal = calculateFinalTotal();
      
      const totalInfo = {
        subtotal,
        percentage: container.percentageValue || 0,
        percentageAmount,
        finalTotal,
        hasPercentage: container.percentageEnabled || false
      };
      
      await ParseTable(container, true, totalInfo, {
        transferColumns: container.transferColumns || [],
        transferRows: container.transferData || []
      });
      toast.success(`Archivo compartido exitosamente.`);
    } catch (error) {
      console.error('Error al compartir archivo:', error);
      toast.error("Error al compartir archivo");
    } finally {
      setIsSharing(false);
    }
  };

  const handleDeletePDF = async () => {
    if (!container) return;
    
    try {
      const pdfName = `${container.title.replace(/\s+/g, '_')}_factura`;
      
      // Preparar el payload para eliminar PDF
      const payload = {
        name: pdfName
      };
      
      // Hacer fetch a la API para eliminar PDF
      const response = await fetch('https://pdfconvertor.hermesbackend.xyz/eliminate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      }
      
      toast.success(`PDF "${pdfName}" eliminado exitosamente del servidor`);
      console.log('PDF eliminado exitosamente del servidor');
      
    } catch (error) {
      console.error('Error al eliminar PDF:', error);
      toast.error("Error al eliminar PDF del servidor");
    }
  };

  if (!container) {
    return <div className="container p-6">Cargando...</div>
  }

  const dynamicColumns = createDynamicColumns(container.columns, editRow, deleteRow)

  return (
    <main className='container max-w-6xl mx-auto p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/menu')}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold">{container.title}</h1>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                handleGenerateHTML();
                handleShareFile();
              }}
              disabled={isGeneratingPDF}
            >
              <FileText className="h-4 w-4" />
              {isGeneratingPDF ? 'Generando PDF...' : 'Generar PDF'}
            </Button>
            </div>
            <p className="text-muted-foreground">{container.description}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Plantilla {container.template} • {container.data.length} filas • {container.columns.length} columnas
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddColumnDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Columna
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsTransferDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Transferencias
            </Button>
          </div>
        </div>

        {/* Data Table */}
        {container.columns.length > 0 ? (
          <DataTable
            columns={dynamicColumns}
            data={container.data}
            containerColumns={container.columns}
            onAddRow={addRow}
            showAddButton={true}
            container={container}
            onUpdateContainer={saveContainer}
          />
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">
              No hay columnas definidas aún
            </p>
            <Button onClick={() => setIsAddColumnDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Columna
            </Button>
          </div>
        )}

        {/* Column Management */}
        {container.columns.length > 0 && (
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Gestión de Columnas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {container.columns.map((column, index) => (
                <div key={column.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{column.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">({column.type})</span>
                      {column.type === 'number' && column.sum && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          SUMA
                        </span>
                      )}
                    </div>
                    {column.type === 'number' && (
                      <div className="flex items-center gap-2 mt-1">
                        <Checkbox
                          id={`sum-${column.id}`}
                          checked={column.sum || false}
                          onCheckedChange={() => toggleColumnSum(column.id)}
                        />
                        <Label htmlFor={`sum-${column.id}`} className="text-xs">
                          Sumar columna
                        </Label>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Botones para mover */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveColumn(column.id, 'up')}
                      disabled={index === 0}
                      className="p-1 h-8 w-8"
                      title="Mover hacia arriba"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveColumn(column.id, 'down')}
                      disabled={index === container.columns.length - 1}
                      className="p-1 h-8 w-8"
                      title="Mover hacia abajo"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    {/* Botón para editar nombre */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditColumn(column)}
                      className="p-1 h-8 w-8"
                      title="Editar nombre"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Botón para eliminar */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteColumn(column.id)}
                      className="text-destructive hover:text-destructive p-1 h-8 w-8"
                      title="Eliminar columna"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Column Dialog */}
        <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Columna</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="column-name">Nombre de la Columna</Label>
                <Input
                  id="column-name"
                  value={newColumn.name}
                  onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                  placeholder="Ingresa el nombre de la columna"
                />
              </div>
              <div>
                <Label htmlFor="column-type">Tipo de Dato</Label>
                <Select 
                  value={newColumn.type}
                  onValueChange={(value) => setNewColumn({ 
                    ...newColumn, 
                    type: value as 'text' | 'number',
                    sum: value === 'text' ? false : newColumn.sum
                  })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona el tipo de dato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newColumn.type === 'number' && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="column-sum"
                    checked={newColumn.sum}
                    onCheckedChange={(checked) => setNewColumn({ ...newColumn, sum: !!checked })}
                  />
                  <Label htmlFor="column-sum">
                    Sumar todos los valores de esta columna
                  </Label>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddColumnDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={addColumn}>
                Agregar Columna
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Row Dialog */}
        <Dialog open={isEditRowDialogOpen} onOpenChange={setIsEditRowDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Fila</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {container.columns.map((column) => (
                <div key={column.id}>
                  <Label htmlFor={`edit-${column.id}`}>
                    {column.name} ({column.type})
                  </Label>
                  <Input
                    id={`edit-${column.id}`}
                    type={column.type === 'number' ? 'number' : 'text'}
                    value={editingRowData[column.id] || ''}
                    onChange={(e) => handleEditRowChange(column.id, e.target.value)}
                    placeholder={`Ingresa ${column.type === 'number' ? 'un número' : 'texto'}`}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditRowDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveEditRow} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Transfer Dialog */}
        <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Gestión de Transferencias</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Transfer Table Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddTransferColumnDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Columna
                </Button>
              </div>

              {/* Transfer Table */}
              {(container.transferColumns || []).length > 0 ? (
                <DataTable
                  columns={createDynamicColumns(container.transferColumns || [], editTransferRow, deleteTransferRow)}
                  data={container.transferData || []}
                  containerColumns={container.transferColumns || []}
                  onAddRow={addTransferRow}
                  showAddButton={true}
                  container={{
                    ...container,
                    columns: container.transferColumns,
                    data: container.transferData,
                    percentageEnabled: false // Las transferencias no tienen porcentajes
                  }}
                  onUpdateContainer={(updatedContainer) => {
                    saveContainer({
                      ...container,
                      transferData: updatedContainer.data,
                      transferColumns: updatedContainer.columns
                    })
                  }}
                />
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground mb-4">
                    No hay columnas de transferencia definidas aún
                  </p>
                  <Button onClick={() => setIsAddTransferColumnDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Columna de Transferencia
                  </Button>
                </div>
              )}

              {/* Transfer Column Management */}
              {(container.transferColumns || []).length > 0 && (
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Gestión de Columnas de Transferencia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(container.transferColumns || []).map((column) => (
                      <div key={column.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{column.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{column.type}</p>
                          {column.type === 'number' && (
                            <div className="flex items-center gap-2 mt-1">
                              <Checkbox
                                id={`transfer-sum-${column.id}`}
                                checked={column.sum || false}
                                onCheckedChange={() => toggleTransferColumnSum(column.id)}
                              />
                              <Label htmlFor={`transfer-sum-${column.id}`} className="text-xs">
                                Sumar columna
                              </Label>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTransferColumn(column.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Transfer Column Dialog */}
        <Dialog open={isAddTransferColumnDialogOpen} onOpenChange={setIsAddTransferColumnDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Columna de Transferencia</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="transfer-column-name">Nombre de la Columna</Label>
                <Input
                  id="transfer-column-name"
                  value={newTransferColumn.name}
                  onChange={(e) => setNewTransferColumn({ ...newTransferColumn, name: e.target.value })}
                  placeholder="Ej: Banco, Monto, Fecha"
                />
              </div>
              <div>
                <Label htmlFor="transfer-column-type">Tipo de Dato</Label>
                <Select 
                  value={newTransferColumn.type}
                  onValueChange={(value) => setNewTransferColumn({ 
                    ...newTransferColumn, 
                    type: value as 'text' | 'number',
                    sum: value === 'text' ? false : newTransferColumn.sum
                  })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona el tipo de dato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newTransferColumn.type === 'number' && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="transfer-column-sum"
                    checked={newTransferColumn.sum}
                    onCheckedChange={(checked) => setNewTransferColumn({ ...newTransferColumn, sum: !!checked })}
                  />
                  <Label htmlFor="transfer-column-sum">
                    Sumar todos los valores de esta columna
                  </Label>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTransferColumnDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={addTransferColumn}>
                Agregar Columna
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Transfer Row Dialog */}
        <Dialog open={isEditTransferRowDialogOpen} onOpenChange={setIsEditTransferRowDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Fila de Transferencia</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(container.transferColumns || []).map((column) => (
                <div key={column.id}>
                  <Label htmlFor={`edit-transfer-${column.id}`}>
                    {column.name} ({column.type})
                  </Label>
                  <Input
                    id={`edit-transfer-${column.id}`}
                    type={column.type === 'number' ? 'number' : 'text'}
                    value={editingTransferRowData[column.id] || ''}
                    onChange={(e) => handleEditTransferRowChange(column.id, e.target.value)}
                    placeholder={`Ingresa ${column.type === 'number' ? 'un número' : 'texto'}`}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditTransferRowDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveEditTransferRow} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Column Dialog */}
        <Dialog open={isEditColumnDialogOpen} onOpenChange={setIsEditColumnDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Nombre de Columna</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-column-name">Nombre de la Columna</Label>
                <Input
                  id="edit-column-name"
                  value={editingColumnName}
                  onChange={(e) => setEditingColumnName(e.target.value)}
                  placeholder="Ingresa el nuevo nombre"
                />
              </div>
              {editingColumn && (
                <div className="text-sm text-muted-foreground">
                  <p>Tipo: <span className="capitalize">{editingColumn.type}</span></p>
                  {editingColumn.type === 'number' && editingColumn.sum && (
                    <p>Esta columna está configurada para sumarse</p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditColumnDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveEditColumn} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </main>
  )
}

export default Editor
