import { injectable, inject } from 'tsyringe';
import { IHttpClient } from '../http/IHttpClient';
import { IPatientApiService, PatientListResponse, CreatePatientResponse } from './IPatientApiService';
import { getApiConfig } from './config/ApiConfig';
import { TOKENS, CreatePatientCommand } from '@nx-starter/application-shared';

@injectable()
export class PatientApiService implements IPatientApiService {
  private readonly apiConfig = getApiConfig();

  constructor(
    @inject(TOKENS.HttpClient) private readonly httpClient: IHttpClient
  ) {}

  async getAllPatients(): Promise<PatientListResponse> {
    const response = await this.httpClient.get<PatientListResponse>(
      this.apiConfig.endpoints.patients.all
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch patients');
    }
    
    return response.data;
  }

  async createPatient(command: CreatePatientCommand): Promise<CreatePatientResponse> {
    const response = await this.httpClient.post<CreatePatientResponse>(
      this.apiConfig.endpoints.patients.create,
      command
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create patient');
    }
    
    return response.data;
  }
}