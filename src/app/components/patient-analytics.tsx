'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Heart,
  Activity
} from 'lucide-react';
import { format, subDays } from 'date-fns';

interface PatientAnalyticsProps {
  providerId: string;
}

export function PatientAnalytics({ providerId }: PatientAnalyticsProps): React.ReactElement {
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [timeRange, setTimeRange] = useState<string>('30');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadAnalytics();
  }, [providerId, timeRange]);

  const loadAnalytics = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // In demo mode, use mock data
      const mockData = {
        overview: {
          totalPatients: 247,
          activePatients: 189,
          newPatientsThisMonth: 12,
          averageAge: 45,
          avgResponseTime: 2.3,
          patientSatisfaction: 4.8
        },
        adherence: {
          overall: 87,
          byMedication: [
            { name: 'Lisinopril', adherence: 92, patients: 45 },
            { name: 'Metformin', adherence: 85, patients: 32 },
            { name: 'Atorvastatin', adherence: 79, patients: 28 },
            { name: 'Aspirin', adherence: 94, patients: 52 }
          ]
        },
        appointments: {
          totalScheduled: 156,
          completed: 142,
          noShows: 8,
          cancelled: 6,
          attendanceRate: 91,
          weeklyTrend: [88, 92, 89, 91, 87, 94, 91]
        },
        riskAssessment: {
          high: 12,
          medium: 34,
          low: 143,
          categories: [
            { category: 'Cardiovascular', high: 8, medium: 15, low: 25 },
            { category: 'Diabetes', high: 3, medium: 12, low: 18 },
            { category: 'Hypertension', high: 5, medium: 8, low: 22 },
            { category: 'Mental Health', high: 2, medium: 6, low: 12 }
          ]
        },
        communications: {
          totalMessages: 342,
          avgResponseTime: 2.3,
          urgentMessages: 15,
          satisfactionScore: 4.8,
          messageTypes: [
            { type: 'General', count: 156, percentage: 45 },
            { type: 'Appointments', count: 89, percentage: 26 },
            { type: 'Prescriptions', count: 67, percentage: 20 },
            { type: 'Test Results', count: 30, percentage: 9 }
          ]
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadgeColor = (level: string): string => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 animate-pulse text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Analytics</h2>
          <p className="text-gray-600">
            Comprehensive insights into your patient care and outcomes
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData.overview?.totalPatients || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.overview?.newPatientsThisMonth || 0} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Adherence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analyticsData.adherence?.overall || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Above target threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointment Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analyticsData.appointments?.attendanceRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.appointments?.noShows || 0} no-shows this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData.overview?.avgResponseTime || 0}h
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.communications?.satisfactionScore || 0}/5 satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Patient Risk Assessment</span>
          </CardTitle>
          <CardDescription>
            Current risk distribution across your patient population
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Overall Risk Distribution */}
            <div className="space-y-4">
              <h4 className="font-semibold">Overall Risk Levels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">High Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-red-600">
                      {analyticsData.riskAssessment?.high || 0}
                    </span>
                    <span className="text-sm text-gray-500">patients</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-yellow-600">
                      {analyticsData.riskAssessment?.medium || 0}
                    </span>
                    <span className="text-sm text-gray-500">patients</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Low Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-green-600">
                      {analyticsData.riskAssessment?.low || 0}
                    </span>
                    <span className="text-sm text-gray-500">patients</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk by Category */}
            <div className="space-y-4">
              <h4 className="font-semibold">Risk by Category</h4>
              <div className="space-y-3">
                {analyticsData.riskAssessment?.categories?.map((category: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.category}</span>
                      <span className="text-xs text-gray-500">
                        {category.high + category.medium + category.low} total
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-red-600">{category.high} high</span>
                      <span className="text-yellow-600">{category.medium} medium</span>
                      <span className="text-green-600">{category.low} low</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication Adherence Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-green-600" />
            <span>Medication Adherence Analysis</span>
          </CardTitle>
          <CardDescription>
            Adherence rates across different medications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.adherence?.byMedication?.map((med: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{med.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-blue-600">{med.adherence}%</span>
                    <span className="text-sm text-gray-500">({med.patients} patients)</span>
                  </div>
                </div>
                <Progress value={med.adherence} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Message Analytics</CardTitle>
            <CardDescription>
              Communication patterns and response metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Messages</span>
              <span className="font-semibold">{analyticsData.communications?.totalMessages || 0}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Urgent Messages</span>
              <Badge className="bg-red-100 text-red-800">
                {analyticsData.communications?.urgentMessages || 0}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Avg Response Time</span>
              <span className="font-semibold text-blue-600">
                {analyticsData.communications?.avgResponseTime || 0}h
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Satisfaction Score</span>
              <span className="font-semibold text-green-600">
                {analyticsData.communications?.satisfactionScore || 0}/5
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Types</CardTitle>
            <CardDescription>
              Distribution of message categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analyticsData.communications?.messageTypes?.map((type: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{type.type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${type.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">
                    {type.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Appointment Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <span>Appointment Trends</span>
          </CardTitle>
          <CardDescription>
            Weekly attendance patterns and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold">This Month&apos;s Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Scheduled</span>
                  <span className="font-semibold">{analyticsData.appointments?.totalScheduled || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Completed</span>
                  <span className="font-semibold text-green-600">{analyticsData.appointments?.completed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">No Shows</span>
                  <span className="font-semibold text-red-600">{analyticsData.appointments?.noShows || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cancelled</span>
                  <span className="font-semibold text-yellow-600">{analyticsData.appointments?.cancelled || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Weekly Attendance Trend</h4>
              <div className="space-y-2">
                {analyticsData.appointments?.weeklyTrend?.map((rate: number, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-sm w-16">Week {index + 1}</span>
                    <div className="flex-1">
                      <Progress value={rate} className="h-2" />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">{rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}