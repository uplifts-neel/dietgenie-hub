
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark-theme">
      <div className="animate-float">
        <div className="text-5xl font-bold text-center text-white mb-4">
          <span className="text-coral-red">DRONACHARYA</span>
          <br />
          <span className="text-turquoise">THE GYM</span>
        </div>
        
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-coral-red to-turquoise animate-pulse flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-dark-theme flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-coral-red to-turquoise animate-spin flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-dark-theme flex items-center justify-center text-white font-bold">
                <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16">
                  <path
                    d="M7 7.13471C7 6.10028 7 5.58307 7.18152 5.18147C7.34141 4.83535 7.59139 4.56567 7.90784 4.39202C8.2683 4.2 8.75576 4.2 9.73069 4.2H14.2693C15.2442 4.2 15.7317 4.2 16.0922 4.39202C16.4086 4.56567 16.6586 4.83535 16.8185 5.18147C17 5.58307 17 6.10028 17 7.13471V7.2M12 15V19.5M9 19.5H15M17 7.2V16.6667C17 17.6394 17 18.1257 16.8334 18.4998C16.6882 18.8235 16.4461 19.0922 16.1469 19.2679C15.8032 19.4667 15.3355 19.5138 14.4 19.6081C13.4676 19.7022 12.7238 19.8 12 19.8C11.2762 19.8 10.5324 19.7022 9.6 19.6081C8.66447 19.5138 8.19671 19.4667 7.85308 19.2679C7.5539 19.0922 7.31184 18.8235 7.16659 18.4998C7 18.1257 7 17.6394 7 16.6667V7.2M18.5 7.2H5.5C5.08579 7.2 4.75 7.53579 4.75 7.95V8.85C4.75 9.26421 5.08579 9.6 5.5 9.6H18.5C18.9142 9.6 19.25 9.26421 19.25 8.85V7.95C19.25 7.53579 18.9142 7.2 18.5 7.2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-white/60 mt-8 text-center">
        Sant Nagar, Burari, Delhi-110036
      </p>
    </div>
  );
};

export default SplashScreen;
