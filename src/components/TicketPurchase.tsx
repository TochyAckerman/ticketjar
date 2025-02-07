import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Event, TicketType } from '../types/event';
import { PromoCode } from '../types/ticket';
import QRCode from 'qrcode.react';

interface TicketPurchaseProps {
  event: Event;
  onPurchaseComplete: () => void;
  onCancel: () => void;
}

interface TicketSelection {
  [key: string]: number;
}

const TicketPurchase: React.FC<TicketPurchaseProps> = ({
  event,
  onPurchaseComplete,
  onCancel
}) => {
  const { user } = useAuth();
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection>({});
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTicketChange = (ticketTypeId: string, quantity: number) => {
    if (quantity < 0) return;
    
    const ticketType = event.ticketTypes.find(t => t.id === ticketTypeId);
    if (!ticketType) return;

    if (quantity > ticketType.maxPerCustomer) {
      setError(`Maximum ${ticketType.maxPerCustomer} tickets allowed per customer for ${ticketType.name}`);
      return;
    }

    setSelectedTickets(prev => ({
      ...prev,
      [ticketTypeId]: quantity
    }));
    setError('');
  };

  const calculateSubtotal = () => {
    return event.ticketTypes.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.id] || 0;
      return total + (ticket.price * quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;

    const subtotal = calculateSubtotal();
    if (appliedPromo.minPurchaseAmount && subtotal < appliedPromo.minPurchaseAmount) {
      return 0;
    }

    return appliedPromo.discountType === 'Percentage'
      ? subtotal * (appliedPromo.discountValue / 100)
      : appliedPromo.discountValue;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return subtotal - discount;
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      // TODO: Implement API call to validate promo code
      const response = await fetch(`/api/events/${event.id}/promo-codes/${promoCode}`);
      if (!response.ok) {
        throw new Error('Invalid promo code');
      }
      const promoData: PromoCode = await response.json();
      setAppliedPromo(promoData);
      setError('');
    } catch (err) {
      setError('Invalid promo code');
      setAppliedPromo(null);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      setError('Please log in to purchase tickets');
      return;
    }

    const ticketCount = Object.values(selectedTickets).reduce((a, b) => a + b, 0);
    if (ticketCount === 0) {
      setError('Please select at least one ticket');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // TODO: Implement API call to process purchase
      const purchaseData = {
        eventId: event.id,
        tickets: Object.entries(selectedTickets).map(([ticketTypeId, quantity]) => ({
          ticketTypeId,
          quantity
        })),
        promoCode: appliedPromo?.code
      };

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseData)
      });

      if (!response.ok) {
        throw new Error('Failed to process purchase');
      }

      onPurchaseComplete();
    } catch (err) {
      setError('Failed to process purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Purchase Tickets</h2>
      
      {/* Ticket Selection */}
      <div className="space-y-4 mb-6">
        {event.ticketTypes.map(ticket => (
          <div key={ticket.id} className="flex items-center justify-between p-4 border rounded">
            <div>
              <h3 className="font-semibold">{ticket.name}</h3>
              <p className="text-sm text-gray-500">{ticket.description}</p>
              <p className="text-green-600 font-medium">${ticket.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleTicketChange(ticket.id, (selectedTickets[ticket.id] || 0) - 1)}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                -
              </button>
              <span className="w-8 text-center">{selectedTickets[ticket.id] || 0}</span>
              <button
                onClick={() => handleTicketChange(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleApplyPromoCode}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Apply
          </button>
        </div>
        {appliedPromo && (
          <p className="text-green-600 text-sm mt-2">
            Promo code applied: {appliedPromo.discountValue}
            {appliedPromo.discountType === 'Percentage' ? '%' : '$'} off
          </p>
        )}
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4 mb-6">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          {appliedPromo && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${calculateDiscount().toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {isProcessing ? 'Processing...' : 'Purchase'}
        </button>
      </div>
    </div>
  );
};

export default TicketPurchase; 