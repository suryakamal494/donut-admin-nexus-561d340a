import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { getPerformanceColor } from "@/lib/reportColors";
import type { InstituteStudentSummary } from "@/data/institute/reportsData";

interface StudentReportCardProps {
  student: InstituteStudentSummary;
  instituteName?: string;
}

/**
 * Printable student report card — rendered off-screen, captured by html2canvas.
 * Uses inline styles + utility classes for reliable capture.
 */
const StudentReportCard = forwardRef<HTMLDivElement, StudentReportCardProps>(
  ({ student, instituteName = "Edvantage Academy" }, ref) => {
    const overallColor = getPerformanceColor(student.overallAverage);
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const trendLabel =
      student.trend === "up" ? "↑ Improving" : student.trend === "down" ? "↓ Declining" : "→ Stable";

    return (
      <div
        ref={ref}
        style={{
          width: 794, // A4 at 96dpi
          padding: 40,
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          backgroundColor: "#ffffff",
          color: "#1a1a2e",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, borderBottom: "3px solid #6366f1", paddingBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#1a1a2e" }}>{instituteName}</h1>
            <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>Academic Performance Report</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Generated on</p>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{dateStr}</p>
          </div>
        </div>

        {/* Student Info */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, backgroundColor: "#f8fafc", borderRadius: 12, padding: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{student.studentName}</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
              {student.rollNumber} · {student.batchName}
            </p>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
              {student.subjectCount} subjects · {student.examsTaken} exams taken
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: student.overallAverage >= 75 ? "#059669" : student.overallAverage >= 50 ? "#0d9488" : student.overallAverage >= 35 ? "#d97706" : "#dc2626",
              }}
            >
              {student.overallAverage}%
            </div>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Overall Average</p>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                margin: "2px 0 0",
                color: student.trend === "up" ? "#059669" : student.trend === "down" ? "#dc2626" : "#64748b",
              }}
            >
              {trendLabel}
            </p>
          </div>
        </div>

        {/* Performance Tier */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {[
              { label: "Mastery", range: "≥75%", color: "#059669", active: student.overallAverage >= 75 },
              { label: "Stable", range: "50-74%", color: "#0d9488", active: student.overallAverage >= 50 && student.overallAverage < 75 },
              { label: "Reinforce", range: "35-49%", color: "#d97706", active: student.overallAverage >= 35 && student.overallAverage < 50 },
              { label: "At Risk", range: "<35%", color: "#dc2626", active: student.overallAverage < 35 },
            ].map((tier) => (
              <div
                key={tier.label}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "6px 0",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: tier.active ? tier.color : "#f1f5f9",
                  color: tier.active ? "#fff" : "#94a3b8",
                }}
              >
                {tier.label} ({tier.range})
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 24 }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Subject</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Teacher</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Average</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Trend</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Exams</th>
              <th style={{ padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Performance</th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((sub, i) => {
              const color =
                sub.average >= 75 ? "#059669" : sub.average >= 50 ? "#0d9488" : sub.average >= 35 ? "#d97706" : "#dc2626";
              const trendStr = sub.trend === "up" ? "↑" : sub.trend === "down" ? "↓" : "→";
              return (
                <tr key={sub.subjectName} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: `hsl(${sub.subjectColor})`,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontWeight: 600 }}>{sub.subjectName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#64748b", fontSize: 12 }}>{sub.teacherName}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, color }}>{sub.average}%</td>
                  <td
                    style={{
                      padding: "10px 12px",
                      textAlign: "center",
                      fontWeight: 600,
                      color: sub.trend === "up" ? "#059669" : sub.trend === "down" ? "#dc2626" : "#64748b",
                    }}
                  >
                    {trendStr}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#64748b" }}>{sub.examCount}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ width: "100%", height: 8, backgroundColor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${sub.average}%`, height: "100%", backgroundColor: color, borderRadius: 4 }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8" }}>
          <span>This is a computer-generated report. No signature required.</span>
          <span>{instituteName} — Confidential</span>
        </div>
      </div>
    );
  }
);

StudentReportCard.displayName = "StudentReportCard";
export default StudentReportCard;
