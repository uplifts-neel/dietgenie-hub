
import { useState } from "react";
import { RegistrationForm } from "./registration/components/RegistrationForm";
import { SuccessCard } from "./registration/components/SuccessCard";

const Registration = () => {
  const [admissionNumber, setAdmissionNumber] = useState<string | null>(null);

  const handleSuccess = (number: string) => {
    setAdmissionNumber(number);
  };

  const resetForm = () => {
    setAdmissionNumber(null);
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">New Member Registration</h1>

      {admissionNumber ? (
        <SuccessCard admissionNumber={admissionNumber} onReset={resetForm} />
      ) : (
        <RegistrationForm onSuccess={handleSuccess} />
      )}
    </div>
  );
};

export default Registration;
