// Query DTOs for CQRS pattern

export interface GetAllAppointmentsQuery {
  // No parameters needed for getting all appointments
}

export interface GetAppointmentByIdQuery {
  id: string;
}

export interface GetAppointmentsByPatientIdQuery {
  patientId: string;
}

export interface GetTodayAppointmentsQuery {
  // No parameters needed
}

export interface GetTodayConfirmedAppointmentsQuery {
  // No parameters needed
}

export interface GetConfirmedAppointmentsByDateQuery {
  date: Date;
}

export interface GetWeeklyAppointmentSummaryQuery {
  startDate?: Date;
}

export interface GetAppointmentStatsQuery {
  // No parameters needed for basic stats
}