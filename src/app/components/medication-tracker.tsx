'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  TrendingUp,
  Bell,
  Target,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

interface MedicationTrackerProps {
  userId: string;
}

export function MedicationTracker({ userId }: MedicationTrackerProps): React.ReactElement {
  const [medications, setMedications] = useState<any[]>([]);
  const [adherenceStats, setAdherenceStats] = useState<any>({});
  const [todayLogs, setTodayLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNewMedicationDialog, setShowNewMedicationDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('medications');

  // New medication form state
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    instructions: '',
    prescriber: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    reminderTime: '09:00'
  });

  useEffect(() => {
    loadMedications();
    loadAdherenceStats();
    loadTodayLogs();
  }, [userId]);

  const loadMedications = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // In demo mode, use mock data
      setMedications([
        {
          id: '1',
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          instructions: 'Take with food in the morning',
          prescriber: 'Dr. Michael Chen',
          startDate: new Date('2024-01-15'),
          endDate: null,
          isActive: true,
          reminderTime: '09:00',
          nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
        },
        {
          id: '2',
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          instructions: 'Take with meals to reduce stomach upset',
          prescriber: 'Dr. Michael Chen',
          startDate: new Date('2024-02-01'),
          endDate: null,
          isActive: true,
          reminderTime: '08:00,20:00',
          nextDose: new Date(Date.now() + 4 * 60 * 60 * 1000), // In 4 hours
        },
        {
          id: '3',
          name: 'Vitamin D3',
          dosage: '1000 IU',
          frequency: 'Once daily',
          instructions: 'Take with largest meal of the day',
          prescriber: 'Dr. Sarah Williams',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          isActive: true,
          reminderTime: '18:00',
          nextDose: new Date(Date.now() + 8 * 60 * 60 * 1000), // In 8 hours
        }
      ]);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdherenceStats = async (): Promise<void> => {
    try {
      // Mock adherence statistics
      setAdherenceStats({
        overall: {
          adherenceRate: 87,
          totalLogs: 156,
          takenLogs: 136,
          missedLogs: 15,
          delayedLogs: 5
        },
        byMedication: [
          { medicationName: 'Lisinopril', adherenceRate: 92, total: 28, taken: 26, missed: 2 },
          { medicationName: 'Metformin', adherenceRate: 85, total: 56, taken: 48, missed: 6, delayed: 2 },
          { medicationName: 'Vitamin D3', adherenceRate: 82, total: 28, taken: 23, missed: 4, delayed: 1 }
        ],
        weeklyTrend: [88, 90, 85, 89, 87, 91, 87] // Last 7 days
      });
    } catch (error) {
      console.error('Error loading adherence stats:', error);
    }
  };

  const loadTodayLogs = async (): Promise<void> => {
    try {
      // Mock today's medication logs
      const today = new Date();
      setTodayLogs([
        {
          id: '1',
          medication: { name: 'Lisinopril', dosage: '10mg' },
          takenAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15),
          status: 'TAKEN',
          notes: ''
        },
        {
          id: '2',
          medication: { name: 'Metformin', dosage: '500mg' },
          takenAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
          status: 'TAKEN',
          notes: ''
        },
        {
          id: '3',
          medication: { name: 'Metformin', dosage: '500mg' },
          takenAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0),
          status: 'DELAYED',
          notes: 'Took 1 hour late'
        }
      ]);
    } catch (error) {
      console.error('Error loading today logs:', error);
    }
  };

  const handleCreateMedication = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // In real app, make API call
      // const response = await fetch('/api/medications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...newMedication, patientId: userId })
      // });

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowNewMedicationDialog(false);
      loadMedications();
      
      // Reset form
      setNewMedication({
        name: '',
        dosage: '',
        frequency: 'Once daily',
        instructions: '',
        prescriber: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: '',
        reminderTime: '09:00'
      });
      
    } catch (error) {
      console.error('Error creating medication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logMedication = async (medicationId: string, status: string, notes?: string): Promise<void> => {
    try {
      // In real app, make API call to log medication
      // await fetch('/api/medication-logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     medicationId,
      //     status,
      //     notes,
      //     takenAt: new Date()
      //   })
      // });

      // Refresh data
      loadTodayLogs();
      loadAdherenceStats();
    } catch (error) {
      console.error('Error logging medication:', error);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'TAKEN': return 'text-green-600';
      case 'MISSED': return 'text-red-600';
      case 'DELAYED': return 'text-yellow-600';
      case 'PARTIAL': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (date: Date): string => {
    return format(date, 'h:mm a');
  };

  const getAdherenceColor = (rate: number): string => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medication Tracker</h2>
          <p className="text-gray-600">
            Manage your medications and track adherence
          </p>
        </div>
        
        <Dialog open={showNewMedicationDialog} onOpenChange={setShowNewMedicationDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>
                Add a new medication to your tracker.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder="e.g., Lisinopril, Metformin"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    placeholder="e.g., 10mg, 500mg"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={newMedication.frequency} onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Once daily">Once daily</SelectItem>
                      <SelectItem value="Twice daily">Twice daily</SelectItem>
                      <SelectItem value="Three times daily">Three times daily</SelectItem>
                      <SelectItem value="Four times daily">Four times daily</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prescriber">Prescriber</Label>
                <Input
                  id="prescriber"
                  value={newMedication.prescriber}
                  onChange={(e) => setNewMedication({...newMedication, prescriber: e.target.value})}
                  placeholder="e.g., Dr. Smith"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={newMedication.reminderTime}
                    onChange={(e) => setNewMedication({...newMedication, reminderTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={newMedication.instructions}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMedication({...newMedication, instructions: e.target.value})}
                  placeholder="e.g., Take with food, Take on empty stomach"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewMedicationDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateMedication} 
                disabled={isLoading || !newMedication.name || !newMedication.dosage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Adding...' : 'Add Medication'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medications">My Medications</TabsTrigger>
          <TabsTrigger value="today">Today&apos;s Doses</TabsTrigger>
          <TabsTrigger value="analytics">Adherence Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-4">
          {medications.map(medication => (
            <Card key={medication.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Pill className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{medication.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dosage:</span> {medication.dosage} • {medication.frequency}
                        </div>
                        <div>
                          <span className="font-medium">Prescriber:</span> {medication.prescriber}
                        </div>
                        {medication.instructions && (
                          <div>
                            <span className="font-medium">Instructions:</span> {medication.instructions}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Started:</span> {format(medication.startDate, 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Bell className="h-4 w-4" />
                          <span>Next dose: {formatTime(medication.nextDose)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Badge className={medication.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {medication.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    <Button 
                      size="sm" 
                      onClick={() => logMedication(medication.id, 'TAKEN')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Taken
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today&apos;s Medication Log</span>
              </CardTitle>
              <CardDescription>
                Track your medication adherence for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${log.status === 'TAKEN' ? 'bg-green-100' : log.status === 'DELAYED' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      {log.status === 'TAKEN' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">{log.medication.name}</h4>
                      <p className="text-sm text-gray-600">
                        {log.medication.dosage} • Taken at {formatTime(log.takenAt)}
                      </p>
                      {log.notes && (
                        <p className="text-sm text-gray-500 mt-1">{log.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <Badge className={`${log.status === 'TAKEN' ? 'bg-green-100 text-green-800' : log.status === 'DELAYED' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {log.status}
                  </Badge>
                </div>
              ))}
              
              {todayLogs.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No logs for today yet</h3>
                  <p className="text-gray-600">Start logging your medications to track adherence.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Overall Adherence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Overall Adherence</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getAdherenceColor(adherenceStats.overall?.adherenceRate || 0)}`}>
                    {adherenceStats.overall?.adherenceRate || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Adherence Rate</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {adherenceStats.overall?.takenLogs || 0}
                  </div>
                  <p className="text-sm text-gray-600">Doses Taken</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {adherenceStats.overall?.missedLogs || 0}
                  </div>
                  <p className="text-sm text-gray-600">Doses Missed</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {adherenceStats.overall?.delayedLogs || 0}
                  </div>
                  <p className="text-sm text-gray-600">Doses Delayed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* By Medication */}
          <Card>
            <CardHeader>
              <CardTitle>Adherence by Medication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {adherenceStats.byMedication?.map((med: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{med.medicationName}</h4>
                    <span className={`font-semibold ${getAdherenceColor(med.adherenceRate)}`}>
                      {med.adherenceRate}%
                    </span>
                  </div>
                  <Progress value={med.adherenceRate} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{med.taken} taken</span>
                    <span>{med.missed} missed</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}