'use server';

import axios from 'axios';

const backendApi = axios.create({
  baseURL: 'http://localhost:5139/api',
});

export async function sendContactRequest(data: {
  fullName: string;
  email: string;
  phoneNumber: string;
  requestType: string;
  message: string;
  preferredReplyChannel: number | null;
}): Promise<{ succeeded: boolean; message: string; data?: any }> {
  try {
    const res = await backendApi.post('/ContactRequest/Send', data);
    return res.data;
  } catch (err: any) {
    return {
      succeeded: false,
      message: err.response?.data?.message || err.message || 'خطأ في الاتصال',
    };
  }
}
