import { injectable, inject } from 'tsyringe';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
} from 'routing-controllers';
import {
  CreateAppointmentUseCase,
  UpdateAppointmentUseCase,
  CancelAppointmentUseCase,
  ConfirmAppointmentUseCase,
  DeleteAppointmentUseCase,
  GetAllAppointmentsQueryHandler,
  GetAppointmentByIdQueryHandler,
  GetAppointmentsByPatientIdQueryHandler,
  GetTodayAppointmentsQueryHandler,
  GetTodayConfirmedAppointmentsQueryHandler,
  GetWeeklyAppointmentSummaryQueryHandler,
  AppointmentMapper,
  TOKENS,
  AppointmentValidationService,
  AppointmentIdSchema,
} from '@nx-starter/application-shared';
import {
  AppointmentListResponse,
  AppointmentResponse,
  AppointmentOperationResponse,
  CreateAppointmentRequestDto,
  UpdateAppointmentRequestDto,
  WeeklyAppointmentSummaryResponse,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

/**
 * REST API Controller for Appointment operations
 * Follows Clean Architecture - Controllers are part of the presentation layer
 */
@Controller('/appointments')
@injectable()
export class AppointmentController {
  constructor(
    @inject(TOKENS.CreateAppointmentUseCase)
    private createAppointmentUseCase: CreateAppointmentUseCase,
    @inject(TOKENS.UpdateAppointmentUseCase)
    private updateAppointmentUseCase: UpdateAppointmentUseCase,
    @inject(TOKENS.CancelAppointmentUseCase)
    private cancelAppointmentUseCase: CancelAppointmentUseCase,
    @inject(TOKENS.ConfirmAppointmentUseCase)
    private confirmAppointmentUseCase: ConfirmAppointmentUseCase,
    @inject(TOKENS.DeleteAppointmentUseCase)
    private deleteAppointmentUseCase: DeleteAppointmentUseCase,
    @inject(TOKENS.GetAllAppointmentsQueryHandler)
    private getAllAppointmentsQueryHandler: GetAllAppointmentsQueryHandler,
    @inject(TOKENS.GetAppointmentByIdQueryHandler)
    private getAppointmentByIdQueryHandler: GetAppointmentByIdQueryHandler,
    @inject(TOKENS.GetAppointmentsByPatientIdQueryHandler)
    private getAppointmentsByPatientIdQueryHandler: GetAppointmentsByPatientIdQueryHandler,
    @inject(TOKENS.GetTodayAppointmentsQueryHandler)
    private getTodayAppointmentsQueryHandler: GetTodayAppointmentsQueryHandler,
    @inject(TOKENS.GetTodayConfirmedAppointmentsQueryHandler)
    private getTodayConfirmedAppointmentsQueryHandler: GetTodayConfirmedAppointmentsQueryHandler,
    @inject(TOKENS.GetWeeklyAppointmentSummaryQueryHandler)
    private getWeeklyAppointmentSummaryQueryHandler: GetWeeklyAppointmentSummaryQueryHandler,
    @inject(TOKENS.AppointmentValidationService)
    private validationService: AppointmentValidationService
  ) {}

  /**
   * GET /api/appointments - Get all appointments
   */
  @Get('/')
  async getAllAppointments(): Promise<AppointmentListResponse> {
    const appointments = await this.getAllAppointmentsQueryHandler.execute();
    const appointmentDtos = AppointmentMapper.toDtoArray(appointments);

    return ApiResponseBuilder.success(appointmentDtos);
  }

  /**
   * GET /api/appointments/today - Get today's appointments
   */
  @Get('/today')
  async getTodayAppointments(): Promise<AppointmentListResponse> {
    const appointments = await this.getTodayAppointmentsQueryHandler.execute();
    const appointmentDtos = AppointmentMapper.toDtoArray(appointments);

    return ApiResponseBuilder.success(appointmentDtos);
  }

  /**
   * GET /api/appointments/today/confirmed - Get today's confirmed appointments
   */
  @Get('/today/confirmed')
  async getTodayConfirmedAppointments(): Promise<AppointmentListResponse> {
    const appointments = await this.getTodayConfirmedAppointmentsQueryHandler.execute();
    const appointmentDtos = AppointmentMapper.toDtoArray(appointments);

    return ApiResponseBuilder.success(appointmentDtos);
  }

  /**
   * GET /api/appointments/weekly-summary - Get weekly appointment summary
   */
  @Get('/weekly-summary')
  async getWeeklyAppointmentSummary(): Promise<WeeklyAppointmentSummaryResponse> {
    const summary = await this.getWeeklyAppointmentSummaryQueryHandler.execute();

    return ApiResponseBuilder.success(summary);
  }

  /**
   * GET /api/appointments/patient/:patientId - Get appointments by patient ID
   */
  @Get('/patient/:patientId')
  async getAppointmentsByPatientId(@Param('patientId') patientId: string): Promise<AppointmentListResponse> {
    const validatedData = this.validationService.validateGetAppointmentsByPatientIdQuery({ patientId });
    const appointments = await this.getAppointmentsByPatientIdQueryHandler.execute(validatedData);
    const appointmentDtos = AppointmentMapper.toDtoArray(appointments);

    return ApiResponseBuilder.success(appointmentDtos);
  }

  /**
   * GET /api/appointments/:id - Get appointment by ID
   */
  @Get('/:id')
  async getAppointmentById(@Param('id') id: string): Promise<AppointmentResponse> {
    // Validate the ID parameter
    const validatedId = AppointmentIdSchema.parse(id);
    const appointment = await this.getAppointmentByIdQueryHandler.execute({ id: validatedId });
    const appointmentDto = AppointmentMapper.toDto(appointment);
    return ApiResponseBuilder.success(appointmentDto);
  }

  /**
   * POST /api/appointments - Create a new appointment
   */
  @Post('/')
  @HttpCode(201)
  async createAppointment(@Body() body: CreateAppointmentRequestDto): Promise<AppointmentResponse> {
    const validatedData = this.validationService.validateCreateCommand(body);
    const appointment = await this.createAppointmentUseCase.execute(validatedData);
    const appointmentDto = AppointmentMapper.toDto(appointment);

    return ApiResponseBuilder.success(appointmentDto);
  }

  /**
   * PUT /api/appointments/:id - Update an appointment
   */
  @Put('/:id')
  async updateAppointment(@Param('id') id: string, @Body() body: UpdateAppointmentRequestDto): Promise<AppointmentOperationResponse> {
    // Validate the combined data (body + id) using the validation service
    const validatedData = this.validationService.validateUpdateCommand({
      ...body,
      id,
    });

    await this.updateAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment updated successfully');
  }

  /**
   * PATCH /api/appointments/:id/cancel - Cancel an appointment
   */
  @Patch('/:id/cancel')
  async cancelAppointment(@Param('id') id: string): Promise<AppointmentOperationResponse> {
    const validatedData = this.validationService.validateCancelCommand({ id });

    await this.cancelAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment cancelled successfully');
  }

  /**
   * PATCH /api/appointments/:id/confirm - Confirm an appointment
   */
  @Patch('/:id/confirm')
  async confirmAppointment(@Param('id') id: string): Promise<AppointmentOperationResponse> {
    const validatedData = this.validationService.validateConfirmCommand({ id });

    await this.confirmAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment confirmed successfully');
  }

  /**
   * DELETE /api/appointments/:id - Delete an appointment
   */
  @Delete('/:id')
  async deleteAppointment(@Param('id') id: string): Promise<AppointmentOperationResponse> {
    const validatedData = this.validationService.validateDeleteCommand({ id });

    await this.deleteAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment deleted successfully');
  }
}