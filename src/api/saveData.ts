import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function saveData(fileName: string, data: any) {
  try {
    const filePath = join(process.cwd(), 'public', fileName);
    await writeFile(filePath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving data:', error);
    return { success: false, error: error.message };
  }
}