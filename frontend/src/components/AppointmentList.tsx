import React, { useEffect, useState } from 'react';
import type { Appointment, Employee, Customer } from '../type';
import { AppointmentRow } from './AppointmentRow';

type AnyRecord = Record<string, unknown>;

const toArray = (value: unknown): AnyRecord[] => {
  if (Array.isArray(value)) {
    return value as AnyRecord[];
  }

  if (value && typeof value === 'object') {
    const obj = value as AnyRecord;
    const nested = obj.data ?? obj.content ?? obj.items ?? obj.results;
    if (Array.isArray(nested)) {
      return nested as AnyRecord[];
    }
  }

  return [];
};

const pickNumber = (item: AnyRecord, keys: string[]): number | undefined => {
  for (const key of keys) {
    const raw = item[key];
    if (typeof raw === 'number') {
      return raw;
    }
    if (typeof raw === 'string') {
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
};

const pickString = (item: AnyRecord, keys: string[]): string | undefined => {
  for (const key of keys) {
    const raw = item[key];
    if (typeof raw === 'string' && raw.trim()) {
      return raw;
    }
  }
  return undefined;
};

const getAppointmentServiceRef = (appointment: Appointment): number | undefined => {
  const raw = (appointment as unknown as AnyRecord).serviceId ?? (appointment as unknown as AnyRecord).service;

  if (typeof raw === 'number') {
    return raw;
  }

  if (typeof raw === 'string') {
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const getAppointmentServiceName = (appointment: Appointment, servicesById: Record<number, string>): string => {
  const record = appointment as unknown as AnyRecord;

  // If backend already sends the name, prefer it.
  const directName = pickString(record, ['serviceName', 'careName', 'name']);
  if (directName) {
    return directName;
  }

  // Some APIs return `service` as either a name or an id.
  const rawService = record.service;
  if (typeof rawService === 'string') {
    const parsed = Number(rawService);
    if (Number.isNaN(parsed) && rawService.trim()) {
      return rawService;
    }
  }

  // If backend nests service/care object, read name and id from there.
  const nestedService = record.service;
  if (nestedService && typeof nestedService === 'object') {
    const nestedRecord = nestedService as AnyRecord;
    const nestedName = pickString(nestedRecord, ['name', 'serviceName', 'careName', 'title']);
    if (nestedName) {
      return nestedName;
    }

    const nestedId = pickNumber(nestedRecord, ['id', 'serviceId', 'careId']);
    if (typeof nestedId === 'number' && servicesById[nestedId]) {
      return servicesById[nestedId];
    }
  }

  const serviceRef = getAppointmentServiceRef(appointment);
  if (typeof serviceRef === 'number' && servicesById[serviceRef]) {
    return servicesById[serviceRef];
  }

  // Keep appointment-driven context visible when the id exists but mapping is missing.
  if (typeof serviceRef === 'number') {
    return `Service #${serviceRef}`;
  }

  return 'Unknown Service';
};

export const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Record<number, Customer>>({});
  const [services, setServices] = useState<Record<number, string>>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';
        
        // Fetch all appointments (support both plural and singular backend routes)
        const appointmentEndpoints = ['/v1/appointments', '/v1/appointment'];
        let appointmentsRaw: unknown = [];
        let fetched = false;
        for (const endpoint of appointmentEndpoints) {
          const appointmentsResponse = await fetch(`${apiBaseUrl}${endpoint}`);
          if (appointmentsResponse.ok) {
            appointmentsRaw = await appointmentsResponse.json();
            fetched = true;
            break;
          }
        }
        if (!fetched) {
          throw new Error('Failed to fetch appointments');
        }
        const appointmentsData = toArray(appointmentsRaw) as unknown as Appointment[];
        setAppointments(appointmentsData);

        // Fetch all employees
        const employeesResponse = await fetch(`${apiBaseUrl}/v1/employees`);
        if (employeesResponse.ok) {
          const employeesRaw = await employeesResponse.json();
          const employeesData = toArray(employeesRaw) as unknown as Employee[];
          setEmployees(employeesData);
        }

        // Fetch services and customers (you may need to adjust these endpoints)
        const servicesResponse = await fetch(`${apiBaseUrl}/v1/cares`);
        if (servicesResponse.ok) {
          const servicesRaw = await servicesResponse.json();
          const servicesData = toArray(servicesRaw);
          //console.log('Cares API raw response:', servicesRaw);
          //console.log('Cares API normalized first item:', servicesData[0]);
          const servicesMap: Record<number, string> = {};
          servicesData.forEach((service) => {
            const id = pickNumber(service, ['id', 'careId', 'serviceId']);
            const name = pickString(service, ['name', 'careName', 'id', 'title']);

            if (typeof id === 'number' && name) {
              servicesMap[id] = name;
            }
          });
          console.log('Mapped care names by id:', servicesMap);
          setServices(servicesMap);
        }

        // Fetch customer data for each appointment
        const customersMap: Record<number, Customer> = {};
        for (const appointment of appointmentsData) {
          if (!customersMap[appointment.customerId]) {
            try {
              const customerResponse = await fetch(`${apiBaseUrl}/v1/customer?id=${appointment.customerId}`);
              if (customerResponse.ok) {
                const customerData = await customerResponse.json();
                customersMap[appointment.customerId] = customerData;
              }
            } catch (err) {
              console.error(`Failed to fetch customer ${appointment.customerId}:`, err);
            }
          }
        }
        setCustomers(customersMap);

        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <span className="text-lg">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-400">
        <span className="text-lg">Error: {error}</span>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-white/70">
        <span className="text-lg italic">No appointments found</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-64">
      <table className="w-full bg-white/5 backdrop-blur rounded-lg">
        <thead className="bg-black/40 text-white font-bold uppercase text-xs tracking-wider">
          <tr>
            <th className="p-4 text-left border-r border-gray-400">Customer Info</th>
            <th className="p-4 text-center border-r border-gray-400">Service</th>
            <th className="p-4 text-center border-r border-gray-400">Date</th>
            <th className="p-4 text-center border-r border-gray-400">Time</th>
            <th className="p-4 text-center border-r border-gray-400">Cost</th>
            <th className="p-4 text-center border-r border-gray-400">Provider</th>
            <th className="p-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {appointments.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              customer={customers[appointment.customerId] || {
                firstName: 'Unknown',
                lastName: 'Customer',
                email: '',
                phoneNumber: '',
              }}
              serviceName={getAppointmentServiceName(appointment, services)}
              availableEmployees={employees}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
