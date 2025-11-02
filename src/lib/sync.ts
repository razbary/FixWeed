import { encryptData, decryptData } from './crypto';

export async function syncToCloud(username: string, key: string): Promise<boolean> {
  try {
    const profile = localStorage.getItem('fixweed_profile');
    const setup = localStorage.getItem('fixweed_setup');
    
    const dataToSync = {
      profile,
      setup,
      lastSync: new Date().toISOString()
    };
    
    const encrypted = await encryptData(JSON.stringify(dataToSync), key);
    
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, data: encrypted })
    });
    
    return response.ok;
  } catch (err) {
    console.error('Sync failed:', err);
    return false;
  }
}

export async function loadFromCloud(username: string, key: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/sync/${encodeURIComponent(username)}`);
    
    if (!response.ok) {
      return false;
    }
    
    const { data } = await response.json();
    
    if (!data) {
      return false;
    }
    
    const decrypted = await decryptData(data, key);
    const parsed = JSON.parse(decrypted);
    
    if (parsed.profile) {
      localStorage.setItem('fixweed_profile', parsed.profile);
    }
    if (parsed.setup) {
      localStorage.setItem('fixweed_setup', parsed.setup);
    }
    
    return true;
  } catch (err) {
    console.error('Load failed:', err);
    return false;
  }
}

