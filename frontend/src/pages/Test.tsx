import React from 'react';
import { AppointmentRow } from '../components/AppointmentRow';
import type { Appointment, Employee, Customer } from '../type';

// Mock Data for the list
const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, firstName: 'Alice', lastName: 'Green', specialization: 'Massage' },
  { id: 2, firstName: 'Bob', lastName: 'Brown', specialization: 'Stylist' }
];

const MOCK_APPOINTMENTS = [
  {
    appointment: { id: 1, status: 'PENDING', totalPrice: 150, employeeId: null } as Appointment,
    customer: { firstName: 'John', lastName: 'Doe', email: 'john@gmail.com', phoneNumber: '2409999999' } as Customer,
    service: "Swedish Massage"
  },
  {
    appointment: { id: 2, status: 'COMPLETED', totalPrice: 45, employeeId: 1 } as Appointment,
    customer: { firstName: 'Pemon', lastName: 'Kouadio', email: 'pemon@example.com', phoneNumber: '3015550123' } as Customer,
    service: "Haircut"
  }
];

export const AppointmentList: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md border border-gray-300">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300 text-xs uppercase text-gray-500 font-medium">
              <th className="p-3 border-r border-gray-300 text-left">Customer's Information</th>
              <th className="p-3 border-r border-gray-300 text-center">Service</th>
              <th className="p-3 border-r border-gray-300 text-left">Total Cost</th>
              <th className="p-3 border-r border-gray-300 text-center">Provider</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_APPOINTMENTS.map((item) => (
              <AppointmentRow 
                key={item.appointment.id}
                appointment={item.appointment}
                customer={item.customer}
                serviceName={item.service}
                availableEmployees={MOCK_EMPLOYEES}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentList;