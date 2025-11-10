import { useState, useEffect } from 'react';
import { 
  Invitation, 
  CollaborationMessage, 
  CollaborationMilestone,
  Event,
  User,
  Artist,
  Club
} from '../shared/schema';

// Données mockées basées sur le schema
const mockInvitations: Invitation[] = [
  {
    id: 1,
    eventId: 1,
    userId: 2,
    invitedById: 1,
    status: "confirmed",
    progress: 100,
    invitedAt: new Date('2024-01-15'),
    expectedAttendees: 150,
    genre: "House",
    description: "Soirée house music avec ambiance électro",
    createdAt: new Date('2024-01-10')
  },
  {
    id: 2,
    eventId: 2,
    userId: 3,
    invitedById: 1,
    status: "negotiation",
    progress: 60,
    invitedAt: new Date('2024-01-20'),
    expectedAttendees: 80,
    genre: "Techno",
    description: "Nuit techno underground",
    createdAt: new Date('2024-01-18')
  },
  {
    id: 3,
    eventId: 3,
    userId: 4,
    invitedById: 1,
    status: "pending",
    progress: 0,
    invitedAt: new Date('2024-01-25'),
    expectedAttendees: 200,
    genre: "Hip-Hop",
    description: "Concert hip-hop avec artistes locaux",
    createdAt: new Date('2024-01-22')
  },
  {
    id: 4,
    eventId: 4,
    userId: 5,
    invitedById: 1,
    status: "completed",
    progress: 100,
    invitedAt: new Date('2024-01-05'),
    expectedAttendees: 120,
    genre: "Jazz",
    description: "Soirée jazz lounge",
    createdAt: new Date('2024-01-01')
  }
];

const mockEvents: Event[] = [
  {
    id: 1,
    organizerType: "club",
    organizerId: 1,
    createdBy: 1,
    title: "Soirée House Nation",
    description: "Une nuit dédiée à la house music avec les meilleurs DJs",
    date: new Date('2024-02-15'),
    startTime: "22:00",
    endTime: "06:00",
    location: "78 Rue de la Soif, Paris",
    city: "Paris",
    country: "France",
    venueName: "Le Warehouse",
    category: "Electronic",
    price: 25.00,
    capacity: 500,
    coverImage: "/api/placeholder/400/200",
    participantCount: 150,
    popularity: 85,
    isApproved: true,
    status: "upcoming",
    mood: "energetic",
    reserveTables: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: 2,
    organizerType: "club",
    organizerId: 2,
    createdBy: 1,
    title: "Techno Underground",
    description: "Plongez dans l'univers de la techno hardcore",
    date: new Date('2024-02-20'),
    startTime: "23:00",
    endTime: "07:00",
    location: "45 Avenue Techno, Lyon",
    city: "Lyon",
    country: "France",
    venueName: "The Basement",
    category: "Electronic",
    price: 20.00,
    capacity: 300,
    coverImage: "/api/placeholder/400/200",
    participantCount: 80,
    popularity: 75,
    isApproved: true,
    status: "upcoming",
    mood: "dark",
    reserveTables: false,
    createdAt: new Date('2024-01-15')
  }
];

const mockUsers: User[] = [
  {
    id: 2,
    username: "dj_marco",
    password: "hashed",
    email: "marco@example.com",
    firstName: "Marco",
    lastName: "Rossi",
    role: "artist",
    profileImage: "/api/placeholder/100/100",
    city: "Paris",
    country: "France",
    walletBalance: 1500.00,
    isVerified: true,
    phone: "+33612345678",
    verificationStatus: "approved",
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    darkMode: false,
    language: "fr",
    locationEnabled: true,
    twoFactorEnabled: false,
    createdAt: new Date('2023-12-01')
  },
  {
    id: 3,
    username: "techno_crew",
    password: "hashed",
    email: "crew@example.com",
    firstName: "Techno",
    lastName: "Crew",
    role: "artist",
    profileImage: "/api/placeholder/100/100",
    city: "Lyon",
    country: "France",
    walletBalance: 800.00,
    isVerified: true,
    phone: "+33687654321",
    verificationStatus: "approved",
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    darkMode: false,
    language: "fr",
    locationEnabled: true,
    twoFactorEnabled: false,
    createdAt: new Date('2023-11-15')
  }
];

const mockArtists: Artist[] = [
  {
    id: 1,
    userId: 2,
    displayName: "DJ Marco",
    genre: "House, Techno",
    bio: "DJ international spécialisé dans la house music",
    rate: 1500.00,
    tags: ["house", "techno", "electronic"],
    popularity: 85,
    socialMedia: { instagram: "@djmarco", soundcloud: "djmarco" },
    contact: { email: "marco@example.com", phone: "+33612345678" },
    location: "Paris, France",
    rating: 4.8,
    bookings: 45
  }
];

const mockClubs: Club[] = [
  {
    id: 1,
    userId: 1,
    name: "Le Warehouse",
    city: "Paris",
    country: "France",
    address: "78 Rue de la Soif, 75001 Paris",
    capacity: 500,
    description: "Club emblématique de la scène électronique parisienne",
    profileImage: "/api/placeholder/100/100",
    rating: 4.5,
    reviewCount: 120,
    category: "Nightclub",
    coverImage: "/api/placeholder/400/200",
    featured: true,
    instagram: "@lewarehouse",
    website: "lewarehouse.com",
    openingHours: {
      "vendredi": "22:00-06:00",
      "samedi": "22:00-07:00"
    },
    features: ["Terrasse", "VIP", "Sound System"],
    hasTableReservation: true
  }
];

const mockMessages: CollaborationMessage[] = [
  {
    id: 1,
    invitationId: 1,
    senderType: "artist",
    senderId: 1,
    content: "Bonjour ! Je suis intéressé par votre événement. Pouvez-vous me donner plus de détails sur la programmation ?",
    createdAt: new Date('2024-01-11')
  },
  {
    id: 2,
    invitationId: 1,
    senderType: "club",
    senderId: 1,
    content: "Bien sûr ! Nous prévoyons une soirée house avec plusieurs DJs. Le set principal serait de 2h.",
    createdAt: new Date('2024-01-12')
  },
  {
    id: 3,
    invitationId: 1,
    senderType: "artist",
    senderId: 1,
    content: "Parfait ! Et concernant le cachet, est-ce négociable ?",
    createdAt: new Date('2024-01-12')
  }
];

const mockMilestones: CollaborationMilestone[] = [
  {
    id: 1,
    invitationId: 1,
    title: "Signature du contrat",
    description: "Finaliser et signer le contrat de collaboration",
    status: "completed",
    assignedTo: "both",
    priority: "high",
    dueDate: new Date('2024-01-20'),
    completedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 2,
    invitationId: 1,
    title: "Préparation set musical",
    description: "Préparer le set musical de 2h",
    status: "in_progress",
    assignedTo: "artist",
    priority: "medium",
    dueDate: new Date('2024-02-10'),
    completedAt: undefined,
    createdAt: new Date('2024-01-10')
  }
];

const InvitationsManagement = () => {
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(mockInvitations[0]);
  const [messages, setMessages] = useState<CollaborationMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'messages' | 'milestones'>('details');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInvitations = invitations.filter(inv => 
    filterStatus === 'all' || inv.status === filterStatus
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'En attente' },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Confirmé' },
      negotiation: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Négociation' },
      completed: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Terminé' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Annulé' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { bg: 'bg-gray-500/20', text: 'text-gray-400', label: status };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getEventById = (eventId: number) => {
    return mockEvents.find(event => event.id === eventId);
  };

  const getUserById = (userId: number) => {
    return mockUsers.find(user => user.id === userId);
  };

  const getArtistByUserId = (userId: number) => {
    return mockArtists.find(artist => artist.userId === userId);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedInvitation) return;

    const newMsg: CollaborationMessage = {
      id: messages.length + 1,
      invitationId: selectedInvitation.id,
      senderType: "club", // Assuming current user is club
      senderId: 1,
      content: newMessage,
      createdAt: new Date()
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const updateInvitationStatus = (invitationId: number, newStatus: string) => {
    setInvitations(invitations.map(inv => 
      inv.id === invitationId ? { ...inv, status: newStatus } : inv
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des Invitations</h1>
          <p className="text-gray-400">Gérez toutes vos invitations et collaborations en un seul endroit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Liste des invitations */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              {/* Filtres */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Filtrer par statut</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="negotiation">Négociation</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>

              {/* Liste des invitations */}
              <div className="space-y-3">
                {filteredInvitations.map((invitation) => {
                  const event = getEventById(invitation.eventId);
                  const user = getUserById(invitation.userId);
                  const artist = getArtistByUserId(invitation.userId);

                  return (
                    <div
                      key={invitation.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedInvitation?.id === invitation.id
                          ? 'border-pink-500 bg-gray-800'
                          : 'border-gray-800 bg-gray-900 hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedInvitation(invitation)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white text-sm">
                          {event?.title}
                        </h3>
                        {getStatusBadge(invitation.status)}
                      </div>
                      <p className="text-gray-400 text-xs mb-2">
                        {artist?.displayName || user?.firstName} {user?.lastName}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(invitation.invitedAt).toLocaleDateString('fr-FR')}</span>
                        <span>{invitation.expectedAttendees} personnes</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content - Détails de l'invitation sélectionnée */}
          <div className="lg:col-span-2">
            {selectedInvitation ? (
              <div className="bg-gray-900 rounded-lg border border-gray-800">
                {/* En-tête */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        {getEventById(selectedInvitation.eventId)?.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>
                          Artiste: {getArtistByUserId(selectedInvitation.userId)?.displayName}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(selectedInvitation.invitedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(selectedInvitation.status)}
                      <div className="relative">
                        <select 
                          value={selectedInvitation.status}
                          onChange={(e) => updateInvitationStatus(selectedInvitation.id, e.target.value)}
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="negotiation">Négociation</option>
                          <option value="completed">Terminé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation par onglets */}
                <div className="border-b border-gray-800">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'details', label: 'Détails' },
                      { id: 'messages', label: 'Messages' },
                      { id: 'milestones', label: 'Étapes' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-pink-500 text-pink-500'
                            : 'border-transparent text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Contenu des onglets */}
                <div className="p-6">
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Informations de l'événement</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-gray-400">Lieu</label>
                              <p className="text-white">{getEventById(selectedInvitation.eventId)?.venueName}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Date</label>
                              <p className="text-white">
                                {getEventById(selectedInvitation.eventId)?.date && 
                                  new Date(getEventById(selectedInvitation.eventId)!.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Genre musical</label>
                              <p className="text-white">{selectedInvitation.genre}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Détails de l'invitation</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-gray-400">Participants attendus</label>
                              <p className="text-white">{selectedInvitation.expectedAttendees} personnes</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Progression</label>
                              <div className="flex items-center space-x-3">
                                <div className="flex-1 bg-gray-800 rounded-full h-2">
                                  <div 
                                    className="bg-pink-500 h-2 rounded-full transition-all"
                                    style={{ width: `${selectedInvitation.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-400">{selectedInvitation.progress}%</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Description</label>
                              <p className="text-white text-sm">{selectedInvitation.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'messages' && (
                    <div className="space-y-4">
                      {/* Historique des messages */}
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {messages
                          .filter(msg => msg.invitationId === selectedInvitation.id)
                          .map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.senderType === 'club' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.senderType === 'club'
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-gray-800 text-white'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Input pour nouveau message */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Tapez votre message..."
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                          onClick={sendMessage}
                          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          Envoyer
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'milestones' && (
                    <div className="space-y-4">
                      {mockMilestones
                        .filter(milestone => milestone.invitationId === selectedInvitation.id)
                        .map((milestone) => (
                          <div key={milestone.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white">{milestone.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                milestone.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-400'
                                  : milestone.status === 'in_progress'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {milestone.status === 'completed' ? 'Terminé' : 
                                 milestone.status === 'in_progress' ? 'En cours' : 'En attente'}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{milestone.description}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Assigné à: {milestone.assignedTo}</span>
                              <span>Priorité: {milestone.priority}</span>
                              {milestone.dueDate && (
                                <span>Échéance: {new Date(milestone.dueDate).toLocaleDateString('fr-FR')}</span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center">
                <p className="text-gray-400">Sélectionnez une invitation pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationsManagement;