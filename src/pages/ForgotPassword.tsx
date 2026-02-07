import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, KeyRound, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import api from "@/api/axios";
import { Logo } from "@/components/layout/Logo";
import api from "@/api/axios";
import { Logo } from "@/components/layout/Logo";

type Step = "email" | "otp" | "newPassword" | "success";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Error", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast({ title: "OTP Sent", description: "A reset code has been sent to your email." });
      setStep("otp");
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to send OTP.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast({ title: "Error", description: "Please enter a valid OTP.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast({ title: "OTP Verified", description: "Please set your new password." });
      setStep("newPassword");
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Invalid OTP.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, password, confirmPassword });
      setStep("success");
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to reset password.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-card-foreground">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email address and we'll send you a code to reset your password.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-card-foreground font-medium">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background border-border text-foreground"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Code"}
      </Button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-card-foreground">Enter OTP</h1>
        <p className="text-muted-foreground mt-2">
          We've sent a verification code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp" className="text-card-foreground font-medium">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="bg-background border-border text-foreground text-center text-xl tracking-widest"
          maxLength={6}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={handleEmailSubmit}
          disabled={isLoading}
          className="text-primary hover:underline font-medium disabled:opacity-50"
        >
          Resend
        </button>
      </p>
    </form>
  );

  const renderNewPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-card-foreground">Set New Password</h1>
        <p className="text-muted-foreground mt-2">
          Create a strong password for your account.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-card-foreground font-medium">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background border-border text-foreground"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-card-foreground font-medium">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-background border-border text-foreground"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-natural/10 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-natural" />
      </div>
      <div>
        <h1 className="font-serif text-2xl font-bold text-card-foreground mb-2">Password Reset Successful</h1>
        <p className="text-muted-foreground">
          Your password has been reset successfully. You can now log in with your new password.
        </p>
      </div>
      <Button onClick={() => navigate("/login")} className="w-full">
        Back to Login
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl p-8 shadow-medium border border-border/50">
          {/* Logo */}
          <div className="text-center mb-6 flex justify-center">
            <Logo className="mb-4" />
          </div>

          {/* Back Button (except on success) */}
          {/* {step !== "success" && (
            <button
              onClick={() => {
                if (step === "email") navigate("/login");
                else if (step === "otp") setStep("email");
                else if (step === "newPassword") setStep("otp");
              }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )} */}

          {/* Step Content */}
          {step === "email" && renderEmailStep()}
          {step === "otp" && renderOtpStep()}
          {step === "newPassword" && renderNewPasswordStep()}
          {step === "success" && renderSuccessStep()}

          {/* Login Link */}
          {step === "email" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
