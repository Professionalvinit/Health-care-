'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

interface MessagingCenterProps {
  userId: string;
  userRole: 'PATIENT' | 'PROVIDER';
}

export function MessagingCenter({ userId, userRole }: MessagingCenterProps): React.ReactElement {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [newMessageContent, setNewMessageContent] = useState<string>('');
  const [contacts, setContacts] = useState<any[]>([]);
  
  // New message form state
  const [newMessage, setNewMessage] = useState({
    receiverId: '',
    subject: '',
    content: '',
    type: 'GENERAL',
    priority: 'NORMAL'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    loadContacts();
  }, [userId, userRole]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.otherUser.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // In demo mode, use mock data
      const mockConversations = [
        {
          id: '1',
          otherUser: {
            id: userRole === 'PATIENT' ? 'provider-1' : 'patient-1',
            name: userRole === 'PATIENT' ? 'Dr. Michael Chen' : 'Sarah Johnson',
            role: userRole === 'PATIENT' ? 'PROVIDER' : 'PATIENT',
            specialization: userRole === 'PATIENT' ? 'Internal Medicine' : null,
            avatar: userRole === 'PATIENT' 
              ? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face'
              : 'https://images.unsplash.com/photo-1494790108755-2616b2e9d7a2?w=50&h=50&fit=crop&crop=face'
          },
          lastMessage: {
            content: 'Your lab results are ready for review. Please schedule a follow-up appointment.',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: false
          },
          unreadCount: 1
        },
        {
          id: '2',
          otherUser: {
            id: userRole === 'PATIENT' ? 'provider-2' : 'patient-2',
            name: userRole === 'PATIENT' ? 'Dr. Sarah Williams' : 'Michael Rodriguez',
            role: userRole === 'PATIENT' ? 'PROVIDER' : 'PATIENT',
            specialization: userRole === 'PATIENT' ? 'Cardiology' : null,
            avatar: userRole === 'PATIENT'
              ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face'
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
          },
          lastMessage: {
            content: 'Thank you for the medication adjustment. I\'m feeling much better.',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            isRead: true
          },
          unreadCount: 0
        },
        {
          id: '3',
          otherUser: {
            id: userRole === 'PATIENT' ? 'provider-3' : 'patient-3',
            name: userRole === 'PATIENT' ? 'Nurse Jennifer' : 'Emma Thompson',
            role: userRole === 'PATIENT' ? 'PROVIDER' : 'PATIENT',
            specialization: userRole === 'PATIENT' ? 'Nursing' : null,
            avatar: userRole === 'PATIENT'
              ? 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face'
              : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
          },
          lastMessage: {
            content: 'Don\'t forget to take your medication with food as prescribed.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            isRead: true
          },
          unreadCount: 0
        }
      ];

      setConversations(mockConversations);
      
      // Auto-select first conversation if none selected
      if (!activeConversation && mockConversations.length > 0) {
        setActiveConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string): Promise<void> => {
    try {
      // Mock conversation messages
      const mockMessages = [
        {
          id: '1',
          sender: { 
            id: activeConversation.otherUser.id, 
            name: activeConversation.otherUser.name,
            role: activeConversation.otherUser.role
          },
          content: 'Hello! I wanted to follow up on your recent visit. How are you feeling?',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isRead: true,
          type: 'GENERAL'
        },
        {
          id: '2',
          sender: { id: userId, name: 'You', role: userRole },
          content: 'Hi Dr. Chen! I\'m feeling much better since starting the new medication. The symptoms have improved significantly.',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
          isRead: true,
          type: 'GENERAL'
        },
        {
          id: '3',
          sender: { 
            id: activeConversation.otherUser.id, 
            name: activeConversation.otherUser.name,
            role: activeConversation.otherUser.role
          },
          content: 'That\'s great to hear! Your lab results came back and everything looks good. I\'d like to schedule a follow-up in 3 months to monitor your progress.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false,
          type: 'TEST_RESULT'
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadContacts = async (): Promise<void> => {
    try {
      // Mock contacts based on user role
      const mockContacts = userRole === 'PATIENT' ? [
        { id: 'provider-1', name: 'Dr. Michael Chen', specialization: 'Internal Medicine' },
        { id: 'provider-2', name: 'Dr. Sarah Williams', specialization: 'Cardiology' },
        { id: 'provider-3', name: 'Dr. Emily Rodriguez', specialization: 'Dermatology' },
        { id: 'provider-4', name: 'Nurse Jennifer', specialization: 'Nursing' }
      ] : [
        { id: 'patient-1', name: 'Sarah Johnson', role: 'Patient' },
        { id: 'patient-2', name: 'Michael Rodriguez', role: 'Patient' },
        { id: 'patient-3', name: 'Emma Thompson', role: 'Patient' },
        { id: 'patient-4', name: 'John Davis', role: 'Patient' }
      ];

      setContacts(mockContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim() || !activeConversation) return;

    try {
      // Create new message
      const newMsg = {
        id: Date.now().toString(),
        sender: { id: userId, name: 'You', role: userRole },
        content: content.trim(),
        createdAt: new Date(),
        isRead: true,
        type: 'GENERAL'
      };

      // Add message to current conversation
      setMessages(prev => [...prev, newMsg]);
      setNewMessageContent('');

      // In real app, make API call
      // await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     senderId: userId,
      //     receiverId: activeConversation.otherUser.id,
      //     content: content.trim(),
      //     type: 'GENERAL'
      //   })
      // });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateNewMessage = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // In real app, make API call
      // await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     senderId: userId,
      //     ...newMessage
      //   })
      // });

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowNewMessageDialog(false);
      loadConversations();
      
      // Reset form
      setNewMessage({
        receiverId: '',
        subject: '',
        content: '',
        type: 'GENERAL',
        priority: 'NORMAL'
      });
      
    } catch (error) {
      console.error('Error creating message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'URGENT': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'NORMAL': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getMessageTypeIcon = (type: string): React.ReactElement => {
    switch (type) {
      case 'TEST_RESULT': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'EMERGENCY': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'APPOINTMENT': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatMessageTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 24 * 60 * 60 * 1000) { // Less than 24 hours
      return format(date, 'h:mm a');
    } else if (diff < 7 * 24 * 60 * 60 * 1000) { // Less than 7 days
      return format(date, 'EEE');
    } else {
      return format(date, 'MMM d');
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm === '' || 
      conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex h-[600px] border rounded-lg bg-white">
      {/* Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Messages</h3>
            <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>New Message</DialogTitle>
                  <DialogDescription>
                    Send a message to a healthcare {userRole === 'PATIENT' ? 'provider' : 'patient'}.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="receiver">To</Label>
                    <Select value={newMessage.receiverId} onValueChange={(value) => setNewMessage({...newMessage, receiverId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${userRole === 'PATIENT' ? 'provider' : 'patient'}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} {contact.specialization && `• ${contact.specialization}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                      placeholder="Enter message subject"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={newMessage.type} onValueChange={(value) => setNewMessage({...newMessage, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="APPOINTMENT">Appointment</SelectItem>
                          <SelectItem value="PRESCRIPTION">Prescription</SelectItem>
                          <SelectItem value="TEST_RESULT">Test Result</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newMessage.priority} onValueChange={(value) => setNewMessage({...newMessage, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="NORMAL">Normal</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="content">Message</Label>
                    <Textarea
                      id="content"
                      value={newMessage.content}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage({...newMessage, content: e.target.value})}
                      placeholder="Type your message here..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateNewMessage} 
                    disabled={isLoading || !newMessage.receiverId || !newMessage.content}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversation(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeConversation?.id === conversation.id 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img 
                    src={conversation.otherUser.avatar} 
                    alt={conversation.otherUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {conversation.otherUser.name}
                      </h4>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    {conversation.otherUser.specialization && (
                      <p className="text-xs text-gray-500 mb-1">
                        {conversation.otherUser.specialization}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                    
                    <p className="text-xs text-gray-400 mt-1">
                      {formatMessageTime(conversation.lastMessage.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <img 
                  src={activeConversation.otherUser.avatar} 
                  alt={activeConversation.otherUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{activeConversation.otherUser.name}</h4>
                  {activeConversation.otherUser.specialization && (
                    <p className="text-sm text-gray-600">
                      {activeConversation.otherUser.specialization}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.id === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${
                      message.sender.id === userId 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    } rounded-lg p-3`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {getMessageTypeIcon(message.type)}
                        <span className="text-xs opacity-75">
                          {message.sender.name}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {format(message.createdAt, 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(newMessageContent)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => sendMessage(newMessageContent)}
                  disabled={!newMessageContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the list to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}