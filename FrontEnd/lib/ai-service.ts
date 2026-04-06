/**
 * AI Service for Pet Health Analysis
 * This service handles communication with AI APIs for pet health analysis,
 * image/video processing, and health recommendations.
 */

export interface AIAnalysisRequest {
  file: File
  petId: string
  petType: string
  petBreed: string
  petAge: number
  additionalContext?: string
}

export interface AIAnalysisResponse {
  success: boolean
  analysis: PetHealthAnalysis
  error?: string
}

export interface PetHealthAnalysis {
  petId: string
  overallStatus: "healthy" | "attention-needed" | "concerning" | "urgent"
  confidence: number
  findings: Array<{
    type: "behavior" | "physical" | "environmental"
    concern: string
    severity: "low" | "medium" | "high"
    recommendation: string
  }>
  moodAnalysis?: {
    dominantEmotion: string
    confidence: number
    emotions: Array<{ emotion: string; confidence: number }>
  }
  vitals?: {
    estimatedHeartRate?: number
    activityLevel?: "low" | "moderate" | "high"
    stressLevel?: "low" | "moderate" | "high"
  }
  recommendations: string[]
  followUpActions: string[]
  timestamp: Date
}

export interface AIChatRequest {
  message: string
  petId?: string
  userRole?: "visitor" | "user" | "trainer" | "worker" | "admin"
  conversationHistory?: Array<{
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }>
  context?: {
    recentActivities?: any[]
    currentMood?: string
    healthStatus?: string
  }
}

export interface AIChatResponse {
  success: boolean
  response: string
  suggestions?: string[]
  followUpQuestions?: string[]
  error?: string
}

export interface AIHealthInsights {
  petId: string
  period: "daily" | "weekly" | "monthly"
  insights: {
    overallTrend: "improving" | "stable" | "declining"
    keyMetrics: {
      healthScore: number
      activityLevel: number
      moodScore: number
      routineConsistency: number
    }
    patterns: Array<{
      type: string
      description: string
      frequency: string
      impact: "positive" | "neutral" | "concerning"
    }>
    recommendations: string[]
    alerts: Array<{
      type: "health" | "behavior" | "routine"
      message: string
      priority: "low" | "medium" | "high"
    }>
  }
  generatedAt: Date
}

class AIService {
  private baseUrl: string

  constructor() {
    this.baseUrl = "/api/ai-scan"
  }

  /**
   * Analyze pet photo or video for health indicators
   */
  async analyzeMedia(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      // For demo purposes, simulate AI analysis
      // In production, this would call your actual AI service
      
      const formData = new FormData()
      formData.append('file', request.file)
      formData.append('petId', request.petId)
      formData.append('petType', request.petType)
      formData.append('petBreed', request.petBreed)
      formData.append('petAge', request.petAge.toString())
      
      if (request.additionalContext) {
        formData.append('context', request.additionalContext)
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        // Omit headers, letting browser process multipart/form-data naturally
        body: formData
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

      // In production, you would make an actual API call:
      /*
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        analysis: data.analysis
      }
      */
    } catch (error) {
      console.error('AI analysis failed:', error)
      return {
        success: false,
        analysis: {} as PetHealthAnalysis,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Chat with AI assistant for pet health advice
   */
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'chat', request })
      });

      if (!response.ok) {
        throw new Error(`AI chat error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

      // In production:
      /*
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`AI chat error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        response: data.response,
        suggestions: data.suggestions,
        followUpQuestions: data.followUpQuestions
      }
      */
    } catch (error) {
      console.error('AI chat failed:', error)
      return {
        success: false,
        response: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Generate comprehensive health insights based on pet data
   */
  async generateHealthInsights(
    petId: string, 
    period: "daily" | "weekly" | "monthly"
  ): Promise<AIHealthInsights> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'insights', petId, period })
      });

      if (!response.ok) {
        throw new Error(`AI insights error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

      // In production:
      /*
      const response = await fetch(`${this.baseUrl}/insights/${petId}?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      })

      if (!response.ok) {
        throw new Error(`AI insights error: ${response.statusText}`)
      }

      const data = await response.json()
      return data
      */
    } catch (error) {
      console.error('Health insights generation failed:', error)
      throw error
    }
  }
}

// Export singleton instance
export const aiService = new AIService()
