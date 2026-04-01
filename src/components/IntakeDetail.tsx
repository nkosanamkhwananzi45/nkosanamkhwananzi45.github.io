import { Badge } from '@/components/ui/badge';
import { Intake } from '@/types/intake';
import { Calendar, Mail, Phone, BookOpen } from 'lucide-react';

interface IntakeDetailProps {
  intake: Intake;
}

export default function IntakeDetail({ intake }: IntakeDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold mb-2">{intake.client_name}</h2>
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-800">{intake.status}</Badge>
          <Badge className={intake.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
            {intake.priority}
          </Badge>
        </div>
      </div>

      {/* Client Information */}
      <div>
        <h3 className="font-semibold mb-3">Contact Information</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-600" />
            <a href={`mailto:${intake.client_email}`} className="text-blue-600 hover:underline">
              {intake.client_email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-600" />
            <span>{intake.client_phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-600" />
            <span>{new Date(intake.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Service Information */}
      <div>
        <h3 className="font-semibold mb-3">Service Details</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Service Type</p>
            <p className="font-medium capitalize">{intake.service_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Description</p>
            <p className="mt-1">{intake.service_description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Preferred Start Date</p>
            <p className="font-medium">{new Date(intake.preferred_start_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      {intake.required_skills.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {intake.required_skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-100">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {intake.notes && (
        <div>
          <h3 className="font-semibold mb-3">Notes</h3>
          <p className="bg-gray-50 p-3 rounded text-sm">{intake.notes}</p>
        </div>
      )}
    </div>
  );
}
