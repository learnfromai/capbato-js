// DI Container tokens following Clean Architecture layers
export const TOKENS = {
  // Infrastructure Layer - HTTP and API Services
  HttpClient: 'IHttpClient',
  TodoApiService: 'ITodoApiService',
  AuthApiService: 'IAuthApiService',
  PatientApiService: 'IPatientApiService',
  UserApiService: 'IUserApiService',
  
  // Infrastructure Layer - Repositories
  TodoRepository: 'ITodoRepository',
  UserRepository: 'IUserRepository',
  PatientRepository: 'IPatientRepository',
  DoctorRepository: 'IDoctorRepository',
  ScheduleRepository: 'IScheduleRepository',

  // Infrastructure Layer - Services
  PasswordHashingService: 'IPasswordHashingService',
  JwtService: 'IJwtService',

  // Application Layer - CQRS Services (Interface-based for cleaner injection)
  TodoCommandService: 'ITodoCommandService',
  TodoQueryService: 'ITodoQueryService',
  AuthCommandService: 'IAuthCommandService',
  AuthQueryService: 'IAuthQueryService',
  PatientCommandService: 'IPatientCommandService',
  PatientQueryService: 'IPatientQueryService',
  UserQueryService: 'IUserQueryService',

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
  CreateScheduleUseCase: 'CreateScheduleUseCase',
  UpdateScheduleUseCase: 'UpdateScheduleUseCase',
  DeleteScheduleUseCase: 'DeleteScheduleUseCase',

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
  GetAllSchedulesQueryHandler: 'GetAllSchedulesQueryHandler',
  GetScheduleByIdQueryHandler: 'GetScheduleByIdQueryHandler',
  GetSchedulesByDateQueryHandler: 'GetSchedulesByDateQueryHandler',
  GetSchedulesByDoctorQueryHandler: 'GetSchedulesByDoctorQueryHandler',
  GetTodaySchedulesQueryHandler: 'GetTodaySchedulesQueryHandler',
  GetTodayDoctorQueryHandler: 'GetTodayDoctorQueryHandler',
  GetScheduleStatsQueryHandler: 'GetScheduleStatsQueryHandler',

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
  GetSchedulesByDateValidationService: 'GetSchedulesByDateValidationService',
  GetSchedulesByDoctorValidationService: 'GetSchedulesByDoctorValidationService',
  ScheduleValidationService: 'ScheduleValidationService',
} as const;

// Type-safe token keys
export type TokenKey = keyof typeof TOKENS;
