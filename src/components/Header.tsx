import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award } from "lucide-react";
import { APP_TITLE } from "../constants/text";

interface HeaderProps {
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="container-app py-3 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton ? (
            <button
              onClick={handleBack}
              className="p-2 mr-2 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-700" />
            </button>
          ) : (
            <Award className="h-6 w-6 text-primary-600 mr-2" />
          )}
          <h1 className="text-lg font-semibold text-neutral-900">
            {APP_TITLE}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
