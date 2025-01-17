import { surnames, maleNames, femaleNames, onlineNames, getRandomElement } from '@/data/nameData';
import { convertToPinyin } from './pinyinData';

interface NameResult {
  chinese: string;
  pinyin: string;
  onlineName: string;
}

export function generateChineseName(
  firstName: string,
  lastName: string,
  gender: string,
  _style: string
): NameResult {
  const surname = getRandomElement(surnames);
  const nameArray = gender === 'female' ? femaleNames : maleNames;
  const givenName = getRandomElement(nameArray);
  const onlineName = getRandomElement(onlineNames);
  const fullName = surname + givenName;

  return {
    chinese: fullName,
    pinyin: convertToPinyin(fullName),
    onlineName: onlineName
  };
} 