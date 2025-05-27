import React from "react";
import { useNavigate } from "react-router-dom";
import { Award, Calendar, Users, Check } from "lucide-react";
import {
  APP_TITLE,
  APP_DESCRIPTION,
  EVENT_DATE,
  EVENT_TIME,
  EVENT_SPOTS,
  EVENT_SPOTS_DESC,
  EVENT_BENEFITS,
  REGISTER_NOW,
} from "../constants/text";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Award className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          {APP_TITLE}
        </h1>
        <p className="text-neutral-600 max-w-sm">{APP_DESCRIPTION}</p>
      </div>

      <div
        className="w-full card p-6 mb-6 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <h2 className="text-lg font-semibold mb-4">Event Highlights</h2>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-base font-medium">{EVENT_DATE}</h3>
              <p className="text-sm text-neutral-600">{EVENT_TIME}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-base font-medium">{EVENT_SPOTS}</h3>
              <p className="text-sm text-neutral-600">{EVENT_SPOTS_DESC}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full card p-6 mb-8 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h2 className="text-lg font-semibold mb-4">What You'll Get</h2>

        <ul className="space-y-3">
          {EVENT_BENEFITS.map((item, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success-100 flex items-center justify-center mr-2 mt-0.5">
                <Check className="h-3 w-3 text-success-600" />
              </div>
              <span className="text-neutral-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate("/register")}
        className="btn-primary w-full py-3 animate-slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        {REGISTER_NOW}
      </button>
    </div>
  );
};

export default HomePage;
