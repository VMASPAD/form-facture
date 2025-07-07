import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogDescription } from '@radix-ui/react-dialog'
import Templates from '@/components/Templates'

export interface Container {
  id: string;
  title: string;
  description: string;
  template: number;
  data: any[];
  columns: Column[];
  createdAt: string;
  // Nuevas propiedades
  email?: string;
  phone?: string;
  textField?: string;
  image?: string; // Base64 string
  // Configuración de porcentajes
  percentageEnabled?: boolean;
  percentageValue?: number;
}

export interface Column {
  id: string;
  name: string;
  type: 'text' | 'number';
  sum?: boolean;
}

function Menu() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditPropertiesDialogOpen, setIsEditPropertiesDialogOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newContainer, setNewContainer] = useState({
    title: '',
    description: '',
    template: 1,
    email: '',
    phone: '',
    textField: '',
    image: ''
  });
  const [containerProperties, setContainerProperties] = useState({
    title: '',
    description: '',
    template: 1,
    email: '',
    phone: '',
    textField: '',
    image: ''
  });

  // Load containers from localStorage on component mount
  useEffect(() => {
    const savedContainers = localStorage.getItem('formFactureContainers');
    if (savedContainers) {
      try {
        const parsedContainers = JSON.parse(savedContainers);
        setContainers(parsedContainers);
      } catch (error) {
        console.error('Error parsing containers from localStorage:', error);
        setContainers([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save containers to localStorage whenever containers change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('formFactureContainers', JSON.stringify(containers));
    }
  }, [containers, isLoaded]);

  const createContainer = () => {
    if (newContainer.title.trim() === '') return;

    const container: Container = {
      id: Date.now().toString(),
      title: newContainer.title,
      description: newContainer.description,
      template: newContainer.template,
      data: [],
      columns: [],
      createdAt: new Date().toISOString(),
      email: newContainer.email,
      phone: newContainer.phone,
      textField: newContainer.textField,
      image: newContainer.image,
      percentageEnabled: false,
      percentageValue: 21
    };

    setContainers([...containers, container]);
    setNewContainer({ title: '', description: '', template: 1, email: '', phone: '', textField: '', image: '' });
    setIsCreateDialogOpen(false);
  };

  const deleteContainer = (id: string) => {
    setContainers(containers.filter(container => container.id !== id));
  };

  const openEditProperties = (container: Container) => {
    setEditingContainer(container);
    setContainerProperties({
      title: container.title || '',
      description: container.description || '',
      template: container.template || 1,
      email: container.email || '',
      phone: container.phone || '',
      textField: container.textField || '',
      image: container.image || ''
    });
    setIsEditPropertiesDialogOpen(true);
  };

  const saveContainerProperties = () => {
    if (!editingContainer) return;

    const updatedContainers = containers.map(container =>
      container.id === editingContainer.id
        ? { ...container, ...containerProperties }
        : container
    );

    setContainers(updatedContainers);
    setIsEditPropertiesDialogOpen(false);
    setEditingContainer(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isCreating: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        if (isCreating) {
          setNewContainer({ ...newContainer, image: base64String });
        } else {
          setContainerProperties({ ...containerProperties, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredContainers = containers.filter(container =>
    container.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className='container max-w-4xl mx-auto p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mis Facturas</h1>
            <p className="text-muted-foreground">Gestiona tus tablas y datos</p>
          </div>
<div className='flex flex-row gap-2'>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Contenedor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Contenedor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newContainer.title}
                    onChange={(e) => setNewContainer({ ...newContainer, title: e.target.value })}
                    placeholder="Ingresa el título"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={newContainer.description}
                    onChange={(e) => setNewContainer({ ...newContainer, description: e.target.value })}
                    placeholder="Describe tu contenedor"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContainer.email}
                    onChange={(e) => setNewContainer({ ...newContainer, email: e.target.value })}
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Número de Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newContainer.phone}
                    onChange={(e) => setNewContainer({ ...newContainer, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <Label htmlFor="textField">Campo de Texto</Label>
                  <Input
                    id="textField"
                    value={newContainer.textField}
                    onChange={(e) => setNewContainer({ ...newContainer, textField: e.target.value })}
                    placeholder="Texto adicional"
                  />
                </div>
                <div>
                  <Label htmlFor="image">Imagen</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="cursor-pointer"
                  />
                  {newContainer.image && (
                    <div className="mt-2">
                      <img
                        src={newContainer.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="template">Plantilla</Label>
                  <Select
                    value={newContainer.template.toString()}
                    onValueChange={(value) => setNewContainer({ ...newContainer, template: parseInt(value) })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una plantilla" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Plantilla Básica</SelectItem>
                      <SelectItem value="2">Plantilla Financiera</SelectItem>
                      <SelectItem value="3">Plantilla Inventario</SelectItem>
                      <SelectItem value="4">Azul Corporativo</SelectItem>
                      <SelectItem value="5">Verde Suave</SelectItem>
                      <SelectItem value="6">Gris Elegante</SelectItem>
                      <SelectItem value="7">Púrpura Moderno</SelectItem>
                      <SelectItem value="8">Naranja Suave</SelectItem>
                      <SelectItem value="9">Rosa Profesional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={createContainer}>
                  Crear Contenedor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ver plantillas
              </Button></DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Plantillas disponibles</DialogTitle>
                <DialogDescription>
                  Explora nuestras plantillas de diseño profesional para tus facturas
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Templates />
              </div>
            </DialogContent>
          </Dialog>
        </div>
</div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar contenedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Containers Grid */}
        <AnimatePresence>
          {filteredContainers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">
                {searchTerm ? 'No se encontraron contenedores' : 'No hay contenedores aún'}
              </p>
              {!searchTerm && (
                <p className="text-sm text-muted-foreground mt-2">
                  Crea tu primer contenedor para comenzar
                </p>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContainers.map((container, index) => (
                <motion.div
                  key={container.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-card border border-border/50 p-4 rounded-lg hover:border-border transition-colors"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{container.title}</h3>
                      <p className="text-sm text-muted-foreground">{container.description}</p>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Plantilla {container.template}</span>
                        <span>{container.data.length} filas</span>
                      </div>
                      <div>
                        <span>Creado: {new Date(container.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                      {container.email && (
                        <div>
                          <span>Email: {container.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/editor?id=${container.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditProperties(container)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-3 w-3" />
                        Props
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2 bg-red-500">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Seguro que queres eliminar el contenedor?</DialogTitle>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteContainer(container.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              Eliminar contenedor
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Edit Properties Dialog */}
        <Dialog open={isEditPropertiesDialogOpen} onOpenChange={setIsEditPropertiesDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Propiedades del Contenedor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={containerProperties.title}
                  onChange={(e) => setContainerProperties({ ...containerProperties, title: e.target.value })}
                  placeholder="Título del contenedor"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descripción</Label>
                <Input
                  id="edit-description"
                  value={containerProperties.description}
                  onChange={(e) => setContainerProperties({ ...containerProperties, description: e.target.value })}
                  placeholder="Descripción del contenedor"
                />
              </div>
              <div>
                <Label htmlFor="edit-template">Plantilla</Label>
                <Select
                  value={containerProperties.template.toString()}
                  onValueChange={(value) => setContainerProperties({ ...containerProperties, template: parseInt(value) })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Plantilla Básica</SelectItem>
                    <SelectItem value="2">Plantilla Financiera</SelectItem>
                    <SelectItem value="3">Plantilla Inventario</SelectItem>
                    <SelectItem value="4">Azul Corporativo</SelectItem>
                    <SelectItem value="5">Verde Suave</SelectItem>
                    <SelectItem value="6">Gris Elegante</SelectItem>
                    <SelectItem value="7">Púrpura Moderno</SelectItem>
                    <SelectItem value="8">Naranja Suave</SelectItem>
                    <SelectItem value="9">Rosa Profesional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={containerProperties.email}
                  onChange={(e) => setContainerProperties({ ...containerProperties, email: e.target.value })}
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Número de Teléfono</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={containerProperties.phone}
                  onChange={(e) => setContainerProperties({ ...containerProperties, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <Label htmlFor="edit-textField">Campo de Texto</Label>
                <Input
                  id="edit-textField"
                  value={containerProperties.textField}
                  onChange={(e) => setContainerProperties({ ...containerProperties, textField: e.target.value })}
                  placeholder="Texto adicional"
                />
              </div>
              <div>
                <Label htmlFor="edit-image">Imagen</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  className="cursor-pointer"
                />
                {containerProperties.image && (
                  <div className="mt-2">
                    <img
                      src={containerProperties.image}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
              {editingContainer && (
                <div>
                  <Label>Fecha de Creación</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(editingContainer.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditPropertiesDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveContainerProperties}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </main>
  )
}

export default Menu