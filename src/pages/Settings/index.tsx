import React, { useState } from 'react';
import { Bell, Mail, Shield, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: 'SDN 01 Semper Timur',
    email: 'admin@sdn01sempertimur.edu',
    emailNotifications: true
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Profile Settings */}
          <div className="space-y-4">
            <h3 className="text-base font-medium flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </h3>
            <div className="ml-7 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">School Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h3>
            <div className="ml-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive email notifications for borrowed documents</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </h3>
            <div className="ml-7">
              <Button variant="outline">
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}