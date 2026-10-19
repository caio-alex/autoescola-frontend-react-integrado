export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export type CnhCategory = 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';

export type LessonStatus =
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELED_BY_STUDENT'
  | 'CANCELED_BY_SCHOOL'
  | 'NO_SHOW';

export type VehicleStatus = 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';

export interface UserSummary {
  id: string;
  profileId: string | null;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserSummary;
}

export interface Lesson {
  id: string;
  startTime: string;
  endTime: string;
  status: LessonStatus;
  studentId: string;
  studentName: string;
  instructorId: string;
  instructorName: string;
  vehicleId: string;
  vehicleModel: string;
  vehiclePlate: string;
  performanceScore?: number | null;
  instructorNotes?: string | null;
}

export interface AvailableInstructorVehicle {
  instructorId: string;
  instructorName: string;
  instructorRating: number;
  vehicleId: string;
  vehicleModel: string;
  transmission: string;
}

export interface AvailableSlot {
  timeSlot: string;
  startTime: string;
  isAvailable: boolean;
  availableOptions: AvailableInstructorVehicle[];
}

export interface StudentDashboardData {
  studentId: string;
  name: string;
  desiredCategory: CnhCategory;
  medicalExamApproved: boolean;
  theoreticalCourseCompleted: boolean;
  completedPracticalLessons: number;
  requiredPracticalLessons: number;
  progressPercentage: number;
  readyForPracticalExam: boolean;
  nextUpcomingLesson: Lesson | null;
}

export interface AdminDashboardKpi {
  totalStudents: number;
  activeInstructors: number;
  activeVehicles: number;
  vehiclesInMaintenance: number;
  lessonsScheduledToday: number;
  completedLessonsToday: number;
  studentsReadyForExam: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  transmission: string;
  category: CnhCategory;
  status: VehicleStatus;
}
