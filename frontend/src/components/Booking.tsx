import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchServices } from '../api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

interface BookingFormData {
  serviceType: string;
  serviceId: number | null;
  appointmentDate: string;
  appointmentTime: string;
  totalCost: number;
}

interface ServiceOption {
  id: number;
  name: string;
  type: 'Massage' | 'Hairstyles' | 'Nails';
  price: number;
}

type AnyRecord = Record<string, unknown>;

const SERVICE_TYPES: Array<'Massage' | 'Hairstyles' | 'Nails'> = ['Massage', 'Hairstyles', 'Nails'];

const getTimeForToday = (hours: number, minutes: number): Date => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const isOpenDay = (date: Date): boolean => date.getDay() !== 0;

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
      return raw.trim();
    }
  }
  return undefined;
};

const normalizeType = (rawType: string | undefined, serviceName: string): 'Massage' | 'Hairstyles' | 'Nails' => {
  const source = (rawType ?? serviceName).toLowerCase();
  if (source.includes('massage')) {
    return 'Massage';
  }
  if (source.includes('nail') || source.includes('manicure') || source.includes('pedicure')) {
    return 'Nails';
  }
  return 'Hairstyles';
};


const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: '',
    serviceId: null,
    appointmentDate: '',
    appointmentTime: '',
    totalCost: 0,
  });
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoadingServices(true);
        setServiceError(null);
        const raw = await fetchServices();
        const list = Array.isArray(raw)
          ? raw
          : (raw?.data ?? raw?.content ?? raw?.items ?? raw?.results ?? []);

        const normalized = (list as AnyRecord[])
          .map((item) => {
            const id = pickNumber(item, ['id', 'careId', 'serviceId']);
            const name = pickString(item, ['name', 'careName', 'title']);
            const price = pickNumber(item, ['price', 'cost', 'totalPrice', 'amount']) ?? 0;
            const rawType = pickString(item, ['serviceType', 'careType', 'category', 'type']);

            if (typeof id !== 'number' || !name) {
              return null;
            }

            return {
              id,
              name,
              type: normalizeType(rawType, name),
              price,
            } as ServiceOption;
          })
          .filter((service): service is ServiceOption => service !== null);

        setServices(normalized);
      } catch (error) {
        setServiceError(error instanceof Error ? error.message : 'Failed to load services');
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = useMemo(
    () => services.filter((service) => service.type === formData.serviceType),
    [services, formData.serviceType]
  );

  // Internal state for the DatePicker object
  const [startDate, setStartDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      // Format for your Spring Boot Backend
      setFormData({
        ...formData,
        appointmentDate: date.toISOString().split('T')[0], // YYYY-MM-DD
        appointmentTime: `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}:00`
      });
    }
  };

  const handleServiceTypeChange = (serviceType: 'Massage' | 'Hairstyles' | 'Nails') => {
    setFormData((prev) => ({
      ...prev,
      serviceType,
      serviceId: null,
      totalCost: 0,
    }));
  };

  const handleServiceChange = (serviceIdValue: string) => {
    const parsedId = Number(serviceIdValue);
    if (Number.isNaN(parsedId)) {
      setFormData((prev) => ({ ...prev, serviceId: null, totalCost: 0 }));
      return;
    }

    const selected = filteredServices.find((service) => service.id === parsedId);
    setFormData((prev) => ({
      ...prev,
      serviceId: parsedId,
      totalCost: selected?.price ?? 0,
    }));
  };

  const handleSubmit = async () => {
    setBookingError(null);
    setBookingSuccess(null);

    const customerIdRaw = localStorage.getItem('customerId');
    const customerId = customerIdRaw ? Number(customerIdRaw) : NaN;

    if (!customerIdRaw || Number.isNaN(customerId)) {
      setBookingError('No customer ID found. Please login again.');
      return;
    }

    if (!formData.serviceType || formData.serviceId === null || !formData.appointmentDate || !formData.appointmentTime) {
      setBookingError('Please select service type, service, date, and time before booking.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        serviceId: formData.serviceId,
        service_id: formData.serviceId,
        status: 'PENDING',
        totalPrice: formData.totalCost,
        employeeId: null,
        customerId,
        customer_id: customerId,
      };

      const response = await fetch(`${API_BASE_URL}/v1/appointment/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server responded with ${response.status}`);
      }

      setBookingSuccess('Appointment booked successfully.');
      setFormData({
        serviceType: '',
        serviceId: null,
        appointmentDate: '',
        appointmentTime: '',
        totalCost: 0,
      });
      setStartDate(null);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = "w-full border border-gray-400 p-3 bg-white text-gray-600 focus:outline-none focus:border-black transition-colors cursor-pointer";

  return (
    <div className="max-w-md mx-auto bg-white p-12 border border-gray-200 shadow-sm font-sans">
      <h2 className="text-center text-gray-500 tracking-[0.2em] uppercase mb-10 text-lg">
        Booking
      </h2>

      <div className="space-y-8">
        <div>
          <label htmlFor="service-type" className="block text-sm text-gray-500 uppercase tracking-wide mb-2">
            Service Type
          </label>
          <select
            id="service-type"
            value={formData.serviceType}
            onChange={(e) => handleServiceTypeChange(e.target.value as 'Massage' | 'Hairstyles' | 'Nails')}
            className={inputStyle}
          >
            <option value="">Select Type</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="service-name" className="block text-sm text-gray-500 uppercase tracking-wide mb-2">
            Service
          </label>
          <select
            id="service-name"
            value={formData.serviceId ?? ''}
            onChange={(e) => handleServiceChange(e.target.value)}
            disabled={!formData.serviceType || loadingServices}
            className={inputStyle}
          >
            <option value="">
              {!formData.serviceType ? 'Select service type first' : loadingServices ? 'Loading services...' : 'Select Service'}
            </option>
            {filteredServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          {serviceError && <p className="text-xs text-red-600 mt-2">{serviceError}</p>}
        </div>

        {/* Date & Time Picker Popup */}
        <div className="relative">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={5} // 5 minute increments as requested
            minTime={getTimeForToday(8, 0)}
            maxTime={getTimeForToday(18, 0)}
            filterDate={isOpenDay}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select Date and Time"
            className={inputStyle}
            minDate={new Date()} // Prevent booking in the past
          />
        </div>

        <div className="pt-10 flex justify-center">
          <div className="border border-gray-400 px-10 py-2 text-gray-500 min-w-[180px] text-center">
            {formData.totalCost > 0 ? `$${formData.totalCost}` : 'Total cost'}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full border border-gray-400 py-3 text-gray-600 uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Booking...' : 'Book'}
        </button>
        {bookingError && <p className="text-xs text-red-600 text-center">{bookingError}</p>}
        {bookingSuccess && <p className="text-xs text-green-700 text-center">{bookingSuccess}</p>}
      </div>
    </div>
  );
};

export default BookingForm;