import React from 'react';
import type { Appointment } from '../type';

interface CustomerAppointmentRowProps {
  appointment: Appointment;
  serviceName: string;
}

export const CustomerAppointmentRow: React.FC<CustomerAppointmentRowProps> = ({
  appointment,
  serviceName,
}) => {
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50 transition-colors text-sm text-gray-700">
      {/* Service */}
      <td className="p-4 border-r border-gray-300 text-left">
        {serviceName}
      </td>

      {/* Appointment Date */}
      <td className="p-4 border-r border-gray-300 text-center">
        {new Date(appointment.appointmentDate).toLocaleDateString()}
      </td>

      {/* Appointment Time */}
      <td className="p-4 border-r border-gray-300 text-center">
        {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>

      {/* Total Cost */}
      <td className="p-4 border-r border-gray-300 font-semibold text-center">
        ${appointment.totalPrice.toFixed(2)}
      </td>

      {/* Status */}
      <td className="p-4 text-center">
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
          appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
          appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-600'
        }`}>
          {appointment.status}
        </span>
      </td>
    </tr>
  );
};
