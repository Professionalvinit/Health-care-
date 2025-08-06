'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Stethoscope, 
  Phone, 
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentSchedulerProps {
  userId: string;
  userRole: 'PATIENT' | 'PROVIDER';
}

export function AppointmentScheduler({ userId, userRole }: AppointmentSchedulerProps): React.ReactElement {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    providerId: '',
    patientId: userRole === 'PATIENT' ? userId : '',
    title: '',
    description: '',
    type: 'IN_PERSON',
    date: new Date(),
    time: '09:00',
    duration: 30
  });

  useEffect(() => {
    loadAppointments();
    loadProviders();
  }, [userId, userRole]);

  const loadAppointments = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // In demo mode, use mock data
      setAppointments([
        {
          id: '1',
          title: 'Annual Physical Exam',
          description: 'Comprehensive health check-up including lab work review',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
          type: 'IN_PERSON',
          status: 'CONFIRMED',
          patient: { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com' },
          provider: { id: '1', name: 'Dr. Michael Chen', specialization: 'Internal Medicine' },
          location: 'Room 205, Main Clinic'
        },
        {
          id: '2',
          title: 'Follow-up Consultation',
          description: 'Review test results and adjust treatment plan',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
          type: 'TELEHEALTH',
          status: 'SCHEDULED',
          patient: { id: '2', name: 'Michael Rodriguez', email: 'michael@example.com' },
          provider: { id: '2', name: 'Dr. Sarah Williams', specialization: 'Cardiology' },
          location: 'Virtual Meeting'
        },
        {
          id: '3',
          title: 'Medication Review',
          description: 'Quarterly medication effectiveness review',
          startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
          type: 'PHONE_CALL',
          status: 'SCHEDULED',
          patient: { id: '3', name: 'Emma Thompson', email: 'emma@example.com' },
          provider: { id: '1', name: 'Dr. Michael Chen', specialization: 'Internal Medicine' },
          location: 'Phone Consultation'
        }
      ]);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProviders = async (): Promise<void> => {
    try {
      setProviders([
        { id: '1', name: 'Dr. Michael Chen', specialization: 'Internal Medicine', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face' },
        { id: '2', name: 'Dr. Sarah Williams', specialization: 'Cardiology', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face' },
        { id: '3', name: 'Dr. Emily Rodriguez', specialization: 'Dermatology', avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face' },
        { id: '4', name: 'Dr. James Wilson', specialization: 'Orthopedics', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face' }
      ]);
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };

  const handleCreateAppointment = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const startTime = new Date(newAppointment.date);
      const [hours, minutes] = newAppointment.time.split(':');
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const endTime = new Date(startTime.getTime() + newAppointment.duration * 60 * 1000);

      const appointmentData = {
        ...newAppointment,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      // In real app, make API call to create appointment
      // const response = await fetch('/api/appointments', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(appointmentData)
      // });

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowNewAppointmentDialog(false);
      loadAppointments();
      
      // Reset form
      setNewAppointment({
        providerId: '',
        patientId: userRole === 'PATIENT' ? userId : '',
        title: '',
        description: '',
        type: 'IN_PERSON',
        date: new Date(),
        time: '09:00',
        duration: 30
      });
      
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAppointmentTypeIcon = (type: string): React.ReactElement => {
    switch (type) {
      case 'TELEHEALTH': return <Video className="h-4 w-4 text-green-600" />;
      case 'PHONE_CALL': return <Phone className="h-4 w-4 text-blue-600" />;
      default: return <Stethoscope className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NO_SHOW': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: Date): string => {
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-600">
            {userRole === 'PATIENT' ? 'Manage your medical appointments' : 'Manage patient appointments'}
          </p>
        </div>
        
        <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Book a new appointment with a healthcare provider.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {userRole === 'PATIENT' && (
                <div className="grid gap-2">
                  <Label htmlFor="provider">Select Provider</Label>
                  <Select value={newAppointment.providerId} onValueChange={(value) => setNewAppointment({...newAppointment, providerId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a healthcare provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex items-center space-x-2">
                            <span>{provider.name}</span>
                            <span className="text-sm text-gray-500">• {provider.specialization}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="title">Appointment Title</Label>
                <Input
                  id="title"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                  placeholder="e.g., Annual Check-up, Follow-up Visit"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_PERSON">In-Person Visit</SelectItem>
                    <SelectItem value="TELEHEALTH">Video Consultation</SelectItem>
                    <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Popover open={false} onOpenChange={() => {}}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newAppointment.date, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        selected={newAppointment.date}
                        onSelect={(date: Date | undefined) => date && setNewAppointment({...newAppointment, date})}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={newAppointment.duration.toString()} onValueChange={(value) => setNewAppointment({...newAppointment, duration: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newAppointment.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewAppointment({...newAppointment, description: e.target.value})}
                  placeholder="Additional details about the appointment..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewAppointmentDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAppointment} 
                disabled={isLoading || !newAppointment.title || !newAppointment.providerId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map(appointment => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    {getAppointmentTypeIcon(appointment.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{appointment.title}</h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatDateTime(appointment.startTime)}</span>
                      </div>
                      
                      <div>
                        {userRole === 'PATIENT' ? (
                          <span>Provider: {appointment.provider.name} • {appointment.provider.specialization}</span>
                        ) : (
                          <span>Patient: {appointment.patient.name}</span>
                        )}
                      </div>
                      
                      <div>Location: {appointment.location}</div>
                      
                      {appointment.description && (
                        <div className="mt-2">
                          <span className="text-gray-800">{appointment.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {appointment.status === 'CONFIRMED' && appointment.type === 'TELEHEALTH' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Video className="h-4 w-4 mr-2" />
                      Join Call
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  
                  {appointment.status === 'SCHEDULED' && (
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAppointments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your filters or search terms.'
                  : 'Schedule your first appointment to get started.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={() => setShowNewAppointmentDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}