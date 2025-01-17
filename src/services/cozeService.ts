interface CozeResponse {
  reply: string;
  data?: {
    chinese: string;
    pinyin: string;
    meaning: string;
    cultural: string;
  };
}

export async function generateNameWithCoze(
  firstName: string,
  lastName: string,
  gender: string,
  style: string
): Promise<CozeResponse> {
  try {
    const response = await fetch('https://www.coze.cn/open/api/bot/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
      },
      body: JSON.stringify({
        bot_id: process.env.COZE_BOT_ID,
        messages: [
          {
            role: 'user',
            content: `Please generate a Chinese name based on the following information:
              First Name: ${firstName}
              Last Name: ${lastName}
              Gender: ${gender}
              Style: ${style}
              
              Please provide the name in this format:
              {
                "chinese": "中文名",
                "pinyin": "pinyin with tones",
                "meaning": "detailed meaning in English",
                "cultural": "cultural context and significance"
              }`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate name');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating name:', error);
    throw error;
  }
} 