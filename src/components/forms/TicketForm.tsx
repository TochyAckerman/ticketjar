import React from 'react';
import { TicketType } from '../../types/event';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/helpers';

interface TicketFormProps {
  ticketTypes: TicketType[];
  selectedTickets: Record<string, number>;
  onTicketChange: (ticketTypeId: string, quantity: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  error?: string;
  submitLabel?: string;
}

const TicketForm: React.FC<TicketFormProps> = ({
  ticketTypes,
  selectedTickets,
  onTicketChange,
  onSubmit,
  isSubmitting = false,
  error,
  submitLabel = 'Purchase Tickets'
}) => {
  const calculateSubtotal = () => {
    return ticketTypes.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.id] || 0;
      return total + (ticket.price * quantity);
    }, 0);
  };

  const hasSelectedTickets = Object.values(selectedTickets).some(quantity => quantity > 0);

  return (
    <div className="space-y-6">
      {ticketTypes.map(ticket => (
        <div key={ticket.id} className="flex items-center justify-between p-4 border rounded">
          <div>
            <h3 className="font-semibold">{ticket.name}</h3>
            <p className="text-sm text-gray-500">{ticket.description}</p>
            <p className="text-green-600 font-medium">{formatCurrency(ticket.price)}</p>
            {ticket.maxPerCustomer && (
              <p className="text-xs text-gray-500">
                Max {ticket.maxPerCustomer} per customer
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onTicketChange(ticket.id, (selectedTickets[ticket.id] || 0) - 1)}
              disabled={!selectedTickets[ticket.id]}
            >
              -
            </Button>
            <span className="w-8 text-center">{selectedTickets[ticket.id] || 0}</span>
            <Button
              variant="outline"
              onClick={() => onTicketChange(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}
              disabled={selectedTickets[ticket.id] === ticket.maxPerCustomer}
            >
              +
            </Button>
          </div>
        </div>
      ))}

      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(calculateSubtotal())}</span>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <Button
        variant="primary"
        onClick={onSubmit}
        isLoading={isSubmitting}
        disabled={!hasSelectedTickets || isSubmitting}
        fullWidth
      >
        {submitLabel}
      </Button>
    </div>
  );
};

export default TicketForm; 