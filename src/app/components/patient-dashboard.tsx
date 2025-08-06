'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MessageSquare, 
  Pill, 
  Activity, 
  Heart, 
  Video,
  Clock,
  Plus,
  Bell,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  FileText,
  TrendingUp
} from 'lucide-react';
import { SymptomChecker } from './symptom-checker';
import { AppointmentScheduler } from './appointment-scheduler';
import { MedicationTracker } from './medication-tracker';
import { MessagingCenter } from './messaging-center';
import { HealthRecords } from './health-records';

interface PatientDashboardProps {
  user: any;
}

export function PatientDashboard({ user }: PatientDashboardProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Load dashboard data (in demo mode, use mock data)
      setUpcomingAppointments([
        {
          id: '1',
          title: 'Annual Check-up',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          provider: { name: 'Dr. Michael Chen', specialization: 'Internal Medicine' },
          type: 'IN_PERSON',
          status: 'CONFIRMED'
        },
        {
          id: '2',
          title: 'Follow-up Consultation',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          provider: { name: 'Dr. Sarah Williams', specialization: 'Cardiology' },
          type: 'TELEHEALTH',
          status: 'SCHEDULED'
        }
      ]);

      setRecentMessages([
        {
          id: '1',
          sender: { name: 'Dr. Michael Chen', role: 'PROVIDER' },
          subject: 'Lab Results Available',
          content: 'Your recent lab results are ready for review. Please schedule a follow-up if you have any questions.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isRead: false,
          priority: 'NORMAL'
        },
        {
          id: '2',
          sender: { name: 'Nurse Jennifer', role: 'PROVIDER' },
          subject: 'Medication Reminder',
          content: 'Please remember to take your blood pressure medication as prescribed.',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          isRead: true,
          priority: 'NORMAL'
        }
      ]);

      setMedications([
        {
          id: '1',
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          isActive: true,
          nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
        },
        {
          id: '2',
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          isActive: true,
          nextDose: new Date(Date.now() + 4 * 60 * 60 * 1000), // In 4 hours
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAppointmentTypeColor = (type: string): string => {
    switch (type) {
      case 'TELEHEALTH': return 'bg-green-100 text-green-800';
      case 'IN_PERSON': return 'bg-blue-100 text-blue-800';
      case 'PHONE_CALL': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatTimeUntil = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `in ${hours} hours`;
    } else {
      const days = Math.floor(hours / 24);
      return `in ${days} days`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here&apos;s your health overview and upcoming activities.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>AI Checker</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center space-x-2">
            <Pill className="h-4 w-4" />
            <span>Medications</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Records</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">Tomorrow</div>
                <p className="text-xs text-muted-foreground">
                  Dr. Chen - Annual Check-up
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">1</div>
                <p className="text-xs text-muted-foreground">
                  Lab Results Available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
                <Pill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{medications.length}</div>
                <p className="text-xs text-muted-foreground">
                  Next dose in 2 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">85%</div>
                <p className="text-xs text-muted-foreground">
                  Excellent adherence
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button 
                  onClick={() => setActiveTab('symptoms')}
                  className="h-auto p-4 bg-blue-600 hover:bg-blue-700"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Activity className="h-6 w-6" />
                    <span className="text-sm">Check Symptoms</span>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('appointments')}
                  variant="outline" 
                  className="h-auto p-4"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Book Appointment</span>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('messages')}
                  variant="outline" 
                  className="h-auto p-4"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-sm">Message Doctor</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Video className="h-6 w-6" />
                    <span className="text-sm">Start Video Call</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upcoming Appointments</span>
                <Button size="sm" onClick={() => setActiveTab('appointments')}>
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {appointment.type === 'TELEHEALTH' ? (
                        <Video className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{appointment.title}</h4>
                      <p className="text-sm text-gray-600">
                        {appointment.provider.name} • {appointment.provider.specialization}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(appointment.startTime)} • {formatTimeUntil(appointment.startTime)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={getAppointmentTypeColor(appointment.type)}>
                      {appointment.type.replace('_', ' ')}
                    </Badge>
                    <div>
                      <Button size="sm" variant="outline">
                        {appointment.type === 'TELEHEALTH' ? 'Join Call' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Messages</span>
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
          <AppointmentScheduler userId={user.id} userRole="PATIENT" />
        </TabsContent>

        <TabsContent value="symptoms">
          <SymptomChecker />
        </TabsContent>

        <TabsContent value="medications">
          <MedicationTracker userId={user.id} />
        </TabsContent>

        <TabsContent value="messages">
          <MessagingCenter userId={user.id} userRole="PATIENT" />
        </TabsContent>

        <TabsContent value="records">
          <HealthRecords userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}