import { NewHealthRecord, ValidationError, FormValidationResult, RecordType } from '@/types/health';

// Sanitization functions
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeNumber(input: string): number | null {
  const num = parseFloat(input.trim());
  return isNaN(num) ? null : num;
}

// Validation rules
const VALIDATION_RULES = {
  title: {
    required: true,
    minLength: 2,
    maxLength: 200,
  },
  provider: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  description: {
    required: false,
    maxLength: 1000,
  },
  value: {
    required: false,
    maxLength: 50,
  },
  unit: {
    required: false,
    maxLength: 20,
  },
};

const VALID_RECORD_TYPES: RecordType[] = [
  'NOTE',
  'VITAL_SIGNS',
  'LAB_RESULT',
  'PRESCRIPTION',
  'DIAGNOSIS',
  'PROCEDURE',
  'DOCUMENT',
  'IMAGE'
];

// Field validation functions
export function validateTitle(title: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const sanitized = sanitizeString(title);
  
  if (!sanitized) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (sanitized.length < VALIDATION_RULES.title.minLength) {
    errors.push({ field: 'title', message: `Title must be at least ${VALIDATION_RULES.title.minLength} characters` });
  } else if (sanitized.length > VALIDATION_RULES.title.maxLength) {
    errors.push({ field: 'title', message: `Title must be less than ${VALIDATION_RULES.title.maxLength} characters` });
  }
  
  return errors;
}

export function validateProvider(provider: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const sanitized = sanitizeString(provider);
  
  if (!sanitized) {
    errors.push({ field: 'provider', message: 'Provider is required' });
  } else if (sanitized.length < VALIDATION_RULES.provider.minLength) {
    errors.push({ field: 'provider', message: `Provider must be at least ${VALIDATION_RULES.provider.minLength} characters` });
  } else if (sanitized.length > VALIDATION_RULES.provider.maxLength) {
    errors.push({ field: 'provider', message: `Provider must be less than ${VALIDATION_RULES.provider.maxLength} characters` });
  }
  
  return errors;
}

export function validateDescription(description: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const sanitized = sanitizeString(description);
  
  if (sanitized.length > VALIDATION_RULES.description.maxLength) {
    errors.push({ field: 'description', message: `Description must be less than ${VALIDATION_RULES.description.maxLength} characters` });
  }
  
  return errors;
}

export function validateValue(value: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const sanitized = sanitizeString(value);
  
  if (sanitized.length > VALIDATION_RULES.value.maxLength) {
    errors.push({ field: 'value', message: `Value must be less than ${VALIDATION_RULES.value.maxLength} characters` });
  }
  
  return errors;
}

export function validateUnit(unit: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const sanitized = sanitizeString(unit);
  
  if (sanitized.length > VALIDATION_RULES.unit.maxLength) {
    errors.push({ field: 'unit', message: `Unit must be less than ${VALIDATION_RULES.unit.maxLength} characters` });
  }
  
  return errors;
}

export function validateRecordType(type: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!VALID_RECORD_TYPES.includes(type as RecordType)) {
    errors.push({ field: 'type', message: 'Invalid record type' });
  }
  
  return errors;
}

export function validateRecordDate(dateString: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!dateString) {
    errors.push({ field: 'recordDate', message: 'Record date is required' });
    return errors;
  }
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    errors.push({ field: 'recordDate', message: 'Invalid date format' });
  } else if (date > now) {
    errors.push({ field: 'recordDate', message: 'Record date cannot be in the future' });
  } else if (date < new Date('1900-01-01')) {
    errors.push({ field: 'recordDate', message: 'Record date cannot be before 1900' });
  }
  
  return errors;
}

// Vital signs validation
export function validateVitalSigns(vitals: {
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (vitals.systolic !== undefined) {
    if (vitals.systolic < 60 || vitals.systolic > 250) {
      errors.push({ field: 'systolic', message: 'Systolic pressure must be between 60-250 mmHg' });
    }
  }
  
  if (vitals.diastolic !== undefined) {
    if (vitals.diastolic < 30 || vitals.diastolic > 150) {
      errors.push({ field: 'diastolic', message: 'Diastolic pressure must be between 30-150 mmHg' });
    }
  }
  
  if (vitals.heartRate !== undefined) {
    if (vitals.heartRate < 30 || vitals.heartRate > 220) {
      errors.push({ field: 'heartRate', message: 'Heart rate must be between 30-220 bpm' });
    }
  }
  
  if (vitals.temperature !== undefined) {
    if (vitals.temperature < 90 || vitals.temperature > 110) {
      errors.push({ field: 'temperature', message: 'Temperature must be between 90-110°F' });
    }
  }
  
  if (vitals.weight !== undefined) {
    if (vitals.weight < 10 || vitals.weight > 1000) {
      errors.push({ field: 'weight', message: 'Weight must be between 10-1000 lbs' });
    }
  }
  
  if (vitals.height !== undefined) {
    if (vitals.height < 12 || vitals.height > 96) {
      errors.push({ field: 'height', message: 'Height must be between 12-96 inches' });
    }
  }
  
  return errors;
}

// Complete form validation
export function validateHealthRecordForm(record: NewHealthRecord): FormValidationResult {
  const allErrors: ValidationError[] = [
    ...validateRecordType(record.type),
    ...validateTitle(record.title),
    ...validateProvider(record.provider),
    ...validateDescription(record.description),
    ...validateValue(record.value),
    ...validateUnit(record.unit),
    ...validateRecordDate(record.recordDate),
  ];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

// Sanitize form data
export function sanitizeHealthRecord(record: NewHealthRecord): NewHealthRecord {
  return {
    type: record.type,
    title: sanitizeString(record.title),
    description: sanitizeString(record.description),
    value: sanitizeString(record.value),
    unit: sanitizeString(record.unit),
    recordDate: record.recordDate,
    provider: sanitizeString(record.provider),
  };
}

// Get field-specific error message
export function getFieldError(errors: ValidationError[], fieldName: string): string | undefined {
  const error = errors.find(err => err.field === fieldName);
  return error?.message;
}
