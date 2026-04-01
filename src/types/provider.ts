export interface Assignment {
  id: string;
  provider_id: string;
  client_name: string;
  client_email: string;
  service_type: string;
  service_description: string;
  status: string;
  start_date: string;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressUpdate {
  id: string;
  assignment_id: string;
  provider_id: string;
  status: string;
  notes: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_type: string;
  sender_name: string;
  recipient_id: string;
  assignment_id?: string;
  content: string;
  is_read: boolean;
  created_at: string;
  attachments?: string[];
}

export interface ProviderPayment {
  id: string;
  provider_id: string;
  assignment_id: string;
  amount: number;
  status: string;
  payment_date?: string;
  paid_out_date?: string;
  notes?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  provider_id: string;
  type: string;
  title: string;
  message: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  bio?: string;
  availability: boolean;
  rating: number;
  total_completed: number;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}
