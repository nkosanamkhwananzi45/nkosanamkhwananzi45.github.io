import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIntakeManagement } from '@/hooks/useIntakeManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { IntakeFormData } from '@/types/intake';

interface IntakeFormProps {
  initialData?: IntakeFormData;
  onSuccess: () => void;
}

export default function IntakeForm({ initialData, onSuccess }: IntakeFormProps) {
  const { user } = useAuth();
  const { createIntake, loading } = useIntakeManagement();
  const [formData, setFormData] = useState<IntakeFormData>(
    initialData || {
      client_name: '',
      client_email: '',
      client_phone: '',
      service_type: 'tutoring',
      service_description: '',
      required_skills: [],
      preferred_start_date: '',
      priority: 'medium',
      notes: '',
    }
  );
  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const success = await createIntake(formData, user.id);
    if (success) {
      onSuccess();
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        required_skills: [...prev.required_skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      required_skills: prev.required_skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="font-semibold">Client Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client_name">Client Name</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, client_name: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client_email">Email</Label>
            <Input
              id="client_email"
              type="email"
              value={formData.client_email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, client_email: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client_phone">Phone</Label>
            <Input
              id="client_phone"
              value={formData.client_phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, client_phone: e.target.value }))
              }
              required
            />
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-4">
        <h3 className="font-semibold">Service Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="service_type">Service Type</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, service_type: value as any }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tutoring">Tutoring</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, priority: value as any }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="service_description">Service Description</Label>
          <Textarea
            id="service_description"
            value={formData.service_description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, service_description: e.target.value }))
            }
            required
            rows={4}
          />
        </div>
      </div>

      {/* Skills & Dates */}
      <div className="space-y-4">
        <h3 className="font-semibold">Skills & Timeline</h3>
        <div className="space-y-2">
          <Label>Required Skills</Label>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Enter a skill..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button type="button" onClick={addSkill} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.required_skills.map((skill, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferred_start_date">Preferred Start Date</Label>
          <Input
            id="preferred_start_date"
            type="date"
            value={formData.preferred_start_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, preferred_start_date: e.target.value }))
            }
            required
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Intake'}
      </Button>
    </form>
  );
}
