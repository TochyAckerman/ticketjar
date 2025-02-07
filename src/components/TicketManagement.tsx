import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Ticket } from '../types/ticket';
import { QRCodeSVG } from 'qrcode.react';
import { useApi, api } from '../hooks/useApi';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { STATUS_COLORS } from '../utils/constants';
import { formatDateTime, validateEmail } from '../utils/helpers';

interface TicketManagementProps {
  ticket: Ticket;
  onTransferComplete?: () => void;
}

const TicketManagement: React.FC<TicketManagementProps> = ({
  ticket,
  onTransferComplete
}) => {
  const { user } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  const { execute: transferTicket, error, isLoading } = useApi<{ id: string }>(
    async (data: { ticketId: string; toEmail: string }) => {
      const result = await api.tickets.transfer(data);
      return { data: result.data?.[0] || null, error: result.error };
    },
    {
      onSuccess: () => {
        setIsTransferModalOpen(false);
        onTransferComplete?.();
      }
    }
  );

  const handleTransferTicket = async () => {
    if (!user) return;
    if (!validateEmail(recipientEmail)) {
      return;
    }

    await transferTicket({
      ticketId: ticket.id,
      toEmail: recipientEmail
    });
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold">Ticket #{ticket.id}</h3>
          <p className="text-gray-500 mt-1">Purchase ID: {ticket.purchaseId}</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[ticket.status]} mt-2`}>
            {ticket.status}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowQRCode(!showQRCode)}
        >
          {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
        </Button>
      </div>

      {showQRCode && (
        <div className="mb-6 flex flex-col items-center">
          <QRCodeSVG value={ticket.qrCode} size={200} />
          <p className="text-sm text-gray-500 mt-2">
            Present this QR code at the event entrance
          </p>
        </div>
      )}

      {ticket.status === 'Valid' && (
        <Button
          variant="primary"
          fullWidth
          onClick={() => setIsTransferModalOpen(true)}
        >
          Transfer Ticket
        </Button>
      )}

      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Transfer Ticket"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter recipient's email"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error.message}</p>
          )}

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsTransferModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleTransferTicket}
              isLoading={isLoading}
              fullWidth
            >
              Transfer
            </Button>
          </div>
        </div>
      </Modal>

      <div className="mt-6 space-y-2 text-sm text-gray-500">
        {ticket.transferredFrom && (
          <p>Transferred from: {ticket.transferredFrom}</p>
        )}
        {ticket.transferredTo && (
          <p>Transferred to: {ticket.transferredTo}</p>
        )}
        {ticket.usedAt && (
          <p>Used on: {formatDateTime(ticket.usedAt)}</p>
        )}
        {ticket.promoCodeUsed && (
          <p>Promo code used: {ticket.promoCodeUsed}</p>
        )}
      </div>
    </Card>
  );
};

export default TicketManagement; 