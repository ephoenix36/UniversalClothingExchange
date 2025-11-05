// Logistics and Shipping Management

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  estimatedDays: number;
  price: number;
  currency: string;
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  LABEL_CREATED = 'LABEL_CREATED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  FAILED = 'FAILED',
}

export interface TrackingEvent {
  timestamp: Date;
  status: string;
  location: string;
  description: string;
}

export interface Shipment {
  id: string;
  trackingNumber?: string;
  carrier?: string;
  service?: string;
  status: ShipmentStatus;
  labelUrl?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  events: TrackingEvent[];
}

// Mock shipping rate calculator (in production, use ShipStation, EasyPost, or Shippo API)
export function calculateShippingRates(
  from: ShippingAddress,
  to: ShippingAddress,
  weight: number, // in ounces
  dimensions?: { length: number; width: number; height: number } // in inches
): ShippingRate[] {
  // Mock rates - in production, call actual shipping API
  const baseRates = [
    {
      id: 'usps_first_class',
      carrier: 'USPS',
      service: 'First Class',
      estimatedDays: 3,
      basePrice: 4.99,
    },
    {
      id: 'usps_priority',
      carrier: 'USPS',
      service: 'Priority Mail',
      estimatedDays: 2,
      basePrice: 8.99,
    },
    {
      id: 'ups_ground',
      carrier: 'UPS',
      service: 'Ground',
      estimatedDays: 5,
      basePrice: 12.99,
    },
    {
      id: 'fedex_2day',
      carrier: 'FedEx',
      service: '2Day',
      estimatedDays: 2,
      basePrice: 15.99,
    },
  ];

  // Simple distance-based multiplier (mock calculation)
  const distanceMultiplier = calculateDistanceMultiplier(from, to);
  
  // Weight-based pricing
  const weightMultiplier = Math.ceil(weight / 16); // per pound
  
  return baseRates.map((rate) => ({
    ...rate,
    price: Number((rate.basePrice * distanceMultiplier * weightMultiplier).toFixed(2)),
    currency: 'USD',
  }));
}

// Simple distance calculation based on state
function calculateDistanceMultiplier(from: ShippingAddress, to: ShippingAddress): number {
  if (from.state === to.state) return 1.0; // Same state
  if (isAdjacent(from.state, to.state)) return 1.2; // Adjacent states
  if (isSameRegion(from.state, to.state)) return 1.5; // Same region
  return 2.0; // Cross-country
}

function isAdjacent(state1: string, state2: string): boolean {
  // Mock - in production, use actual state adjacency data
  const adjacentStates: Record<string, string[]> = {
    CA: ['OR', 'NV', 'AZ'],
    NY: ['PA', 'NJ', 'CT', 'MA', 'VT'],
    TX: ['OK', 'AR', 'LA', 'NM'],
    // Add more as needed
  };
  
  return adjacentStates[state1]?.includes(state2) || false;
}

function isSameRegion(state1: string, state2: string): boolean {
  const regions = {
    west: ['CA', 'OR', 'WA', 'NV', 'AZ', 'UT', 'ID', 'MT', 'WY', 'CO', 'NM'],
    midwest: ['IL', 'IN', 'MI', 'OH', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
    south: ['TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'TN', 'KY', 'WV', 'VA', 'NC', 'SC', 'GA', 'FL'],
    northeast: ['NY', 'PA', 'NJ', 'CT', 'MA', 'RI', 'VT', 'NH', 'ME', 'MD', 'DE'],
  };
  
  for (const states of Object.values(regions)) {
    if (states.includes(state1) && states.includes(state2)) {
      return true;
    }
  }
  
  return false;
}

// Generate mock tracking number
export function generateTrackingNumber(carrier: string): string {
  const prefix = {
    USPS: '9400',
    UPS: '1Z',
    FedEx: '7712',
  }[carrier] || 'TRACK';
  
  const random = Math.random().toString(36).substring(2, 15).toUpperCase();
  return `${prefix}${random}`;
}

// Create shipping label (mock - in production, use ShipStation/EasyPost)
export async function createShippingLabel(
  rateId: string,
  from: ShippingAddress,
  to: ShippingAddress,
  weight: number
): Promise<{ labelUrl: string; trackingNumber: string; carrier: string }> {
  // Mock label creation
  const carriers = ['USPS', 'UPS', 'FedEx'];
  const carrier = carriers[Math.floor(Math.random() * carriers.length)];
  const trackingNumber = generateTrackingNumber(carrier);
  
  // In production, this would call the shipping API and return actual label
  return {
    labelUrl: `https://example.com/labels/${trackingNumber}.pdf`,
    trackingNumber,
    carrier,
  };
}

// Track shipment (mock - in production, use real tracking API)
export async function trackShipment(trackingNumber: string): Promise<TrackingEvent[]> {
  // Mock tracking events
  const now = new Date();
  const events: TrackingEvent[] = [
    {
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      status: 'LABEL_CREATED',
      location: 'Origin Facility',
      description: 'Shipping label created',
    },
    {
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      status: 'IN_TRANSIT',
      location: 'Distribution Center',
      description: 'Package in transit',
    },
    {
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      status: 'OUT_FOR_DELIVERY',
      location: 'Local Facility',
      description: 'Out for delivery',
    },
  ];
  
  return events;
}

// Calculate estimated delivery date
export function calculateEstimatedDelivery(estimatedDays: number): Date {
  const now = new Date();
  const delivery = new Date(now);
  delivery.setDate(delivery.getDate() + estimatedDays);
  
  // Skip weekends
  while (delivery.getDay() === 0 || delivery.getDay() === 6) {
    delivery.setDate(delivery.getDate() + 1);
  }
  
  return delivery;
}
