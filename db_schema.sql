-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.academic_events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  CONSTRAINT academic_events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.courses (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  course_code text NOT NULL,
  course_title text NOT NULL,
  department text NOT NULL,
  level text NOT NULL,
  semester text NOT NULL,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.schedules (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  student_id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  activity_type text NOT NULL,
  start_time timestamp without time zone NOT NULL,
  end_time timestamp without time zone,
  semester text NOT NULL,
  course_id bigint,
  venue text,
  date text,
  CONSTRAINT schedules_pkey PRIMARY KEY (id),
  CONSTRAINT schedules_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT schedules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.student_courses (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  student_id uuid NOT NULL DEFAULT auth.uid(),
  course_id bigint NOT NULL,
  CONSTRAINT student_courses_pkey PRIMARY KEY (id),
  CONSTRAINT student_courses_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT student_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  full_name text NOT NULL DEFAULT ''::text,
  matric_number text NOT NULL DEFAULT ''::text UNIQUE,
  department text NOT NULL DEFAULT ''::text,
  level text NOT NULL DEFAULT ''::text,
  CONSTRAINT students_pkey PRIMARY KEY (id)
);