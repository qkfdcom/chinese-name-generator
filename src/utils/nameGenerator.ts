import { surnames, maleNames, femaleNames, onlineNames, getRandomElement } from '@/data/nameData';
import { convertToPinyin } from './pinyinData';

interface NameResult {
  chinese: string;
  pinyin: string;
  onlineName: string;
}

// 根据不同风格定义名字特征
const styleCharacteristics = {
  elegant: {
    characters: ['雅', '芸', '婉', '清', '淑', '华', '嘉', '琪', '瑶', '璎', '萱', '雯', '静', '怡', '宸', '晗', '翊', '轩', '致', '远'],
    description: 'Elegant and graceful names'
  },
  modern: {
    characters: ['昊', '浩', '宇', '晨', '阳', '子', '涵', '睿', '天', '羽', '梓', '辰', '铭', '鑫', '博', '雨', '晴', '曦', '璇', '瑞'],
    description: 'Contemporary and trendy names'
  },
  traditional: {
    characters: ['德', '文', '明', '志', '永', '仁', '礼', '义', '智', '信', '国', '家', '安', '平', '福', '寿', '康', '宁', '泰', '和'],
    description: 'Classical and traditional names'
  },
  creative: {
    characters: ['奇', '逸', '灵', '韵', '彩', '霄', '瑾', '珺', '璨', '曜', '熠', '玥', '颜', '影', '霖', '晟', '萌', '悦', '蕊', '洋'],
    description: 'Unique and creative names'
  }
};

const getStyleSpecificNames = (style: string, names: string[]): string[] => {
  const styleChars = styleCharacteristics[style as keyof typeof styleCharacteristics]?.characters || [];
  
  // 过滤包含风格特征字的名字
  const styleFilteredNames = names.filter(name => 
    styleChars.some(char => name.includes(char))
  );

  // 如果过滤后的名字太少，返回原始名字列表
  return styleFilteredNames.length > 10 ? styleFilteredNames : names;
}

export function generateChineseName(
  firstName: string,
  lastName: string,
  gender: string,
  style: string
): NameResult {
  const surname = getRandomElement(surnames);
  const nameArray = gender === 'female' ? femaleNames : maleNames;
  const styleNames = getStyleSpecificNames(style, nameArray);
  const givenName = getRandomElement(styleNames);
  const onlineName = getRandomElement(onlineNames);
  const fullName = surname + givenName;

  return {
    chinese: fullName,
    pinyin: convertToPinyin(fullName),
    onlineName: onlineName
  };
} 