"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// This generates ALL mock data for a new student
export async function populateMockData(userId: string) {
  try {
    console.log("🎓 Starting comprehensive mock data generation for:", userId);

    const supabase = await getSupabaseServer();

    // Step 1: Get student's info
    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", userId)
      .single();

    if (!student) {
      return { success: false, message: "Student not found" };
    }

    console.log(`👨‍🎓 Student: ${student.full_name}`);
    console.log(
      `📚 Department: ${student.department}, Level: ${student.level}`
    );

    // Step 2: Ask Gemini to generate EVERYTHING in one call
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are generating realistic academic data for a Nigerian university student.

STUDENT INFO:
- Department: ${student.department}
- Level: ${student.level}
- Current Semester: First Semester (assume it's currently September)

CONTEXT - Nigerian University System:
- 200 Level = Second Year
- Courses have codes like: BIO 201, CHM 202, PHY 201, GST 201
- First digit = Level (2 for 200L)
- Second digit = Semester (0 for both, 1 for first, 2 for second)
- Students typically take 8-12 courses per semester
- Each course has 2-4 contact hours per week
- Mix of core courses, electives, and general studies

Generate realistic Nigerian university data with:

1. COURSES (8-10 courses for ${student.department} ${student.level} student)
   - Core department courses
   - Related science courses (if science department)
   - General Studies courses (GST)
   - Use proper Nigerian course codes

2. WEEKLY SCHEDULE (for each course)
   - Lectures (1-2 per week)
   - Practicals/Labs (if applicable)
   - Tutorials (if applicable)
   - Realistic times: 8am-5pm, Mon-Fri
   - Realistic venues: LT1, Lab 3, Hall A, etc.

3. ACADEMIC EVENTS (8-12 events over next 3 months)
   - Tests (CATs - Continuous Assessment Tests)
   - Assignments and submissions
   - Practicals
   - Mid-semester exams
   - Project deadlines
   - All dates must be FUTURE dates (after ${new Date().toISOString()})

Return ONLY valid JSON, no markdown, no backticks, no extra text.
Format EXACTLY like this:

{
  "courses": [
    {
      "course_code": "BIO 201",
      "course_title": "Cell Biology",
      "department": "${student.department}",
      "level": "${student.level}",
      "semester": "First Semester"
    }
  ],
  "schedules": [
    {
      "course_code": "BIO 201",
      "title": "Cell Biology Lecture",
      "description": "Introduction to cell structure and function",
      "activity_type": "Lecture",
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "11:00",
      "venue": "LT2",
      "semester": "First Semester"
    }
  ],
  "academic_events": [
    {
      "title": "BIO 201 CAT 1",
      "description": "First continuous assessment test covering topics 1-4",
      "start_date": "2026-03-15",
      "end_date": "2026-03-15"
    }
  ]
}`;

    console.log("🤖 Asking Gemini to generate comprehensive data...");

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log(
      "📝 Raw response received (first 200 chars):",
      responseText.substring(0, 200)
    );

    // Step 3: Clean and parse JSON
    const cleanedResponse = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const mockData = JSON.parse(cleanedResponse);

    console.log("✅ Parsed data:");
    console.log(`   - ${mockData.courses?.length || 0} courses`);
    console.log(`   - ${mockData.schedules?.length || 0} schedule items`);
    console.log(`   - ${mockData.academic_events?.length || 0} events`);

    // Step 4: Insert courses first (we need their IDs for other tables)
    console.log("📚 Inserting courses...");

    const { data: insertedCourses, error: coursesError } = await supabase
      .from("courses")
      .insert(mockData.courses)
      .select(); // ← This returns the inserted courses with their IDs

    if (coursesError) {
      console.error("❌ Courses error:", coursesError);
      return {
        success: false,
        message: "Failed to insert courses: " + coursesError.message,
      };
    }

    console.log(`✅ Inserted ${insertedCourses.length} courses`);

    // Step 5: Create a map of course_code → course_id
    // So we can link schedules to the right course
    const courseMap = new Map<string, number>();
    insertedCourses.forEach((course: any) => {
      courseMap.set(course.course_code, course.id);
    });

    // Step 6: Link student to all their courses
    console.log("🔗 Linking student to courses...");

    const studentCourses = insertedCourses.map((course: any) => ({
      student_id: userId,
      course_id: course.id,
    }));

    const { error: studentCoursesError } = await supabase
      .from("student_courses")
      .insert(studentCourses);

    if (studentCoursesError) {
      console.error("❌ Student courses error:", studentCoursesError);
    } else {
      console.log(`✅ Linked student to ${studentCourses.length} courses`);
    }

    // Step 7: Insert schedules with proper course_id foreign keys
    console.log("📅 Inserting schedules...");

    // Calculate next occurrence of each day for the schedule
    const getNextDate = (dayOfWeek: string): string => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const today = new Date();
      const targetDay = days.indexOf(dayOfWeek);
      const currentDay = today.getDay();

      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7; // Get next occurrence

      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysToAdd);

      return nextDate.toISOString().split("T")[0]; // Return YYYY-MM-DD
    };

    const schedulesWithDetails = mockData.schedules.map((schedule: any) => {
      const courseId = courseMap.get(schedule.course_code);

      if (!courseId) {
        console.warn(`⚠️ Course ${schedule.course_code} not found in map`);
      }

      // Create full datetime for start and end times
      const scheduleDate = getNextDate(schedule.day_of_week);

      return {
        student_id: userId,
        course_id: courseId,
        title: schedule.title,
        description: schedule.description,
        activity_type: schedule.activity_type,
        start_time: `${scheduleDate} ${schedule.start_time}:00`, // "2026-03-10 09:00:00"
        end_time: `${scheduleDate} ${schedule.end_time}:00`,
        venue: schedule.venue,
        date: scheduleDate,
        semester: schedule.semester,
      };
    });

    const { error: schedulesError } = await supabase
      .from("schedules")
      .insert(schedulesWithDetails);

    if (schedulesError) {
      console.error("❌ Schedules error:", schedulesError);
    } else {
      console.log(`✅ Inserted ${schedulesWithDetails.length} schedule items`);
    }

    // Step 8: Insert academic events
    console.log("📆 Inserting academic events...");

    const eventsWithStudentId = mockData.academic_events.map((event: any) => ({
      ...event,
      student_id: userId,
    }));

    const { error: eventsError } = await supabase
      .from("academic_events")
      .insert(eventsWithStudentId);

    if (eventsError) {
      console.error("❌ Events error:", eventsError);
    } else {
      console.log(`✅ Inserted ${eventsWithStudentId.length} academic events`);
    }

    // Step 9: Mark user as no longer new
    await supabase
      .from("students")
      .update({ is_new_user: false })
      .eq("id", userId);

    // Step 10: Refresh the page data
    revalidatePath("/waitingScreen");
    revalidatePath("/dashboard");

    console.log("🎉 Mock data population complete!");

    return {
      success: true,
      message: `Successfully added ${insertedCourses.length} courses, ${schedulesWithDetails.length} schedule items, and ${eventsWithStudentId.length} events!`,
      stats: {
        courses: insertedCourses.length,
        schedules: schedulesWithDetails.length,
        events: eventsWithStudentId.length,
      },
    };
  } catch (error: any) {
    console.error("❌ ERROR:", error);
    return {
      success: false,
      message: "Failed to generate mock data. Please try again.",
      error: error.message,
    };
  }
}

// Dismiss modal without adding data
export async function dismissMockData(userId: string) {
  const supabase = await getSupabaseServer();

  await supabase
    .from("students")
    .update({ is_new_user: false })
    .eq("id", userId);

  revalidatePath("/waitingScreen");
  revalidatePath("/dashboard");

  return { success: true };
}
