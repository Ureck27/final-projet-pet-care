// Mock AI Scanner Service

/**
 * Simulates analyzing a pet's image or video using AI to determine health status.
 * @param {string} imageUrl URL of the pet's image
 * @param {string} videoUrl URL of the pet's video
 * @returns {Promise<Object>} The analysis result containing status, description, and recommendations.
 */
const analyzePetMedia = async (imageUrl, videoUrl) => {
  // Simulate network or processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // If no media is provided, we can't analyze
  if (!imageUrl && !videoUrl) {
    return {
      status: 'healthy',
      description: 'No media provided for AI analysis.',
      recommendations: 'Upload an image or video for a visual symptom check.',
    };
  }

  // Generate a random mock result to simulate real-world variance
  const randomizer = Math.random();

  if (randomizer > 0.8) {
    return {
      status: 'critical',
      description:
        'AI detected signs of severe lethargy or visible injury. The pet appears distressed.',
      recommendations: 'Consult a veterinarian immediately. Urgent medical attention is advised.',
    };
  } else if (randomizer > 0.5) {
    return {
      status: 'warning',
      description:
        'AI noticed mild symptoms such as slight limping, dull coat, or unusual posture.',
      recommendations:
        'Monitor the pet closely for the next 48 hours. Consider scheduling a non-urgent vet checkup.',
    };
  } else {
    return {
      status: 'healthy',
      description: 'AI analysis indicates the pet appears vibrant, active, and healthy.',
      recommendations:
        'Maintain current diet and exercise routine. Regular annual checkups are sufficient.',
    };
  }
};

module.exports = { analyzePetMedia };
