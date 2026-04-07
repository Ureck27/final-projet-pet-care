// AI Pet Analyzer Service
// This service analyzes pet images and returns health status
// Currently uses mock responses, can be connected to real AI API later

class AIPetAnalyzer {
  /**
   * Analyze pet image and return status
   * @param {string} imageUrl - URL of the pet image
   * @returns {Promise<Object>} Analysis result
   */
  async analyzePetImage(imageUrl) {
    try {
      // Mock AI analysis - replace with real AI API call
      const mockResults = [
        {
          status: 'healthy',
          message: 'Pet looks active and healthy',
        },
        {
          status: 'active',
          message: 'Pet appears energetic and playful',
        },
        {
          status: 'resting',
          message: 'Pet is resting calmly',
        },
        {
          status: 'alert',
          message: 'Pet is alert and attentive',
        },
        {
          status: 'concerned',
          message: 'Pet may need attention - monitor behavior',
        },
        {
          status: 'injured',
          message: 'Pet appears injured - immediate veterinary attention needed',
        },
        {
          status: 'sick',
          message: 'Pet shows signs of illness - consult veterinarian',
        },
        {
          status: 'abnormal',
          message: 'Unusual behavior detected - further investigation needed',
        },
      ];

      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Randomly select a result (90% chance of positive, 10% chance of concerning)
      const randomIndex =
        Math.random() < 0.9 ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 4) + 4;

      const result = mockResults[randomIndex];

      return {
        success: true,
        status: result.status,
        message: result.message,
        imageUrl: imageUrl,
        analyzedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        status: 'error',
        message: 'Failed to analyze image',
        error: error.message,
      };
    }
  }

  /**
   * Check if status requires immediate attention
   * @param {string} status - Pet status from AI analysis
   * @returns {boolean} - True if immediate attention needed
   */
  requiresImmediateAttention(status) {
    const urgentStatuses = ['injured', 'sick', 'abnormal'];
    return urgentStatuses.includes(status);
  }

  /**
   * Get notification recipients based on status
   * @param {string} status - Pet status from AI analysis
   * @returns {Array} - List of recipient types
   */
  getNotificationRecipients(status) {
    if (this.requiresImmediateAttention(status)) {
      return ['owner', 'admin', 'trainer'];
    }
    return ['owner'];
  }
}

module.exports = new AIPetAnalyzer();
