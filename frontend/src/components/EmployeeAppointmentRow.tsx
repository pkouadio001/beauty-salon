import React, { useState } from 'react';
import type { Appointment, Customer } from '../type';

interface EmployeeAppointmentRowProps {
  appointment: Appointment;
  customer: Customer;
  serviceName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const EmployeeAppointmentRow: React.FC<EmployeeAppointmentRowProps> = ({
  appointment,
  customer,
  serviceName,
}) => {
  const [status, setStatus] = useState<'PENDING' | 'COMPLETED' | 'CANCELLED'>(appointment.status as 'PENDING' | 'COMPLETED' | 'CANCELLED');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: 'PENDING' | 'COMPLETED' | 'CANCELLED') => {
    setSaving(true);
    setSaveError(null);
    try {
      const body = { status: newStatus };
      const res = await fetch(`${API_BASE_URL}/v1/appointments/${appointment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      setStatus(newStatus);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save status');
    } finally {
      setSaving(false);
    }
  };
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50 transition-colors text-sm text-gray-700 relative">
      {/* Customer Info */}
      <td className="p-4 border-r border-gray-300">
        <ul className="list-disc list-inside space-y-1">
          <li className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</li>
          <li>{customer.email}</li>
          <li>{customer.phoneNumber}</li>
        </ul>
      </td>

      {/* Service */}
      <td className="p-4 border-r border-gray-300 text-center">
        {serviceName}
      </td>

      {/* Appointment Date */}
      <td className="p-4 border-r border-gray-300 text-center text-sm">
        {new Date(appointment.appointmentDate).toLocaleDateString()}
      </td>

      {/* Appointment Time */}
      <td className="p-4 border-r border-gray-300 text-center text-sm">
        {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>

      {/* Total Cost */}
      <td className="p-4 border-r border-gray-300 font-semibold">
        ${appointment.totalPrice.toFixed(2)}
      </td>

      {/* Status */}
      <td className="p-4 text-center">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as 'PENDING' | 'COMPLETED' | 'CANCELLED')}
          disabled={saving || status === 'COMPLETED'}
          className={`px-3 py-1 rounded text-xs font-bold border border-gray-300 cursor-pointer disabled:opacity-50 ${
            status === 'PENDING' ? 'bg-gray-100 text-gray-600' : 
            status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
            status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600'
          }`}
        >
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        {saveError && <div className="text-xs text-red-500 mt-1 italic">{saveError}</div>}
      </td>
    </tr>
  );
};
