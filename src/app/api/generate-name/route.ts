import { NextRequest, NextResponse } from 'next/server';
import { generateSignature, API_ENDPOINT } from '../../../utils/apiUtils';

interface HunyuanResponse {
  Response: {
    Choice: {
      Message: {
        Content: string;
      };
    };
    RequestId: string;
  };
}

interface NameResult {
  chinese: string;
  pinyin: string;
  meaning: string;
  cultural: string;
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, gender, style } = await request.json();

    if (!firstName || !lastName || !gender || !style) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.TENCENT_SECRET_ID || !process.env.TENCENT_SECRET_KEY) {
      throw new Error('API credentials not configured');
    }

    const requestBody = JSON.stringify({
      Model: "hunyuan-pro",
      Messages: [
        {
          Role: "user",
          Content: `作为一个专业的中文取名专家，请根据以下信息生成一个独特的中文名字：
            英文名：${firstName} ${lastName}
            性别：${gender}
            风格：${style}
            
            要求：
            1. 名字要体现用户的英文名特点
            2. 符合所选性别特征
            3. 契合选择的风格
            4. 音律要优美
            5. 字义要积极向上
            
            请严格按照以下JSON格式返回结果，不要包含任何其他文字：
            {
              "chinese": "中文名字（2-3个字）",
              "pinyin": "拼音（带声调）",
              "meaning": "名字的英文含义（简明扼要）",
              "cultural": "文化内涵和寓意（50字以内）"
            }`
        }
      ],
      Temperature: 0.8,
      Stream: false,
      TopP: 0.7,
      MaxTokens: 800
    });

    const timestamp = Math.floor(Date.now() / 1000);
    const { authorization } = generateSignature(
      process.env.TENCENT_SECRET_ID,
      process.env.TENCENT_SECRET_KEY,
      timestamp,
      requestBody
    );

    const headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': authorization,
      'X-TC-Timestamp': timestamp.toString(),
      'X-TC-Region': 'ap-guangzhou',
      'Host': 'hunyuan.tencentcloudapi.com'
    });

    console.log('Request Headers:', Object.fromEntries(headers.entries()));
    console.log('Request Body:', requestBody);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      body: requestBody
    });

    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!response.ok) {
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      });
      throw new Error(`API request failed: ${response.statusText} - ${responseText}`);
    }

    let data: HunyuanResponse;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed API Response:', data);
    } catch (error) {
      console.error('Failed to parse API response:', error);
      throw new Error('Invalid JSON response from API');
    }

    if (!data.Response?.Choice?.Message?.Content) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid API response structure');
    }

    const content = data.Response.Choice.Message.Content;
    console.log('Message Content:', content);

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in content:', content);
        throw new Error('No JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]) as NameResult;
      console.log('Parsed Result:', result);
      
      if (!result.chinese || !result.pinyin || !result.meaning || !result.cultural) {
        console.error('Missing fields in result:', result);
        throw new Error('Missing required fields in response');
      }

      return NextResponse.json(result);
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      throw new Error('Failed to parse name generation result');
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate name' },
      { status: 500 }
    );
  }
} 