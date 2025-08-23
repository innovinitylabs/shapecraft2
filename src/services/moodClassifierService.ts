// ========================================
// MOOD CLASSIFIER API SERVICE
// ========================================

import { FlowerArtParameters } from './moodClassifierService';

export interface MoodAnalysisRequest {
  text: string;
  streakDays?: number;
  communityMood?: number;
  tradingActivity?: number;
}

export interface MoodAnalysisResponse {
  success: boolean;
  data: FlowerArtParameters;
  error?: string;
}

class MoodClassifierService {
  private baseUrl: string;

  constructor() {
    // Use Railway backend URL - update this with your actual Railway URL
    this.baseUrl = process.env.NEXT_PUBLIC_MOOD_CLASSIFIER_API_URL || 'https://shapes-of-mood-classifier-production.up.railway.app';
  }

  async analyzeMood(request: MoodAnalysisRequest): Promise<FlowerArtParameters> {
    try {
      const response = await fetch(`${this.baseUrl}/api/mood-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          streakDays: request.streakDays || 0,
          communityMood: request.communityMood || 0.5,
          tradingActivity: request.tradingActivity || 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: MoodAnalysisResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Mood analysis failed');
      }

      return result.data;
    } catch (error) {
      console.error('Mood analysis error:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async getExample(): Promise<{ example_request: Record<string, unknown>; example_response: FlowerArtParameters }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/example`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Example request failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const moodClassifierService = new MoodClassifierService();
