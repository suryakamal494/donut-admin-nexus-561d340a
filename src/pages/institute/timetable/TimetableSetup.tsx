import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HolidayCalendarDialog } from "@/components/timetable";
import { useTimetableSetup } from "@/hooks/useTimetableSetup";
import {
  PeriodStructureTab,
  PeriodTypesTab,
  HolidaysTab,
  TeacherLoadTab,
  TeacherConstraintsTab,
  FacilitiesTab,
  ExamScheduleTab,
  SetupProgressBar,
  AdvancedModeToggle,
} from "@/components/timetable/setup";
import { Save } from "lucide-react";
import { toast } from "sonner";

const TimetableSetup = () => {
  const navigate = useNavigate();
  const setup = useTimetableSetup();

  const handleSave = () => {
    toast.success("Setup saved successfully!", {
      description: "Your timetable configuration has been saved."
    });
    navigate("/institute/timetable");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable Setup"
        description="Configure all settings before building your timetable"
        breadcrumbs={[
          { label: "Timetable", href: "/institute/timetable" },
          { label: "Setup" },
        ]}
        actions={
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save & Continue</span>
            <span className="sm:hidden">Save</span>
          </Button>
        }
      />

      {/* Advanced Mode Toggle */}
      <AdvancedModeToggle 
        enabled={setup.isAdvancedMode}
        onToggle={setup.setIsAdvancedMode}
      />

      {/* Progress Overview */}
      <SetupProgressBar
        tabs={setup.tabs}
        activeTab={setup.activeTab}
        getProgress={setup.getTabProgress}
        advancedTabIds={['teacher-constraints', 'facilities']}
        onTabChange={setup.setActiveTab}
      />

      <Tabs value={setup.activeTab} onValueChange={setup.setActiveTab} className="space-y-6">
        <TabsList className="sr-only">
          {setup.tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 1: Period Structure */}
        <TabsContent value="period-structure">
          <PeriodStructureTab
            workingDays={setup.workingDays}
            periodsPerDay={setup.periodsPerDay}
            breaks={setup.breaks}
            useTimeMapping={setup.useTimeMapping}
            timeMapping={setup.timeMapping}
            onToggleDay={setup.toggleDay}
            onPeriodsChange={setup.setPeriodsPerDay}
            onBreaksChange={{
              add: setup.addBreak,
              update: setup.updateBreak,
              remove: setup.removeBreak,
            }}
            onTimeMappingToggle={setup.setUseTimeMapping}
            onTimeMappingUpdate={setup.updateTimeMapping}
            onGenerateTimeMappings={setup.generateTimeMappings}
          />
        </TabsContent>

        {/* Tab 2: Period Types */}
        <TabsContent value="period-types">
          <PeriodTypesTab
            periodTypes={setup.periodTypes}
            onUpdate={setup.setPeriodTypes}
          />
        </TabsContent>

        {/* Tab 3: Holidays */}
        <TabsContent value="holidays">
          <HolidaysTab
            holidays={setup.holidays}
            onManageClick={() => setup.setHolidayDialogOpen(true)}
          />
        </TabsContent>

        {/* Tab 4: Teacher Load */}
        <TabsContent value="teacher-load">
          <TeacherLoadTab
            teachers={setup.teacherLoadData}
            editingTeacherId={setup.editingTeacher}
            onEditingChange={setup.setEditingTeacher}
            onTeacherUpdate={setup.updateTeacherLoad}
          />
        </TabsContent>

        {/* Tab 5: Exam Schedule */}
        <TabsContent value="exam-schedule">
          <ExamScheduleTab />
        </TabsContent>

        {/* Tab 6: Teacher Constraints (Advanced) */}
        {setup.isAdvancedMode && (
          <TabsContent value="teacher-constraints">
            <TeacherConstraintsTab
              teachers={setup.teacherLoadData}
              constraints={setup.teacherConstraints}
              onUpdate={setup.setTeacherConstraints}
            />
          </TabsContent>
        )}

        {/* Tab 6: Facilities (Advanced) */}
        {setup.isAdvancedMode && (
          <TabsContent value="facilities">
            <FacilitiesTab
              facilities={setup.facilities}
              onUpdate={setup.setFacilities}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Holiday Dialog */}
      <HolidayCalendarDialog
        open={setup.holidayDialogOpen}
        onClose={() => setup.setHolidayDialogOpen(false)}
        holidays={setup.holidays}
        onSave={(newHolidays) => {
          setup.setHolidays(newHolidays);
          toast.success("Holidays saved");
        }}
      />

      {/* Save Actions Footer */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
        <div>
          <p className="font-medium">Ready to build your timetable?</p>
          <p className="text-sm text-muted-foreground">
            Save your setup and proceed to the workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/institute/timetable")}>
            Skip for now
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimetableSetup;
