
import React from 'react';

type ProfileSectionProps = {
  profile: {
    name: string;
    photo?: string;
    achievements: string[];
  };
};

const ProfileSection = ({ profile }: ProfileSectionProps) => {
  return (
    <div className="mt-8 flex flex-col items-center animate-fade-in">
      <div className="relative mt-[-50px] z-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-coral-red to-turquoise p-1">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
      <h2 className="text-xl font-semibold text-white mt-3">{profile.name}</h2>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {profile.achievements.map((achievement, index) => (
          <span
            key={index}
            className="inline-block bg-gradient-to-r from-coral-red/30 to-turquoise/30 text-white text-xs px-3 py-1 rounded-full"
          >
            {achievement}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileSection;
