'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Activity, 
  AlertTriangle,
  BarChart3,
  Stethoscope,
  Clock,
  CheckCircle,
  Video,
  FileText,
  TrendingUp,
  Heart
} from 'lucide-react';
import { AppointmentScheduler } from './appointment-scheduler';
import { MessagingCenter } from './messaging-center';
import { PatientAnalytics } from './patient-analytics';

interface ProviderDashboardProps {
  user: any;
}

export function ProviderDashboard({ user }: ProviderDashboardProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [urgentSymptoms, setUrgentSymptoms] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [patientStats, setPatientStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Load dashboard data (in demo mode, use mock data)
      setTodayAppointments([
        {
          id: '1',
          title: 'Annual Check-up',
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
          patient: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e9d7a2?w=50&h=50&fit=crop&crop=face' },
          type: 'IN_PERSON',
          status: 'CONFIRMED'
        },
        {
          id: '2',
          title: 'Follow-up Consultation',
          startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // In 4 hours
          patient: { name: 'Michael Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
          type: 'TELEHEALTH',
          status: 'SCHEDULED'
        },
        {
          id: '3',
          title: 'Medication Review',
          startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // In 6 hours
          patient: { name: 'Emma Thompson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
          type: 'PHONE_CALL',
          status: 'CONFIRMED'
        }
      ]);

      setUrgentSymptoms([
        {
          id: '1',
          patient: { name: 'John Davis', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
          symptoms: ['chest pain', 'shortness of breath'],
          severity: 9,
          priority: 'URGENT',
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          isReviewed: false
        },
        {
          id: '2',
          patient: { name: 'Lisa Chen', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=50&h=50&fit=crop&crop=face' },
          symptoms: ['severe headache', 'nausea', 'sensitivity to light'],
          severity: 8,
          priority: 'HIGH',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isReviewed: false
        }
      ]);

      setRecentMessages([
        {
          id: '1',
          sender: { name: 'Sarah Johnson', role: 'PATIENT' },
          subject: 'Question about new medication',
          content: 'I\'ve been experiencing some mild side effects from the new medication. Should I be concerned?',
          createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
          isRead: false,
          priority: 'NORMAL'
        },
        {
          id: '2',
          sender: { name: 'Michael Rodriguez', role: 'PATIENT' },
          subject: 'Lab results inquiry',
          content: 'Could you please explain my recent lab results? I have some questions about the cholesterol levels.',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          isRead: false,
          priority: 'NORMAL'
        }
      ]);

      setPatientStats({
        totalPatients: 247,
        activePatients: 189,
        appointmentsToday: 8,
        medicationAdherence: 87,
        avgResponseTime: '2.3 hours',
        patientSatisfaction: 4.8
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'NORMAL': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentTypeIcon = (type: string): React.ReactElement => {
    switch (type) {
      case 'TELEHEALTH': return <Video className="h-4 w-4" />;
      case 'PHONE_CALL': return <MessageSquare className="h-4 w-4" />;
      default: return <Stethoscope className="h-4 w-4" />;
    }
  };

  const formatTimeUntil = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff > 0) {
      // Future date
      if (hours === 0) {
        return `in ${minutes} min`;
      } else {
        return `in ${hours}h ${minutes}m`;
      }
    } else {
      // Past date
      if (hours === 0) {
        return `${minutes} min ago`;
      } else if (hours < 24) {
        return `${hours}h ${minutes}m ago`;
      } else {
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
    }
  };

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Good morning, {user.name}! 👩‍⚕️
        </h1>
        <p className="text-gray-600">
          {user.specialization} • {todayAppointments.length} appointments today
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Urgent Reports</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{todayAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {todayAppointments.length > 0 ? `Next in ${formatTimeUntil(todayAppointments[0].startTime)}` : 'No appointments today'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent Reports</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{urgentSymptoms.length}</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{recentMessages.filter(m => !m.isRead).length}</div>
                <p className="text-xs text-muted-foreground">
                  From patients
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{patientStats.patientSatisfaction}/5</div>
                <p className="text-xs text-muted-foreground">
                  Average rating
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Urgent Symptom Reports */}
          {urgentSymptoms.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Urgent Symptom Reports</span>
                </CardTitle>
                <CardDescription>
                  These patient reports require immediate medical attention.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {urgentSymptoms.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={report.patient.avatar} 
                        alt={report.patient.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">{report.patient.name}</h4>
                        <p className="text-sm text-gray-600">
                          Symptoms: {report.symptoms.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Severity: {report.severity}/10 • {formatTimeUntil(report.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                      <div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Review Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Today&apos;s Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Schedule</CardTitle>
              <CardDescription>
                {todayAppointments.length} appointments scheduled for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {getAppointmentTypeIcon(appointment.type)}
                    </div>
                    <img 
                      src={appointment.patient.avatar} 
                      alt={appointment.patient.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{appointment.patient.name}</h4>
                      <p className="text-sm text-gray-600">{appointment.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(appointment.startTime)} • {formatTimeUntil(appointment.startTime)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={appointment.type === 'TELEHEALTH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {appointment.type.replace('_', ' ')}
                    </Badge>
                    <div>
                      <Button size="sm" variant="outline">
                        {appointment.type === 'TELEHEALTH' ? 'Start Video' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Patient Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Patient Messages</span>
                <Button size="sm" onClick={() => setActiveTab('messages')}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMessages.map((message) => (
                <div key={message.id} className={`p-3 border rounded-lg ${!message.isRead ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-semibold text-sm">{message.sender.name}</h5>
                        {!message.isRead && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <h6 className="font-medium text-sm text-gray-900 mb-1">
                        {message.subject}
                      </h6>
                      <p className="text-sm text-gray-600 truncate">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 ml-4">
                      {formatTimeUntil(message.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentScheduler userId={user.id} userRole="PROVIDER" />
        </TabsContent>

        <TabsContent value="symptoms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Patient Symptom Reports</span>
              </CardTitle>
              <CardDescription>
                Review and respond to patient symptom reports requiring medical attention.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {urgentSymptoms.map((report) => (
                <Card key={report.id} className="border-red-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={report.patient.avatar} 
                          alt={report.patient.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{report.patient.name}</h4>
                          <div className="mb-2">
                            <Badge className={getPriorityColor(report.priority)}>
                              {report.priority}
                            </Badge>
                            <span className="text-sm text-gray-500 ml-2">
                              Severity: {report.severity}/10
                            </span>
                          </div>
                          <div className="mb-3">
                            <h6 className="font-medium text-sm mb-1">Reported Symptoms:</h6>
                            <div className="flex flex-wrap gap-1">
                              {report.symptoms.map((symptom: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            Reported {formatTimeUntil(report.createdAt)} ago
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Review Report
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Patient
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {urgentSymptoms.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
                  <p className="text-gray-600">No urgent symptom reports at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <MessagingCenter userId={user.id} userRole="PROVIDER" />
        </TabsContent>

        <TabsContent value="analytics">
          <PatientAnalytics providerId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}