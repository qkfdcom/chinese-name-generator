import { generateChineseName } from '@/utils/nameGenerator';

interface NameResult {
  chinese: string;
  pinyin: string;
  onlineName: string;
}

export async function generateNameWithHunyuan(
  firstName: string,
  lastName: string,
  gender: string,
  style: string
): Promise<NameResult> {
  try {
    // 暂时使用本地生成器
    return generateChineseName(firstName, lastName, gender, style);
  } catch (error) {
    console.error('Name generation error:', error);
    throw error instanceof Error ? error : new Error('Failed to generate name');
  }
} 