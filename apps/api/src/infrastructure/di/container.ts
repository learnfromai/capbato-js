import 'reflect-metadata';
import { container } from 'tsyringe';
import { InMemoryTodoRepository } from '../todo/persistence/in-memory/InMemoryTodoRepository';
import { SqliteTodoRepository } from '../todo/persistence/sqlite/SqliteTodoRepository';
import { TypeOrmTodoRepository } from '../todo/persistence/typeorm/TypeOrmTodoRepository';
import { MongooseTodoRepository } from '../todo/persistence/mongoose/MongooseTodoRepository';
import { InMemoryUserRepository, SqliteUserRepository, TypeOrmUserRepository, MongooseUserRepository } from '../user/persistence';
import { InMemoryPatientRepository } from '../patient/persistence/in-memory/InMemoryPatientRepository';
import { TypeOrmPatientRepository } from '../patient/persistence/typeorm/TypeOrmPatientRepository';
import { InMemoryDoctorRepository } from '../doctor/persistence/in-memory/InMemoryDoctorRepository';
import { TypeOrmDoctorRepository } from '../doctor/persistence/typeorm/TypeOrmDoctorRepository';
import { InMemoryAddressRepository } from '../address/persistence';
import { InMemoryScheduleRepository } from '../schedule/persistence/in-memory/InMemoryScheduleRepository';
import { TypeOrmScheduleRepository } from '../schedule/persistence/typeorm/TypeOrmScheduleRepository';
import { SqliteScheduleRepository } from '../schedule/persistence/sqlite/SqliteScheduleRepository';
import { MongooseScheduleRepository } from '../schedule/persistence/mongoose/MongooseScheduleRepository';
import { InMemoryAppointmentRepository } from '../appointment/persistence/in-memory/InMemoryAppointmentRepository';
import { TypeOrmAppointmentRepository } from '../appointment/persistence/typeorm/TypeOrmAppointmentRepository';
import {
  CreateTodoUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
  ToggleTodoUseCase,
  GetAllTodosQueryHandler,
  GetActiveTodosQueryHandler,
  GetCompletedTodosQueryHandler,
  GetTodoByIdQueryHandler,
  GetTodoStatsQueryHandler,
  CreatePatientUseCase,
  GetAllPatientsQueryHandler,
  GetPatientByIdQueryHandler,
  GetPatientStatsQueryHandler,
  PatientNumberService,
  PhoneNumberService,
  AgeCalculationService,
  TOKENS,
  TodoValidationService,
  CreateTodoValidationService,
  UpdateTodoValidationService,
  DeleteTodoValidationService,
  ToggleTodoValidationService,
  UserValidationService,
  RegisterUserValidationService,
  LoginUserValidationService,
  PatientValidationService,
  CreatePatientValidationService,
  GetPatientByIdValidationService,
  DoctorValidationService,
  GetDoctorByIdValidationService,
  GetDoctorsBySpecializationValidationService,
  GetAllProvincesQueryHandler,
  GetCitiesByProvinceCodeQueryHandler,
  GetBarangaysByCityCodeQueryHandler,
  AddressValidationService,
  GetCitiesValidationService,
  GetBarangaysValidationService,
} from '@nx-starter/application-shared';
import {
  CreateScheduleUseCase,
  UpdateScheduleUseCase,
  DeleteScheduleUseCase,
  GetAllSchedulesQueryHandler,
  GetScheduleByIdQueryHandler,
  GetSchedulesByDateQueryHandler,
  GetSchedulesByDoctorQueryHandler,
  GetTodaySchedulesQueryHandler,
  GetTodayDoctorQueryHandler,
  GetScheduleStatsQueryHandler,
  ScheduleValidationService,
  CreateScheduleValidationService,
  UpdateScheduleValidationService,
  DeleteScheduleValidationService,
  GetScheduleByIdValidationService,
  GetSchedulesByDateValidationService,
  GetSchedulesByDoctorValidationService,
} from '@nx-starter/application-shared';
import {
  CreateAppointmentUseCase,
  UpdateAppointmentUseCase,
  DeleteAppointmentUseCase,
  ConfirmAppointmentUseCase,
  CancelAppointmentUseCase,
  RescheduleAppointmentUseCase,
  GetAllAppointmentsQueryHandler,
  GetAppointmentByIdQueryHandler,
  GetAppointmentsByPatientIdQueryHandler,
  GetTodayAppointmentsQueryHandler,
  GetTodayConfirmedAppointmentsQueryHandler,
  GetConfirmedAppointmentsQueryHandler,
  GetWeeklyAppointmentSummaryQueryHandler,
  GetAppointmentStatsQueryHandler,
  AppointmentValidationService,
  CreateAppointmentValidationService,
  UpdateAppointmentValidationService,
  DeleteAppointmentValidationService,
  ConfirmAppointmentValidationService,
  CancelAppointmentValidationService,
  RescheduleAppointmentValidationService,
  GetAppointmentByIdValidationService,
  GetAppointmentsByPatientIdValidationService,
  GetAppointmentsByDateValidationService,
  GetAppointmentsByDateRangeValidationService,
} from '@nx-starter/application-shared';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  ChangeUserPasswordUseCase,
  BcryptPasswordHashingService,
  JwtService,
  JwtConfig,
  GetAllUsersQueryHandler,
  GetDoctorByIdQueryHandler,
  GetDoctorsBySpecializationQueryHandler,
  CreateDoctorProfileCommandHandler,
} from '@nx-starter/application-api';
import {
  GetAllDoctorsQueryHandler,
  GetDoctorByUserIdQueryHandler,
  CheckDoctorProfileExistsQueryHandler,
} from '@nx-starter/application-shared';
import type { ITodoRepository, IUserRepository, IDoctorRepository, IAddressRepository, IScheduleRepository, IAppointmentRepository } from '@nx-starter/domain';
import type { IPatientRepository } from '@nx-starter/application-shared';
import { UserDomainService, AppointmentDomainService } from '@nx-starter/domain';
import { getTypeOrmDataSource } from '../database/connections/TypeOrmConnection';
import { connectMongoDB } from '../database/connections/MongooseConnection';
import { getDatabaseConfig, getSecurityConfig } from '../../config';

// Register dependencies following Clean Architecture layers
export const configureDI = async () => {
  // Infrastructure Layer - Repository (choose based on config)
  const todoRepositoryImplementation = await getTodoRepositoryImplementation();
  container.registerInstance<ITodoRepository>(
    TOKENS.TodoRepository,
    todoRepositoryImplementation
  );

  const userRepositoryImplementation = await getUserRepositoryImplementation();
  container.registerInstance<IUserRepository>(
    TOKENS.UserRepository,
    userRepositoryImplementation
  );

  const patientRepositoryImplementation = await getPatientRepositoryImplementation();
  container.registerInstance<IPatientRepository>(
    TOKENS.PatientRepository,
    patientRepositoryImplementation
  );

  const doctorRepositoryImplementation = await getDoctorRepositoryImplementation();
  container.registerInstance<IDoctorRepository>(
    TOKENS.DoctorRepository,
    doctorRepositoryImplementation
  );

  // Container registration code
  const addressRepositoryImplementation = await getAddressRepositoryImplementation();
  container.registerInstance<IAddressRepository>(
    TOKENS.AddressRepository,
    addressRepositoryImplementation
  );

  const scheduleRepositoryImplementation = await getScheduleRepositoryImplementation();
  container.registerInstance<IScheduleRepository>(
    TOKENS.ScheduleRepository,
    scheduleRepositoryImplementation
  );

  const appointmentRepositoryImplementation = await getAppointmentRepositoryImplementation();
  container.registerInstance<IAppointmentRepository>(
    TOKENS.AppointmentRepository,
    appointmentRepositoryImplementation
  );

  // Infrastructure Layer - Services  
  container.registerSingleton(
    TOKENS.PasswordHashingService,
    BcryptPasswordHashingService
  );
  
  // Register JWT service with configuration
  const securityConfig = getSecurityConfig();
  const jwtConfig: JwtConfig = {
    secret: securityConfig.jwt.secret,
    expiresIn: securityConfig.jwt.expiresIn,
    issuer: securityConfig.jwt.issuer,
    audience: securityConfig.jwt.audience,
  };
  
  container.registerInstance(
    TOKENS.JwtService,
    new JwtService(jwtConfig)
  );

  // Application Layer - Use Cases (Commands)
  container.registerSingleton(TOKENS.CreateTodoUseCase, CreateTodoUseCase);
  container.registerSingleton(TOKENS.UpdateTodoUseCase, UpdateTodoUseCase);
  container.registerSingleton(TOKENS.DeleteTodoUseCase, DeleteTodoUseCase);
  container.registerSingleton(TOKENS.ToggleTodoUseCase, ToggleTodoUseCase);
  container.registerSingleton(TOKENS.RegisterUserUseCase, RegisterUserUseCase);
  container.registerSingleton(TOKENS.LoginUserUseCase, LoginUserUseCase);
  container.registerSingleton(TOKENS.ChangeUserPasswordUseCase, ChangeUserPasswordUseCase);
  container.registerSingleton(TOKENS.CreatePatientUseCase, CreatePatientUseCase);
  container.registerSingleton(TOKENS.CreateDoctorProfileCommandHandler, CreateDoctorProfileCommandHandler);

  // Schedule Use Cases
  container.registerSingleton(TOKENS.CreateScheduleUseCase, CreateScheduleUseCase);
  container.registerSingleton(TOKENS.UpdateScheduleUseCase, UpdateScheduleUseCase);
  container.registerSingleton(TOKENS.DeleteScheduleUseCase, DeleteScheduleUseCase);

  // Appointment Use Cases
  container.registerSingleton(TOKENS.CreateAppointmentUseCase, CreateAppointmentUseCase);
  container.registerSingleton(TOKENS.UpdateAppointmentUseCase, UpdateAppointmentUseCase);
  container.registerSingleton(TOKENS.DeleteAppointmentUseCase, DeleteAppointmentUseCase);
  container.registerSingleton(TOKENS.ConfirmAppointmentUseCase, ConfirmAppointmentUseCase);
  container.registerSingleton(TOKENS.CancelAppointmentUseCase, CancelAppointmentUseCase);
  container.registerSingleton(TOKENS.RescheduleAppointmentUseCase, RescheduleAppointmentUseCase);

  // Application Layer - Use Cases (Queries)
  container.registerSingleton(
    TOKENS.GetAllTodosQueryHandler,
    GetAllTodosQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetAllUsersQueryHandler,
    GetAllUsersQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetActiveTodosQueryHandler,
    GetActiveTodosQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetCompletedTodosQueryHandler,
    GetCompletedTodosQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetTodoByIdQueryHandler,
    GetTodoByIdQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetTodoStatsQueryHandler,
    GetTodoStatsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetAllPatientsQueryHandler,
    GetAllPatientsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetPatientByIdQueryHandler,
    GetPatientByIdQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetPatientStatsQueryHandler,
    GetPatientStatsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetAllDoctorsQueryHandler,
    GetAllDoctorsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetDoctorByIdQueryHandler,
    GetDoctorByIdQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetDoctorsBySpecializationQueryHandler,
    GetDoctorsBySpecializationQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetDoctorByUserIdQueryHandler,
    GetDoctorByUserIdQueryHandler
  );
  container.registerSingleton(
    TOKENS.CheckDoctorProfileExistsQueryHandler,
    CheckDoctorProfileExistsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetAllProvincesQueryHandler,
    GetAllProvincesQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetCitiesByProvinceCodeQueryHandler,
    GetCitiesByProvinceCodeQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetBarangaysByCityCodeQueryHandler,
    GetBarangaysByCityCodeQueryHandler
  );

  // Schedule Query Handlers
  container.registerSingleton(TOKENS.GetAllSchedulesQueryHandler, GetAllSchedulesQueryHandler);
  container.registerSingleton(TOKENS.GetScheduleByIdQueryHandler, GetScheduleByIdQueryHandler);
  container.registerSingleton(TOKENS.GetSchedulesByDateQueryHandler, GetSchedulesByDateQueryHandler);
  container.registerSingleton(TOKENS.GetSchedulesByDoctorQueryHandler, GetSchedulesByDoctorQueryHandler);
  container.registerSingleton(TOKENS.GetTodaySchedulesQueryHandler, GetTodaySchedulesQueryHandler);
  container.registerSingleton(TOKENS.GetTodayDoctorQueryHandler, GetTodayDoctorQueryHandler);
  container.registerSingleton(TOKENS.GetScheduleStatsQueryHandler, GetScheduleStatsQueryHandler);

  // Appointment Query Handlers
  container.registerSingleton(TOKENS.GetAllAppointmentsQueryHandler, GetAllAppointmentsQueryHandler);
  container.registerSingleton(TOKENS.GetAppointmentByIdQueryHandler, GetAppointmentByIdQueryHandler);
  container.registerSingleton(TOKENS.GetAppointmentsByPatientIdQueryHandler, GetAppointmentsByPatientIdQueryHandler);
  container.registerSingleton(TOKENS.GetTodayAppointmentsQueryHandler, GetTodayAppointmentsQueryHandler);
  container.registerSingleton(TOKENS.GetTodayConfirmedAppointmentsQueryHandler, GetTodayConfirmedAppointmentsQueryHandler);
  container.registerSingleton(TOKENS.GetConfirmedAppointmentsQueryHandler, GetConfirmedAppointmentsQueryHandler);
  container.registerSingleton(TOKENS.GetWeeklyAppointmentSummaryQueryHandler, GetWeeklyAppointmentSummaryQueryHandler);
  container.registerSingleton(TOKENS.GetAppointmentStatsQueryHandler, GetAppointmentStatsQueryHandler);

  // Application Layer - Validation Services
  container.registerSingleton(
    TOKENS.CreateTodoValidationService,
    CreateTodoValidationService
  );
  container.registerSingleton(
    TOKENS.UpdateTodoValidationService,
    UpdateTodoValidationService
  );
  container.registerSingleton(
    TOKENS.DeleteTodoValidationService,
    DeleteTodoValidationService
  );
  container.registerSingleton(
    TOKENS.ToggleTodoValidationService,
    ToggleTodoValidationService
  );
  container.registerSingleton(
    TOKENS.TodoValidationService,
    TodoValidationService
  );
  container.registerSingleton(
    TOKENS.RegisterUserValidationService,
    RegisterUserValidationService
  );
  container.registerSingleton(
    TOKENS.LoginUserValidationService,
    LoginUserValidationService
  );
  container.registerSingleton(
    TOKENS.UserValidationService,
    UserValidationService
  );
  container.registerSingleton(
    TOKENS.CreatePatientValidationService,
    CreatePatientValidationService
  );
  container.registerSingleton(
    TOKENS.GetPatientByIdValidationService,
    GetPatientByIdValidationService
  );
  container.registerSingleton(
    TOKENS.PatientValidationService,
    PatientValidationService
  );
  container.registerSingleton(
    TOKENS.GetDoctorByIdValidationService,
    GetDoctorByIdValidationService
  );
  container.registerSingleton(
    TOKENS.GetDoctorsBySpecializationValidationService,
    GetDoctorsBySpecializationValidationService
  );
  container.registerSingleton(
    TOKENS.DoctorValidationService,
    DoctorValidationService
  );
  container.registerSingleton(
    TOKENS.GetCitiesValidationService,
    GetCitiesValidationService
  );
  container.registerSingleton(
    TOKENS.GetBarangaysValidationService,
    GetBarangaysValidationService
  );
  container.registerSingleton(
    TOKENS.AddressValidationService,
    AddressValidationService
  );

  // Schedule Validation Services
  container.registerSingleton(TOKENS.CreateScheduleValidationService, CreateScheduleValidationService);
  container.registerSingleton(TOKENS.UpdateScheduleValidationService, UpdateScheduleValidationService);
  container.registerSingleton(TOKENS.DeleteScheduleValidationService, DeleteScheduleValidationService);
  container.registerSingleton(TOKENS.GetScheduleByIdValidationService, GetScheduleByIdValidationService);
  container.registerSingleton(TOKENS.GetSchedulesByDateValidationService, GetSchedulesByDateValidationService);
  container.registerSingleton(TOKENS.GetSchedulesByDoctorValidationService, GetSchedulesByDoctorValidationService);
  container.registerSingleton(TOKENS.ScheduleValidationService, ScheduleValidationService);

  // Appointment Validation Services
  container.registerSingleton(TOKENS.CreateAppointmentValidationService, CreateAppointmentValidationService);
  container.registerSingleton(TOKENS.UpdateAppointmentValidationService, UpdateAppointmentValidationService);
  container.registerSingleton(TOKENS.DeleteAppointmentValidationService, DeleteAppointmentValidationService);
  container.registerSingleton(TOKENS.ConfirmAppointmentValidationService, ConfirmAppointmentValidationService);
  container.registerSingleton(TOKENS.CancelAppointmentValidationService, CancelAppointmentValidationService);
  container.registerSingleton(TOKENS.RescheduleAppointmentValidationService, RescheduleAppointmentValidationService);
  container.registerSingleton(TOKENS.GetAppointmentByIdValidationService, GetAppointmentByIdValidationService);
  container.registerSingleton(TOKENS.GetAppointmentsByPatientIdValidationService, GetAppointmentsByPatientIdValidationService);
  container.registerSingleton(TOKENS.GetAppointmentsByDateValidationService, GetAppointmentsByDateValidationService);
  container.registerSingleton(TOKENS.GetAppointmentsByDateRangeValidationService, GetAppointmentsByDateRangeValidationService);
  container.registerSingleton(TOKENS.AppointmentValidationService, AppointmentValidationService);

  // Domain Layer - Domain Services
  // UserDomainService is instantiated manually in use cases (Clean Architecture best practice)
  container.registerSingleton(TOKENS.PatientNumberService, PatientNumberService);
  container.registerSingleton(TOKENS.PhoneNumberService, PhoneNumberService);
  container.registerSingleton(TOKENS.AgeCalculationService, AgeCalculationService);
  container.registerSingleton(TOKENS.AppointmentDomainService, AppointmentDomainService);
};

async function getTodoRepositoryImplementation(): Promise<ITodoRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using ${ormType} ORM with ${dbType} database`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory repository');
    return new InMemoryTodoRepository();
  }

  // Handle MongoDB (always uses Mongoose)
  if (dbType === 'mongodb') {
    await connectMongoDB();
    console.log('📦 Using Mongoose repository with MongoDB');
    return new MongooseTodoRepository();
  }

  // Handle SQL databases with different ORMs
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM repository with ${dbType}`);
      return new TypeOrmTodoRepository(dataSource);
    }


    case 'native':
    default: {
      if (dbType === 'sqlite') {
        console.log('📦 Using native SQLite repository');
        return new SqliteTodoRepository();
      }

      // For other databases without native support, default to TypeORM
      console.log(
        `📦 No native support for ${dbType}, falling back to TypeORM`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmTodoRepository(dataSource);
    }
  }
}

async function getUserRepositoryImplementation(): Promise<IUserRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using ${ormType} ORM with ${dbType} database for User repository`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory user repository');
    return new InMemoryUserRepository();
  }

  // Handle MongoDB (always uses Mongoose)
  if (dbType === 'mongodb') {
    await connectMongoDB();
    console.log('📦 Using Mongoose user repository with MongoDB');
    return new MongooseUserRepository();
  }

  // Handle SQL databases with different ORMs
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM user repository with ${dbType}`);
      return new TypeOrmUserRepository(dataSource);
    }

    case 'native':
    default: {
      if (dbType === 'sqlite') {
        console.log('📦 Using native SQLite user repository');
        return new SqliteUserRepository();
      }

      // For other databases without native support, default to TypeORM
      console.log(
        `📦 No native support for ${dbType}, falling back to TypeORM for user repository`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmUserRepository(dataSource);
    }
  }
}

async function getPatientRepositoryImplementation(): Promise<IPatientRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using ${ormType} ORM with ${dbType} database for Patient repository`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory patient repository');
    return new InMemoryPatientRepository();
  }

  // Handle SQL databases with TypeORM (Patient only supports TypeORM and in-memory)
  // MongoDB support can be added later if needed
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM patient repository with ${dbType}`);
      return new TypeOrmPatientRepository(dataSource);
    }

    case 'native':
    default: {
      // For Patient repository, we only support TypeORM and in-memory
      // Default to TypeORM for all SQL databases
      console.log(
        `📦 Patient repository only supports TypeORM and in-memory. Using TypeORM with ${dbType}`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmPatientRepository(dataSource);
    }
  }
}

async function getDoctorRepositoryImplementation(): Promise<IDoctorRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using Doctor repository: ${ormType} ORM with ${dbType} database`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory doctor repository');
    return new InMemoryDoctorRepository();
  }

  // Handle SQL databases with TypeORM (Doctor supports TypeORM and in-memory like Patient)
  // MongoDB support can be added later if needed
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM doctor repository with ${dbType}`);
      return new TypeOrmDoctorRepository(dataSource);
    }

    case 'native':
    default: {
      // For Doctor repository, we only support TypeORM and in-memory
      // Default to TypeORM for all SQL databases
      console.log(
        `📦 Doctor repository only supports TypeORM and in-memory. Using TypeORM with ${dbType}`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmDoctorRepository(dataSource);
    }
  }
}

async function getAddressRepositoryImplementation(): Promise<IAddressRepository> {
  // Address data is static JSON, so we always use in-memory implementation
  console.log('📦 Using in-memory address repository with Philippine data');
  return new InMemoryAddressRepository();
}

async function getScheduleRepositoryImplementation(): Promise<IScheduleRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using Schedule repository: ${ormType} ORM with ${dbType} database`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory schedule repository');
    return new InMemoryScheduleRepository();
  }

  // Handle MongoDB (always uses Mongoose)
  if (dbType === 'mongodb') {
    await connectMongoDB();
    console.log('📦 Using Mongoose schedule repository with MongoDB');
    return new MongooseScheduleRepository();
  }

  // Handle SQL databases with different ORMs
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM schedule repository with ${dbType}`);
      return new TypeOrmScheduleRepository(dataSource);
    }

    case 'native':
    default: {
      if (dbType === 'sqlite') {
        console.log('📦 Using native SQLite schedule repository');
        return new SqliteScheduleRepository();
      }

      // For other databases without native support, default to TypeORM
      console.log(
        `📦 No native support for ${dbType}, falling back to TypeORM for schedule repository`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmScheduleRepository(dataSource);
    }
  }
}

async function getAppointmentRepositoryImplementation(): Promise<IAppointmentRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using Appointment repository: ${ormType} ORM with ${dbType} database`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    return new InMemoryAppointmentRepository();
  }

  // For other databases, prefer TypeORM unless specified otherwise
  if (ormType === 'typeorm' || ormType === 'native') {
    const dataSource = await getTypeOrmDataSource();
    return new TypeOrmAppointmentRepository(dataSource);
  }

  // Default to in-memory for unsupported combinations
  console.log(
    `📦 Unsupported combination ${ormType}+${dbType}, falling back to in-memory appointment repository`
  );
  return new InMemoryAppointmentRepository();
}

// Export container and tokens for use in controllers
export { container, TOKENS };
