import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import ListGenerator from '@/app/components/ListGenerator';
import ThemeSelector from '@/app/components/ThemeSelector';
import { fetchUserSettings } from '@/app/lib/data';
import { createServerClient } from '@/utils/pocketbase/server';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Page() {
  const userSettings = await fetchUserSettings();
  const pb = createServerClient();
  const userId = pb.authStore.model?.id || '';

  // Default values if no settings exist yet
  const settings = userSettings || {
    appointment_types: [],
    appointment_types_default: '',
    appointment_specialties: [],
    appointment_specialties_default: '',
    theme: 'light',
    user_id: userId,
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex w-full flex-col">
        <h1 className={`${GeistSans.className} text-2xl`}>Settings</h1>
        <div className="flex flex-col">
          <div className="h-12"></div>

          <ThemeSelector 
            currentTheme={settings.theme || 'light'} 
            userId={settings.user_id || userId} 
          />
          
          <div className="h-12"></div>

          <ListGenerator
            listName="Appointment Types"
            fieldName="appointment_types"
            listItems={settings.appointment_types || []}
            defaultItem={settings.appointment_types_default || ''}
            userId={settings.user_id || userId}
          />
          <div className="h-12"></div>
          <ListGenerator
            listName="Appointment Specialties"
            fieldName="appointment_specialties"
            listItems={settings.appointment_specialties || []}
            defaultItem={settings.appointment_specialties_default || ''}
            userId={settings.user_id || userId}
          />
        </div>
      </div>
    </div>
  );
}
