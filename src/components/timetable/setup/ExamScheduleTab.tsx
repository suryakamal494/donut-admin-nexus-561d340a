import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamBlockForm } from "@/components/timetable/ExamBlockForm";
import { ExamBlockList } from "@/components/timetable/ExamBlockList";
import { ExamYearlyCalendar } from "@/components/timetable/ExamYearlyCalendar";
import { ExamTypeManager } from "@/components/timetable/ExamTypeManager";
import { ExamBlock, ExamType } from "@/types/examBlock";
import { examBlocks as initialBlocks, defaultExamTypes } from "@/data/examBlockData";
import { Plus, List, CalendarDays, ClipboardList } from "lucide-react";
import { toast } from "sonner";

export function ExamScheduleTab() {
  const [activeTab, setActiveTab] = useState("list");
  const [blocks, setBlocks] = useState<ExamBlock[]>(initialBlocks);
  const [editingBlock, setEditingBlock] = useState<ExamBlock | null>(null);
  const [examTypes, setExamTypes] = useState<ExamType[]>(defaultExamTypes);

  // Get list of exam type IDs currently in use
  const usedTypeIds = useMemo(() => {
    return [...new Set(blocks.map(b => b.examTypeId))];
  }, [blocks]);

  const handleSaveBlock = (block: ExamBlock) => {
    if (editingBlock) {
      setBlocks(prev => prev.map(b => b.id === block.id ? block : b));
      toast.success("Exam updated successfully");
      setEditingBlock(null);
    } else {
      setBlocks(prev => [...prev, { ...block, id: `block-${Date.now()}`, createdAt: new Date().toISOString() }]);
      toast.success("Exam created successfully");
    }
    setActiveTab("list");
  };

  const handleEditBlock = (block: ExamBlock) => {
    setEditingBlock(block);
    setActiveTab("create");
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    toast.success("Exam deleted successfully");
  };

  const handleToggleActive = (blockId: string) => {
    setBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, isActive: !b.isActive } : b
    ));
  };

  // Exam type handlers
  const handleAddType = (type: ExamType) => {
    setExamTypes(prev => [...prev, type]);
  };

  const handleUpdateType = (type: ExamType) => {
    setExamTypes(prev => prev.map(t => t.id === type.id ? type : t));
  };

  const handleDeleteType = (typeId: string) => {
    setExamTypes(prev => prev.filter(t => t.id !== typeId));
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Exam Schedule</CardTitle>
              <CardDescription>Schedule exams and reserve time slots</CardDescription>
            </div>
          </div>
          <ExamTypeManager 
            examTypes={examTypes}
            onAddType={handleAddType}
            onUpdateType={handleUpdateType}
            onDeleteType={handleDeleteType}
            usedTypeIds={usedTypeIds}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => {
          if (v !== "create") setEditingBlock(null);
          setActiveTab(v);
        }}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
            <TabsTrigger value="list" className="gap-2">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </TabsTrigger>
            <TabsTrigger value="yearly" className="gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{editingBlock ? "Edit" : "Create"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            <ExamBlockList
              blocks={blocks}
              onEdit={handleEditBlock}
              onDelete={handleDeleteBlock}
              onToggleActive={handleToggleActive}
              onCreateNew={() => setActiveTab("create")}
              examTypes={examTypes}
            />
          </TabsContent>

          <TabsContent value="yearly" className="mt-0">
            <ExamYearlyCalendar 
              blocks={blocks} 
              examTypes={examTypes}
              onEdit={handleEditBlock}
            />
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <ExamBlockForm
              existingBlock={editingBlock}
              onSave={handleSaveBlock}
              onCancel={() => {
                setEditingBlock(null);
                setActiveTab("list");
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
