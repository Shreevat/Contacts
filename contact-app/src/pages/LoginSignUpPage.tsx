import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import InputField from "../components/InputField"; // Ensure the path is correct

interface LoginSignUpPageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const LoginSignUpPage: React.FC<LoginSignUpPageProps> = ({
  setIsAuthenticated,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true); // To toggle between login and sign-up

  const navigate = useNavigate(); // Using the useNavigate hook for redirects

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:5001/api/users/login",
          { email, password }
        );
        const { accessToken } = response.data;

        // Store the token in cookies
        Cookies.set("authToken", accessToken, { expires: 1 }); // Expires in 1 day
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        const response = await axios.post(
          "http://localhost:5001/api/users/register",
          {
            username: email.split("@")[0],
            email,
            password,
          }
        );

        if (response.status === 201) {
          setSuccessMessage("Account created successfully!");
          setIsLogin(true); // Switch to login after successful sign-up
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          {!isLogin && (
            <InputField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          )}

          <div className="mt-4 *:mb-4 text-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-500 hover:underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-red-500 text-center">{error}</div>
          )}
          {successMessage && (
            <div className="mt-4 text-green-500 text-center">
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginSignUpPage;
