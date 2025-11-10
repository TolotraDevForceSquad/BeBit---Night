// create-mock-data.ts
import {
  // Données fictives
  mockArtistPortfolios,
  mockClubLocations,
  mockClubTables,
  mockEvents,
  mockEventArtists,
  mockEventReservedTables,
  mockEventParticipants,
  mockInvitations,
  mockTicketTypes,
  mockTickets,
  mockFeedback,
  mockFeedbackLikes,
  mockFeedbackComments,
  mockPhotos,
  mockPhotoLikes,
  mockPhotoComments,
  mockCollaborationMilestones,
  mockCollaborationMessages,
  mockTransactions,
  mockCustomerProfiles,
  mockMusicGenres,
  mockDrinkTypes,
  mockCustomerTags,
  mockPromotions,
  mockPaymentMethods,
  mockInvoices
} from './club-events-data';

import { 
  // Services API
  createArtistPortfolio,
  createClubLocation,
  createClubTable,
  createEvent,
  createEventArtist,
  createEventReservedTable,
  createEventParticipant,
  createInvitation,
  createTicketType,
  createTicket,
  createFeedback,
  createFeedbackLike,
  createFeedbackComment,
  createPhoto,
  createPhotoLike,
  createPhotoComment,
  createCollaborationMilestone,
  createCollaborationMessage,
  createTransaction,
  createCustomerProfile,
  createMusicGenre,
  createDrinkType,
  createCustomerTag,
  createPromotion,
  createPaymentMethod,
  createInvoice,
} from '@/services/servapi';

export async function createMockData() {
  console.log('🚀 Début de la création des données fictives...');

  try {
    // ======================
    // ÉTAPE 1: Données de base (sans dépendances)
    // ======================
    console.log('📝 Étape 1: Création des données de base...');

    // MusicGenres (table indépendante)
    console.log('🎵 Création des genres musicaux...');
    for (const genre of mockMusicGenres) {
      await createMusicGenre(genre);
    }

    // DrinkTypes (table indépendante)
    console.log('🍹 Création des types de boissons...');
    for (const drink of mockDrinkTypes) {
      await createDrinkType(drink);
    }

    // ======================
    // ÉTAPE 2: Données liées aux artistes et clubs
    // ======================
    console.log('📝 Étape 2: Création des portfolios et localisations...');

    // ArtistPortfolios (dépend de artists)
    console.log('🖼️ Création des portfolios artistes...');
    for (const portfolio of mockArtistPortfolios) {
      await createArtistPortfolio(portfolio);
    }

    // ClubLocations (dépend de clubs)
    console.log('📍 Création des localisations clubs...');
    for (const location of mockClubLocations) {
      await createClubLocation(location);
    }

    // ClubTables (dépend de clubs)
    console.log('🪑 Création des tables clubs...');
    for (const table of mockClubTables) {
      await createClubTable(table);
    }

    // ======================
    // ÉTAPE 3: Événements et relations
    // ======================
    console.log('📝 Étape 3: Création des événements...');

    // Events (dépend de users, clubs, artists)
    console.log('🎪 Création des événements...');
    for (const event of mockEvents) {
      await createEvent(event);
    }

    // EventArtists (dépend de events et artists)
    console.log('🎤 Création des relations événements-artistes...');
    for (const eventArtist of mockEventArtists) {
      await createEventArtist(eventArtist);
    }

    // EventReservedTables (dépend de events et clubTables)
    console.log('💺 Création des tables réservées...');
    for (const reservedTable of mockEventReservedTables) {
      await createEventReservedTable(reservedTable);
    }

    // EventParticipants (dépend de events et users)
    console.log('👥 Création des participants événements...');
    for (const participant of mockEventParticipants) {
      await createEventParticipant(participant);
    }

    // ======================
    // ÉTAPE 4: Invitations et collaboration
    // ======================
    console.log('📝 Étape 4: Création des invitations...');

    // Invitations (dépend de events et users)
    console.log('📨 Création des invitations...');
    for (const invitation of mockInvitations) {
      await createInvitation(invitation);
    }

    // CollaborationMilestones (dépend de invitations)
    console.log('🎯 Création des milestones de collaboration...');
    for (const milestone of mockCollaborationMilestones) {
      await createCollaborationMilestone(milestone);
    }

    // CollaborationMessages (dépend de invitations)
    console.log('💬 Création des messages de collaboration...');
    for (const message of mockCollaborationMessages) {
      await createCollaborationMessage(message);
    }

    // ======================
    // ÉTAPE 5: Tickets et transactions
    // ======================
    console.log('📝 Étape 5: Création des tickets et transactions...');

    // TicketTypes (dépend de events)
    console.log('🎫 Création des types de tickets...');
    for (const ticketType of mockTicketTypes) {
      await createTicketType(ticketType);
    }

    // Tickets (dépend de events, users, ticketTypes)
    console.log('🎟️ Création des tickets...');
    for (const ticket of mockTickets) {
      await createTicket(ticket);
    }

    // Transactions (dépend de users)
    console.log('💰 Création des transactions...');
    for (const transaction of mockTransactions) {
      await createTransaction(transaction);
    }

    // ======================
    // ÉTAPE 6: Feedback et interactions
    // ======================
    console.log('📝 Étape 6: Création du feedback...');

    // Feedback (dépend de users)
    console.log('⭐ Création des feedbacks...');
    for (const feedback of mockFeedback) {
      await createFeedback(feedback);
    }

    // FeedbackLikes (dépend de feedback et users)
    console.log('❤️ Création des likes de feedback...');
    for (const like of mockFeedbackLikes) {
      await createFeedbackLike(like);
    }

    // FeedbackComments (dépend de feedback et users)
    console.log('💬 Création des commentaires de feedback...');
    for (const comment of mockFeedbackComments) {
      await createFeedbackComment(comment);
    }

    // ======================
    // ÉTAPE 7: Photos et médias
    // ======================
    console.log('📝 Étape 7: Création des photos...');

    // Photos (dépend de users et events)
    console.log('📸 Création des photos...');
    for (const photo of mockPhotos) {
      await createPhoto(photo);
    }

    // PhotoLikes (dépend de photos et users)
    console.log('❤️ Création des likes de photos...');
    for (const like of mockPhotoLikes) {
      await createPhotoLike(like);
    }

    // PhotoComments (dépend de photos et users)
    console.log('💬 Création des commentaires de photos...');
    for (const comment of mockPhotoComments) {
      await createPhotoComment(comment);
    }

    // ======================
    // ÉTAPE 8: Profils clients et marketing
    // ======================
    console.log('📝 Étape 8: Création des profils clients...');

    // CustomerProfiles (dépend de users)
    console.log('👤 Création des profils clients...');
    for (const profile of mockCustomerProfiles) {
      await createCustomerProfile(profile);
    }

    // CustomerTags (dépend de customerProfiles)
    console.log('🏷️ Création des tags clients...');
    for (const tag of mockCustomerTags) {
      await createCustomerTag(tag);
    }

    // Promotions (dépend de events et clubs)
    console.log('🎁 Création des promotions...');
    for (const promotion of mockPromotions) {
      await createPromotion(promotion);
    }

    // ======================
    // ÉTAPE 9: Paiements et facturation
    // ======================
    console.log('📝 Étape 9: Création des méthodes de paiement...');

    // PaymentMethods (dépend de users)
    console.log('💳 Création des méthodes de paiement...');
    for (const method of mockPaymentMethods) {
      await createPaymentMethod(method);
    }

    // Invoices (dépend de users et transactions)
    console.log('🧾 Création des factures...');
    for (const invoice of mockInvoices) {
      await createInvoice(invoice);
    }

    console.log('✅ Toutes les données fictives ont été créées avec succès!');
    return { success: true, message: 'Données fictives créées avec succès' };

  } catch (error) {
    console.error('❌ Erreur lors de la création des données fictives:', error);
    return { 
      success: false, 
      message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
    };
  }
}
