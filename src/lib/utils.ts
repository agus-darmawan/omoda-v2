/**
 * Calculate the average speed from an array of speed values.
 * 
 * @param speedHistory - An array of speed values
 * @returns The average speed rounded to 2 decimal places
 */
export const calculateAverageSpeed = (speedHistory: number[]): number => {
    if (speedHistory.length === 0) return 0;
    const totalSpeed = speedHistory.reduce((acc, curr) => acc + curr, 0);
    return parseFloat((totalSpeed / speedHistory.length).toFixed(2));
  };
  
  /**
   * Retrieve the speed history from localStorage.
   * 
   * @returns A parsed array of speed values, or an empty array if no data is found
   */
  export const getSpeedHistory = (): number[] => {
    const speedHistory = localStorage.getItem('speedData');
    return speedHistory ? JSON.parse(speedHistory) : [];
  };
  
  /**
   * Format elapsed time (in seconds) into a more human-readable format (days, hours, minutes, and seconds).
   * 
   * @param seconds - The total elapsed time in seconds
   * @returns A formatted string displaying days, hours, minutes, and seconds
   */
  export const formatElapsedTime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };
  