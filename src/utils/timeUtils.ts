/**
 * Time utility functions for handling auction time calculations
 */

/**
 * Calculate time remaining from end date
 * @param endDate The auction end date string
 * @returns Formatted time remaining string or null if expired
 */
export function calculateTimeRemaining(endDate: string | null): string | null {
  if (!endDate) {
    return null;
  }

  try {
    const end = new Date(endDate);
    const now = new Date();
    
    // Check if auction has ended
    if (end <= now) {
      return null;
    }

    const timeDiff = end.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  } catch {
    // Silently handle time calculation errors
    return null;
  }
}

/**
 * Format time remaining for display (simplified version)
 * @param timeRemaining Time remaining string from API or calculated
 * @returns Formatted string for display
 */
export function formatTimeRemaining(timeRemaining: string | null): string {
  if (!timeRemaining) {
    // This shouldn't happen in marketplace since expired auctions are filtered out
    // But good to handle defensively
    return 'Ending soon';
  }

  // If it's already formatted from the API, use it
  if (timeRemaining.includes('days') || timeRemaining.includes('hours') || timeRemaining.includes('minutes')) {
    // Convert "X days, Y hours" to "Xd Yh" format for compact display
    return timeRemaining
      .replace(/(\d+)\s+days?/g, '$1d')
      .replace(/(\d+)\s+hours?/g, '$1h')
      .replace(/(\d+)\s+minutes?/g, '$1m')
      .replace(/,\s*/g, ' ')
      .trim();
  }

  return timeRemaining;
}

/**
 * Check if auction is active based on start and end dates
 * @param startDate Auction start date
 * @param endDate Auction end date
 * @returns Whether the auction is currently active
 */
export function isAuctionActive(startDate: string | null, endDate: string | null): boolean {
  if (!startDate || !endDate) {
    return false;
  }

  try {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return now >= start && now <= end;
  } catch {
    // Silently handle date parsing errors
    return false;
  }
}

/**
 * Get auction status based on dates
 * @param startDate Auction start date
 * @param endDate Auction end date
 * @param isComplete Whether the auction setup is complete
 * @returns Status string
 */
export function getAuctionStatus(
  startDate: string | null, 
  endDate: string | null, 
  isComplete: boolean = true
): string {
  if (!isComplete) {
    return 'Draft';
  }

  if (!startDate || !endDate) {
    return 'Not Started';
  }

  try {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return 'Scheduled';
    } else if (now > end) {
      return 'Ended';
    } else {
      return 'Active';
    }
  } catch {
    // Silently handle date parsing errors
    return 'Unknown';
  }
}
