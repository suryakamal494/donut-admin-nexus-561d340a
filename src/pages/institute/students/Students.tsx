import React, { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Plus,
  Search,
  MoreVertical,
  Users,
  ChevronRight,
  Edit,
  Trash2,
  Key,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { students, batches, availableClasses, Student } from "@/data/instituteData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Virtualized student rows component
const VirtualizedStudentTable = ({ 
  batchStudents, 
  onEdit, 
  onResetPassword, 
  onDelete 
}: { 
  batchStudents: Student[];
  onEdit: (student: Student) => void;
  onResetPassword: (name: string) => void;
  onDelete: (student: Student) => void;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const ROW_HEIGHT = 52;

  const virtualizer = useVirtualizer({
    count: batchStudents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Only virtualize if more than 15 students
  if (batchStudents.length <= 15) {
    return (
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Student</TableHead>
              <TableHead className="min-w-[80px]">Roll No.</TableHead>
              <TableHead className="min-w-[100px] hidden sm:table-cell">Username</TableHead>
              <TableHead className="min-w-[70px]">Status</TableHead>
              <TableHead className="text-right w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batchStudents.map((student) => (
              <StudentRow 
                key={student.id} 
                student={student} 
                onEdit={onEdit}
                onResetPassword={onResetPassword}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      {/* Fixed header */}
      <Table className="min-w-[500px]">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Student</TableHead>
            <TableHead className="min-w-[80px]">Roll No.</TableHead>
            <TableHead className="min-w-[100px] hidden sm:table-cell">Username</TableHead>
            <TableHead className="min-w-[70px]">Status</TableHead>
            <TableHead className="text-right w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      
      {/* Virtualized body */}
      <div 
        ref={parentRef} 
        className="overflow-auto"
        style={{ maxHeight: `${Math.min(batchStudents.length * ROW_HEIGHT, 400)}px` }}
      >
        <Table className="min-w-[500px]">
          <TableBody>
            <tr style={{ height: `${virtualItems[0]?.start ?? 0}px` }} />
            {virtualItems.map((virtualRow) => {
              const student = batchStudents[virtualRow.index];
              return (
                <StudentRow 
                  key={student.id} 
                  student={student} 
                  onEdit={onEdit}
                  onResetPassword={onResetPassword}
                  onDelete={onDelete}
                />
              );
            })}
            <tr style={{ height: `${virtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end ?? 0)}px` }} />
          </TableBody>
        </Table>
      </div>
      
      {/* Count indicator */}
      <div className="px-3 py-1.5 bg-muted/20 border-t border-border/50 text-xs text-muted-foreground">
        {batchStudents.length} students
      </div>
    </div>
  );
};

// Memoized student row
const StudentRow = React.memo(({ 
  student, 
  onEdit, 
  onResetPassword, 
  onDelete 
}: { 
  student: Student;
  onEdit: (student: Student) => void;
  onResetPassword: (name: string) => void;
  onDelete: (student: Student) => void;
}) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs md:text-sm font-medium text-primary shrink-0">
          {student.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <span className="font-medium text-sm truncate block">{student.name}</span>
          <span className="text-xs text-muted-foreground sm:hidden">@{student.username}</span>
        </div>
      </div>
    </TableCell>
    <TableCell className="text-sm">{student.studentMobile}</TableCell>
    <TableCell className="text-muted-foreground hidden sm:table-cell text-sm">
      @{student.username}
    </TableCell>
    <TableCell>
      <Badge
        variant={student.status === "active" ? "default" : "secondary"}
        className={student.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs" : "text-xs"}
      >
        {student.status}
      </Badge>
    </TableCell>
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(student)}>
            <Edit className="h-4 w-4 mr-2" />Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onResetPassword(student.name)}>
            <Key className="h-4 w-4 mr-2" />Reset Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive"
            onClick={() => onDelete(student)}
          >
            <Trash2 className="h-4 w-4 mr-2" />Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
));
StudentRow.displayName = "StudentRow";



const Students = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchIdFilter = searchParams.get("batchId");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [expandedBatches, setExpandedBatches] = useState<string[]>(
    batchIdFilter ? [batchIdFilter] : batches.slice(0, 2).map((b) => b.id)
  );
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Computed stats - memoized
  const stats = useMemo(() => ({
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.status === "active").length,
    totalBatches: batches.length,
  }), []);

  // Create class chips with student counts - memoized
  const classChips = useMemo(() => 
    availableClasses
      .map((cls) => {
        const classBatches = batches.filter(b => b.classId === cls.id);
        const classStudentCount = students.filter(s => 
          classBatches.some(b => b.id === s.batchId)
        ).length;
        return {
          id: cls.id,
          name: cls.name,
          count: classStudentCount,
        };
      })
      .filter((c) => c.count > 0), []);

  // Group students by batch - memoized
  const studentsByBatch = useMemo(() => 
    batches.reduce((acc, batch) => {
      if (selectedClass && batch.classId !== selectedClass) return acc;
      
      const batchStudents = students.filter((s) => s.batchId === batch.id);
      if (batchStudents.length > 0 || !batchIdFilter) {
        acc[batch.id] = {
          batch,
          students: batchStudents,
        };
      }
      return acc;
    }, {} as Record<string, { batch: typeof batches[0]; students: typeof students }>), [selectedClass, batchIdFilter]);

  const toggleBatch = useCallback((batchId: string) => {
    setExpandedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  }, []);

  // Filter students by batch and search - memoized
  const filteredStudentsByBatch = useMemo(() => 
    Object.entries(studentsByBatch).reduce(
      (acc, [batchId, data]) => {
        if (batchIdFilter && batchId !== batchIdFilter) return acc;

        const filteredStudents = data.students.filter(
          (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.studentMobile?.includes(searchQuery)
        );

        if (filteredStudents.length > 0 || !searchQuery) {
          acc[batchId] = { ...data, students: filteredStudents };
        }
        return acc;
      },
      {} as typeof studentsByBatch
    ), [studentsByBatch, searchQuery, batchIdFilter]);

  const handleEdit = useCallback((student: Student) => {
    navigate(`/institute/students/${student.id}/edit`);
  }, [navigate]);

  const handleResetPassword = useCallback((studentName: string) => {
    toast.success(`Password reset for ${studentName}`);
  }, []);

  const handleDeleteStudent = useCallback(() => {
    if (studentToDelete) {
      toast.success(`${studentToDelete.name} has been removed`);
      setStudentToDelete(null);
    }
  }, [studentToDelete]);

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Students"
        description="Manage students organized by batches."
        actions={
          <Button
            onClick={() => navigate("/institute/students/add")}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Students</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      />

      {/* Quick Stats - Compact */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-foreground">{stats.totalStudents}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-foreground">{stats.activeStudents}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-foreground">{stats.totalBatches}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Batches</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Filter Chips */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedClass(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
              "border border-border/50 hover:border-primary/50",
              selectedClass === null
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            All
            <span className="ml-1 text-xs opacity-80">({stats.totalStudents})</span>
          </button>
          {classChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedClass(chip.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
                "border border-border/50 hover:border-primary/50",
                selectedClass === chip.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {chip.name.replace('Class ', '')}
              <span className="ml-1 text-xs opacity-80">({chip.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, username, or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Students grouped by Batch */}
      <div className="space-y-4">
        {Object.entries(filteredStudentsByBatch).map(([batchId, { batch, students: batchStudents }]) => (
          <Card key={batchId}>
            <Collapsible
              open={expandedBatches.includes(batchId)}
              onOpenChange={() => toggleBatch(batchId)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3 md:py-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div
                        className={cn(
                          "h-6 w-6 md:h-8 md:w-8 rounded-lg flex items-center justify-center transition-transform shrink-0",
                          expandedBatches.includes(batchId) && "rotate-90"
                        )}
                      >
                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm md:text-base truncate">
                          {batch.className} - {batch.name}
                        </CardTitle>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {batchStudents.length} students
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
                        {batch.academicYear}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/institute/students/add?batchId=${batchId}`);
                        }}
                        className="h-7 md:h-8 px-2 md:px-3"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {batchStudents.length > 0 ? (
                    <VirtualizedStudentTable
                      batchStudents={batchStudents}
                      onEdit={handleEdit}
                      onResetPassword={handleResetPassword}
                      onDelete={setStudentToDelete}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">
                        No students in this batch yet
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/institute/students/add?batchId=${batchId}`)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Students
                      </Button>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}

        {Object.keys(filteredStudentsByBatch).length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-16 flex flex-col items-center justify-center text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Add students to your batches to get started"}
              </p>
              <Button onClick={() => navigate("/institute/students/add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Students
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {studentToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Students;