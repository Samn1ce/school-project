"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabaseServer } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper function to calculate time until an event
function getTimeUntil(eventDate: string): string {
  const now = new Date();
  const event = new Date(eventDate);
  const diff = event.getTime() - now.getTime();

  if (diff < 0) {
    return "This event has already passed";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `in ${days} day${days > 1 ? "s" : ""}, ${hours} hour${
      hours > 1 ? "s" : ""
    }`;
  } else if (hours > 0) {
    return `in ${hours} hour${hours > 1 ? "s" : ""}, ${minutes} minute${
      minutes > 1 ? "s" : ""
    }`;
  } else {
    return `in ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
}

export async function askGemini(message: string, userId: string) {
  try {
    const supabase = await getSupabaseServer();

    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: events } = await supabase
      .from("academic_events")
      .select("*")
      .order("event_date", { ascending: true });

    const scopeCheckModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const scopeCheckPrompt = `You are a scope checker for a school database assistant.

The assistant can ONLY answer questions about:
- Academic events (exams, tests, assignments, deadlines, project submissions)
- Student information (name, department, level, matric number)
- Schedule and calendar
- Upcoming events and dates
- Study tips or academic advice
- Greetings e.g if a user sends "hello" you can respond with something like "hello 'student_name' how are you doing today, what aspect of your studies can i help you with". Just be crative with it

The assistant CANNOT answer:
- General knowledge questions
- Homework help or explanations
- Questions outside school related purpose

Analyze this student question: "${message}"

Respond with ONLY one word:
- "IN_SCOPE" if the question is about database information
- "OUT_OF_SCOPE" if it's a general question

Your response:`;

    const scopeResult = await scopeCheckModel.generateContent(scopeCheckPrompt);
    const scopeDecision = scopeResult.response.text().trim().toUpperCase();

    if (scopeDecision.includes("OUT_OF_SCOPE")) {
      return {
        success: true,
        message:
          "I'm sorry, but I'm specifically designed to help you with your academic schedule, events, and student information from your database.\n\nFor general questions, homework help, or academic explanations, please visit:\n🔗 https://gemini.google.com",
        outOfScope: true,
      };
    }

    let databaseContext = `STUDENT INFORMATION:
- Name: ${student?.full_name}
- Department: ${student?.department}
- Level: ${student?.level}
- Matric Number: ${student?.matric_number}

ACADEMIC EVENTS:`;

    if (events && events.length > 0) {
      events.forEach((event: any, index: number) => {
        const timeUntil = getTimeUntil(event.event_date);
        const eventDate = new Date(event.event_date);
        const formattedDate = eventDate.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        databaseContext += `
        ${index + 1}. ${event.title}
          - Date: ${formattedDate}
          - Time Until: ${timeUntil}
          - Location: ${event.location || "Not specified"}
          - Description: ${event.description || "No description"}`;
      });
    } else {
      databaseContext += "\nNo upcoming events scheduled.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful academic assistant with access to a student's database.

Your role is STRICTLY LIMITED to:
- Answering questions about the student's academic events and schedule
- Providing information from the student's profile
- Helping with event planning and reminders
- Upcoming events and dates
- Study tips or academic advice

${databaseContext}

IMPORTANT RULES:
1. ONLY use information from the database context above
2. Be conversational and helpful
3. When mentioning events, include the time until the event
4. If asked about study materials or help with the subject, offer to help with a "quick recap" (even if materials aren't uploaded yet)
5. Format dates in a friendly way
6. Use natural language for time calculations
7. Be encouraging and supportive

Student's question: ${message}

Provide a helpful, conversational response:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return {
      success: true,
      message: response,
      outOfScope: false,
    };
  } catch (error: any) {
    console.error("❌ Error:", error);

    return {
      success: false,
      message: "Sorry, I encountered an error. Please try again.",
      error: error.message,
    };
  }
}
