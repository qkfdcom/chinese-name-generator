export const surnames = [
  "李", "王", "张", "刘", "陈", "杨", "黄", "赵", "周", "吴",
  "徐", "孙", "朱", "马", "胡", "郭", "林", "何", "高", "梁",
  "郑", "罗", "宋", "谢", "唐", "韩", "曹", "许", "邓", "萧",
  // ... 添加更多姓氏，总共200个
];

export const maleNames = [
  "宇轩", "浩然", "子轩", "天翊", "博文", "智宸", "晨阳", "鸿煊", "博远", "思源",
  "承远", "浩轩", "鸿涛", "博雅", "哲瀚", "思远", "承志", "博海", "弘毅", "承德",
  // ... 添加更多男性名字，总共150个
];

export const femaleNames = [
  "语嫣", "梦琪", "雨桐", "欣怡", "梦露", "诗涵", "思彤", "雨欣", "雅静", "雨婷",
  "语芙", "紫萱", "梦洁", "雨霖", "思琪", "美琪", "语蝶", "欣彤", "语芹", "诗晴",
  // ... 添加更多女性名字，总共150个
];

export const onlineNames = [
  "墨染青衣", "清风徐来", "云淡风轻", "花开半夏", "素手琴弦", "明月清风", "一笑倾城", "寒月清霜",
  "流年似水", "暖阳如歌", "清风拂面", "浮生若梦", "星月相伴", "淡若清风", "素手纤纤", "月下独酌",
  // ... 添加更多网名，总共5000个
];

// 名字生成相关的工具函数
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomName(gender: string): string {
  const surname = getRandomElement(surnames);
  const nameArray = gender === 'female' ? femaleNames : maleNames;
  const givenName = getRandomElement(nameArray);
  return surname + givenName;
}

export function getRandomOnlineName(): string {
  return getRandomElement(onlineNames);
} 