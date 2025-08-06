// Health Records Type Definitions

export type RecordType = 
  | 'NOTE'
  | 'VITAL_SIGNS'
  | 'LAB_RESULT'
  | 'PRESCRIPTION'
  | 'DIAGNOSIS'
  | 'PROCEDURE'
  | 'DOCUMENT'
  | 'IMAGE';

export type FilterType = RecordType | 'all';

export type TabType = 'all' | 'vitals' | 'summary';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface VitalTrends {
  bloodPressure: TrendDirection;
  heartRate: TrendDirection;
  weight: TrendDirection;
}

export interface VitalSigns {
  id: string;
  date: Date;
  bloodPressure: BloodPressure;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  bmi: number;
  trends?: VitalTrends;
}

export interface HealthRecord {
  id: string;
  type: RecordType;
  title: string;
  description: string;
  value: string | null;
  unit: string | null;
  recordDate: Date;
  provider: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewHealthRecord {
  type: RecordType;
  title: string;
  description: string;
  value: string;
  unit: string;
  recordDate: string; // ISO date string for form input
  provider: string;
}

export interface HealthRecordsProps {
  userId: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthRecordsApiResponse extends ApiResponse<HealthRecord[]> {}

export interface VitalSignsApiResponse extends ApiResponse<VitalSigns[]> {}

export interface CreateRecordApiResponse extends ApiResponse<HealthRecord> {}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Error handling types
export interface AppError {
  message: string;
  code?: string;
  details?: string;
}

export interface ErrorState {
  hasError: boolean;
  error: AppError | null;
  retryCount: number;
}

// Loading states
export interface LoadingState {
  records: boolean;
  vitals: boolean;
  creating: boolean;
  general: boolean;
}

// Health metrics for summary
export interface HealthMetric {
  name: string;
  status: 'normal' | 'monitor' | 'alert';
  value?: string;
  lastUpdated?: Date;
}

export interface HealthSummary {
  metrics: HealthMetric[];
  recentActivity: HealthRecord[];
  vitalsTrend: {
    bloodPressure: TrendDirection;
    heartRate: TrendDirection;
    weight: TrendDirection;
  };
}
