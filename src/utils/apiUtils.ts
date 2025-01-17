import crypto from 'crypto';

export const API_ENDPOINT = 'https://hunyuan.tencentcloudapi.com/hyllm/v1/chat/completions';

export function generateSignature(secretId: string, secretKey: string, timestamp: number, requestBody: string) {
  const service = 'hunyuan';
  const algorithm = 'TC3-HMAC-SHA256';
  const date = new Date(timestamp * 1000).toISOString().split('T')[0];
  const host = 'hunyuan.tencentcloudapi.com';
  const contentType = 'application/json; charset=utf-8';
  const canonicalUri = '/hyllm/v1/chat/completions';

  const hashedRequestPayload = crypto
    .createHash('sha256')
    .update(requestBody)
    .digest('hex');

  const canonicalRequest = [
    'POST',
    canonicalUri,
    '',
    'content-type:' + contentType.toLowerCase(),
    'host:' + host.toLowerCase(),
    '',
    'content-type;host',
    hashedRequestPayload,
  ].join('\n');

  const credentialScope = `${date}/${service}/tc3_request`;
  const hashedCanonicalRequest = crypto
    .createHash('sha256')
    .update(canonicalRequest)
    .digest('hex');

  const stringToSign = [
    algorithm,
    timestamp,
    credentialScope,
    hashedCanonicalRequest,
  ].join('\n');

  const secretDate = crypto
    .createHmac('sha256', `TC3${secretKey}`)
    .update(date)
    .digest();
  const secretService = crypto
    .createHmac('sha256', secretDate)
    .update(service)
    .digest();
  const secretSigning = crypto
    .createHmac('sha256', secretService)
    .update('tc3_request')
    .digest();

  const signature = crypto
    .createHmac('sha256', secretSigning)
    .update(stringToSign)
    .digest('hex');

  return {
    authorization: `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=content-type;host, Signature=${signature}`,
    timestamp
  };
} 