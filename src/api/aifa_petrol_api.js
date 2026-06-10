// src/api/aifa_petrol_api.js

const API_BASE_URL = 'http://84.16.235.111:2107/api';

export const aifaPetrolAPI = {
  /**
   * @param {string} startDate - Format: YYYY-MM-DD (optional)
   * @param {string} endDate - Format: YYYY-MM-DD (optional)
   * @returns {Promise<Object>} 
   */
  async getProjectSession(startDate, endDate) {
    try {
      // Build URL with query parameters
      let url = `${API_BASE_URL}/aifa_petrol/project_session`;
      
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching project session:', error);
      throw error;
    }
  },

  /**
   * @param {string} startDate - Format: YYYY-MM-DD (optional)
   * @param {string} endDate - Format: YYYY-MM-DD (optional)
   * @returns {Promise<Object|null>} 
   */
  async getGrandTotal(startDate, endDate) {
    try {
      const response = await this.getProjectSession(startDate, endDate);
      
      if (response.success && response.data) {
        const grandTotal = response.data.find(item => item.session_date === 'Grand Total');
        return grandTotal || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching grand total:', error);
      return null;
    }
  }
};