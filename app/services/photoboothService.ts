import { FRAMES_CONFIG } from '../utils/photobooth/frames';

const DEFAULT_SETTINGS = {
  active: true,
  maintenanceMessage: 'Studio Foto sedang dinonaktifkan sementara. Nantikan event spesial berikutnya!',
  activeEventName: 'Event Spesial',
  customFrames: []
};

export const photoboothService = {
  async getSettings() {
    try {
      const [settingsData, framesData] = await Promise.all([
        $fetch('/api/settings').catch(() => ({})),
        $fetch('/api/frames').catch(() => [])
      ]);
      return {
        ...DEFAULT_SETTINGS,
        ...settingsData,
        customFrames: framesData || []
      };
    } catch (err) {
      console.error('Error loading photobooth settings:', err);
      return DEFAULT_SETTINGS;
    }
  },

  async getFrames() {
    try {
      const frames = await $fetch('/api/frames').catch(() => []);
      return [...FRAMES_CONFIG, ...frames];
    } catch (err) {
      console.error('Error getting combined photobooth frames:', err);
      return FRAMES_CONFIG;
    }
  },

  async updateSettings(settings: any) {
    try {
      await $fetch('/api/settings', {
        method: 'POST',
        body: {
          active: settings.active,
          maintenanceMessage: settings.maintenanceMessage,
          activeEventName: settings.activeEventName
        }
      });
      
      // Also update frame names if changed
      const customFrames = settings.customFrames || [];
      for (const frame of customFrames) {
        if (frame.id) {
          await $fetch(`/api/frames/${frame.id}`, {
            method: 'PUT',
            body: { name: frame.name }
          }).catch(e => console.error('Failed to update frame name:', e));
        }
      }
      
      return { success: true, data: settings };
    } catch (error: any) {
      console.error('Error updating photobooth settings:', error);
      return { success: false, error: error.message };
    }
  },

  async addCustomFrame(newFrame: any) {
    try {
      const res = await $fetch('/api/frames', {
        method: 'POST',
        body: newFrame
      });
      return { success: true, image_key: (res as any).image_key };
    } catch (error: any) {
      console.error('Error adding custom frame:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteCustomFrame(id: string) {
    try {
      await $fetch(`/api/frames/${id}`, {
        method: 'DELETE'
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting custom frame:', error);
      return { success: false, error: error.message };
    }
  }
};
