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

export async function POST(request: NextRequest) {
  try {
    const { chinese, pinyin } = await request.json();
    console.log('Received request:', { chinese, pinyin });

    if (!chinese || !pinyin) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.TENCENT_SECRET_ID || !process.env.TENCENT_SECRET_KEY) {
      return NextResponse.json(
        { error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    const requestBody = JSON.stringify({
      Model: "hunyuan-pro",
      Messages: [
        {
          Role: "user",
          Content: `请对这个中文名字进行详细分析：
            中文名：${chinese}
            拼音：${pinyin}
            
            请从以下几个方面分析：
            1. 字义分析：每个字的具体含义
            2. 音韵分析：声调搭配的优美程度
            3. 文化内涵：名字中包含的文化元素
            4. 寓意分析：整体寓意和祝愿
            
            请用通俗易懂的语言解释，适当使用例子来说明。`
        }
      ],
      Temperature: 0.7,
      Stream: false,
      MaxTokens: 1000
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

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers,
        body: requestBody
      });

      const responseText = await response.text();
      console.log('Raw API Response:', responseText);

      if (!response.ok) {
        const errorMessage = `API request failed: ${response.statusText}`;
        console.error(errorMessage, {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseText
        });
        return NextResponse.json({ error: errorMessage }, { status: response.status });
      }

      let data: HunyuanResponse;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed API Response:', data);
      } catch (error) {
        console.error('Failed to parse API response:', error);
        return NextResponse.json(
          { error: 'Invalid JSON response from API' },
          { status: 500 }
        );
      }

      if (!data.Response?.Choice?.Message?.Content) {
        console.error('Invalid API response structure:', data);
        return NextResponse.json(
          { error: 'Invalid API response structure', details: JSON.stringify(data) },
          { status: 500 }
        );
      }

      const explanation = data.Response.Choice.Message.Content;
      console.log('Explanation:', explanation);

      return NextResponse.json({ explanation });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to connect to API' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 