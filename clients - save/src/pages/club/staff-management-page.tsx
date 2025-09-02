import React, { useState } from 'react';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { PlusCircle, Search, Edit, Trash, Check, X, Shield, ShieldAlert, ChevronDown, LockKeyhole } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

// Types pour les rôles et les droits
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'base' | 'pos' | 'events' | 'finances' | 'admin';
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[];
  staffCount: number;
}

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  customPermissions?: string[];
  lastActive?: string;
  joinDate: string;
}

// Permissions disponibles
const availablePermissions: Permission[] = [
  // Permissions de base
  { id: 'profile_view', name: 'Voir profil', description: 'Peut voir son profil et ses informations', category: 'base' },
  { id: 'club_view', name: 'Voir le club', description: 'Peut voir les informations du club', category: 'base' },
  
  // Permissions POS
  { id: 'pos_access', name: 'Accès POS', description: 'Peut accéder au système POS', category: 'pos' },
  { id: 'pos_take_orders', name: 'Prendre commandes', description: 'Peut prendre des commandes', category: 'pos' },
  { id: 'pos_manage_tables', name: 'Gérer tables', description: 'Peut assigner et gérer les tables', category: 'pos' },
  { id: 'pos_apply_discounts', name: 'Appliquer remises', description: 'Peut appliquer des remises sur les commandes', category: 'pos' },
  { id: 'pos_void_orders', name: 'Annuler commandes', description: 'Peut annuler des commandes', category: 'pos' },
  { id: 'pos_manage_catalog', name: 'Gérer catalogue', description: 'Peut gérer le catalogue des produits', category: 'pos' },
  
  // Permissions événements
  { id: 'events_view', name: 'Voir événements', description: 'Peut voir les événements', category: 'events' },
  { id: 'events_create', name: 'Créer événements', description: 'Peut créer des événements', category: 'events' },
  { id: 'events_edit', name: 'Modifier événements', description: 'Peut modifier des événements', category: 'events' },
  { id: 'events_delete', name: 'Supprimer événements', description: 'Peut supprimer des événements', category: 'events' },
  { id: 'events_publish', name: 'Publier événements', description: 'Peut publier des événements', category: 'events' },
  { id: 'events_scan_tickets', name: 'Scanner tickets', description: 'Peut scanner des tickets d\'entrée', category: 'events' },
  
  // Permissions finances
  { id: 'finances_view', name: 'Voir finances', description: 'Peut voir les informations financières', category: 'finances' },
  { id: 'finances_reports', name: 'Voir rapports', description: 'Peut voir et générer des rapports', category: 'finances' },
  { id: 'finances_transactions', name: 'Gérer transactions', description: 'Peut gérer les transactions', category: 'finances' },
  
  // Permissions admin
  { id: 'staff_view', name: 'Voir staff', description: 'Peut voir la liste du personnel', category: 'admin' },
  { id: 'staff_create', name: 'Ajouter staff', description: 'Peut ajouter du personnel', category: 'admin' },
  { id: 'staff_edit', name: 'Modifier staff', description: 'Peut modifier le personnel', category: 'admin' },
  { id: 'staff_delete', name: 'Supprimer staff', description: 'Peut supprimer du personnel', category: 'admin' },
  { id: 'roles_manage', name: 'Gérer rôles', description: 'Peut gérer les rôles et permissions', category: 'admin' },
  { id: 'settings_manage', name: 'Gérer paramètres', description: 'Peut gérer les paramètres du club', category: 'admin' },
];

// Rôles prédéfinis
const initialRoles: Role[] = [
  {
    id: 1,
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    isSystem: true,
    permissions: availablePermissions.map(p => p.id),
    staffCount: 2
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Peut gérer le personnel et les opérations quotidiennes',
    isSystem: true,
    permissions: [
      'profile_view', 'club_view', 
      'pos_access', 'pos_take_orders', 'pos_manage_tables', 'pos_apply_discounts', 'pos_void_orders',
      'events_view', 'events_create', 'events_edit', 'events_publish', 'events_scan_tickets',
      'finances_view', 'finances_reports',
      'staff_view', 'staff_create', 'staff_edit'
    ],
    staffCount: 3
  },
  {
    id: 3,
    name: 'Serveur',
    description: 'Peut prendre des commandes et gérer les tables',
    isSystem: true,
    permissions: [
      'profile_view', 'club_view',
      'pos_access', 'pos_take_orders', 'pos_manage_tables'
    ],
    staffCount: 8
  },
  {
    id: 4,
    name: 'Caissier',
    description: 'Peut encaisser et gérer les transactions',
    isSystem: true,
    permissions: [
      'profile_view', 'club_view',
      'pos_access', 'pos_take_orders', 'pos_apply_discounts',
      'events_scan_tickets'
    ],
    staffCount: 4
  },
  {
    id: 5,
    name: 'Agent d\'accueil',
    description: 'Peut vérifier les tickets et accueillir les clients',
    isSystem: true,
    permissions: [
      'profile_view', 'club_view',
      'events_view', 'events_scan_tickets'
    ],
    staffCount: 5
  },
  {
    id: 6,
    name: 'Marketing',
    description: 'Peut gérer les événements et les promotions',
    isSystem: false,
    permissions: [
      'profile_view', 'club_view',
      'events_view', 'events_create', 'events_edit', 'events_publish'
    ],
    staffCount: 2
  }
];

// Personnel fictif
const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+261 34 12 34 567',
    avatarUrl: '',
    roleId: 1,
    roleName: 'Administrateur',
    isActive: true,
    lastActive: '2025-05-10T08:30:00',
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Marie Lefèvre',
    email: 'marie.lefevre@example.com',
    phone: '+261 33 98 76 543',
    avatarUrl: '',
    roleId: 1,
    roleName: 'Administrateur',
    isActive: true,
    lastActive: '2025-05-09T16:45:00',
    joinDate: '2024-01-20'
  },
  {
    id: 3,
    name: 'Pierre Martin',
    email: 'pierre.martin@example.com',
    phone: '+261 34 56 78 901',
    avatarUrl: '',
    roleId: 2,
    roleName: 'Manager',
    isActive: true,
    lastActive: '2025-05-10T09:15:00',
    joinDate: '2024-02-05'
  },
  {
    id: 4,
    name: 'Sophie Dubois',
    email: 'sophie.dubois@example.com',
    phone: '+261 33 45 67 890',
    avatarUrl: '',
    roleId: 2,
    roleName: 'Manager',
    isActive: false,
    lastActive: '2025-04-28T14:20:00',
    joinDate: '2024-02-10'
  },
  {
    id: 5,
    name: 'Thomas Bernard',
    email: 'thomas.bernard@example.com',
    phone: '+261 34 23 45 678',
    avatarUrl: '',
    roleId: 3,
    roleName: 'Serveur',
    isActive: true,
    lastActive: '2025-05-09T22:30:00',
    joinDate: '2024-03-01'
  },
  {
    id: 6,
    name: 'Julie Petit',
    email: 'julie.petit@example.com',
    phone: '+261 33 34 56 789',
    avatarUrl: '',
    roleId: 3,
    roleName: 'Serveur',
    isActive: true,
    lastActive: '2025-05-10T00:15:00',
    joinDate: '2024-03-05'
  },
  {
    id: 7,
    name: 'Lucas Moreau',
    email: 'lucas.moreau@example.com',
    phone: '+261 34 78 90 123',
    avatarUrl: '',
    roleId: 4,
    roleName: 'Caissier',
    isActive: true,
    lastActive: '2025-05-09T23:40:00',
    joinDate: '2024-03-15'
  },
  {
    id: 8,
    name: 'Emma Laurent',
    email: 'emma.laurent@example.com',
    phone: '+261 33 67 89 012',
    avatarUrl: '',
    roleId: 5,
    roleName: 'Agent d\'accueil',
    isActive: true,
    customPermissions: ['pos_access', 'pos_take_orders'],
    lastActive: '2025-05-10T01:10:00',
    joinDate: '2024-04-01'
  }
];

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Fonction pour formater les heures
const formatTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString('fr-FR', options);
};

// Composant principal
const StaffManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('staff');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaff);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  
  // États pour les modales
  const [isAddStaffOpen, setIsAddStaffOpen] = useState<boolean>(false);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState<boolean>(false);
  const [isDeleteStaffOpen, setIsDeleteStaffOpen] = useState<boolean>(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState<boolean>(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState<boolean>(false);
  const [isDeleteRoleOpen, setIsDeleteRoleOpen] = useState<boolean>(false);
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState<boolean>(false);
  
  // États pour les formulaires
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: '',
    email: '',
    phone: '',
    roleId: 0,
    isActive: true
  });
  
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: []
  });

  // Fonctions pour le filtrage
  const filterStaff = () => {
    return staffMembers.filter(staff => {
      const matchesSearch = 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staff.phone && staff.phone.includes(searchTerm));
      
      const matchesRole = roleFilter === 'all' || staff.roleId.toString() === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  };

  // Handlers pour le personnel
  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.roleId) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const role = roles.find(r => r.id === newStaff.roleId);
    if (!role) {
      toast({
        title: "Rôle invalide",
        description: "Veuillez sélectionner un rôle valide",
        variant: "destructive"
      });
      return;
    }

    const newStaffMember: StaffMember = {
      id: staffMembers.length > 0 ? Math.max(...staffMembers.map(s => s.id)) + 1 : 1,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      avatarUrl: '',
      roleId: newStaff.roleId,
      roleName: role.name,
      isActive: newStaff.isActive ?? true,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setStaffMembers([...staffMembers, newStaffMember]);
    
    toast({
      title: "Membre ajouté",
      description: `${newStaffMember.name} a été ajouté au personnel`,
    });
    
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      roleId: 0,
      isActive: true
    });
    
    setIsAddStaffOpen(false);
  };

  const handleEditStaff = () => {
    if (!editingStaff) return;
    
    const role = roles.find(r => r.id === editingStaff.roleId);
    if (!role) {
      toast({
        title: "Rôle invalide",
        description: "Veuillez sélectionner un rôle valide",
        variant: "destructive"
      });
      return;
    }

    const updatedStaff = {
      ...editingStaff,
      roleName: role.name
    };

    setStaffMembers(staffMembers.map(staff => 
      staff.id === updatedStaff.id ? updatedStaff : staff
    ));
    
    toast({
      title: "Membre modifié",
      description: `Les informations de ${updatedStaff.name} ont été mises à jour`,
    });
    
    setIsEditStaffOpen(false);
  };

  const handleDeleteStaff = () => {
    if (!deletingStaff) return;
    
    setStaffMembers(staffMembers.filter(staff => staff.id !== deletingStaff.id));
    
    toast({
      title: "Membre supprimé",
      description: `${deletingStaff.name} a été supprimé du personnel`,
    });
    
    setIsDeleteStaffOpen(false);
  };

  // Handlers pour les rôles
  const handleAddRole = () => {
    if (!newRole.name) {
      toast({
        title: "Nom requis",
        description: "Veuillez donner un nom au rôle",
        variant: "destructive"
      });
      return;
    }

    const newRoleItem: Role = {
      id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
      name: newRole.name,
      description: newRole.description || '',
      isSystem: false,
      permissions: newRole.permissions || [],
      staffCount: 0
    };

    setRoles([...roles, newRoleItem]);
    
    toast({
      title: "Rôle ajouté",
      description: `Le rôle "${newRoleItem.name}" a été créé avec succès`,
    });
    
    setNewRole({
      name: '',
      description: '',
      permissions: []
    });
    
    setIsAddRoleOpen(false);
  };

  const handleEditRole = () => {
    if (!editingRole) return;
    
    setRoles(roles.map(role => 
      role.id === editingRole.id ? editingRole : role
    ));
    
    toast({
      title: "Rôle modifié",
      description: `Le rôle "${editingRole.name}" a été mis à jour`,
    });
    
    setIsEditRoleOpen(false);
  };

  const handleDeleteRole = () => {
    if (!deletingRole) return;
    
    // Vérifier si des membres du personnel utilisent ce rôle
    const staffWithRole = staffMembers.filter(staff => staff.roleId === deletingRole.id);
    
    if (staffWithRole.length > 0) {
      toast({
        title: "Suppression impossible",
        description: `${staffWithRole.length} membre(s) du personnel utilise(nt) ce rôle. Veuillez les réassigner avant de supprimer ce rôle.`,
        variant: "destructive"
      });
      return;
    }
    
    setRoles(roles.filter(role => role.id !== deletingRole.id));
    
    toast({
      title: "Rôle supprimé",
      description: `Le rôle "${deletingRole.name}" a été supprimé`,
    });
    
    setIsDeleteRoleOpen(false);
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!editingRole) return;
    
    const hasPermission = editingRole.permissions.includes(permissionId);
    
    if (hasPermission) {
      // Retire la permission
      setEditingRole({
        ...editingRole,
        permissions: editingRole.permissions.filter(id => id !== permissionId)
      });
    } else {
      // Ajoute la permission
      setEditingRole({
        ...editingRole,
        permissions: [...editingRole.permissions, permissionId]
      });
    }
  };

  const handleToggleStaffPermission = (permissionId: string) => {
    if (!editingStaff) return;
    
    const customPermissions = editingStaff.customPermissions || [];
    const hasPermission = customPermissions.includes(permissionId);
    
    if (hasPermission) {
      // Retire la permission
      setEditingStaff({
        ...editingStaff,
        customPermissions: customPermissions.filter(id => id !== permissionId)
      });
    } else {
      // Ajoute la permission
      setEditingStaff({
        ...editingStaff,
        customPermissions: [...customPermissions, permissionId]
      });
    }
  };

  const hasPermission = (staff: StaffMember, permissionId: string): boolean => {
    // Si l'utilisateur a des permissions personnalisées, vérifier d'abord celles-ci
    if (staff.customPermissions && staff.customPermissions.includes(permissionId)) {
      return true;
    }
    
    // Sinon, vérifier les permissions du rôle
    const role = roles.find(r => r.id === staff.roleId);
    return role ? role.permissions.includes(permissionId) : false;
  };

  const getPermissionsByCategory = (category: Permission['category']) => {
    return availablePermissions.filter(p => p.category === category);
  };

  const filteredStaff = filterStaff();

  return (
    <ResponsiveLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestion du personnel</h1>
            <p className="text-muted-foreground">Gérez les membres du personnel et leurs droits d'accès</p>
          </div>
          
          {activeTab === 'staff' ? (
            <Button onClick={() => setIsAddStaffOpen(true)}>
              <PlusCircle className="h-5 w-5 mr-2" />
              Ajouter un membre
            </Button>
          ) : (
            <Button onClick={() => setIsAddRoleOpen(true)}>
              <PlusCircle className="h-5 w-5 mr-2" />
              Créer un rôle
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="staff">Personnel</TabsTrigger>
            <TabsTrigger value="roles">Rôles et permissions</TabsTrigger>
          </TabsList>
          
          {/* Onglet Personnel */}
          <TabsContent value="staff" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un membre du personnel..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-64">
                <select 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Tous les rôles</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id.toString()}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membre</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date d'ajout</TableHead>
                      <TableHead>Dernière activité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map(staff => (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={staff.avatarUrl} />
                                <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-muted-foreground">{staff.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`
                                ${staff.roleId === 1 ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' : ''}
                                ${staff.roleId === 2 ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}
                                ${staff.roleId === 3 ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                ${staff.roleId === 4 ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                                ${staff.roleId === 5 ? 'bg-rose-100 text-rose-800 hover:bg-rose-100' : ''}
                                ${staff.roleId === 6 ? 'bg-sky-100 text-sky-800 hover:bg-sky-100' : ''}
                              `}
                            >
                              {staff.roleName}
                            </Badge>
                            {staff.customPermissions && staff.customPermissions.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Permissions personnalisées
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={staff.isActive ? "default" : "secondary"}>
                              {staff.isActive ? 'Actif' : 'Inactif'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(staff.joinDate)}
                          </TableCell>
                          <TableCell>
                            {staff.lastActive ? (
                              <div>
                                <div>{formatDate(staff.lastActive)}</div>
                                <div className="text-xs text-muted-foreground">{formatTime(staff.lastActive)}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Jamais connecté</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setEditingStaff(staff);
                                  setIsEditStaffOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  setDeletingStaff(staff);
                                  setIsDeleteStaffOpen(true);
                                }}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          Aucun membre du personnel trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Rôles */}
          <TabsContent value="roles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map(role => (
                <Card key={role.id} className={role.isSystem ? 'border-muted-foreground/20' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {role.name}
                          {role.isSystem && (
                            <Badge variant="outline" className="ml-2 bg-slate-100">
                              Système
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {role.description}
                        </CardDescription>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingRole(role);
                              setIsEditPermissionsOpen(true);
                            }}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Gérer les permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingRole(role);
                              setIsEditRoleOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier le rôle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDeletingRole(role);
                              setIsDeleteRoleOpen(true);
                            }}
                            disabled={role.isSystem || role.staffCount > 0}
                            className={
                              (role.isSystem || role.staffCount > 0) 
                                ? 'text-muted-foreground cursor-not-allowed' 
                                : 'text-destructive focus:text-destructive'
                            }
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Supprimer le rôle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-3">
                      <ShieldAlert className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {role.permissions.length} permissions
                      </span>
                      <Badge className="ml-auto" variant="outline">
                        {role.staffCount} membres
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['base', 'pos', 'events', 'finances', 'admin'].map(category => {
                        const categoryPermissions = getPermissionsByCategory(category as Permission['category']);
                        const grantedCount = categoryPermissions.filter(p => 
                          role.permissions.includes(p.id)
                        ).length;
                        
                        if (grantedCount === 0) return null;
                        
                        return (
                          <div key={category} className="flex items-center space-x-1">
                            <div 
                              className={`
                                w-2 h-2 rounded-full 
                                ${category === 'base' ? 'bg-green-500' : ''}
                                ${category === 'pos' ? 'bg-blue-500' : ''}
                                ${category === 'events' ? 'bg-purple-500' : ''}
                                ${category === 'finances' ? 'bg-amber-500' : ''}
                                ${category === 'admin' ? 'bg-rose-500' : ''}
                              `}
                            />
                            <span className="text-xs">
                              {grantedCount}/{categoryPermissions.length} {category}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modales - Ajout de membre du personnel */}
      <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
        <DialogContent className="sm:max-w-[530px]">
          <DialogHeader>
            <DialogTitle>Ajouter un membre du personnel</DialogTitle>
            <DialogDescription>
              Saisissez les informations pour ajouter un nouveau membre du personnel
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom complet
              </Label>
              <Input
                id="name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="phone"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rôle
              </Label>
              <select 
                id="role"
                className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2"
                value={newStaff.roleId || ''}
                onChange={(e) => setNewStaff({...newStaff, roleId: parseInt(e.target.value)})}
              >
                <option value="" disabled>Sélectionnez un rôle</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Actif
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isActive"
                  checked={newStaff.isActive}
                  onCheckedChange={(checked) => setNewStaff({...newStaff, isActive: checked})}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {newStaff.isActive ? 'Actif' : 'Inactif'}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStaffOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddStaff}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modales - Édition d'un membre du personnel */}
      <Dialog open={isEditStaffOpen} onOpenChange={setIsEditStaffOpen}>
        <DialogContent className="sm:max-w-[530px]">
          <DialogHeader>
            <DialogTitle>Modifier un membre du personnel</DialogTitle>
            <DialogDescription>
              Modifiez les informations de ce membre du personnel
            </DialogDescription>
          </DialogHeader>
          
          {editingStaff && (
            <div>
              <Tabs defaultValue="info">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="info">Informations</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 pt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      Nom complet
                    </Label>
                    <Input
                      id="edit-name"
                      value={editingStaff.name}
                      onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingStaff.email}
                      onChange={(e) => setEditingStaff({...editingStaff, email: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-phone" className="text-right">
                      Téléphone
                    </Label>
                    <Input
                      id="edit-phone"
                      value={editingStaff.phone || ''}
                      onChange={(e) => setEditingStaff({...editingStaff, phone: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role" className="text-right">
                      Rôle
                    </Label>
                    <select 
                      id="edit-role"
                      className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={editingStaff.roleId}
                      onChange={(e) => setEditingStaff({...editingStaff, roleId: parseInt(e.target.value)})}
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-isActive" className="text-right">
                      Actif
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="edit-isActive"
                        checked={editingStaff.isActive}
                        onCheckedChange={(checked) => setEditingStaff({...editingStaff, isActive: checked})}
                      />
                      <Label htmlFor="edit-isActive" className="cursor-pointer">
                        {editingStaff.isActive ? 'Actif' : 'Inactif'}
                      </Label>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Permissions personnalisées</h4>
                      <p className="text-sm text-muted-foreground">
                        Ces permissions s'appliquent uniquement à ce membre et remplacent celles de son rôle
                      </p>
                    </div>
                    <Badge variant="outline" className={
                      editingStaff.customPermissions && editingStaff.customPermissions.length > 0
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
                        : ""
                    }>
                      {editingStaff.customPermissions ? editingStaff.customPermissions.length : 0} personnalisées
                    </Badge>
                  </div>
                  
                  <div className="max-h-[320px] overflow-y-auto pr-2 space-y-4">
                    {['base', 'pos', 'events', 'finances', 'admin'].map((category) => {
                      const categoryPermissions = getPermissionsByCategory(category as Permission['category']);
                      
                      if (categoryPermissions.length === 0) return null;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <h5 className={`
                            text-sm font-medium capitalize mb-1 pb-1 border-b
                            ${category === 'base' ? 'text-green-700 border-green-200' : ''}
                            ${category === 'pos' ? 'text-blue-700 border-blue-200' : ''}
                            ${category === 'events' ? 'text-purple-700 border-purple-200' : ''}
                            ${category === 'finances' ? 'text-amber-700 border-amber-200' : ''}
                            ${category === 'admin' ? 'text-rose-700 border-rose-200' : ''}
                          `}>
                            {category}
                          </h5>
                          
                          <div className="grid grid-cols-1 gap-2">
                            {categoryPermissions.map((permission) => {
                              // Vérifier si la permission est dans le rôle
                              const roleHasPermission = roles.find(
                                r => r.id === editingStaff.roleId
                              )?.permissions.includes(permission.id) || false;
                              
                              // Vérifier si la permission est personnalisée
                              const hasCustomPermission = editingStaff.customPermissions?.includes(permission.id) || false;
                              
                              return (
                                <div key={permission.id} className="flex items-start space-x-2">
                                  <Checkbox
                                    id={`permission-${permission.id}`}
                                    checked={hasCustomPermission || (!hasCustomPermission && roleHasPermission)}
                                    onCheckedChange={() => handleToggleStaffPermission(permission.id)}
                                    disabled={roleHasPermission && !hasCustomPermission}
                                  />
                                  <div className="grid gap-0.5">
                                    <Label
                                      htmlFor={`permission-${permission.id}`}
                                      className={`text-sm font-medium ${hasCustomPermission ? 'text-primary' : ''}`}
                                    >
                                      {permission.name}
                                      {roleHasPermission && !hasCustomPermission && (
                                        <span className="ml-2 text-xs text-muted-foreground">(via rôle)</span>
                                      )}
                                      {hasCustomPermission && (
                                        <span className="ml-2 text-xs text-primary">(personnalisée)</span>
                                      )}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStaffOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditStaff}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale - Suppression d'un membre du personnel */}
      <DeleteConfirmationModal
        isOpen={isDeleteStaffOpen}
        onClose={() => setIsDeleteStaffOpen(false)}
        onConfirm={handleDeleteStaff}
        title="Supprimer un membre du personnel"
        description={
          deletingStaff 
            ? `Êtes-vous sûr de vouloir supprimer ${deletingStaff.name} ? Cette action est irréversible.`
            : "Êtes-vous sûr de vouloir supprimer ce membre du personnel ? Cette action est irréversible."
        }
      />
      
      {/* Modale - Ajout d'un rôle */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent className="sm:max-w-[530px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau rôle</DialogTitle>
            <DialogDescription>
              Définissez un nouveau rôle avec ses permissions associées
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-name" className="text-right">
                Nom du rôle
              </Label>
              <Input
                id="role-name"
                value={newRole.name}
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-description" className="text-right">
                Description
              </Label>
              <Input
                id="role-description"
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-right pt-2">
                <Label>Permissions</Label>
              </div>
              <div className="col-span-3 border rounded-md p-3 max-h-[300px] overflow-y-auto">
                <div className="space-y-4">
                  {['base', 'pos', 'events', 'finances', 'admin'].map((category) => {
                    const categoryPermissions = getPermissionsByCategory(category as Permission['category']);
                    
                    if (categoryPermissions.length === 0) return null;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <h5 className={`
                          text-sm font-medium capitalize mb-1 pb-1 border-b
                          ${category === 'base' ? 'text-green-700 border-green-200' : ''}
                          ${category === 'pos' ? 'text-blue-700 border-blue-200' : ''}
                          ${category === 'events' ? 'text-purple-700 border-purple-200' : ''}
                          ${category === 'finances' ? 'text-amber-700 border-amber-200' : ''}
                          ${category === 'admin' ? 'text-rose-700 border-rose-200' : ''}
                        `}>
                          {category}
                        </h5>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-2">
                              <Checkbox
                                id={`new-permission-${permission.id}`}
                                checked={(newRole.permissions || []).includes(permission.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewRole({
                                      ...newRole,
                                      permissions: [...(newRole.permissions || []), permission.id]
                                    });
                                  } else {
                                    setNewRole({
                                      ...newRole,
                                      permissions: (newRole.permissions || []).filter(id => id !== permission.id)
                                    });
                                  }
                                }}
                              />
                              <div className="grid gap-0.5">
                                <Label htmlFor={`new-permission-${permission.id}`} className="text-sm font-medium">
                                  {permission.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddRole}>
              Créer le rôle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale - Édition d'un rôle */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="sm:max-w-[530px]">
          <DialogHeader>
            <DialogTitle>Modifier un rôle</DialogTitle>
            <DialogDescription>
              Modifiez les informations du rôle
            </DialogDescription>
          </DialogHeader>
          
          {editingRole && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role-name" className="text-right">
                  Nom du rôle
                </Label>
                <Input
                  id="edit-role-name"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                  className="col-span-3"
                  disabled={editingRole.isSystem}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-role-description"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditRole}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale - Gestion des permissions d'un rôle */}
      <Dialog open={isEditPermissionsOpen} onOpenChange={setIsEditPermissionsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gérer les permissions</DialogTitle>
            <DialogDescription>
              {editingRole && `Configurez les permissions pour le rôle "${editingRole.name}"`}
            </DialogDescription>
          </DialogHeader>
          
          {editingRole && (
            <div className="py-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">
                    {editingRole.permissions.length} permissions activées
                  </span>
                </div>
                
                <Badge variant="outline">
                  {editingRole.staffCount} membres affectés
                </Badge>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="p-3 bg-muted">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      Toutes les permissions
                    </h3>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Actions rapides
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            // Sélectionner toutes les permissions
                            setEditingRole({
                              ...editingRole,
                              permissions: availablePermissions.map(p => p.id)
                            });
                          }}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Sélectionner tout
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // Désélectionner toutes les permissions
                            setEditingRole({
                              ...editingRole,
                              permissions: []
                            });
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Désélectionner tout
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Par catégorie</DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                          checked={getPermissionsByCategory('base').every(p => 
                            editingRole.permissions.includes(p.id)
                          )}
                          onCheckedChange={(checked) => {
                            const basePermissions = getPermissionsByCategory('base').map(p => p.id);
                            let newPermissions;
                            
                            if (checked) {
                              // Ajouter toutes les permissions de base
                              newPermissions = [...new Set([...editingRole.permissions, ...basePermissions])];
                            } else {
                              // Retirer toutes les permissions de base
                              newPermissions = editingRole.permissions.filter(id => !basePermissions.includes(id));
                            }
                            
                            setEditingRole({
                              ...editingRole,
                              permissions: newPermissions
                            });
                          }}
                        >
                          Permissions de base
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={getPermissionsByCategory('pos').every(p => 
                            editingRole.permissions.includes(p.id)
                          )}
                          onCheckedChange={(checked) => {
                            const posPermissions = getPermissionsByCategory('pos').map(p => p.id);
                            let newPermissions;
                            
                            if (checked) {
                              newPermissions = [...new Set([...editingRole.permissions, ...posPermissions])];
                            } else {
                              newPermissions = editingRole.permissions.filter(id => !posPermissions.includes(id));
                            }
                            
                            setEditingRole({
                              ...editingRole,
                              permissions: newPermissions
                            });
                          }}
                        >
                          Permissions POS
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={getPermissionsByCategory('events').every(p => 
                            editingRole.permissions.includes(p.id)
                          )}
                          onCheckedChange={(checked) => {
                            const eventsPermissions = getPermissionsByCategory('events').map(p => p.id);
                            let newPermissions;
                            
                            if (checked) {
                              newPermissions = [...new Set([...editingRole.permissions, ...eventsPermissions])];
                            } else {
                              newPermissions = editingRole.permissions.filter(id => !eventsPermissions.includes(id));
                            }
                            
                            setEditingRole({
                              ...editingRole,
                              permissions: newPermissions
                            });
                          }}
                        >
                          Permissions événements
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={getPermissionsByCategory('finances').every(p => 
                            editingRole.permissions.includes(p.id)
                          )}
                          onCheckedChange={(checked) => {
                            const financesPermissions = getPermissionsByCategory('finances').map(p => p.id);
                            let newPermissions;
                            
                            if (checked) {
                              newPermissions = [...new Set([...editingRole.permissions, ...financesPermissions])];
                            } else {
                              newPermissions = editingRole.permissions.filter(id => !financesPermissions.includes(id));
                            }
                            
                            setEditingRole({
                              ...editingRole,
                              permissions: newPermissions
                            });
                          }}
                        >
                          Permissions finances
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={getPermissionsByCategory('admin').every(p => 
                            editingRole.permissions.includes(p.id)
                          )}
                          onCheckedChange={(checked) => {
                            const adminPermissions = getPermissionsByCategory('admin').map(p => p.id);
                            let newPermissions;
                            
                            if (checked) {
                              newPermissions = [...new Set([...editingRole.permissions, ...adminPermissions])];
                            } else {
                              newPermissions = editingRole.permissions.filter(id => !adminPermissions.includes(id));
                            }
                            
                            setEditingRole({
                              ...editingRole,
                              permissions: newPermissions
                            });
                          }}
                        >
                          Permissions admin
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
                  {['base', 'pos', 'events', 'finances', 'admin'].map((category) => {
                    const categoryPermissions = getPermissionsByCategory(category as Permission['category']);
                    
                    if (categoryPermissions.length === 0) return null;
                    
                    const allChecked = categoryPermissions.every(p => editingRole.permissions.includes(p.id));
                    const someChecked = categoryPermissions.some(p => editingRole.permissions.includes(p.id));
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id={`category-${category}`}
                            checked={allChecked}
                            ref={(checkbox) => {
                              // Faire en sorte que la case à cocher soit indéterminée si certaines permissions sont cochées mais pas toutes
                              if (checkbox) {
                                checkbox.indeterminate = someChecked && !allChecked;
                              }
                            }}
                            onCheckedChange={(checked) => {
                              const categoryPermissionIds = categoryPermissions.map(p => p.id);
                              
                              if (checked) {
                                // Ajouter toutes les permissions de la catégorie
                                setEditingRole({
                                  ...editingRole,
                                  permissions: [...new Set([...editingRole.permissions, ...categoryPermissionIds])]
                                });
                              } else {
                                // Retirer toutes les permissions de la catégorie
                                setEditingRole({
                                  ...editingRole,
                                  permissions: editingRole.permissions.filter(id => !categoryPermissionIds.includes(id))
                                });
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`category-${category}`} 
                            className={`ml-2 text-sm font-medium capitalize pb-1 border-b
                              ${category === 'base' ? 'text-green-700 border-green-200' : ''}
                              ${category === 'pos' ? 'text-blue-700 border-blue-200' : ''}
                              ${category === 'events' ? 'text-purple-700 border-purple-200' : ''}
                              ${category === 'finances' ? 'text-amber-700 border-amber-200' : ''}
                              ${category === 'admin' ? 'text-rose-700 border-rose-200' : ''}
                            `}
                          >
                            {category}
                          </Label>
                        </div>
                        
                        <div className="ml-6 grid grid-cols-1 gap-2">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-2">
                              <Checkbox
                                id={`edit-permission-${permission.id}`}
                                checked={editingRole.permissions.includes(permission.id)}
                                onCheckedChange={() => handleTogglePermission(permission.id)}
                              />
                              <div className="grid gap-0.5">
                                <Label htmlFor={`edit-permission-${permission.id}`} className="text-sm font-medium">
                                  {permission.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPermissionsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditRole}>
              Enregistrer les permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale - Supprimer un rôle */}
      <DeleteConfirmationModal
        isOpen={isDeleteRoleOpen}
        onClose={() => setIsDeleteRoleOpen(false)}
        onConfirm={handleDeleteRole}
        title="Supprimer un rôle"
        description={
          deletingRole 
            ? `Êtes-vous sûr de vouloir supprimer le rôle "${deletingRole.name}" ? Cette action est irréversible.`
            : "Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible."
        }
      />
    </ResponsiveLayout>
  );
};

export default StaffManagementPage;