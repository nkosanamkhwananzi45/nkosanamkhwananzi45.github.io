export interface Intake {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: 'tutoring' | 'training' | 'consulting';
  service_description: string;
  required_skills: string[];
  preferred_start_date: string;
  status: 'new' | 'reviewed' | 'allocated' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  admin_id?: string;
  created_by: string;
}

export interface IntakeFormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: 'tutoring' | 'training' | 'consulting';
  service_description: string;
  required_skills: string[];
  preferred_start_date: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface IntakeFilter {
  status?: Intake['status'];
  priority?: Intake['priority'];
  serviceType?: Intake['service_type'];
  searchTerm?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}
