import { createDynamicColumns, DynamicRow } from '@/components/Table/columns'
import { DataTable } from '@/components/Table/data-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Container, Column } from '@/pages/Menu'
import { ParseTable, shareInvoiceFile } from '@/lib/parse'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Plus, Trash2, ArrowLeft, Save, FileText } from 'lucide-react'
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

  const handleGenerateHTML = async () => {
    if (!container) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const htmlString = await ParseTable(container);
      console.log('HTML generado:', htmlString);
      
      // Preparar el payload para la API
      const payload = {
        name: `${container.title.replace(/\s+/g, '_')}_factura`,
        content: htmlString,
        template: container.template
      };
      
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
      toast.success("Factura generada y descargada exitosamente");
      console.log('PDF generado y descargado exitosamente');
      await handleDeletePDF()
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error("Error al generar PDF. Se descargó HTML como alternativa.");
      
      // Fallback: descargar HTML si falla la API
      const htmlString = await ParseTable(container);
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
      const htmlString = await ParseTable(container);
      await shareInvoiceFile(container, htmlString);
      toast.success("Archivo compartido exitosamente");
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
            {/* <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleDeletePDF}
              disabled={isDeletingPDF}
            >
              <Trash className="h-4 w-4" />
              {isDeletingPDF ? 'Eliminando PDF...' : 'Eliminar PDF'}
            </Button> */}
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
              {container.columns.map((column) => (
                <div key={column.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{column.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{column.type}</p>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteColumn(column.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
      </motion.div>
    </main>
  )
}

export default Editor
