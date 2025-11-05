/**
 * Basic infrastructure test to verify setup is working
 */
import { describe, it, expect } from 'vitest';
import { 
  createMockUser, 
  createMockWardrobeItem, 
  createMockSwapRequest,
  resetMockIds 
} from './utils/mockData';

describe('Testing Infrastructure', () => {
  it('should have vitest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should have access to mock data factories', () => {
    resetMockIds();
    const user = createMockUser({ displayName: 'Test User' });
    
    expect(user).toBeDefined();
    expect(user.displayName).toBe('Test User');
    expect(user.email).toContain('@example.com');
  });

  it('should create mock wardrobe items', () => {
    const item = createMockWardrobeItem({ title: 'Blue Jeans' });
    
    expect(item).toBeDefined();
    expect(item.title).toBe('Blue Jeans');
    expect(item.color).toContain('Blue');
  });

  it('should create mock swap requests', () => {
    const swap = createMockSwapRequest();
    
    expect(swap).toBeDefined();
    expect(swap.status).toBe('PENDING');
    expect(swap.requesterId).toBeDefined();
    expect(swap.ownerId).toBeDefined();
  });

  it('should handle environment variables', () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_WHOP_APP_ID).toBeDefined();
  });
});
