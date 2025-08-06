import { 
  HealthRecord, 
  VitalSigns, 
  NewHealthRecord, 
  HealthRecordsApiResponse, 
  VitalSignsApiResponse, 
  CreateRecordApiResponse,
  AppError 
} from '@/types/health';

// Base API configuration
const API_BASE_URL = '/api';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'Network error or server unavailable',
      0,
      'NETWORK_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

// Health Records API functions
export const healthRecordsApi = {
  // Get health records for a patient
  async getRecords(
    patientId: string, 
    type?: string, 
    limit?: number
  ): Promise<HealthRecord[]> {
    const params = new URLSearchParams({ patientId });
    if (type && type !== 'all') params.append('type', type);
    if (limit) params.append('limit', limit.toString());

    return apiRequest<HealthRecord[]>(`/health-records?${params}`);
  },

  // Create a new health record
  async createRecord(
    patientId: string, 
    record: NewHealthRecord
  ): Promise<HealthRecord> {
    return apiRequest<HealthRecord>('/health-records', {
      method: 'POST',
      body: JSON.stringify({ patientId, ...record }),
    });
  },

  // Update a health record
  async updateRecord(
    id: string, 
    updates: Partial<NewHealthRecord>
  ): Promise<HealthRecord> {
    return apiRequest<HealthRecord>('/health-records', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
  },

  // Delete a health record
  async deleteRecord(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/health-records?id=${id}`, {
      method: 'DELETE',
    });
  },
};

// Vital Signs API functions
export const vitalSignsApi = {
  // Get vital signs for a patient
  async getVitalSigns(
    patientId: string, 
    days?: number, 
    limit?: number
  ): Promise<VitalSigns[]> {
    const params = new URLSearchParams({ patientId });
    if (days) params.append('days', days.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await apiRequest<any[]>(`/vital-signs?${params}`);
    
    // Transform API response to match our VitalSigns interface
    return response.map(item => ({
      id: item.id,
      date: new Date(item.recordDate),
      bloodPressure: {
        systolic: item.systolic || 0,
        diastolic: item.diastolic || 0,
      },
      heartRate: item.heartRate || 0,
      temperature: item.temperature || 0,
      weight: item.weight || 0,
      height: item.height || 0,
      bmi: item.bmi || 0,
    }));
  },

  // Create new vital signs record
  async createVitalSigns(
    patientId: string,
    vitals: {
      systolic?: number;
      diastolic?: number;
      heartRate?: number;
      temperature?: number;
      weight?: number;
      height?: number;
      recordDate: string;
    }
  ): Promise<any> {
    return apiRequest('/vital-signs', {
      method: 'POST',
      body: JSON.stringify({ patientId, ...vitals }),
    });
  },
};

// Error handling utilities
export function handleApiError(error: unknown): AppError {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

// Retry logic for failed requests
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
}

// Validation utilities
export function validateHealthRecord(record: NewHealthRecord): string[] {
  const errors: string[] = [];
  
  if (!record.title.trim()) {
    errors.push('Title is required');
  }
  
  if (!record.provider.trim()) {
    errors.push('Provider is required');
  }
  
  if (!record.recordDate) {
    errors.push('Record date is required');
  }
  
  // Validate date format
  if (record.recordDate && isNaN(Date.parse(record.recordDate))) {
    errors.push('Invalid date format');
  }
  
  return errors;
}
