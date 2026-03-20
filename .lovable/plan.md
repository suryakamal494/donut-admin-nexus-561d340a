

## Plan: Add "Before You Begin" Section

**What:** Insert a new section between the title/intro line (line 3) and the first content section (line 7) containing:

1. **Domain Glossary** — Plain-language definitions for terms a new joiner won't know:
   - Curriculum (CBSE, ICSE, State Board), Course (JEE, NEET, Olympiad), Class, Subject, Chapter, Topic, Batch, Track, Content Classification, Course-Owned vs Mapped chapters, Learning DNA

2. **UI Location Reference Table** — Maps each feature mentioned in scenarios to its exact sidebar/navigation location:
   | Feature | Portal | Navigation Path |
   |---------|--------|----------------|
   | Batch Management | Institute | Sidebar → Batches |
   | Teacher Management | Institute | Sidebar → Teachers |
   | Master Data | Institute | Sidebar → Master Data |
   | Create Test | Teacher | Sidebar → Exams → Create |
   | Question Bank | SuperAdmin / Teacher | Sidebar → Question Bank |
   | Content Library | SuperAdmin / Teacher | Sidebar → Content Library |
   | Student Dashboard | Student | Home → My Subjects |
   | Curriculum Management | SuperAdmin | Sidebar → Master Data → Curriculum tab |
   | Course Management | SuperAdmin | Sidebar → Master Data → Courses tab |

3. **Prerequisites callout** — A short note telling new joiners to have test accounts ready for each portal (SuperAdmin, Institute, Teacher, Student) and to read the Master Data docs first.

**File:** `docs/06-testing-scenarios/inter-login-tests/curriculum-scope-qa.md` — insert after line 5, before "How the Platform Links Everything Together." No existing scenarios are modified.

