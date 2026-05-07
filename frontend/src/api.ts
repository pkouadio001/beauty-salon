import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    id: number;
    email: string;
    role: string;
    redirectTo: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    dateOfBirth: string;
}
export const registerRequest = async (registerRequest: RegisterRequest) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, registerRequest);
        return response.data;
    } catch (error) {
        console.error('Error registering customer:', error);
        throw error;
    }
};

export const loginCustomer = async (loginRequest: LoginRequest) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, loginRequest);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const fetchServices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/v1/cares`);
        console.log("Services fetched successfully:");
        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};