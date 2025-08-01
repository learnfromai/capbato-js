import { injectable, inject } from 'tsyringe';
import { LabStatus } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import type { LaboratoryStatsDto } from '../../dto/LaboratoryDto';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting laboratory statistics
 */
@injectable()
export class GetLaboratoryStatsQueryHandler {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(): Promise<LaboratoryStatsDto> {
    // Get counts by status
    const totalLabRequests = await this.laboratoryRepository.count();
    const pendingRequests = await this.laboratoryRepository.countByStatus(LabStatus.pending());
    const inProgressRequests = await this.laboratoryRepository.countByStatus(LabStatus.inProgress());
    const completedRequests = await this.laboratoryRepository.countByStatus(LabStatus.complete());
    const cancelledRequests = await this.laboratoryRepository.countByStatus(LabStatus.cancelled());

    // Get total blood chemistries
    const allBloodChemistries = await this.laboratoryRepository.getAllBloodChemistries();
    const totalBloodChemistries = allBloodChemistries.length;

    // Get requests from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const allRequests = await this.laboratoryRepository.getAllLabRequests();
    const requestsToday = allRequests.filter(request => {
      const requestDate = request.requestDate;
      return requestDate >= today && requestDate < tomorrow;
    }).length;

    // Calculate completion rate
    const completionRate = totalLabRequests > 0 
      ? Math.round((completedRequests / totalLabRequests) * 100) 
      : 0;

    return {
      total_lab_requests: totalLabRequests,
      pending_requests: pendingRequests,
      in_progress_requests: inProgressRequests,
      completed_requests: completedRequests,
      cancelled_requests: cancelledRequests,
      total_blood_chemistries: totalBloodChemistries,
      requests_today: requestsToday,
      completion_rate: completionRate,
    };
  }
}