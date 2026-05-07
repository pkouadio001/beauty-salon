import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import calendarIcon from "../assets/calendar.png";
import mobileIcon from "../assets/mobile.png";
import { loginCustomer, registerRequest } from "../api";

/**
 * LoginRestration.tsx
 * Combined Login and Signup component using TypeScript and Tailwind CSS.
 */

interface LoginFormState {
  email: string;
  password: string;
}

interface SignupFormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
}

const LoginRestration: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState<SignupFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { placeholder, value } = e.target;
    if (placeholder === "Email Address") {
      setLoginForm({ ...loginForm, email: value });
    } else if (placeholder === "Password") {
      setLoginForm({ ...loginForm, password: value });
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { placeholder, value } = e.target;
    if (placeholder === "First Name") {
      setSignupForm({ ...signupForm, firstName: value });
    } else if (placeholder === "Last Name") {
      setSignupForm({ ...signupForm, lastName: value });
    } else if (placeholder === "Email Address") {
      setSignupForm({ ...signupForm, email: value });
    } else if (placeholder === "Cellphone") {
      setSignupForm({ ...signupForm, phoneNumber: value });
    } else if (placeholder === "DOB (MM/DD/YYYY)") {
      setSignupForm({ ...signupForm, dateOfBirth: value });
    } else if (placeholder === "Password") {
      setSignupForm({ ...signupForm, password: value });
    } else if (placeholder === "Confirm Password") {
      setSignupForm({ ...signupForm, confirmPassword: value });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!loginForm.email || !loginForm.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const response = await loginCustomer({
        email: loginForm.email,
        password: loginForm.password,
      });

      // Store authentication info
      if (response.role === "CUSTOMER") {
        localStorage.setItem("customerId", response.id);
      } else if (response.role === "EMPLOYEE") {
        localStorage.setItem("employeeId", response.id);
      } else if (response.role === "ADMIN") {
        localStorage.setItem("adminId", response.id);
      }
      localStorage.setItem("userRole", response.role);
      localStorage.setItem("userEmail", response.email);

      // Redirect based on role
      if (response.role === "CUSTOMER") {
        navigate("/customer/Dashboard");
      } else if (response.role === "EMPLOYEE") {
        navigate("/employee/Dashboard");
      } else if (response.role === "ADMIN") {
        navigate("/admin/Dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!signupForm.firstName || !signupForm.lastName || !signupForm.email || 
        !signupForm.phoneNumber || !signupForm.password || !signupForm.dateOfBirth) {
      setError("Please fill in all fields");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await registerRequest({
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        email: signupForm.email,
        phoneNumber: signupForm.phoneNumber,
        password: signupForm.password,
        dateOfBirth: signupForm.dateOfBirth,
      });

      // Store authentication info
      localStorage.setItem("customerId", response.id);
      localStorage.setItem("userRole", response.role);
      localStorage.setItem("userEmail", response.email);

      // Redirect to customer dashboard
      navigate("/customer/Dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#833ab4] to-[#f60606]/55 p-4">
      <div className="bg-white w-full max-w-[498px] rounded-lg shadow-xl flex flex-col p-8 md:p-10 transition-all duration-300">
        
        {/* Dynamic Header Based on State */}
        <h1 className="text-[#00000b] text-3xl md:text-4xl font-bold text-center mb-8">
          {isLogin ? "Login Form" : "Signup Form"}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form Toggle Switch */}
        <div className="flex w-full mb-8 border border-[#707070] rounded-md overflow-hidden">
          <button 
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 py-3 font-bold transition-colors ${
              isLogin 
                ? "bg-gradient-to-b from-[#f60606] to-[#833ab4] text-white" 
                : "bg-white text-[#00000b]"
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 py-3 font-bold transition-colors ${
              !isLogin 
                ? "bg-gradient-to-b from-[#f60606] to-[#833ab4] text-white" 
                : "bg-white text-[#00000b]"
            }`}
          >
            Signup
          </button>
        </div>

        {isLogin ? (
          /* LOGIN FORM SECTION */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={loginForm.email}
                onChange={handleLoginChange}
                className="w-full h-[52px] pl-12 pr-4 border border-[#707070] rounded-md text-[#00000b] placeholder-[#bcb8b1] focus:ring-2 focus:ring-[#833ab4] outline-none"
              />
              <img src={emailIcon} alt="email icon" className="absolute left-3 top-3 w-[28px] h-[28px]" />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                className="w-full h-[52px] pl-12 pr-4 border border-[#707070] rounded-md text-[#00000b] placeholder-[#bcb8b1] focus:ring-2 focus:ring-[#833ab4] outline-none"
              />
              <img src={passwordIcon} alt="password icon" className="absolute left-3 top-3 w-[28px] h-[28px]" />
            </div>

            <div className="mt-2">
              <button type="button" className="text-[#f60606] text-sm font-bold font-serif hover:underline">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-[52px] bg-gradient-to-b from-[#f60606] to-[#833ab4] text-white text-xl font-bold rounded-md border border-[#707070] mt-4 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm mt-6">
              Not a member?{" "}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }} 
                className="text-[#f60606] font-bold hover:underline"
              >
                Sign-up now
              </button>
            </p>
          </form>
        ) : (
          /* SIGNUP FORM SECTION */
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={signupForm.firstName}
                onChange={handleSignupChange}
                className="w-full h-[52px] px-4 border border-[#707070] rounded-md placeholder-[#bcb8b1] focus:ring-2 focus:ring-[#833ab4] outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={signupForm.lastName}
                onChange={handleSignupChange}
                className="w-full h-[52px] px-4 border border-[#707070] rounded-md placeholder-[#bcb8b1] focus:ring-2 focus:ring-[#833ab4] outline-none"
              />
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={signupForm.email}
                onChange={handleSignupChange}
                className="w-full h-[52px] pl-12 pr-4 border border-[#707070] rounded-md placeholder-[#bcb8b1] focus:ring-2 focus:ring-[#833ab4] outline-none"
              />
              <img src={emailIcon} alt="email icon" className="absolute left-3 top-3 w-[28px] h-[28px]" />
            </div>

            <div className="relative">
              <input
                type="tel"
                placeholder="Cellphone"
                value={signupForm.phoneNumber}
                onChange={handleSignupChange}
                className="w-full h-[52px] pl-12 pr-4 border border-[#707070] rounded-md placeholder-[#bcb8b1] focus:ring-2 focus:ring-[#833ab4] outline-none"
              />
              <img src={mobileIcon} alt="mobile icon" className="absolute left-3 top-3 w-[28px] h-[28px]" />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="DOB (MM/DD/YYYY)"
                value={signupForm.dateOfBirth}
                onChange={handleSignupChange}
                className="w-full h-[52px] pl-12 pr-4 border border-[#707070] rounded-md placeholder-[#bcb8b1] focus:ring-2 focus:ring-[#833ab4] outline-none"
              />
              <img src={calendarIcon} alt="calendar icon" className="absolute left-3 top-3 w-[28px] h-[28px]" />
            </div>

            <input
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={handleSignupChange}
              className="w-full h-[52px] px-4 border border-[#707070] rounded-md placeholder-[#bcb8b1] focus:ring-2 focus:ring-[#833ab4] outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={signupForm.confirmPassword}
              onChange={handleSignupChange}
              className="w-full h-[52px] px-4 border border-[#707070] rounded-md placeholder-[#bcb8b1] focus:ring-2 focus:ring-[#833ab4] outline-none"
            />

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-gradient-to-b from-[#f60606] to-[#833ab4] text-white text-xl font-bold rounded-md border border-[#707070] mt-4 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Signup"}
            </button>

            <p className="text-center text-sm mt-6">
              Already have an account?{" "}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }} 
                className="text-[#f60606] font-bold hover:underline"
              >
                Login here
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginRestration;