// client\src\services\servapi.ts

// ================================
// TYPES POUR LES FICHIERS UPLOADÉS
// ================================
export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface UploadResponse {
  message: string;
  file: UploadedFile;
}

export interface MultipleUploadResponse {
  message: string;
  files: UploadedFile[];
}

export interface FileInfo {
  filename: string;
  url: string;
  size: number;
  uploadedAt: Date;
  modifiedAt: Date;
}

// ================================
// UTILITAIRES
// ================================
export { 
  buildQueryParams, 
  apiRequest, 
  useApiData, 
  API_BASE 
} from './utils';

// ================================
// AUTHENTIFICATION
// ================================
export {
  registerUser,
  loginUser
} from './auth-api';

// ================================
// UTILISATEURS
// ================================
export {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  useUsers
} from './user-api';

// ================================
// ARTISTES
// ================================
export {
  getAllArtists,
  getArtistById,
  getArtistByUserId,
  createArtist,
  updateArtist,
  deleteArtist,
  useArtists,
  getAllArtistPortfolios,
  getArtistPortfolioById,
  getArtistPortfoliosByArtistId,
  createArtistPortfolio,
  updateArtistPortfolio,
  deleteArtistPortfolio,
  useArtistPortfolios
} from './artist-api';

// ================================
// CLUBS
// ================================
export {
  getAllClubs,
  getClubById,
  getClubByUserId,
  createClub,
  updateClub,
  deleteClub,
  useClubs,
  getAllClubLocations,
  getClubLocationById,
  getClubLocationsByClubId,
  createClubLocation,
  updateClubLocation,
  deleteClubLocation,
  useClubLocations,
  getAllClubTables,
  getClubTableById,
  getClubTablesByClubId,
  createClubTable,
  updateClubTable,
  deleteClubTable,
  useClubTables
} from './club-api';

// ================================
// ÉVÉNEMENTS
// ================================
export {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  useEvents,
  createEventArtist,
  getAllEventArtists,
  deleteEventArtist,
  updateEventArtist,
  createEventReservedTable,
  getAllEventReservedTables,
  createEventParticipant,
  getAllEventParticipants,
  updateEventParticipant,
  deleteEventParticipant
} from './event-api';

// ================================
// TICKETS
// ================================
export {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getAllTicketTypes,
  getTicketTypeById,
  createTicketType,
  updateTicketType,
  deleteTicketType,
  useTicketTypes
} from './ticket-api';

// ================================
// FEEDBACK
// ================================
export {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  useFeedback,
  createFeedbackLike,
  deleteFeedbackLike,
  getAllFeedbackLikes,
  getFeedbackLike,
  updateFeedbackLike,
  useFeedbackLikes,
  getAllFeedbackComments,
  createFeedbackComment,
  updateFeedbackComment,
  deleteFeedbackComment,
  getFeedbackComment,
  useFeedbackComments
} from './feedback-api';

// ================================
// PHOTOS
// ================================
export {
  getAllPhotos,
  getPhotoById,
  createPhoto,
  updatePhoto,
  deletePhoto,
  usePhotos,
  createPhotoLike,
  deletePhotoLike,
  getAllPhotoComments,
  createPhotoComment,
  updatePhotoComment,
  deletePhotoComment,
  usePhotoComments
} from './photo-api';

// ================================
// COLLABORATION
// ================================
export {
  getAllCollaborationMilestones,
  getCollaborationMilestoneById,
  createCollaborationMilestone,
  updateCollaborationMilestone,
  deleteCollaborationMilestone,
  useCollaborationMilestones,
  getAllCollaborationMessages,
  createCollaborationMessage,
  updateCollaborationMessage,
  deleteCollaborationMessage,
  useCollaborationMessages
} from './collaboration-api';

// ================================
// TRANSACTIONS
// ================================
export {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  useTransactions
} from './transaction-api';

// ================================
// CLIENTS
// ================================
export {
  getAllCustomerProfiles,
  getCustomerProfileById,
  createCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile,
  useCustomerProfiles,
  getAllMusicGenres,
  getMusicGenreById,
  createMusicGenre,
  updateMusicGenre,
  deleteMusicGenre,
  useMusicGenres,
  getAllDrinkTypes,
  getDrinkTypeById,
  createDrinkType,
  updateDrinkType,
  deleteDrinkType,
  useDrinkTypes,
  getAllCustomerTags,
  createCustomerTag,
  deleteCustomerTag,
  useCustomerTags
} from './customer-api';

// ================================
// PROMOTIONS
// ================================
export {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  usePromotions,
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  usePaymentMethods,
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  useInvoices
} from './promotion-api';

// ================================
// POINT DE VENTE (POS)
// ================================
export {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  useEmployees,
  getAllPosDevices,
  getPosDeviceById,
  createPosDevice,
  updatePosDevice,
  deletePosDevice,
  usePosDevices,
  getAllProductCategories,
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  useProductCategories,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  createProduct,
  updateProduct,
  deleteProduct,
  useProducts,
  getAllPosTables,
  getPosTableById,
  createPosTable,
  updatePosTable,
  deletePosTable,
  usePosTables,
  getAllOrders,
  getOrderById,
  getOrdersByTableId,
  getOrdersByEmployeeId,
  createOrder,
  updateOrder,
  deleteOrder,
  useOrders,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  useOrderItems,
  getAllPosHistory,
  getPosHistoryById,
  createPosHistory,
  updatePosHistory,
  deletePosHistory,
  usePosHistory,
  getAllPosPaymentMethods,
  getPosPaymentMethodById,
  createPosPaymentMethod,
  updatePosPaymentMethod,
  deletePosPaymentMethod,
  usePosPaymentMethods
} from './pos-api';

// ================================
// UPLOAD DE FICHIERS
// ================================
export {
  uploadFile,
  uploadMultipleFiles,
  getAllUploads,
  getFileUrl,
  deleteFile,
  downloadFile,
  useUploads
} from './file-api';

// ================================
// INVITATIONS
// ================================
export {
  getAllInvitations,
  getInvitationById,
  createInvitation,
  updateInvitation,
  deleteInvitation,
  useInvitations,
  getAllArtistInvitations,
  createArtistInvitation,
  updateArtistInvitation,
  deleteArtistInvitation,
  useArtistInvitations
} from './invitation-api';