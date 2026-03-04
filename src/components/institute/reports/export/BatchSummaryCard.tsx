import { forwardRef } from "react";
import { getPerformanceColor } from "@/lib/reportColors";
import type { SubjectSummary, InstituteStudentSummary } from "@/data/institute/reportsData";

interface BatchSummaryCardProps {
  className: string;
  batchName: string;
  overallAverage: number;
  totalStudents: number;
  totalExams: number;
  subjects: SubjectSummary[];
  students: InstituteStudentSummary[];
  instituteName?: string;
}

const BatchSummaryCard = forwardRef<HTMLDivElement, BatchSummaryCardProps>(
  ({ className, batchName, overallAverage, totalStudents, totalExams, subjects, students, instituteName = "Edvantage Academy" }, ref) => {
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const sorted = [...subjects].sort((a, b) => b.classAverage - a.classAverage);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    const atRiskStudents = students.filter((s) => s.overallAverage < 35);
    const multiRisk = students.filter((s) => s.subjects.filter((sub) => sub.average < 35).length >= 2);

    return (
      <div
        ref={ref}
        style={{
          width: 794,
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
            <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>Batch Performance Summary</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Generated on</p>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{dateStr}</p>
          </div>
        </div>

        {/* Batch Info */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, backgroundColor: "#f8fafc", borderRadius: 12, padding: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              {className} — {batchName}
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
              {totalStudents} students · {subjects.length} subjects · {totalExams} exams
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: overallAverage >= 75 ? "#059669" : overallAverage >= 50 ? "#0d9488" : overallAverage >= 35 ? "#d97706" : "#dc2626",
              }}
            >
              {overallAverage}%
            </div>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Overall Average</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Strongest Subject", value: strongest ? `${strongest.subjectName} (${strongest.classAverage}%)` : "—", color: "#059669" },
            { label: "Weakest Subject", value: weakest ? `${weakest.subjectName} (${weakest.classAverage}%)` : "—", color: "#dc2626" },
            { label: "At-Risk Students", value: `${atRiskStudents.length} students (<35%)`, color: "#d97706" },
            { label: "Multi-Subject Risk", value: `${multiRisk.length} in 2+ subjects`, color: "#dc2626" },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                backgroundColor: "#f8fafc",
                borderLeft: `4px solid ${metric.color}`,
              }}
            >
              <p style={{ fontSize: 10, color: "#64748b", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{metric.label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "4px 0 0", color: "#1a1a2e" }}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Subject Performance Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 24 }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Subject</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Teacher</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Class Avg</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Prev Avg</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Trend</th>
              <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>At Risk</th>
              <th style={{ padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>Performance</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((sub) => {
              const color =
                sub.classAverage >= 75 ? "#059669" : sub.classAverage >= 50 ? "#0d9488" : sub.classAverage >= 35 ? "#d97706" : "#dc2626";
              const diff = sub.classAverage - sub.previousAverage;
              const trendStr = sub.trend === "up" ? `↑ +${Math.abs(diff)}%` : sub.trend === "down" ? `↓ -${Math.abs(diff)}%` : "→ Stable";
              return (
                <tr key={sub.subjectId} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: `hsl(${sub.subjectColor})`, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{sub.subjectName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#64748b", fontSize: 12 }}>{sub.teacherName}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, color }}>{sub.classAverage}%</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#64748b" }}>{sub.previousAverage}%</td>
                  <td
                    style={{
                      padding: "10px 12px",
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: 12,
                      color: sub.trend === "up" ? "#059669" : sub.trend === "down" ? "#dc2626" : "#64748b",
                    }}
                  >
                    {trendStr}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: sub.atRiskCount > 0 ? "#dc2626" : "#64748b", fontWeight: sub.atRiskCount > 0 ? 700 : 400 }}>
                    {sub.atRiskCount}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ width: "100%", height: 8, backgroundColor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${sub.classAverage}%`, height: "100%", backgroundColor: color, borderRadius: 4 }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Student Distribution */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Student Performance Distribution</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "Mastery (≥75%)", count: students.filter((s) => s.overallAverage >= 75).length, color: "#059669" },
              { label: "Stable (50-74%)", count: students.filter((s) => s.overallAverage >= 50 && s.overallAverage < 75).length, color: "#0d9488" },
              { label: "Reinforce (35-49%)", count: students.filter((s) => s.overallAverage >= 35 && s.overallAverage < 50).length, color: "#d97706" },
              { label: "At Risk (<35%)", count: students.filter((s) => s.overallAverage < 35).length, color: "#dc2626" },
            ].map((bucket) => (
              <div
                key={bucket.label}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "12px 8px",
                  borderRadius: 8,
                  backgroundColor: bucket.color + "10",
                  border: `1px solid ${bucket.color}30`,
                }}
              >
                <p style={{ fontSize: 24, fontWeight: 800, color: bucket.color, margin: 0 }}>{bucket.count}</p>
                <p style={{ fontSize: 10, color: "#64748b", margin: "2px 0 0" }}>{bucket.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8" }}>
          <span>This is a computer-generated report. No signature required.</span>
          <span>{instituteName} — Confidential</span>
        </div>
      </div>
    );
  }
);

BatchSummaryCard.displayName = "BatchSummaryCard";
export default BatchSummaryCard;
