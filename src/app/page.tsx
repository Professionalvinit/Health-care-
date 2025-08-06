'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { PatientDashboard } from '@/app/components/patient-dashboard';
import { ProviderDashboard } from '@/app/components/provider-dashboard';
import { LoginForm } from '@/app/components/login-form';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  role: string;
  id: string;
  avatar?: string;
  [key: string]: any;
}

export default function HealthPlatform(): React.ReactElement {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [showSymptomChecker, setShowSymptomChecker] = useState<boolean>(false);

  const handleLogin = (userData: UserData): void => {
    setCurrentUser(userData);
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    setShowSymptomChecker(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Health Platform</h1>

        <div className="space-y-6">
          {!currentUser ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-blue-600" />
                  <span>Welcome to HealthCare Plus</span>
                </CardTitle>
                <CardDescription>
                  Please log in to access your health dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm onLogin={handleLogin} />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {currentUser.name}!
                </h2>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>

              {currentUser.role === 'PATIENT' ? (
                <PatientDashboard user={currentUser} />
              ) : (
                <ProviderDashboard user={currentUser} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}