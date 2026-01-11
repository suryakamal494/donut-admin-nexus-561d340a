import { useState } from "react";
import { Eye, EyeOff, Key, Lock, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PasswordResetDialog = ({ open, onOpenChange }: PasswordResetDialogProps) => {
  const isMobile = useIsMobile();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
    onOpenChange(open);
  };

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { strength, label: "Weak", color: "bg-destructive" };
    if (strength <= 3) return { strength, label: "Medium", color: "bg-amber-500" };
    if (strength <= 4) return { strength, label: "Strong", color: "bg-emerald-500" };
    return { strength, label: "Very Strong", color: "bg-teal-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleReset = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, call Supabase auth.updateUser
    toast.success("Password updated successfully");
    setIsLoading(false);
    handleOpenChange(false);
  };

  const content = (
    <div className="space-y-5">
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="current-password" className="text-sm font-medium">
          Current Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="current-password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="pl-10 pr-10 h-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-sm font-medium">
          New Password
        </Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="new-password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="pl-10 pr-10 h-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    level <= passwordStrength.strength ? passwordStrength.color : "bg-muted"
                  )}
                />
              ))}
            </div>
            <p className={cn(
              "text-xs font-medium",
              passwordStrength.strength <= 2 && "text-destructive",
              passwordStrength.strength === 3 && "text-amber-600",
              passwordStrength.strength >= 4 && "text-emerald-600"
            )}>
              {passwordStrength.label}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-sm font-medium">
          Confirm New Password
        </Label>
        <div className="relative">
          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={cn(
              "pl-10 pr-10 h-12",
              confirmPassword && newPassword !== confirmPassword && "border-destructive"
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-xs text-destructive">Passwords do not match</p>
        )}
      </div>

      {/* Password Requirements */}
      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
        <p className="text-xs font-medium text-muted-foreground mb-2">Password requirements:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li className={cn(newPassword.length >= 8 && "text-emerald-600")}>
            • At least 8 characters
          </li>
          <li className={cn(/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && "text-emerald-600")}>
            • Uppercase & lowercase letters
          </li>
          <li className={cn(/[0-9]/.test(newPassword) && "text-emerald-600")}>
            • At least one number
          </li>
          <li className={cn(/[^A-Za-z0-9]/.test(newPassword) && "text-emerald-600")}>
            • At least one special character
          </li>
        </ul>
      </div>
    </div>
  );

  const footer = (
    <div className="flex gap-3 w-full">
      <Button
        variant="outline"
        onClick={() => handleOpenChange(false)}
        className="flex-1 h-12"
        disabled={isLoading}
      >
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button
        onClick={handleReset}
        disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
        className="flex-1 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
      >
        <Key className="w-4 h-4 mr-2" />
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-lg font-semibold">Reset Password</DrawerTitle>
            <DrawerDescription>Change your account password</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-2 overflow-y-auto">
            {content}
          </div>
          <DrawerFooter className="pt-4">
            {footer}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Reset Password</DialogTitle>
          <DialogDescription>Change your account password</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="pt-4 sm:flex-row">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
