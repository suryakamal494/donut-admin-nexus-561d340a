import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import {
  ChevronLeft,
  User,
  Users,
  ClipboardPaste,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Check,
  X,
  AlertCircle,
  Trash2,
  MapPin,
  GraduationCap,
  Lock,
  UserCircle,
  Users2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { batches, students, Student } from "@/data/instituteData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ParsedStudent {
  name: string;
  dateOfBirth: string;
  gender: string;
  studentMobile: string;
  studentEmail: string;
  username: string;
  password: string;
  isValid: boolean;
  errors: string[];
}

interface StudentFormData {
  // Required fields
  name: string;
  dateOfBirth: string;
  gender: string;
  studentMobile: string;
  studentEmail: string;
  username: string;
  password: string;
  
  // Optional - Parent/Guardian
  fatherName: string;
  fatherMobile: string;
  fatherOccupation: string;
  motherName: string;
  motherMobile: string;
  guardianName: string;
  guardianMobile: string;
  guardianRelation: string;
  
  // Optional - Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  
  // Optional - Academic
  previousSchool: string;
  admissionDate: string;
  admissionNumber: string;
  transportRequired: boolean;
  aadharNumber: string;
}

const initialFormData: StudentFormData = {
  name: "",
  dateOfBirth: "",
  gender: "",
  studentMobile: "",
  studentEmail: "",
  username: "",
  password: "",
  fatherName: "",
  fatherMobile: "",
  fatherOccupation: "",
  motherName: "",
  motherMobile: "",
  guardianName: "",
  guardianMobile: "",
  guardianRelation: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  previousSchool: "",
  admissionDate: "",
  admissionNumber: "",
  transportRequired: false,
  aadharNumber: "",
};

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const generateUsername = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, ".").replace(/\.+/g, ".");
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"
];

const AddStudent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { studentId } = useParams();
  const preselectedBatchId = searchParams.get("batchId");

  const isEditMode = !!studentId;
  const existingStudent = studentId ? students.find(s => s.id === studentId) : null;

  const [activeTab, setActiveTab] = useState("manual");
  const [selectedBatchId, setSelectedBatchId] = useState(preselectedBatchId || "");
  const [formData, setFormData] = useState<StudentFormData>({
    ...initialFormData,
    password: generatePassword(),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["required"]);

  // Bulk upload state
  const [pasteData, setPasteData] = useState("");
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  // Pre-populate form in edit mode
  useEffect(() => {
    if (existingStudent) {
      setFormData({
        ...initialFormData,
        name: existingStudent.name,
        username: existingStudent.username,
        dateOfBirth: existingStudent.dateOfBirth || "",
        gender: existingStudent.gender || "",
        studentMobile: existingStudent.studentMobile || "",
        studentEmail: existingStudent.studentEmail || "",
        aadharNumber: existingStudent.aadharNumber || "",
        fatherName: existingStudent.fatherName || "",
        fatherMobile: existingStudent.fatherMobile || "",
        fatherOccupation: existingStudent.fatherOccupation || "",
        motherName: existingStudent.motherName || "",
        motherMobile: existingStudent.motherMobile || "",
        guardianName: existingStudent.guardianName || "",
        guardianMobile: existingStudent.guardianMobile || "",
        guardianRelation: existingStudent.guardianRelation || "",
        addressLine1: existingStudent.addressLine1 || "",
        addressLine2: existingStudent.addressLine2 || "",
        city: existingStudent.city || "",
        state: existingStudent.state || "",
        pincode: existingStudent.pincode || "",
        country: existingStudent.country || "India",
        previousSchool: existingStudent.previousSchool || "",
        admissionDate: existingStudent.admissionDate || "",
        admissionNumber: existingStudent.admissionNumber || "",
        transportRequired: existingStudent.transportRequired || false,
        password: "",
      });
      setSelectedBatchId(existingStudent.batchId);
    }
  }, [existingStudent]);

  const updateFormData = (field: keyof StudentFormData, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate username from name
      if (field === "name" && typeof value === "string") {
        if (!prev.username || prev.username === generateUsername(prev.name)) {
          updated.username = generateUsername(value);
        }
      }
      
      return updated;
    });
  };

  const validateMandatoryFields = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter student name");
      return false;
    }
    if (!formData.dateOfBirth) {
      toast.error("Please select date of birth");
      return false;
    }
    if (!formData.gender) {
      toast.error("Please select gender");
      return false;
    }
    if (!formData.studentMobile || formData.studentMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!formData.studentEmail || !formData.studentEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.username.trim()) {
      toast.error("Please enter username");
      return false;
    }
    if (!isEditMode && !formData.password.trim()) {
      toast.error("Please enter password");
      return false;
    }
    return true;
  };

  const returnTo = searchParams.get("returnTo");

  const handleSubmit = () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }
    
    if (!validateMandatoryFields()) {
      return;
    }

    if (isEditMode) {
      toast.success(`${formData.name} updated successfully`);
    } else {
      toast.success(`${formData.name} added to ${selectedBatch?.className} - ${selectedBatch?.name}`);
    }
    navigate(returnTo || "/institute/students");
  };

  const parseData = (data: string) => {
    const lines = data.trim().split("\n").filter((line) => line.trim());
    const parsed: ParsedStudent[] = [];

    for (const line of lines) {
      const parts = line.includes("\t")
        ? line.split("\t").map((p) => p.trim())
        : line.split(",").map((p) => p.trim());

      const errors: string[] = [];
      const [name = "", dob = "", gender = "", mobile = "", email = "", username = "", password = ""] = parts;

      if (!name) errors.push("Name is required");
      if (!dob) errors.push("Date of birth is required");
      if (!gender || !["male", "female", "other"].includes(gender.toLowerCase())) errors.push("Valid gender is required");
      if (!mobile || mobile.length !== 10) errors.push("Valid 10-digit mobile is required");
      if (!email || !email.includes("@")) errors.push("Valid email is required");

      parsed.push({
        name,
        dateOfBirth: dob,
        gender: gender.toLowerCase(),
        studentMobile: mobile,
        studentEmail: email,
        username: username || generateUsername(name),
        password: password || generatePassword(),
        isValid: errors.length === 0,
        errors,
      });
    }

    return parsed;
  };

  const handleParse = () => {
    if (!pasteData.trim()) {
      toast.error("Please paste some data first");
      return;
    }
    const parsed = parseData(pasteData);
    setParsedStudents(parsed);
  };

  const handleRemoveRow = (index: number) => {
    setParsedStudents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkUpload = () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }

    const validStudents = parsedStudents.filter((s) => s.isValid);
    if (validStudents.length === 0) {
      toast.error("No valid students to add");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        `Added ${validStudents.length} students to ${selectedBatch?.className} - ${selectedBatch?.name}`
      );
      navigate(returnTo || "/institute/students");
    }, 1500);
  };

  const validCount = parsedStudents.filter((s) => s.isValid).length;
  const invalidCount = parsedStudents.filter((s) => !s.isValid).length;

  // Form field component for consistent styling
  const FormField = ({ 
    label, 
    id, 
    required, 
    children,
    className 
  }: { 
    label: string; 
    id: string; 
    required?: boolean;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );

  // Section header badge for completion status
  const SectionBadge = ({ filled, total }: { filled: number; total: number }) => (
    <Badge 
      variant="outline" 
      className={cn(
        "ml-2 text-xs",
        filled === total ? "bg-emerald-100 text-emerald-700 border-emerald-200" : 
        filled > 0 ? "bg-amber-100 text-amber-700 border-amber-200" : ""
      )}
    >
      {filled}/{total}
    </Badge>
  );

  const renderManualForm = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Student Registration Form</CardTitle>
        <CardDescription>
          Fill in the student's details. Fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion 
          type="multiple" 
          value={expandedSections}
          onValueChange={setExpandedSections}
          className="w-full"
        >
          {/* Required Student Details */}
          <AccordionItem value="required" className="border-b">
            <AccordionTrigger className="px-4 sm:px-6 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-primary" />
                <span className="font-medium">Student Details (Required)</span>
                <SectionBadge 
                  filled={[
                    formData.name, 
                    formData.dateOfBirth, 
                    formData.gender,
                    formData.studentMobile,
                    formData.studentEmail,
                    formData.username,
                    formData.password || isEditMode
                  ].filter(Boolean).length}
                  total={7}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" id="name" required>
                  <Input
                    id="name"
                    placeholder="e.g., Aarav Patel"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </FormField>
                
                <FormField label="Date of Birth" id="dateOfBirth" required>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  />
                </FormField>

                <FormField label="Gender" id="gender" required>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => updateFormData("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Mobile Number" id="studentMobile" required>
                  <Input
                    id="studentMobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.studentMobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      updateFormData("studentMobile", value);
                    }}
                    maxLength={10}
                  />
                </FormField>

                <FormField label="Email ID" id="studentEmail" required className="sm:col-span-2">
                  <Input
                    id="studentEmail"
                    type="email"
                    placeholder="student@example.com"
                    value={formData.studentEmail}
                    onChange={(e) => updateFormData("studentEmail", e.target.value)}
                  />
                </FormField>

                <FormField label="Username" id="username" required>
                  <Input
                    id="username"
                    placeholder="Auto-generated from name"
                    value={formData.username}
                    onChange={(e) => updateFormData("username", e.target.value)}
                  />
                </FormField>

                <FormField label={isEditMode ? "New Password (leave blank to keep current)" : "Password"} id="password" required={!isEditMode}>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        placeholder={isEditMode ? "Leave blank to keep current" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => updateFormData("password", generatePassword())}
                      className="shrink-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </FormField>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Parent/Guardian Information - Optional */}
          <AccordionItem value="parent" className="border-b">
            <AccordionTrigger className="px-4 sm:px-6 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-violet-500" />
                <span className="font-medium">Parent/Guardian Info (Optional)</span>
                <SectionBadge 
                  filled={[formData.fatherName, formData.fatherMobile, formData.motherName].filter(Boolean).length}
                  total={3}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6">
              <div className="space-y-6">
                {/* Father's Details */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Father's Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField label="Father's Name" id="fatherName">
                      <Input
                        id="fatherName"
                        placeholder="Father's full name"
                        value={formData.fatherName}
                        onChange={(e) => updateFormData("fatherName", e.target.value)}
                      />
                    </FormField>

                    <FormField label="Father's Mobile" id="fatherMobile">
                      <Input
                        id="fatherMobile"
                        type="tel"
                        placeholder="10-digit mobile"
                        value={formData.fatherMobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                          updateFormData("fatherMobile", value);
                        }}
                        maxLength={10}
                      />
                    </FormField>

                    <FormField label="Father's Occupation" id="fatherOccupation">
                      <Input
                        id="fatherOccupation"
                        placeholder="e.g., Engineer, Teacher"
                        value={formData.fatherOccupation}
                        onChange={(e) => updateFormData("fatherOccupation", e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Mother's Details */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Mother's Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Mother's Name" id="motherName">
                      <Input
                        id="motherName"
                        placeholder="Mother's full name"
                        value={formData.motherName}
                        onChange={(e) => updateFormData("motherName", e.target.value)}
                      />
                    </FormField>

                    <FormField label="Mother's Mobile" id="motherMobile">
                      <Input
                        id="motherMobile"
                        type="tel"
                        placeholder="10-digit mobile"
                        value={formData.motherMobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                          updateFormData("motherMobile", value);
                        }}
                        maxLength={10}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Guardian Details */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Guardian Details (if applicable)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Guardian's Name" id="guardianName">
                      <Input
                        id="guardianName"
                        placeholder="Guardian's name"
                        value={formData.guardianName}
                        onChange={(e) => updateFormData("guardianName", e.target.value)}
                      />
                    </FormField>

                    <FormField label="Guardian's Mobile" id="guardianMobile">
                      <Input
                        id="guardianMobile"
                        type="tel"
                        placeholder="10-digit mobile"
                        value={formData.guardianMobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                          updateFormData("guardianMobile", value);
                        }}
                        maxLength={10}
                      />
                    </FormField>

                    <FormField label="Relation" id="guardianRelation">
                      <Input
                        id="guardianRelation"
                        placeholder="e.g., Uncle, Aunt"
                        value={formData.guardianRelation}
                        onChange={(e) => updateFormData("guardianRelation", e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Address - Optional */}
          <AccordionItem value="address" className="border-b">
            <AccordionTrigger className="px-4 sm:px-6 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Address (Optional)</span>
                <SectionBadge 
                  filled={[formData.addressLine1, formData.city, formData.state, formData.pincode].filter(Boolean).length}
                  total={4}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6">
              <div className="grid grid-cols-1 gap-4">
                <FormField label="Address Line 1" id="addressLine1">
                  <Input
                    id="addressLine1"
                    placeholder="House/Flat No., Street"
                    value={formData.addressLine1}
                    onChange={(e) => updateFormData("addressLine1", e.target.value)}
                  />
                </FormField>

                <FormField label="Address Line 2" id="addressLine2">
                  <Input
                    id="addressLine2"
                    placeholder="Area, Landmark"
                    value={formData.addressLine2}
                    onChange={(e) => updateFormData("addressLine2", e.target.value)}
                  />
                </FormField>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <FormField label="City" id="city">
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                    />
                  </FormField>

                  <FormField label="State" id="state">
                    <Select 
                      value={formData.state} 
                      onValueChange={(value) => updateFormData("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Pincode" id="pincode">
                    <Input
                      id="pincode"
                      placeholder="6-digit"
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        updateFormData("pincode", value);
                      }}
                      maxLength={6}
                    />
                  </FormField>

                  <FormField label="Country" id="country">
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => updateFormData("country", e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Academic Details - Optional */}
          <AccordionItem value="academic" className="border-b-0">
            <AccordionTrigger className="px-4 sm:px-6 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">Academic Details (Optional)</span>
                <SectionBadge 
                  filled={[formData.previousSchool, formData.admissionDate, formData.aadharNumber].filter(Boolean).length}
                  total={3}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Previous School" id="previousSchool" className="sm:col-span-2">
                  <Input
                    id="previousSchool"
                    placeholder="Name of previous school"
                    value={formData.previousSchool}
                    onChange={(e) => updateFormData("previousSchool", e.target.value)}
                  />
                </FormField>

                <FormField label="Admission Date" id="admissionDate">
                  <Input
                    id="admissionDate"
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => updateFormData("admissionDate", e.target.value)}
                  />
                </FormField>

                <FormField label="Admission Number" id="admissionNumber">
                  <Input
                    id="admissionNumber"
                    placeholder="School admission no."
                    value={formData.admissionNumber}
                    onChange={(e) => updateFormData("admissionNumber", e.target.value)}
                  />
                </FormField>

                <FormField label="Aadhar Number" id="aadharNumber">
                  <Input
                    id="aadharNumber"
                    placeholder="12-digit Aadhar number"
                    value={formData.aadharNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                      updateFormData("aadharNumber", value);
                    }}
                    maxLength={12}
                  />
                </FormField>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="transportRequired" className="text-sm font-medium">
                      Transport Required
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Does the student need school transport?
                    </p>
                  </div>
                  <Switch
                    id="transportRequired"
                    checked={formData.transportRequired}
                    onCheckedChange={(checked) => updateFormData("transportRequired", checked)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Submit Button */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-muted/30">
          <Button
            variant="outline"
            onClick={() => navigate(returnTo || "/institute/students")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedBatchId || !formData.name.trim()}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80"
          >
            {isEditMode ? (
              "Save Changes"
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      <PageHeader
        title={isEditMode ? "Edit Student" : "Add Students"}
        description={isEditMode 
          ? "Update student information."
          : "Add students one by one or upload multiple students at once using copy-paste."
        }
        actions={
          <Button variant="outline" onClick={() => navigate(returnTo || "/institute/students")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Students</span>
            <span className="sm:hidden">Back</span>
          </Button>
        }
      />

      {/* Batch Selection */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Select Batch</CardTitle>
          <CardDescription>
            {isEditMode ? "The batch this student belongs to" : "Choose which batch these students will be added to"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select a batch..." />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.className} - {batch.name} ({batch.academicYear})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isEditMode ? (
        renderManualForm()
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="manual" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Add One by One</span>
              <span className="sm:hidden">Manual</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <ClipboardPaste className="h-4 w-4" />
              <span className="hidden sm:inline">Bulk Add (Copy-Paste)</span>
              <span className="sm:hidden">Bulk</span>
            </TabsTrigger>
          </TabsList>

          {/* Manual Add */}
          <TabsContent value="manual" className="mt-6">
            {renderManualForm()}
          </TabsContent>

          {/* Bulk Add */}
          <TabsContent value="bulk" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paste Student Data</CardTitle>
                <CardDescription>
                  Copy rows from Excel, Google Sheets, or any table. Each row should contain mandatory fields.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Required Format (7 columns):</p>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-background p-3 rounded border overflow-x-auto">
{`Name, DOB, Gender, Mobile, Email, Username, Password
Aarav Patel, 2010-05-15, male, 9876543210, aarav@email.com, aarav.patel, Pass123
Diya Sharma, 2010-08-22, female, 9876543211, diya@email.com, diya.sharma, Pass456`}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 All 7 fields are mandatory. Gender should be: male, female, or other
                  </p>
                </div>

                <Textarea
                  placeholder="Paste your data here...

Example:
Aarav Patel	2010-05-15	male	9876543210	aarav@email.com	aarav.patel	Pass123
Diya Sharma	2010-08-22	female	9876543211	diya@email.com	diya.sharma	Pass456"
                  value={pasteData}
                  onChange={(e) => setPasteData(e.target.value)}
                  className="min-h-[150px] font-mono text-sm"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button onClick={handleParse} className="w-full sm:w-auto">
                    <Check className="h-4 w-4 mr-2" />
                    Parse Data
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setPasteData("");
                      setParsedStudents([]);
                    }}
                    className="w-full sm:w-auto"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Parsed Preview */}
            {parsedStudents.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">Preview</CardTitle>
                      <CardDescription>
                        Review the parsed data before adding
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {validCount > 0 && (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          {validCount} valid
                        </Badge>
                      )}
                      {invalidCount > 0 && (
                        <Badge variant="destructive">{invalidCount} with errors</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <Table className="min-w-[700px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30px]">Status</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>DOB</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Mobile</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden lg:table-cell">Username</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedStudents.map((student, index) => (
                          <TableRow
                            key={index}
                            className={cn(!student.isValid && "bg-destructive/5")}
                          >
                            <TableCell>
                              {student.isValid ? (
                                <Check className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <div className="group relative">
                                  <AlertCircle className="h-4 w-4 text-destructive" />
                                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 bg-popover border rounded-md p-2 text-xs shadow-lg min-w-[150px]">
                                    {student.errors.join(", ")}
                                  </div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {student.name || "-"}
                            </TableCell>
                            <TableCell>{student.dateOfBirth || "-"}</TableCell>
                            <TableCell className="capitalize">{student.gender || "-"}</TableCell>
                            <TableCell>{student.studentMobile || "-"}</TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                              {student.studentEmail || "-"}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-muted-foreground">
                              {student.username || "-"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveRow(index)}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleBulkUpload}
                      disabled={validCount === 0 || !selectedBatchId || isProcessing}
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80"
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Add {validCount} Student{validCount !== 1 ? "s" : ""}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AddStudent;
