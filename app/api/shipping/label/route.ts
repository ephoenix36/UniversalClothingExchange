import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { 
  createShippingLabel, 
  calculateEstimatedDelivery,
  type ShippingAddress 
} from '@/lib/logistics';

/**
 * POST /api/shipping/label
 * Create shipping label for a swap or sale
 */
export async function POST(request: NextRequest) {
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
    
    const body = await request.json();
    const { itemId, rateId, toAddress } = body;
    
    if (!itemId || !rateId || !toAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get item
    const item = await prisma.wardrobeItem.findUnique({
      where: { id: itemId },
      include: {
        owner: {
          select: {
            id: true,
            shippingAddress: true,
          },
        },
      },
    });
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Verify user owns the item
    if (item.owner.id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const fromAddress = item.owner.shippingAddress as ShippingAddress;
    const weight = item.weight || 8;
    
    // Create label
    const label = await createShippingLabel(rateId, fromAddress, toAddress, weight);
    
    // Get the service details from rateId
    const [carrier, service] = rateId.split('_');
    const estimatedDays = service === 'priority' ? 2 : service === 'first' ? 3 : 5;
    
    // Create shipment record
    const shipment = await prisma.shipment.create({
      data: {
        itemId: item.id,
        trackingNumber: label.trackingNumber,
        carrier: label.carrier,
        service: service.toUpperCase(),
        status: 'LABEL_CREATED',
        labelUrl: label.labelUrl,
        estimatedDelivery: calculateEstimatedDelivery(estimatedDays),
        fromAddress: fromAddress as any,
        toAddress: toAddress as any,
      },
    });
    
    return NextResponse.json({
      success: true,
      shipment: {
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        carrier: shipment.carrier,
        labelUrl: shipment.labelUrl,
        estimatedDelivery: shipment.estimatedDelivery,
      },
    });
  } catch (error) {
    console.error('Error creating shipping label:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create shipping label' },
      { status: 500 }
    );
  }
}
