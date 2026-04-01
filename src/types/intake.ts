export interface Intake {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  client_id: string | null;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  service_description: string;
  required_skills: string[] | null;
  preferred_start_date: string;
  status: string;
  priority: string;
  notes?: string | null;
  admin_id?: string | null;
  created_by: string;
}

export interface IntakeFormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  service_description: string;
  required_skills: string[];
  preferred_start_date: string;
  priority: string;
  notes?: string;
}

export interface IntakeFilter {
  status?: string;
  priority?: string;
  serviceType?: string;
  searchTerm?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}
