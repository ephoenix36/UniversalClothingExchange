import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * POST /api/users/gemini-key
 * Save user's Gemini API key for AI features
 * IMPORTANT: This is stored securely and never exposed to other users
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
    const { geminiApiKey } = body;
    
    if (!geminiApiKey || !geminiApiKey.startsWith('AIza')) {
      return NextResponse.json(
        { success: false, error: 'Invalid Gemini API key format' },
        { status: 400 }
      );
    }
    
    // Store the API key securely
    await prisma.user.update({
      where: { id: user.id },
      data: { geminiApiKey },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Gemini API key saved successfully',
    });
  } catch (error) {
    console.error('Error saving Gemini key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save API key' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/gemini-key
 * Check if user has configured Gemini API key
 */
export async function GET(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
      select: { geminiApiKey: true },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      hasKey: !!user.geminiApiKey,
      // Never return the actual key
    });
  } catch (error) {
    console.error('Error checking Gemini key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check API key' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/gemini-key
 * Remove user's Gemini API key
 */
export async function DELETE(request: NextRequest) {
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
    
    await prisma.user.update({
      where: { id: user.id },
      data: { geminiApiKey: null },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Gemini API key removed',
    });
  } catch (error) {
    console.error('Error removing Gemini key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove API key' },
      { status: 500 }
    );
  }
}
