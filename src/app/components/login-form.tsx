'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Plus } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  role: string;
  id: string;
  avatar?: string;
  [key: string]: any;
}

interface LoginFormProps {
  onLogin: (userData: UserData) => void;
}

export function LoginForm({ onLogin }: LoginFormProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDemoLogin = async (role: string, userData: Record<string, any>): Promise<void> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onLogin({
      ...userData,
      role,
      id: `demo-${role.toLowerCase()}-${Date.now()}`,
    } as UserData);

    setIsLoading(false);
  };

  const patientData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    address: '123 Main St, Anytown, ST 12345',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e9d7a2?w=150&h=150&fit=crop&crop=face',
    bloodType: 'O+',
    allergies: 'Penicillin, Shellfish',
    emergencyContact: 'John Johnson - +1 (555) 123-4568',
  };

  const providerData = {
    name: 'Dr. Michael Chen',
    email: 'dr.chen@healthcareplus.com',
    phone: '+1 (555) 987-6543',
    specialization: 'Internal Medicine',
    licenseNumber: 'MD-123456',
    yearsExperience: 12,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription>
          Access your health dashboard or try our demo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Demo Access</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Experience the platform with our demo accounts
              </p>
            </div>
            
            <div className="grid gap-3">
              <Button
                onClick={() => handleDemoLogin('PATIENT', patientData)}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {isLoading ? 'Loading...' : 'Demo Patient Dashboard'}
              </Button>
              
              <Button
                onClick={() => handleDemoLogin('PROVIDER', providerData)}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {isLoading ? 'Loading...' : 'Demo Provider Dashboard'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PATIENT">Patient</SelectItem>
                    <SelectItem value="PROVIDER">Healthcare Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Sign In
              </Button>
              
              <div className="text-center">
                <Button variant="link" className="text-sm">
                  Forgot password?
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-gray-600">
            New to HealthCare Plus?
          </p>
          <Button variant="link" className="text-sm text-blue-600">
            <Plus className="h-3 w-3 mr-1" />
            Create Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}