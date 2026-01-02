import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omwlwtvzecnajkylsgpi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9td2x3dHZ6ZWNuYWpreWxzZ3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNDk4NjEsImV4cCI6MjA4MjgyNTg2MX0.HKyZiffm4kNrsgLtklPH37jUwu5eKksCVnyETJI48XY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 뉴스레터 구독 이메일 저장
export async function saveNewsletterEmail(
  email: string,
  agreeRequired: boolean,
  agreeMarketing: boolean
) {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert([
      {
        email,
        agree_required: agreeRequired,
        agree_marketing: agreeMarketing,
        subscribed_at: new Date().toISOString(),
      },
    ]);

  if (error) {
    throw error;
  }

  return { success: true };
}
