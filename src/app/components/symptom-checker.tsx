'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Heart, 
  Loader2,
  Plus,
  X 
} from 'lucide-react';

export function SymptomChecker(): React.ReactElement {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState<string>('');
  const [severity, setSeverity] = useState<number[]>([5]);
  const [description, setDescription] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiSources, setAiSources] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);

  const addSymptom = (): void => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove: string): void => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      addSymptom();
    }
  };

  const analyzeSymptoms = async (): Promise<void> => {
    if (symptoms.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 'demo-patient', // Demo user
          symptoms: JSON.stringify(symptoms),
          severity: severity[0],
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }

      const result = await response.json();
      setAiResponse(result.aiResponse || '');
      setAiSources(result.aiSources ? JSON.parse(result.aiSources) : []);
      setAnalysisComplete(true);
    } catch (error: any) {
      console.error('Symptom analysis error:', error);
      setAiResponse('Sorry, we encountered an issue analyzing your symptoms. Please try again or consult with a healthcare professional.');
      setAiSources([]);
      setAnalysisComplete(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetChecker = (): void => {
    setSymptoms([]);
    setCurrentSymptom('');
    setSeverity([5]);
    setDescription('');
    setAiResponse('');
    setAiSources([]);
    setAnalysisComplete(false);
  };

  const getSeverityColor = (level: number): string => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    if (level <= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSeverityLabel = (level: number): string => {
    if (level <= 3) return 'Mild';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'Severe';
    return 'Very Severe';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Symptom Checker</h2>
        <p className="text-gray-600 mb-4">
          Get instant health insights powered by medical AI. This tool provides information but does not replace professional medical advice.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-2 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              For emergencies, call 911. Always consult healthcare professionals for medical decisions.
            </span>
          </div>
        </div>
      </div>

      {!analysisComplete ? (
        <div className="grid gap-6 md:grid-cols-1">
          {/* Symptom Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-blue-600" />
                <span>What symptoms are you experiencing?</span>
              </CardTitle>
              <CardDescription>
                Add each symptom you&apos;re experiencing. Be as specific as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., headache, fever, cough..."
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={addSymptom} disabled={!currentSymptom.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {symptoms.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Symptoms:</Label>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {symptom}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-2 hover:bg-transparent"
                          onClick={() => removeSymptom(symptom)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Severity and Description */}
          {symptoms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Symptom Details</CardTitle>
                <CardDescription>
                  Help us understand the severity and provide additional context.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Overall Severity (1-10)</Label>
                    <span className={`font-semibold ${getSeverityColor(severity[0])}`}>
                      {severity[0]} - {getSeverityLabel(severity[0])}
                    </span>
                  </div>
                  <Slider
                    value={severity}
                    onValueChange={setSeverity}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                    <span>Very Severe</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="When did symptoms start? What makes them better or worse? Any other relevant information..."
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={analyzeSymptoms}
                  disabled={isAnalyzing || symptoms.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4 mr-2" />
                      Get AI Health Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Analysis Complete</span>
              </CardTitle>
              <CardDescription>
                Based on your symptoms: {symptoms.join(', ')} (Severity: {severity[0]}/10)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">AI Health Analysis</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-blue-800 whitespace-pre-wrap">{aiResponse}</p>
                </div>
              </div>

              {aiSources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Medical Sources</h4>
                  <div className="space-y-2">
                    {aiSources.map((source, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                        <a 
                          href={source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {source}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex space-x-3">
                <Button onClick={resetChecker} variant="outline" className="flex-1">
                  Check More Symptoms
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Schedule Appointment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Important Disclaimers */}
          <Card>
            <CardContent className="pt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Important Medical Disclaimer</h4>
                <div className="text-sm text-red-800 space-y-1">
                  <p>• This AI analysis is for informational purposes only and does not constitute medical advice</p>
                  <p>• Always consult with qualified healthcare professionals for proper medical evaluation</p>
                  <p>• Seek immediate medical attention for severe symptoms or emergencies</p>
                  <p>• Do not delay medical care based on this analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}