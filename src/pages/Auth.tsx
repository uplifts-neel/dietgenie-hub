
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const { signUp, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/home" />;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signUp(username, password, name);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#232323] to-[#1a1a1a] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white text-shadow drop-shadow-lg mb-2">
            DRONACHARYA THE GYM
          </h1>
          <p className="text-white/80">
            Register as a trainer to access the gym management system
          </p>
        </div>

        <Card className="glass-card border-none">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Trainer Registration</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-white">
                  Trainer Name
                </Label>
                <Input
                  id="signup-name"
                  placeholder="Enter trainer's full name"
                  className="bg-white/10 border-white/20 text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-username" className="text-white">
                  Username
                </Label>
                <Input
                  id="signup-username"
                  placeholder="Create a username"
                  className="bg-white/10 border-white/20 text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  className="bg-white/10 border-white/20 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-coral-red to-turquoise hover:from-coral-red/90 hover:to-turquoise/90 text-white py-5 mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Register as Trainer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
