export type TicketStatus = 'Valid' | 'Used' | 'Transferred' | 'Cancelled';

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  validFrom: string;
  validUntil: string;
  maxUses?: number;
  currentUses: number;
  minPurchaseAmount?: number;
  applicableEventIds?: string[];
  applicableTicketTypes?: string[];
}

export interface Ticket {
  id: string;
  eventId: string;
  ticketTypeId: string;
  userId: string;
  purchaseId: string;
  status: TicketStatus;
  qrCode: string;
  price: number;
  discountApplied?: number;
  promoCodeUsed?: string;
  transferredTo?: string;
  transferredFrom?: string;
  transferredAt?: string;
  usedAt?: string;
  createdAt: string;
}

export interface TicketPurchase {
  id: string;
  userId: string;
  eventId: string;
  tickets: {
    ticketTypeId: string;
    quantity: number;
  }[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  promoCode?: string;
  status: 'Pending' | 'Completed' | 'Failed';
  createdAt: string;
  completedAt?: string;
}

export interface TicketTransfer {
  id: string;
  ticketId: string;
  fromUserId: string;
  toEmail: string;
  toUserId?: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  transferCode: string;
  expiresAt: string;
  createdAt: string;
  completedAt?: string;
} 