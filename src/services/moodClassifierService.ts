// ========================================
// MOOD CLASSIFIER API SERVICE
// ========================================

export interface MoodAnalysisRequest {
  text: string;
  streakDays?: number;
  communityMood?: number;
  tradingActivity?: number;
}

export interface FlowerArtParameters {
  currentEmotion: string;
  confidence: number;
  confidencePercentage: number;
  petalParams: {
    layerCount: number;
    petalCount: number;
    baseLayerRadius: number;
    layerRadiusDecrease: number;
    petalRotation: number;
    layerRotations: number[];
    layerOffsets: number[];
    geometrySegments: number;
    geometryPhiStart: number;
    geometryPhiLength: number;
    geometryThetaStart: number;
    geometryThetaLength: number;
  };
  petalOpenCloseParams: {
    minOpenAngle: number;
    maxOpenAngle: number;
    openCloseSpeed: number;
    individualLayerControl: boolean;
    layerOpenCloseRanges: Array<{ min: number; max: number }>;
  };
  heartbeatSettings: {
    bpm: number;
    intensity: number;
  };
  heartbeatParams: {
    pulseUpdateRate: number;
    dualPulseEnabled: boolean;
    secondaryPulseIntensity: number;
    glowIntensityRange: { min: number; max: number };
    bpmRange: { min: number; max: number };
  };
  moodSettings: {
    intensity: number;
    direction: number;
  };
  rotationParams: {
    rotationUpdateRate: number;
    alternatingEnabled: boolean;
    individualLayerRotation: boolean;
    rotationIntensityRange: { min: number; max: number };
    directionOptions: { clockwise: number; counterclockwise: number };
  };
  stalkParams: {
    baseLength: number;
    minLength: number;
    maxLength: number;
    communityMoodThreshold: number;
    communityMoodMultiplier: number;
    growthSpeed: number;
    decaySpeed: number;
    currentLength: number;
  };
  connectorParams: {
    baseColor: string;
    tradingActivityColors: {
      low: string;
      medium: string;
      high: string;
      veryHigh: string;
    };
    tradingActivityThresholds: {
      low: number;
      medium: number;
      high: number;
    };
    colorTransitionSpeed: number;
    currentColor: string;
  };
  beeParams: {
    baseScale: number;
    basePosition: { x: number; y: number; z: number };
    wingSpeed: number;
    wingFlapRange: number;
    wingFlapIntensity: number;
    appearanceThreshold: number;
    flightBobSpeed: number;
    flightBobAmplitude: number;
    rotationSpeed: number;
    rotationAmplitude: number;
    shouldAppear: boolean;
  };
  beeStreakRanges: {
    "3-7": { xRange: { min: number; max: number }; zRange: { min: number; max: number }; yRange: { min: number; max: number } };
    "7-14": { xRange: { min: number; max: number }; zRange: { min: number; max: number }; yRange: { min: number; max: number } };
    "14-21": { xRange: { min: number; max: number }; zRange: { min: number; max: number }; yRange: { min: number; max: number } };
    "21+": { xRange: { min: number; max: number }; zRange: { min: number; max: number }; yRange: { min: number; max: number } };
  };
  streakParams: {
    goodMoodThreshold: number;
    streakDecayRate: number;
    maxStreakDays: number;
    streakMultiplier: number;
    currentStreakDays: number;
    streakFeatures: {
      beeAppearance: boolean;
      beeRangeControl: boolean;
      stalkGrowth: boolean;
      glowIntensity: boolean;
      rotationSpeed: boolean;
    };
  };
}

export interface MoodAnalysisResponse {
  success: boolean;
  data: FlowerArtParameters;
  error?: string;
}

class MoodClassifierService {
  private baseUrl: string;

  constructor() {
    // Use environment variable or default to local development
    this.baseUrl = process.env.NEXT_PUBLIC_MOOD_CLASSIFIER_API_URL || 'http://localhost:5001';
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

  async getExample(): Promise<{ example_request: any; example_response: FlowerArtParameters }> {
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
