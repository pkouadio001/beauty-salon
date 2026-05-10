import React, { useState } from 'react';
import type { Appointment, Employee, Customer } from '../type';

interface AppointmentRowProps {
  appointment: Appointment;
  customer: Customer;
  serviceName: string;
  availableEmployees: Employee[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const AppointmentRow: React.FC<AppointmentRowProps> = ({
  appointment,
  customer,
  serviceName,
  availableEmployees,
}) => {
  const [assignedId, setAssignedId] = useState<number | null>(appointment.employeeId);
  const [status, setStatus] = useState<'PENDING' | 'COMPLETED' | 'CANCELLED'>(appointment.status as 'PENDING' | 'COMPLETED' | 'CANCELLED');
  const [showDropdown, setShowDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const isCompleted = status === 'COMPLETED';

  const currentProvider = availableEmployees.find(emp => emp.id === assignedId);

  const handleAssignProvider = async (employeeId: number) => {
    if (isCompleted) {
      return;
    }
    setShowDropdown(false);
    setSaving(true);
    setSaveError(null);
    try {
      const body = { employeeId };
      const res = await fetch(`${API_BASE_URL}/v1/appointments/${appointment.id}/employee`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      setAssignedId(employeeId);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

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
      if (newStatus === 'COMPLETED') {
        setShowDropdown(false);
      }
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

      {/* Provider (Functional Assignment) */}
      <td className="p-4 border-r border-gray-300 text-center relative">
        {saving && <span className="text-xs text-blue-500 italic">Saving…</span>}
        {saveError && <span className="text-xs text-red-500 italic">{saveError}</span>}
        
        {!saving && currentProvider ? (
          <div className="flex flex-col items-center">
            <span className="font-bold">{currentProvider.firstName} {currentProvider.lastName}</span>
            <span className="text-xs text-gray-500 italic">{currentProvider.specialization}</span>
            <button
              onClick={() => !isCompleted && setShowDropdown(!showDropdown)}
              disabled={isCompleted}
              className="text-[10px] text-blue-600 underline mt-1 cursor-pointer hover:font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isCompleted ? 'Locked' : 'Change'}
            </button>
          </div>
        ) : !saving ? (
          <button
            onClick={() => !isCompleted && setShowDropdown(!showDropdown)}
            disabled={isCompleted}
            className="border border-gray-400 px-3 py-1 text-left bg-white hover:bg-gray-50 cursor-pointer w-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {isCompleted ? 'Provider Locked' : 'Assign Provider +'}
          </button>
        ) : null}

        {/* Dropdown - positioned to parent tr for better overflow handling */}
        {showDropdown && !isCompleted && (
          <div className="absolute z-50 left-0 w-48 bg-white border border-gray-300 shadow-2xl max-h-48 overflow-y-auto"
               style={{ top: '100%', minWidth: '200px' }}>
            {availableEmployees.length > 0 ? (
              availableEmployees.map(emp => (
                <div
                  key={emp.id}
                  onClick={() => handleAssignProvider(emp.id)}
                  className="p-2 hover:bg-blue-100 cursor-pointer text-left border-b border-gray-100 last:border-0 transition-colors"
                >
                  <div className="font-medium text-sm">{emp.firstName} {emp.lastName}</div>
                  <div className="text-xs text-gray-600">{emp.specialization}</div>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500 text-sm">No employees available</div>
            )}
          </div>
        )}
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
