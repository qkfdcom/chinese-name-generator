// 常用汉字拼音对照表
export const pinyinMap: { [key: string]: string } = {
  // 常用姓氏
  "李": "Lǐ",
  "王": "Wáng",
  "张": "Zhāng",
  "刘": "Liú",
  "陈": "Chén",
  "杨": "Yáng",
  "黄": "Huáng",
  "赵": "Zhào",
  "周": "Zhōu",
  "吴": "Wú",
  "徐": "Xú",
  "孙": "Sūn",
  "马": "Mǎ",
  "朱": "Zhū",
  "胡": "Hú",
  "郭": "Guō",
  "何": "Hé",
  "高": "Gāo",
  "林": "Lín",
  "罗": "Luó",

  // 常用名字用字
  "明": "Míng",
  "华": "Huá",
  "平": "Píng",
  "博": "Bó",
  "文": "Wén",
  "宇": "Yǔ",
  "浩": "Hào",
  "天": "Tiān",
  "子": "Zǐ",
  "晨": "Chén",
  "阳": "Yáng",
  "思": "Sī",
  "远": "Yuǎn",
  "佳": "Jiā",
  "欣": "Xīn",
  "雨": "Yǔ",
  "雅": "Yǎ",
  "诗": "Shī",
  "语": "Yǔ",
  "嫣": "Yān",
  "梦": "Mèng",
  "琪": "Qí",
  "桐": "Tóng",
  "怡": "Yí",
  "露": "Lù",
  "涵": "Hán",
  "彤": "Tóng",
  "婷": "Tíng",
  "芙": "Fú",
  "萱": "Xuān",
  "洁": "Jié",
  "霖": "Lín",
  "蝶": "Dié",
  "芹": "Qín",
  "晴": "Qíng"
};

export function convertToPinyin(name: string): string {
  return name
    .split('')
    .map(char => pinyinMap[char] || char)
    .join(' ');
} 