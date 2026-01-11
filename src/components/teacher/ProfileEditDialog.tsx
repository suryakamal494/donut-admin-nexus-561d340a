import { useState, useEffect } from "react";
import { User, Mail, Phone, Save, X } from "lucide-react";
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
import { currentTeacher } from "@/data/teacherData";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileEditDialog = ({ open, onOpenChange }: ProfileEditDialogProps) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState(currentTeacher.name);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName(currentTeacher.name);
    }
  }, [open]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In real implementation, update the backend
    toast.success("Profile updated successfully");
    setIsLoading(false);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-5">
      {/* Avatar Display */}
      <div className="flex justify-center">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
        </div>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Email Field (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            value={currentTeacher.email}
            disabled
            className="pl-10 h-12 bg-muted/50 text-muted-foreground"
          />
        </div>
        <p className="text-xs text-muted-foreground">Contact admin to change email</p>
      </div>

      {/* Phone Field (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
          Mobile Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="phone"
            value={currentTeacher.mobile}
            disabled
            className="pl-10 h-12 bg-muted/50 text-muted-foreground"
          />
        </div>
        <p className="text-xs text-muted-foreground">Contact admin to change mobile</p>
      </div>
    </div>
  );

  const footer = (
    <div className="flex gap-3 w-full">
      <Button
        variant="outline"
        onClick={() => onOpenChange(false)}
        className="flex-1 h-12"
        disabled={isLoading}
      >
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="flex-1 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
      >
        <Save className="w-4 h-4 mr-2" />
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-lg font-semibold">Edit Profile</DrawerTitle>
            <DrawerDescription>Update your personal information</DrawerDescription>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="pt-4 sm:flex-row">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
