'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toast, ErrorBoundary } from '@/components/ui/toast';
import {
  FileText,
  Heart,
  Activity,
  TestTube,
  Pill,
  Image as ImageIcon,
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

// Import our types and utilities
import type {
  HealthRecord,
  VitalSigns,
  NewHealthRecord,
  HealthRecordsProps,
  RecordType,
  FilterType,
  TabType,
  TrendDirection,
  LoadingState,
  VitalTrends
} from '@/types/health';
import { healthRecordsApi, vitalSignsApi, withRetry } from '@/utils/api';
import { useErrorHandler, useToast } from '@/hooks/useErrorHandler';
import {
  validateHealthRecordForm,
  sanitizeHealthRecord,
  getFieldError
} from '@/utils/validation';

export function HealthRecords({ userId }: HealthRecordsProps): React.ReactElement {
  // Properly typed state
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [vitals, setVitals] = useState<VitalSigns[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    records: false,
    vitals: false,
    creating: false,
    general: false,
  });
  const [showNewRecordDialog, setShowNewRecordDialog] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Error handling and notifications
  const { errorState, showError, clearError, retry, setRetryAction } = useErrorHandler();
  const { toast, showToast, hideToast } = useToast();

  // New record form state with proper typing
  const [newRecord, setNewRecord] = useState<NewHealthRecord>({
    type: 'NOTE' as RecordType,
    title: '',
    description: '',
    value: '',
    unit: '',
    recordDate: format(new Date(), 'yyyy-MM-dd'),
    provider: ''
  });

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load health records with proper error handling
  const loadHealthRecords = useCallback(async (): Promise<void> => {
    setLoadingState(prev => ({ ...prev, records: true }));
    clearError();

    try {
      const fetchedRecords = await withRetry(() =>
        healthRecordsApi.getRecords(userId, filterType === 'all' ? undefined : filterType)
      );
      setRecords(fetchedRecords);
      showToast('Health records loaded successfully', 'success');
    } catch (error) {
      showError(error);
      // Fallback to mock data for demo purposes
      setRecords([
        {
          id: '1',
          type: 'LAB_RESULT',
          title: 'Complete Blood Count',
          description: 'Annual CBC panel showing all values within normal ranges',
          value: null,
          unit: null,
          recordDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          provider: 'Dr. Michael Chen',
          isPublic: false
        },
        {
          id: '2',
          type: 'VITAL_SIGNS',
          title: 'Blood Pressure Reading',
          description: 'Regular blood pressure monitoring',
          value: '120/80',
          unit: 'mmHg',
          recordDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          provider: 'Nurse Jennifer',
          isPublic: false
        },
        {
          id: '3',
          type: 'PRESCRIPTION',
          title: 'Lisinopril Prescription',
          description: 'ACE inhibitor for blood pressure management',
          value: '10mg',
          unit: 'daily',
          recordDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          provider: 'Dr. Michael Chen',
          isPublic: false
        }
      ]);
    } finally {
      setLoadingState(prev => ({ ...prev, records: false }));
    }
  }, [userId, filterType, showError, clearError, showToast]);

  // Set retry action for error handling
  useEffect(() => {
    setRetryAction(() => loadHealthRecords);
  }, [loadHealthRecords, setRetryAction]);

  // Load vital signs with proper error handling
  const loadVitals = useCallback(async (): Promise<void> => {
    setLoadingState(prev => ({ ...prev, vitals: true }));

    try {
      const fetchedVitals = await withRetry(() =>
        vitalSignsApi.getVitalSigns(userId, 180) // Last 6 months
      );
      setVitals(fetchedVitals);
    } catch (error) {
      showError(error);
      // Fallback to mock data for demo purposes
      const generateVitals = (days: number): VitalSigns[] => {
        const vitals: VitalSigns[] = [];
        for (let i = days; i >= 0; i -= 7) { // Weekly readings
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          vitals.push({
            id: `vital-${i}`,
            date,
            bloodPressure: {
              systolic: 115 + Math.floor(Math.random() * 10),
              diastolic: 75 + Math.floor(Math.random() * 10)
            },
            heartRate: 68 + Math.floor(Math.random() * 12),
            temperature: 98.1 + (Math.random() * 1.5),
            weight: 150 + Math.floor(Math.random() * 5),
            height: 68, // Constant
            bmi: 22.8
          });
        }
        return vitals;
      };

      setVitals(generateVitals(180)); // Last 6 months
    } finally {
      setLoadingState(prev => ({ ...prev, vitals: false }));
    }
  }, [userId, showError]);

  // Initialize data loading
  useEffect(() => {
    loadHealthRecords();
    loadVitals();
  }, [loadHealthRecords, loadVitals]);

  // Handle creating new health record with validation
  const handleCreateRecord = useCallback(async (): Promise<void> => {
    // Validate form
    const sanitizedRecord = sanitizeHealthRecord(newRecord);
    const validation = validateHealthRecordForm(sanitizedRecord);

    if (!validation.isValid) {
      setValidationErrors(validation.errors.map(e => e.message));
      showToast('Please fix the validation errors', 'error');
      return;
    }

    setLoadingState(prev => ({ ...prev, creating: true }));
    setValidationErrors([]);

    try {
      await withRetry(() =>
        healthRecordsApi.createRecord(userId, sanitizedRecord)
      );

      setShowNewRecordDialog(false);
      await loadHealthRecords(); // Reload records

      // Reset form
      setNewRecord({
        type: 'NOTE' as RecordType,
        title: '',
        description: '',
        value: '',
        unit: '',
        recordDate: format(new Date(), 'yyyy-MM-dd'),
        provider: ''
      });

      showToast('Health record created successfully', 'success');
    } catch (error) {
      showError(error);
      showToast('Failed to create health record', 'error');
    } finally {
      setLoadingState(prev => ({ ...prev, creating: false }));
    }
  }, [newRecord, userId, loadHealthRecords, showError, showToast, setValidationErrors]);

  const getRecordTypeIcon = (type: string): React.ReactElement => {
    switch (type) {
      case 'VITAL_SIGNS': return <Heart className="h-5 w-5 text-red-600" />;
      case 'LAB_RESULT': return <TestTube className="h-5 w-5 text-blue-600" />;
      case 'PRESCRIPTION': return <Pill className="h-5 w-5 text-green-600" />;
      case 'DIAGNOSIS': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'PROCEDURE': return <Activity className="h-5 w-5 text-purple-600" />;
      case 'DOCUMENT': return <FileText className="h-5 w-5 text-gray-600" />;
      case 'IMAGE': return <ImageIcon className="h-5 w-5 text-indigo-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRecordTypeColor = (type: string): string => {
    switch (type) {
      case 'VITAL_SIGNS': return 'bg-red-100 text-red-800';
      case 'LAB_RESULT': return 'bg-blue-100 text-blue-800';
      case 'PRESCRIPTION': return 'bg-green-100 text-green-800';
      case 'DIAGNOSIS': return 'bg-orange-100 text-orange-800';
      case 'PROCEDURE': return 'bg-purple-100 text-purple-800';
      case 'DOCUMENT': return 'bg-gray-100 text-gray-800';
      case 'IMAGE': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Memoize filtered records for performance
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = searchTerm === '' ||
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.provider.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || record.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, filterType]);

  const getVitalTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    const diff = Math.abs(current - previous);
    if (diff < 2) return 'stable';
    return current > previous ? 'up' : 'down';
  };

  // Memoize latest vitals calculation for performance
  const latestVitals = useMemo(() => {
    if (vitals.length === 0) return null;
    const latest = vitals[vitals.length - 1];
    const previous = vitals.length > 1 ? vitals[vitals.length - 2] : latest;

    return {
      ...latest,
      trends: {
        bloodPressure: getVitalTrend(latest.bloodPressure.systolic, previous.bloodPressure.systolic),
        heartRate: getVitalTrend(latest.heartRate, previous.heartRate),
        weight: getVitalTrend(latest.weight, previous.weight)
      }
    };
  }, [vitals]);

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Error Boundary */}
      {errorState.hasError && (
        <ErrorBoundary
          error={errorState.error!}
          onRetry={retry}
          onDismiss={clearError}
        />
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Records</h2>
          <p className="text-gray-600">
            View and manage your medical records and vital signs
          </p>
        </div>
        
        <Dialog open={showNewRecordDialog} onOpenChange={setShowNewRecordDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Health Record</DialogTitle>
              <DialogDescription>
                Add a new health record entry to your medical history.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Record Type</Label>
                <Select value={newRecord.type} onValueChange={(value) => setNewRecord({...newRecord, type: value as RecordType})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOTE">Note</SelectItem>
                    <SelectItem value="VITAL_SIGNS">Vital Signs</SelectItem>
                    <SelectItem value="LAB_RESULT">Lab Result</SelectItem>
                    <SelectItem value="PRESCRIPTION">Prescription</SelectItem>
                    <SelectItem value="DIAGNOSIS">Diagnosis</SelectItem>
                    <SelectItem value="PROCEDURE">Procedure</SelectItem>
                    <SelectItem value="DOCUMENT">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                  placeholder="e.g., Blood Pressure Reading, Lab Results"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="value">Value (Optional)</Label>
                  <Input
                    id="value"
                    value={newRecord.value}
                    onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                    placeholder="e.g., 120/80, 98.6"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit (Optional)</Label>
                  <Input
                    id="unit"
                    value={newRecord.unit}
                    onChange={(e) => setNewRecord({...newRecord, unit: e.target.value})}
                    placeholder="e.g., mmHg, °F, mg/dL"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="recordDate">Date</Label>
                <Input
                  id="recordDate"
                  type="date"
                  value={newRecord.recordDate}
                  onChange={(e) => setNewRecord({...newRecord, recordDate: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  value={newRecord.provider}
                  onChange={(e) => setNewRecord({...newRecord, provider: e.target.value})}
                  placeholder="e.g., Dr. Smith, Nurse Johnson"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                  placeholder="Additional notes or details about this record..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewRecordDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateRecord}
                disabled={loadingState.creating || !newRecord.title}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loadingState.creating ? 'Adding...' : 'Add Record'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="summary">Health Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="VITAL_SIGNS">Vital Signs</SelectItem>
                <SelectItem value="LAB_RESULT">Lab Results</SelectItem>
                <SelectItem value="PRESCRIPTION">Prescriptions</SelectItem>
                <SelectItem value="DIAGNOSIS">Diagnoses</SelectItem>
                <SelectItem value="PROCEDURE">Procedures</SelectItem>
                <SelectItem value="DOCUMENT">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Records List */}
          <div className="space-y-4">
            {loadingState.records ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading health records...</span>
              </div>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map(record => (
              <Card key={record.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {getRecordTypeIcon(record.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{record.title}</h3>
                          <Badge className={getRecordTypeColor(record.type)}>
                            {record.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(record.recordDate, 'MMM d, yyyy')}</span>
                          </div>
                          
                          <div>Provider: {record.provider}</div>
                          
                          {(record.value || record.unit) && (
                            <div>
                              Value: {record.value} {record.unit}
                            </div>
                          )}
                          
                          {record.description && (
                            <div className="mt-2">
                              <span className="text-gray-800">{record.description}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterType !== 'all'
                      ? 'Try adjusting your filters or search terms.'
                      : 'Add your first health record to get started.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-6">
          {/* Latest Vitals */}
          {loadingState.vitals ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading vital signs...</span>
            </div>
          ) : latestVitals && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
                  </div>
                  <p className="text-xs text-muted-foreground">mmHg</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`h-3 w-3 mr-1 ${
                      latestVitals.trends.bloodPressure === 'up' ? 'text-red-500' : 
                      latestVitals.trends.bloodPressure === 'down' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                    <span className="text-xs text-gray-600">
                      {latestVitals.trends.bloodPressure === 'stable' ? 'Stable' : 
                       latestVitals.trends.bloodPressure === 'up' ? 'Increased' : 'Decreased'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {latestVitals.heartRate}
                  </div>
                  <p className="text-xs text-muted-foreground">bpm</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`h-3 w-3 mr-1 ${
                      latestVitals.trends.heartRate === 'up' ? 'text-orange-500' : 
                      latestVitals.trends.heartRate === 'down' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                    <span className="text-xs text-gray-600">Normal</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {latestVitals.weight}
                  </div>
                  <p className="text-xs text-muted-foreground">lbs</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`h-3 w-3 mr-1 ${
                      latestVitals.trends.weight === 'up' ? 'text-orange-500' : 
                      latestVitals.trends.weight === 'down' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                    <span className="text-xs text-gray-600">
                      BMI: {latestVitals.bmi}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {latestVitals.temperature.toFixed(1)}°F
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(latestVitals.date, 'MMM d')}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-green-600">Normal</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vitals History */}
          <Card>
            <CardHeader>
              <CardTitle>Vitals History</CardTitle>
              <CardDescription>
                Your vital signs over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vitals.slice(-10).reverse().map(vital => (
                  <div key={vital.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Heart className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{format(vital.date, 'MMM d, yyyy')}</h4>
                        <p className="text-sm text-gray-600">
                          BP: {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic} • 
                          HR: {vital.heartRate} • 
                          Weight: {vital.weight}lbs
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Health Metrics Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics Overview</CardTitle>
                <CardDescription>
                  Summary of your key health indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Blood Pressure</span>
                  <Badge className="bg-green-100 text-green-800">Normal</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Heart Rate</span>
                  <Badge className="bg-green-100 text-green-800">Normal</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">BMI</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cholesterol</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Monitor</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Records Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest health records and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {records.slice(0, 5).map(record => (
                  <div key={record.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{record.title}</p>
                      <p className="text-xs text-gray-600">
                        {format(record.recordDate, 'MMM d')} • {record.provider}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}