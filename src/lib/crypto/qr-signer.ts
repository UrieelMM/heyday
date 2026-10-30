import crypto from 'crypto';

export interface QrPassData {
  eventId: string;
  groupId: string;
  confirmedAdults: number;
  confirmedChildren: number;
}

export function signQrPass(data: QrPassData, secretKey: string): string {
  const payloadBase = `INV1:${data.eventId}:${data.groupId}:${data.confirmedAdults}:${data.confirmedChildren}`;
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(payloadBase)
    .digest('hex')
    .slice(0, 16);

  return `${payloadBase}:${hmac}`;
}

export function verifyQrPass(
  qrPayload: string,
  secretKey: string
): { valid: boolean; data?: QrPassData } {
  const parts = qrPayload.split(':');
  if (parts.length !== 6 || parts[0] !== 'INV1') {
    return { valid: false };
  }

  const [, eventId, groupId, adultsStr, childrenStr, providedHmac] = parts;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuid.test(eventId) || !uuid.test(groupId) || !/^(0|[1-9]\d?)$/.test(adultsStr) || !/^(0|[1-9]\d?)$/.test(childrenStr) || !/^[0-9a-f]{16}$/.test(providedHmac)) {
    return { valid: false };
  }
  const confirmedAdults = Number.parseInt(adultsStr, 10);
  const confirmedChildren = Number.parseInt(childrenStr, 10);

  if (Number.isNaN(confirmedAdults) || Number.isNaN(confirmedChildren)) {
    return { valid: false };
  }

  const payloadBase = `INV1:${eventId}:${groupId}:${confirmedAdults}:${confirmedChildren}`;
  const expectedHmac = crypto
    .createHmac('sha256', secretKey)
    .update(payloadBase)
    .digest('hex')
    .slice(0, 16);

  const providedBuf = Buffer.from(providedHmac, 'utf8');
  const expectedBuf = Buffer.from(expectedHmac, 'utf8');

  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return { valid: false };
  }

  return {
    valid: true,
    data: {
      eventId,
      groupId,
      confirmedAdults,
      confirmedChildren,
    },
  };
}
