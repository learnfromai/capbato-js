// DI Container tokens following Clean Architecture layers
export const TOKENS = {
  // Infrastructure Layer - HTTP and API Services
  HttpClient: 'IHttpClient',
  TodoApiService: 'ITodoApiService',
  AuthApiService: 'IAuthApiService',
  PatientApiService: 'IPatientApiService',
  
  // Infrastructure Layer - Repositories
  TodoRepository: 'ITodoRepository',
  UserRepository: 'IUserRepository',
  PatientRepository: 'IPatientRepository',
  DoctorRepository: 'IDoctorRepository',

  // Infrastructure Layer - Services
  PasswordHashingService: 'IPasswordHashingService',
  JwtService: 'IJwtService',

  // Application Layer - CQRS Services (Interface-based for cleaner injection)
  TodoCommandService: 'ITodoCommandService',
  TodoQueryService: 'ITodoQueryService',
  AuthCommandService: 'IAuthCommandService',
  AuthQueryService: 'IAuthQueryService',
  PatientQueryService: 'IPatientQueryService',

  // Application Layer - Use Cases (Commands)
  CreateTodoUseCase: 'CreateTodoUseCase',
  UpdateTodoUseCase: 'UpdateTodoUseCase',
  DeleteTodoUseCase: 'DeleteTodoUseCase',
  ToggleTodoUseCase: 'ToggleTodoUseCase',
  RegisterUserUseCase: 'RegisterUserUseCase',
  LoginUserUseCase: 'LoginUserUseCase',
  ChangeUserPasswordUseCase: 'ChangeUserPasswordUseCase',
  CreatePatientUseCase: 'CreatePatientUseCase',
  CreateDoctorProfileCommandHandler: 'CreateDoctorProfileCommandHandler',

  // Application Layer - Use Cases (Queries)
  GetAllTodosQueryHandler: 'GetAllTodosQueryHandler',
  GetFilteredTodosQueryHandler: 'GetFilteredTodosQueryHandler',
  GetActiveTodosQueryHandler: 'GetActiveTodosQueryHandler',
  GetCompletedTodosQueryHandler: 'GetCompletedTodosQueryHandler',
  GetTodoStatsQueryHandler: 'GetTodoStatsQueryHandler',
  GetTodoByIdQueryHandler: 'GetTodoByIdQueryHandler',
  GetAllUsersQueryHandler: 'GetAllUsersQueryHandler',
  GetAllPatientsQueryHandler: 'GetAllPatientsQueryHandler',
  GetPatientByIdQueryHandler: 'GetPatientByIdQueryHandler',
  GetPatientStatsQueryHandler: 'GetPatientStatsQueryHandler',
  GetAllDoctorsQueryHandler: 'GetAllDoctorsQueryHandler',
  GetDoctorByIdQueryHandler: 'GetDoctorByIdQueryHandler',
  GetDoctorByUserIdQueryHandler: 'GetDoctorByUserIdQueryHandler',
  GetDoctorsBySpecializationQueryHandler: 'GetDoctorsBySpecializationQueryHandler',
  CheckDoctorProfileExistsQueryHandler: 'CheckDoctorProfileExistsQueryHandler',

  // Schedule Use Cases and Query Handlers
  CreateScheduleUseCase: 'CreateScheduleUseCase',
  UpdateScheduleUseCase: 'UpdateScheduleUseCase',
  DeleteScheduleUseCase: 'DeleteScheduleUseCase',
  GetAllSchedulesQueryHandler: 'GetAllSchedulesQueryHandler',
  GetScheduleByIdQueryHandler: 'GetScheduleByIdQueryHandler',
  GetSchedulesByDoctorQueryHandler: 'GetSchedulesByDoctorQueryHandler',
  GetSchedulesByDateQueryHandler: 'GetSchedulesByDateQueryHandler',
  GetTodaysSchedulesQueryHandler: 'GetTodaysSchedulesQueryHandler',
  GetTodaysDoctorQueryHandler: 'GetTodaysDoctorQueryHandler',

  // Infrastructure Layer - Repositories
  ScheduleRepository: 'IScheduleRepository',

  // Domain Layer - Services
  TodoDomainService: 'TodoDomainService',
  UserDomainService: 'UserDomainService',
  PatientNumberService: 'PatientNumberService',
  PhoneNumberService: 'PhoneNumberService',
  AgeCalculationService: 'AgeCalculationService',

  // Application Layer - Validation Services
  CreateTodoValidationService: 'CreateTodoValidationService',
  UpdateTodoValidationService: 'UpdateTodoValidationService', 
  DeleteTodoValidationService: 'DeleteTodoValidationService',
  ToggleTodoValidationService: 'ToggleTodoValidationService',
  TodoValidationService: 'TodoValidationService',
  RegisterUserValidationService: 'RegisterUserValidationService',
  LoginUserValidationService: 'LoginUserValidationService',
  UserValidationService: 'UserValidationService',
  CreatePatientValidationService: 'CreatePatientValidationService',
  GetPatientByIdValidationService: 'GetPatientByIdValidationService',
  PatientValidationService: 'PatientValidationService',
  GetDoctorByIdValidationService: 'GetDoctorByIdValidationService',
  GetDoctorsBySpecializationValidationService: 'GetDoctorsBySpecializationValidationService',
  DoctorValidationService: 'DoctorValidationService',
  CreateScheduleValidationService: 'CreateScheduleValidationService',
  UpdateScheduleValidationService: 'UpdateScheduleValidationService',
  DeleteScheduleValidationService: 'DeleteScheduleValidationService',
  GetScheduleByIdValidationService: 'GetScheduleByIdValidationService',
  ScheduleValidationService: 'ScheduleValidationService',
} as const;

// Type-safe token keys
export type TokenKey = keyof typeof TOKENS;
