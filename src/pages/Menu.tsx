import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'

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
  // Información de pago
  paymentAccount?: string;
  paymentCuit?: string;
  paymentCbu?: string;
  paymentAlias?: string;
  // Datos de transferencias
  transferData?: any[];
  transferColumns?: Column[];
  // Datos del Cliente
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientDocument?: string;
  clientTaxId?: string;
  // Datos de la Empresa
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyTaxId?: string;
  companyWebsite?: string;
  companyLogo?: string; // Base64 string
}

export interface Column {
  id: string;
  name: string;
  type: 'text' | 'number';
  sum?: boolean;
}

export interface CompanyTemplate {
  id: string;
  name: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyTaxId: string;
  companyWebsite: string;
  companyLogo?: string;
  createdAt: string;
}

export interface PaymentTemplate {
  id: string;
  name: string;
  paymentAccount: string;
  paymentCuit: string;
  paymentCbu: string;
  paymentAlias: string;
  createdAt: string;
}

function Menu() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditPropertiesDialogOpen, setIsEditPropertiesDialogOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Estados para templates
  const [companyTemplates, setCompanyTemplates] = useState<CompanyTemplate[]>([]);
  const [paymentTemplates, setPaymentTemplates] = useState<PaymentTemplate[]>([]);
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false);
  const [isCreateCompanyTemplateDialogOpen, setIsCreateCompanyTemplateDialogOpen] = useState(false);
  const [isCreatePaymentTemplateDialogOpen, setIsCreatePaymentTemplateDialogOpen] = useState(false);
  const [selectedCompanyTemplate, setSelectedCompanyTemplate] = useState<string>('none');
  const [selectedPaymentTemplate, setSelectedPaymentTemplate] = useState<string>('none');
  
  const [newCompanyTemplate, setNewCompanyTemplate] = useState({
    name: '',
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyTaxId: '',
    companyWebsite: '',
    companyLogo: ''
  });
  
  const [newPaymentTemplate, setNewPaymentTemplate] = useState({
    name: '',
    paymentAccount: '',
    paymentCuit: '',
    paymentCbu: '',
    paymentAlias: ''
  });
  const [newContainer, setNewContainer] = useState({
    title: '',
    description: '',
    template: 1,
    email: '',
    phone: '',
    textField: '',
    image: '',
    paymentAccount: '',
    paymentCuit: '',
    paymentCbu: '',
    paymentAlias: '',
    // Datos del Cliente
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientDocument: '',
    clientTaxId: '',
    // Datos de la Empresa
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyTaxId: '',
    companyWebsite: '',
    companyLogo: ''
  });
  const [containerProperties, setContainerProperties] = useState({
    title: '',
    description: '',
    template: 14,
    email: '',
    phone: '',
    textField: '',
    image: '',
    paymentAccount: '',
    paymentCuit: '',
    paymentCbu: '',
    paymentAlias: '',
    // Datos del Cliente
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientDocument: '',
    clientTaxId: '',
    // Datos de la Empresa
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyTaxId: '',
    companyWebsite: '',
    companyLogo: ''
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
    
    // Cargar templates
    const savedCompanyTemplates = localStorage.getItem('formFactureCompanyTemplates');
    if (savedCompanyTemplates) {
      try {
        const parsedCompanyTemplates = JSON.parse(savedCompanyTemplates);
        setCompanyTemplates(parsedCompanyTemplates);
      } catch (error) {
        console.error('Error parsing company templates from localStorage:', error);
        setCompanyTemplates([]);
      }
    }
    
    const savedPaymentTemplates = localStorage.getItem('formFacturePaymentTemplates');
    if (savedPaymentTemplates) {
      try {
        const parsedPaymentTemplates = JSON.parse(savedPaymentTemplates);
        setPaymentTemplates(parsedPaymentTemplates);
      } catch (error) {
        console.error('Error parsing payment templates from localStorage:', error);
        setPaymentTemplates([]);
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

  // Save templates to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('formFactureCompanyTemplates', JSON.stringify(companyTemplates));
    }
  }, [companyTemplates, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('formFacturePaymentTemplates', JSON.stringify(paymentTemplates));
    }
  }, [paymentTemplates, isLoaded]);

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
      percentageValue: 21,
      paymentAccount: newContainer.paymentAccount,
      paymentCuit: newContainer.paymentCuit,
      paymentCbu: newContainer.paymentCbu,
      paymentAlias: newContainer.paymentAlias,
      transferData: [],
      transferColumns: [],
      // Datos del Cliente
      clientName: newContainer.clientName,
      clientEmail: newContainer.clientEmail,
      clientPhone: newContainer.clientPhone,
      clientAddress: newContainer.clientAddress,
      clientDocument: newContainer.clientDocument,
      clientTaxId: newContainer.clientTaxId,
      // Datos de la Empresa
      companyName: newContainer.companyName,
      companyEmail: newContainer.companyEmail,
      companyPhone: newContainer.companyPhone,
      companyAddress: newContainer.companyAddress,
      companyTaxId: newContainer.companyTaxId,
      companyWebsite: newContainer.companyWebsite,
      companyLogo: newContainer.companyLogo
    };

    setContainers([...containers, container]);
    setNewContainer({ 
      title: '', 
      description: '', 
      template: 1, 
      email: '', 
      phone: '', 
      textField: '', 
      image: '',
      paymentAccount: '',
      paymentCuit: '',
      paymentCbu: '',
      paymentAlias: '',
      // Datos del Cliente
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      clientDocument: '',
      clientTaxId: '',
      // Datos de la Empresa
      companyName: '',
      companyEmail: '',
      companyPhone: '',
      companyAddress: '',
      companyTaxId: '',
      companyWebsite: '',
      companyLogo: ''
    });
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
      image: container.image || '',
      paymentAccount: container.paymentAccount || '',
      paymentCuit: container.paymentCuit || '',
      paymentCbu: container.paymentCbu || '',
      paymentAlias: container.paymentAlias || '',
      // Datos del Cliente
      clientName: container.clientName || '',
      clientEmail: container.clientEmail || '',
      clientPhone: container.clientPhone || '',
      clientAddress: container.clientAddress || '',
      clientDocument: container.clientDocument || '',
      clientTaxId: container.clientTaxId || '',
      // Datos de la Empresa
      companyName: container.companyName || '',
      companyEmail: container.companyEmail || '',
      companyPhone: container.companyPhone || '',
      companyAddress: container.companyAddress || '',
      companyTaxId: container.companyTaxId || '',
      companyWebsite: container.companyWebsite || '',
      companyLogo: container.companyLogo || ''
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

  const handleCompanyLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setNewContainer({ ...newContainer, companyLogo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  // Funciones para Company Templates
  const createCompanyTemplate = () => {
    if (newCompanyTemplate.name.trim() === '') return;

    const template: CompanyTemplate = {
      id: Date.now().toString(),
      name: newCompanyTemplate.name,
      companyName: newCompanyTemplate.companyName,
      companyEmail: newCompanyTemplate.companyEmail,
      companyPhone: newCompanyTemplate.companyPhone,
      companyAddress: newCompanyTemplate.companyAddress,
      companyTaxId: newCompanyTemplate.companyTaxId,
      companyWebsite: newCompanyTemplate.companyWebsite,
      companyLogo: newCompanyTemplate.companyLogo,
      createdAt: new Date().toISOString()
    };

    setCompanyTemplates([...companyTemplates, template]);
    setNewCompanyTemplate({
      name: '',
      companyName: '',
      companyEmail: '',
      companyPhone: '',
      companyAddress: '',
      companyTaxId: '',
      companyWebsite: '',
      companyLogo: ''
    });
    setIsCreateCompanyTemplateDialogOpen(false);
  };

  const deleteCompanyTemplate = (id: string) => {
    setCompanyTemplates(companyTemplates.filter(template => template.id !== id));
  };

  const loadCompanyTemplate = (templateId: string) => {
    const template = companyTemplates.find(t => t.id === templateId);
    if (template) {
      setNewContainer({
        ...newContainer,
        companyName: template.companyName,
        companyEmail: template.companyEmail,
        companyPhone: template.companyPhone,
        companyAddress: template.companyAddress,
        companyTaxId: template.companyTaxId,
        companyWebsite: template.companyWebsite,
        companyLogo: template.companyLogo || ''
      });
    }
  };

  // Funciones para Payment Templates
  const createPaymentTemplate = () => {
    if (newPaymentTemplate.name.trim() === '') return;

    const template: PaymentTemplate = {
      id: Date.now().toString(),
      name: newPaymentTemplate.name,
      paymentAccount: newPaymentTemplate.paymentAccount,
      paymentCuit: newPaymentTemplate.paymentCuit,
      paymentCbu: newPaymentTemplate.paymentCbu,
      paymentAlias: newPaymentTemplate.paymentAlias,
      createdAt: new Date().toISOString()
    };

    setPaymentTemplates([...paymentTemplates, template]);
    setNewPaymentTemplate({
      name: '',
      paymentAccount: '',
      paymentCuit: '',
      paymentCbu: '',
      paymentAlias: ''
    });
    setIsCreatePaymentTemplateDialogOpen(false);
  };

  const deletePaymentTemplate = (id: string) => {
    setPaymentTemplates(paymentTemplates.filter(template => template.id !== id));
  };

  const loadPaymentTemplate = (templateId: string) => {
    const template = paymentTemplates.find(t => t.id === templateId);
    if (template) {
      setNewContainer({
        ...newContainer,
        paymentAccount: template.paymentAccount,
        paymentCuit: template.paymentCuit,
        paymentCbu: template.paymentCbu,
        paymentAlias: template.paymentAlias
      });
    }
  };

  const handleCompanyTemplateLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setNewCompanyTemplate({ ...newCompanyTemplate, companyLogo: base64String });
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
                Nueva Factura
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Factura</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Información General */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título de la Factura</Label>
                      <Input
                        id="title"
                        value={newContainer.title}
                        onChange={(e) => setNewContainer({ ...newContainer, title: e.target.value })}
                        placeholder="Ej: Factura de Servicios"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Información Adicional</Label>
                      <Input
                        id="description"
                        value={newContainer.description}
                        onChange={(e) => setNewContainer({ ...newContainer, description: e.target.value })}
                        placeholder="Información Adicional de la factura"
                      />
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
                          <SelectItem value="1">Clasico</SelectItem>
                          <SelectItem value="2">CyberPunk</SelectItem>
                          <SelectItem value="3">Artistico</SelectItem>
                          <SelectItem value="4">Minimalista</SelectItem>
                          <SelectItem value="5">Gotico</SelectItem>
                          <SelectItem value="6">SCIFI</SelectItem>
                          <SelectItem value="7">PlayFul</SelectItem>
                          <SelectItem value="8">Rustico</SelectItem>
                          <SelectItem value="9">Formal</SelectItem>
                          <SelectItem value="10">Futurista</SelectItem>
                          <SelectItem value="11">Formal Colorido</SelectItem>
                          <SelectItem value="12">Formal Gris</SelectItem>
                          <SelectItem value="13">Formal Rojo</SelectItem>
                          <SelectItem value="14">Formal Celeste</SelectItem>
                          <SelectItem value="15">Formal Azul</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Datos del Cliente */}
                <Card>
                  <CardHeader>
                    <CardTitle>Datos del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientName">Nombre del Cliente</Label>
                        <Input
                          id="clientName"
                          value={newContainer.clientName}
                          onChange={(e) => setNewContainer({ ...newContainer, clientName: e.target.value })}
                          placeholder="Nombre completo o razón social"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientEmail">Email del Cliente</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={newContainer.clientEmail}
                          onChange={(e) => setNewContainer({ ...newContainer, clientEmail: e.target.value })}
                          placeholder="cliente@ejemplo.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientPhone">Teléfono del Cliente</Label>
                        <Input
                          id="clientPhone"
                          type="tel"
                          value={newContainer.clientPhone}
                          onChange={(e) => setNewContainer({ ...newContainer, clientPhone: e.target.value })}
                          placeholder="+1 234 567 890"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientDocument">Documento/DNI</Label>
                        <Input
                          id="clientDocument"
                          value={newContainer.clientDocument}
                          onChange={(e) => setNewContainer({ ...newContainer, clientDocument: e.target.value })}
                          placeholder="12345678"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="clientAddress">Dirección del Cliente</Label>
                        <Input
                          id="clientAddress"
                          value={newContainer.clientAddress}
                          onChange={(e) => setNewContainer({ ...newContainer, clientAddress: e.target.value })}
                          placeholder="Dirección completa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientTaxId">CUIT/RUC/Tax ID</Label>
                        <Input
                          id="clientTaxId"
                          value={newContainer.clientTaxId}
                          onChange={(e) => setNewContainer({ ...newContainer, clientTaxId: e.target.value })}
                          placeholder="20-12345678-9"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Datos de la Empresa */}
                <Card>
                  <CardHeader>
                    <CardTitle>Datos de la Empresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {companyTemplates.length > 0 && (
                      <div>
                        <Label htmlFor="companyTemplate">Cargar Template de Empresa</Label>
                        <Select 
                          value={selectedCompanyTemplate}
                          onValueChange={(value) => {
                            setSelectedCompanyTemplate(value);
                            if (value && value !== "none") {
                              loadCompanyTemplate(value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un template..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sin template</SelectItem>
                            {companyTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Nombre de la Empresa</Label>
                        <Input
                          id="companyName"
                          value={newContainer.companyName}
                          onChange={(e) => setNewContainer({ ...newContainer, companyName: e.target.value })}
                          placeholder="Mi Empresa S.A."
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyEmail">Email de la Empresa</Label>
                        <Input
                          id="companyEmail"
                          type="email"
                          value={newContainer.companyEmail}
                          onChange={(e) => setNewContainer({ ...newContainer, companyEmail: e.target.value })}
                          placeholder="contacto@miempresa.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyPhone">Teléfono de la Empresa</Label>
                        <Input
                          id="companyPhone"
                          type="tel"
                          value={newContainer.companyPhone}
                          onChange={(e) => setNewContainer({ ...newContainer, companyPhone: e.target.value })}
                          placeholder="+1 234 567 890"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyTaxId">CUIT/RUC de la Empresa</Label>
                        <Input
                          id="companyTaxId"
                          value={newContainer.companyTaxId}
                          onChange={(e) => setNewContainer({ ...newContainer, companyTaxId: e.target.value })}
                          placeholder="30-12345678-9"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="companyAddress">Dirección de la Empresa</Label>
                        <Input
                          id="companyAddress"
                          value={newContainer.companyAddress}
                          onChange={(e) => setNewContainer({ ...newContainer, companyAddress: e.target.value })}
                          placeholder="Dirección de la empresa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyWebsite">Sitio Web</Label>
                        <Input
                          id="companyWebsite"
                          value={newContainer.companyWebsite}
                          onChange={(e) => setNewContainer({ ...newContainer, companyWebsite: e.target.value })}
                          placeholder="https://miempresa.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyLogo">Logo de la Empresa</Label>
                        <Input
                          id="companyLogo"
                          type="file"
                          accept="image/*"
                          onChange={handleCompanyLogoUpload}
                          className="cursor-pointer"
                        />
                        {newContainer.companyLogo && (
                          <div className="mt-2">
                            <img
                              src={newContainer.companyLogo}
                              alt="Logo Preview"
                              className="w-20 h-20 object-cover rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Métodos de Pago */}
                <Card>
                  <CardHeader>
                    <CardTitle>Métodos de Pago</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paymentTemplates.length > 0 && (
                      <div>
                        <Label htmlFor="paymentTemplate">Cargar Template de Pago</Label>
                        <Select 
                          value={selectedPaymentTemplate}
                          onValueChange={(value) => {
                            setSelectedPaymentTemplate(value);
                            if (value && value !== "none") {
                              loadPaymentTemplate(value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un template..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sin template</SelectItem>
                            {paymentTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paymentAccount">Número de Cuenta</Label>
                        <Input
                          id="paymentAccount"
                          value={newContainer.paymentAccount}
                          onChange={(e) => setNewContainer({ ...newContainer, paymentAccount: e.target.value })}
                          placeholder="058-214570/7"
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentCuit">CUIT/CUIL</Label>
                        <Input
                          id="paymentCuit"
                          value={newContainer.paymentCuit}
                          onChange={(e) => setNewContainer({ ...newContainer, paymentCuit: e.target.value })}
                          placeholder="23317324830"
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentCbu">CBU</Label>
                        <Input
                          id="paymentCbu"
                          value={newContainer.paymentCbu}
                          onChange={(e) => setNewContainer({ ...newContainer, paymentCbu: e.target.value })}
                          placeholder="0720058880000214570721"
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentAlias">Alias</Label>
                        <Input
                          id="paymentAlias"
                          value={newContainer.paymentAlias}
                          onChange={(e) => setNewContainer({ ...newContainer, paymentAlias: e.target.value })}
                          placeholder="EMPRESA.NOMBRE"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={createContainer}>
                  Crear Factura
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
          
          <Dialog open={isTemplatesDialogOpen} onOpenChange={setIsTemplatesDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Gestionar Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Gestión de Templates</DialogTitle>
                <DialogDescription>
                  Crea y gestiona templates para datos de empresa y métodos de pago
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Company Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Templates de Empresa
                      <Button 
                        onClick={() => setIsCreateCompanyTemplateDialogOpen(true)}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Nuevo
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {companyTemplates.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No hay templates de empresa creados aún
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {companyTemplates.map((template) => (
                          <div key={template.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{template.name}</h4>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteCompanyTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p><strong>Empresa:</strong> {template.companyName}</p>
                              <p><strong>Email:</strong> {template.companyEmail}</p>
                              <p><strong>Teléfono:</strong> {template.companyPhone}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Templates de Pago
                      <Button 
                        onClick={() => setIsCreatePaymentTemplateDialogOpen(true)}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Nuevo
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paymentTemplates.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No hay templates de pago creados aún
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paymentTemplates.map((template) => (
                          <div key={template.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{template.name}</h4>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deletePaymentTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p><strong>Cuenta:</strong> {template.paymentAccount}</p>
                              <p><strong>CUIT:</strong> {template.paymentCuit}</p>
                              <p><strong>Alias:</strong> {template.paymentAlias}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTemplatesDialogOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
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
                  Crea tu primera factura para comenzar
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
                          Ver
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditProperties(container)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-3 w-3" />
                        Editar
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
                              Eliminar Factura
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
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Propiedades de la Factura</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Información General */}
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Título de la Factura</Label>
                    <Input
                      id="edit-title"
                      value={containerProperties.title}
                      onChange={(e) => setContainerProperties({ ...containerProperties, title: e.target.value })}
                      placeholder="Ej: Factura de Servicios"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Información Adicional</Label>
                    <Textarea
                      id="edit-description"
                      value={containerProperties.description}
                      onChange={(e) => setContainerProperties({ ...containerProperties, description: e.target.value })}
                      placeholder="Información Adicional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-template">Plantilla de Diseño</Label>
                    <Select
                      value={containerProperties.template.toString()}
                      onValueChange={(value) => setContainerProperties({ ...containerProperties, template: parseInt(value) })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una plantilla" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Clasico</SelectItem>
                        <SelectItem value="2">CyberPunk</SelectItem>
                        <SelectItem value="3">Artistico</SelectItem>
                        <SelectItem value="4">Minimalista</SelectItem>
                        <SelectItem value="5">Gotico</SelectItem>
                        <SelectItem value="6">SCIFI</SelectItem>
                        <SelectItem value="7">PlayFul</SelectItem>
                        <SelectItem value="8">Rustico</SelectItem>
                        <SelectItem value="9">Formal</SelectItem>
                        <SelectItem value="10">Futurista</SelectItem>
                        <SelectItem value="11">Formal Colorido</SelectItem>
                        <SelectItem value="12">Formal Gris</SelectItem>
                        <SelectItem value="13">Formal Rojo</SelectItem>
                        <SelectItem value="14">Formal Celeste</SelectItem>
                        <SelectItem value="15">Formal Azul</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {editingContainer && (
                    <div>
                      <Label>Fecha de Creación</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(editingContainer.createdAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Datos del Cliente */}
              <Card>
                <CardHeader>
                  <CardTitle>Datos del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyTemplates.length > 0 && (
                    <div>
                      <Label htmlFor="edit-clientTemplate">Cargar Template de Cliente</Label>
                      <Select 
                        value="none"
                        onValueChange={(value) => {
                          if (value && value !== "none") {
                            const template = companyTemplates.find(t => t.id === value);
                            if (template) {
                              setContainerProperties({
                                ...containerProperties,
                                clientName: template.companyName,
                                clientEmail: template.companyEmail,
                                clientPhone: template.companyPhone,
                                clientAddress: template.companyAddress,
                                clientTaxId: template.companyTaxId
                              });
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un template..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin template</SelectItem>
                          {companyTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-clientName">Nombre del Cliente</Label>
                      <Input
                        id="edit-clientName"
                        value={containerProperties.clientName || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, clientName: e.target.value })}
                        placeholder="Nombre completo o razón social"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-clientEmail">Email del Cliente</Label>
                      <Input
                        id="edit-clientEmail"
                        type="email"
                        value={containerProperties.clientEmail || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, clientEmail: e.target.value })}
                        placeholder="cliente@ejemplo.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-clientPhone">Teléfono del Cliente</Label>
                      <Input
                        id="edit-clientPhone"
                        type="tel"
                        value={containerProperties.clientPhone || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, clientPhone: e.target.value })}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-clientDocument">Documento/DNI</Label>
                      <Input
                        id="edit-clientDocument"
                        value={containerProperties.clientDocument || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, clientDocument: e.target.value })}
                        placeholder="12345678"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="edit-clientAddress">Dirección del Cliente</Label>
                      <Input
                        id="edit-clientAddress"
                        value={containerProperties.clientAddress || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, clientAddress: e.target.value })}
                        placeholder="Dirección completa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-clientTaxId">CUIT/RUC/Tax ID</Label>
                      <Input
                        id="edit-clientTaxId"
                        value={containerProperties.clientTaxId || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, clientTaxId: e.target.value })}
                        placeholder="20-12345678-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Datos de la Empresa */}
              <Card>
                <CardHeader>
                  <CardTitle>Datos de la Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyTemplates.length > 0 && (
                    <div>
                      <Label htmlFor="edit-companyTemplate">Cargar Template de Empresa</Label>
                      <Select 
                        value="none"
                        onValueChange={(value) => {
                          if (value && value !== "none") {
                            const template = companyTemplates.find(t => t.id === value);
                            if (template) {
                              setContainerProperties({
                                ...containerProperties,
                                companyName: template.companyName,
                                companyEmail: template.companyEmail,
                                companyPhone: template.companyPhone,
                                companyAddress: template.companyAddress,
                                companyTaxId: template.companyTaxId,
                                companyWebsite: template.companyWebsite,
                                companyLogo: template.companyLogo || ''
                              });
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un template..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin template</SelectItem>
                          {companyTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-companyName">Nombre de la Empresa</Label>
                      <Input
                        id="edit-companyName"
                        value={containerProperties.companyName || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, companyName: e.target.value })}
                        placeholder="Mi Empresa S.A."
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-companyEmail">Email de la Empresa</Label>
                      <Input
                        id="edit-companyEmail"
                        type="email"
                        value={containerProperties.companyEmail || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, companyEmail: e.target.value })}
                        placeholder="contacto@miempresa.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-companyPhone">Teléfono de la Empresa</Label>
                      <Input
                        id="edit-companyPhone"
                        type="tel"
                        value={containerProperties.companyPhone || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, companyPhone: e.target.value })}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-companyTaxId">CUIT/RUC de la Empresa</Label>
                      <Input
                        id="edit-companyTaxId"
                        value={containerProperties.companyTaxId || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, companyTaxId: e.target.value })}
                        placeholder="30-12345678-9"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="edit-companyAddress">Dirección de la Empresa</Label>
                      <Input
                        id="edit-companyAddress"
                        value={containerProperties.companyAddress || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, companyAddress: e.target.value })}
                        placeholder="Dirección de la empresa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-companyWebsite">Sitio Web</Label>
                      <Input
                        id="edit-companyWebsite"
                        value={containerProperties.companyWebsite || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, companyWebsite: e.target.value })}
                        placeholder="https://miempresa.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-companyLogo">Logo de la Empresa</Label>
                      <Input
                        id="edit-companyLogo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64String = event.target?.result as string;
                              setContainerProperties({ ...containerProperties, companyLogo: base64String });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="cursor-pointer"
                      />
                      {containerProperties.companyLogo && (
                        <div className="mt-2">
                          <img
                            src={containerProperties.companyLogo}
                            alt="Logo Preview"
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métodos de Pago */}
              <Card>
                <CardHeader>
                  <CardTitle>Métodos de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentTemplates.length > 0 && (
                    <div>
                      <Label htmlFor="edit-paymentTemplate">Cargar Template de Pago</Label>
                      <Select 
                        value="none"
                        onValueChange={(value) => {
                          if (value && value !== "none") {
                            const template = paymentTemplates.find(t => t.id === value);
                            if (template) {
                              setContainerProperties({
                                ...containerProperties,
                                paymentAccount: template.paymentAccount,
                                paymentCuit: template.paymentCuit,
                                paymentCbu: template.paymentCbu,
                                paymentAlias: template.paymentAlias
                              });
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un template..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin template</SelectItem>
                          {paymentTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-paymentAccount">Número de Cuenta</Label>
                      <Input
                        id="edit-paymentAccount"
                        value={containerProperties.paymentAccount || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, paymentAccount: e.target.value })}
                        placeholder="058-214570/7"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-paymentCuit">CUIT/CUIL</Label>
                      <Input
                        id="edit-paymentCuit"
                        value={containerProperties.paymentCuit || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, paymentCuit: e.target.value })}
                        placeholder="23317324830"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-paymentCbu">CBU</Label>
                      <Input
                        id="edit-paymentCbu"
                        value={containerProperties.paymentCbu || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, paymentCbu: e.target.value })}
                        placeholder="0720058880000214570721"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-paymentAlias">Alias</Label>
                      <Input
                        id="edit-paymentAlias"
                        value={containerProperties.paymentAlias || ''}
                        onChange={(e) => setContainerProperties({ ...containerProperties, paymentAlias: e.target.value })}
                        placeholder="EMPRESA.NOMBRE"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Campos Adicionales Legacy */}
              <Card>
                <CardHeader>
                  <CardTitle>Campos Adicionales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="edit-email">Email (Legacy)</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={containerProperties.email || ''}
                      onChange={(e) => setContainerProperties({ ...containerProperties, email: e.target.value })}
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Teléfono (Legacy)</Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      value={containerProperties.phone || ''}
                      onChange={(e) => setContainerProperties({ ...containerProperties, phone: e.target.value })}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-textField">Campo de Texto</Label>
                    <Input
                      id="edit-textField"
                      value={containerProperties.textField || ''}
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
                </CardContent>
              </Card>
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

        {/* Dialog para crear Company Template */}
        <Dialog open={isCreateCompanyTemplateDialogOpen} onOpenChange={setIsCreateCompanyTemplateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Template de Empresa</DialogTitle>
              <DialogDescription>
                Crea un template reutilizable con los datos de una empresa
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Nombre del Template</Label>
                <Input
                  id="template-name"
                  value={newCompanyTemplate.name}
                  onChange={(e) => setNewCompanyTemplate({ ...newCompanyTemplate, name: e.target.value })}
                  placeholder="Ej: Mi Empresa Principal"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-companyName">Nombre de la Empresa</Label>
                  <Input
                    id="template-companyName"
                    value={newCompanyTemplate.companyName}
                    onChange={(e) => setNewCompanyTemplate({ ...newCompanyTemplate, companyName: e.target.value })}
                    placeholder="Mi Empresa S.A."
                  />
                </div>
                <div>
                  <Label htmlFor="template-companyEmail">Email</Label>
                  <Input
                    id="template-companyEmail"
                    type="email"
                    value={newCompanyTemplate.companyEmail}
                    onChange={(e) => setNewCompanyTemplate({ ...newCompanyTemplate, companyEmail: e.target.value })}
                    placeholder="contacto@miempresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="template-companyPhone">Teléfono</Label>
                  <Input
                    id="template-companyPhone"
                    value={newCompanyTemplate.companyPhone}
                    onChange={(e) => setNewCompanyTemplate({ ...newCompanyTemplate, companyPhone: e.target.value })}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <Label htmlFor="template-companyTaxId">CUIT/RUC</Label>
                  <Input
                    id="template-companyTaxId"
                    value={newCompanyTemplate.companyTaxId}
                    onChange={(e) => setNewCompanyTemplate({ ...newCompanyTemplate, companyTaxId: e.target.value })}
                    placeholder="30-12345678-9"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="template-companyAddress">Dirección</Label>
                  <Input
                    id="template-companyAddress"
                    value={newCompanyTemplate.companyAddress}
                    onChange={(e) => setNewCompanyTemplate({ ...newCompanyTemplate, companyAddress: e.target.value })}
                    placeholder="Dirección de la empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="template-companyWebsite">Sitio Web</Label>
                  <Input
                    id="template-companyWebsite"
                    value={newCompanyTemplate.companyWebsite}
                    onChange={(e) => setNewCompanyTemplate({ ...newCompanyTemplate, companyWebsite: e.target.value })}
                    placeholder="https://miempresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="template-companyLogo">Logo</Label>
                  <Input
                    id="template-companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleCompanyTemplateLogoUpload}
                    className="cursor-pointer"
                  />
                  {newCompanyTemplate.companyLogo && (
                    <div className="mt-2">
                      <img
                        src={newCompanyTemplate.companyLogo}
                        alt="Logo Preview"
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateCompanyTemplateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createCompanyTemplate}>
                Crear Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para crear Payment Template */}
        <Dialog open={isCreatePaymentTemplateDialogOpen} onOpenChange={setIsCreatePaymentTemplateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Template de Pago</DialogTitle>
              <DialogDescription>
                Crea un template reutilizable con métodos de pago
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-template-name">Nombre del Template</Label>
                <Input
                  id="payment-template-name"
                  value={newPaymentTemplate.name}
                  onChange={(e) => setNewPaymentTemplate({ ...newPaymentTemplate, name: e.target.value })}
                  placeholder="Ej: Cuenta Principal"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-paymentAccount">Número de Cuenta</Label>
                  <Input
                    id="template-paymentAccount"
                    value={newPaymentTemplate.paymentAccount}
                    onChange={(e) => setNewPaymentTemplate({ ...newPaymentTemplate, paymentAccount: e.target.value })}
                    placeholder="058-214570/7"
                  />
                </div>
                <div>
                  <Label htmlFor="template-paymentCuit">CUIT/CUIL</Label>
                  <Input
                    id="template-paymentCuit"
                    value={newPaymentTemplate.paymentCuit}
                    onChange={(e) => setNewPaymentTemplate({ ...newPaymentTemplate, paymentCuit: e.target.value })}
                    placeholder="23317324830"
                  />
                </div>
                <div>
                  <Label htmlFor="template-paymentCbu">CBU</Label>
                  <Input
                    id="template-paymentCbu"
                    value={newPaymentTemplate.paymentCbu}
                    onChange={(e) => setNewPaymentTemplate({ ...newPaymentTemplate, paymentCbu: e.target.value })}
                    placeholder="0720058880000214570721"
                  />
                </div>
                <div>
                  <Label htmlFor="template-paymentAlias">Alias</Label>
                  <Input
                    id="template-paymentAlias"
                    value={newPaymentTemplate.paymentAlias}
                    onChange={(e) => setNewPaymentTemplate({ ...newPaymentTemplate, paymentAlias: e.target.value })}
                    placeholder="EMPRESA.NOMBRE"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatePaymentTemplateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createPaymentTemplate}>
                Crear Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </main>
  )
}

export default Menu