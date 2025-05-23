import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppContext, UserRegistrationData } from "../context/AppContext";
import { AlertCircle } from "lucide-react";
import { saveToGoogleSheet } from "../services/googleSheetService";

import OfflineNotice from "../components/OfflineNotice";

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { registrationData, updateRegistrationData, isOffline } =
    useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserRegistrationData>({
    defaultValues: registrationData,
  });

  const onSubmit = async (data: UserRegistrationData) => {
    try {
      updateRegistrationData(data);

      // If offline, store in localStorage to sync later
      if (isOffline) {
        localStorage.setItem("pendingRegistration", JSON.stringify(data));
        navigate("/upload-photo");
        return;
      }

      // Save to Google Sheet if online
      const success = await saveToGoogleSheet({
        ...data,
        badgeTemplate: "default",
        photoUploaded: false,
      });

      if (!success) {
        // If save failed, store in localStorage as fallback
        const pendingRegistrations = JSON.parse(
          localStorage.getItem("pendingRegistrations") || "[]"
        );
        pendingRegistrations.push({
          ...data,
          timestamp: new Date().toISOString(),
          error: "Failed to save to server",
        });
        localStorage.setItem(
          "pendingRegistrations",
          JSON.stringify(pendingRegistrations)
        );

        // Show warning but continue
        alert(
          "Warning: Your registration was saved locally but couldn't be sent to the server. It will be synced when possible."
        );
      }

      // Continue to photo upload
      navigate("/upload-photo");
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Registration Details</h1>
        <p className="text-neutral-600">
          Please fill in your information below
        </p>
      </div>

      {isOffline && (
        <OfflineNotice message="You're currently offline. Your registration will be saved locally and synced when you're back online." />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="card p-6 space-y-5">
          <div>
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              className="input mt-1"
              placeholder="Your full name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                type="tel"
                className="input mt-1"
                placeholder="Your phone number"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9+\-() ]+$/,
                    message: "Invalid phone number",
                  },
                  validate: (value) => {
                    if (!value) return true;
                    return (
                      /^[0-9+\-() ]+$/.test(value) || "Invalid phone number"
                    );
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                className="input mt-1"
                placeholder="Your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              className="select mt-1"
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-error-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold">Address Information</h2>

          <div>
            <label htmlFor="unit">Unit/Apartment</label>
            <input
              id="unit"
              type="text"
              className="input mt-1"
              placeholder="Unit or apartment number"
              {...register("unit")}
            />
          </div>

          <div>
            <label htmlFor="locality">Locality *</label>
            <input
              id="locality"
              type="text"
              className="input mt-1"
              placeholder="Your locality"
              {...register("locality", { required: "Locality is required" })}
            />
            {errors.locality && (
              <p className="mt-1 text-sm text-error-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.locality.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="area">Area</label>
            <input
              id="area"
              type="text"
              className="input mt-1"
              placeholder="Your area"
              {...register("area")}
            />
          </div>

          <div>
            <label htmlFor="panchayat">Panchayat *</label>
            <input
              id="panchayat"
              type="text"
              className="input mt-1"
              placeholder="Your panchayat"
              {...register("panchayat", { required: "Panchayat is required" })}
            />
            {errors.panchayat && (
              <p className="mt-1 text-sm text-error-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.panchayat.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city">City *</label>
              <input
                id="city"
                type="text"
                className="input mt-1"
                placeholder="Your city"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="state">State *</label>
              <input
                id="state"
                type="text"
                className="input mt-1"
                placeholder="Your state"
                {...register("state", { required: "State is required" })}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-error-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Continue to Photo Upload"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
