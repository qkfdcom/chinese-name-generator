import { generateChineseName } from '@/utils/nameGenerator';

interface HunyuanResponse {
  chinese: string;
  pinyin: string;
  meaning: string;
  cultural: string;
}

interface APIError {
  error: string;
}

export async function generateNameWithHunyuan(
  firstName: string,
  lastName: string,
  gender: string,
  style: string
): Promise<HunyuanResponse> {
  try {
    // 暂时使用本地生成器
    return generateChineseName(firstName, lastName, gender, style);
  } catch (error) {
    console.error('Name generation error:', error);
    throw error instanceof Error ? error : new Error('Failed to generate name');
  }
} 