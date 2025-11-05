import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { trackShipment } from '@/lib/logistics';

/**
 * GET /api/shipping/track/[trackingNumber]
 * Track a shipment
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const { trackingNumber } = await params;
    
    // Get shipment
    const shipment = await prisma.shipment.findFirst({
      where: { trackingNumber },
      include: {
        item: {
          select: {
            title: true,
            ownerId: true,
          },
        },
      },
    });
    
    if (!shipment) {
      return NextResponse.json(
        { success: false, error: 'Shipment not found' },
        { status: 404 }
      );
    }
    
    // Verify user is involved in this shipment
    // (either sender or recipient - would need to check swap/sale records)
    
    // Get tracking events
    const events = await trackShipment(trackingNumber);
    
    return NextResponse.json({
      success: true,
      shipment: {
        trackingNumber: shipment.trackingNumber,
        carrier: shipment.carrier,
        service: shipment.service,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        actualDelivery: shipment.actualDelivery,
        itemTitle: shipment.item.title,
      },
      events,
    });
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track shipment' },
      { status: 500 }
    );
  }
}
