'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Stethoscope, 
  Calendar, 
  MessageSquare, 
  Pill, 
  Activity, 
  Users, 
  Video,
  Plus,
  Bell,
  Search,
  BarChart3,
  Shield,
  Clock,
  UserCheck
} from 'lucide-react';
import { PatientDashboard } from '@/app/components/patient-dashboard';
import { ProviderDashboard } from '@/app/components/provider-dashboard';
import { LoginForm } from '@/app/components/login-form';
import { SymptomChecker } from '@/app/components/symptom-checker';

export default function HealthPlatform(): React.ReactElement {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSymptomChecker, setShowSymptomChecker] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in (in real app, this would check authentication)
    const checkAuth = async (): Promise<void> => {
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (userData: any): void => {
    setCurrentUser(userData);
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    setShowSymptomChecker(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 animate-pulse text-blue-600" />
          <span className="text-gray-600">Loading HealthCare Platform...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">HealthCare Plus</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          {/* Hero Section */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
            <div className="mx-auto w-full max-w-md lg:max-w-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Smart Patient Engagement & Telehealth Platform
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  AI-powered healthcare management with secure messaging, symptom analysis, and virtual consultations.
                </p>
                
                {/* Quick Access Symptom Checker */}
                <div className="mb-8">
                  <Button 
                    onClick={() => setShowSymptomChecker(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                    size="lg"
                  >
                    <Activity className="h-5 w-5 mr-2" />
                    Try AI Symptom Checker (No Login Required)
                  </Button>
                </div>
              </div>

              <LoginForm onLogin={handleLogin} />
            </div>
          </div>

          {/* Features Section */}
          <div className="flex-1 bg-blue-600 text-white px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
            <div className="mx-auto max-w-md">
              <h3 className="text-2xl font-bold mb-8">Platform Features</h3>
              
              <div className="grid gap-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">AI Health Assistant</h4>
                    <p className="text-blue-100 text-sm">Get instant symptom analysis with medical citations</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Smart Scheduling</h4>
                    <p className="text-blue-100 text-sm">Book appointments with automated reminders</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Video className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Telehealth Visits</h4>
                    <p className="text-blue-100 text-sm">Secure video consultations with providers</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Secure Messaging</h4>
                    <p className="text-blue-100 text-sm">HIPAA-compliant communication</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Medication Tracking</h4>
                    <p className="text-blue-100 text-sm">Smart reminders and adherence monitoring</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Health Analytics</h4>
                    <p className="text-blue-100 text-sm">Track progress and health trends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Symptom Checker Modal */}
        {showSymptomChecker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">AI Symptom Checker</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowSymptomChecker(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <div className="p-6">
                <SymptomChecker />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Dashboard based on user role
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">HealthCare Plus</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600">
                {currentUser.role === 'PATIENT' ? 'Patient' : 'Provider'}
              </Badge>
              <span className="text-sm font-medium text-gray-700">
                {currentUser.name}
              </span>
              <Button variant="outline" onClick={handleLogout} size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      {currentUser.role === 'PATIENT' ? (
        <PatientDashboard user={currentUser} />
      ) : (
        <ProviderDashboard user={currentUser} />
      )}
    </div>
  );
}