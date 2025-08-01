import { injectable, inject } from 'tsyringe';
import { LabRequest, LabRequestId, PatientId, LabStatus, TestTypeName } from '@nx-starter/domain';
import type { ILaboratoryRepository } from '@nx-starter/domain';
import type { UpdateLabRequestCommand } from '../../dto/LaboratoryCommands';
import { TOKENS } from '../../di/tokens';
import { LabRequestNotFoundException } from '@nx-starter/domain';

/**
 * Use case for updating a lab request with results
 * Handles business logic for updating lab request status and test results
 */
@injectable()
export class UpdateLabRequestUseCase {
  constructor(
    @inject(TOKENS.LaboratoryRepository) private laboratoryRepository: ILaboratoryRepository
  ) {}

  async execute(command: UpdateLabRequestCommand): Promise<LabRequest> {
    // Get existing lab request
    const patientId = new PatientId(command.patient_id);
    const existingLabRequest = await this.laboratoryRepository.getLabRequestsByPatientIdAndDate(
      patientId,
      command.request_date
    );

    if (!existingLabRequest) {
      throw new LabRequestNotFoundException(`Lab request for patient ${command.patient_id} on ${command.request_date}`);
    }

    // Prepare test results from command
    const testResults = new Map<TestTypeName, string>();
    
    // Add test results that are provided and not empty
    if (command.fbs && command.fbs.trim()) testResults.set('fbs', command.fbs.trim());
    if (command.bun && command.bun.trim()) testResults.set('bun', command.bun.trim());
    if (command.creatinine && command.creatinine.trim()) testResults.set('creatinine', command.creatinine.trim());
    if (command.blood_uric_acid && command.blood_uric_acid.trim()) testResults.set('blood_uric_acid', command.blood_uric_acid.trim());
    if (command.lipid_profile && command.lipid_profile.trim()) testResults.set('lipid_profile', command.lipid_profile.trim());
    if (command.sgot && command.sgot.trim()) testResults.set('sgot', command.sgot.trim());
    if (command.sgpt && command.sgpt.trim()) testResults.set('sgpt', command.sgpt.trim());
    if (command.alp && command.alp.trim()) testResults.set('alp', command.alp.trim());
    if (command.sodium_na && command.sodium_na.trim()) testResults.set('sodium_na', command.sodium_na.trim());
    if (command.potassium_k && command.potassium_k.trim()) testResults.set('potassium_k', command.potassium_k.trim());
    if (command.hbalc && command.hbalc.trim()) testResults.set('hbalc', command.hbalc.trim());
    if (command.ecg && command.ecg.trim()) testResults.set('ecg', command.ecg.trim());
    if (command.t3 && command.t3.trim()) testResults.set('t3', command.t3.trim());
    if (command.t4 && command.t4.trim()) testResults.set('t4', command.t4.trim());
    if (command.ft3 && command.ft3.trim()) testResults.set('ft3', command.ft3.trim());
    if (command.ft4 && command.ft4.trim()) testResults.set('ft4', command.ft4.trim());
    if (command.tsh && command.tsh.trim()) testResults.set('tsh', command.tsh.trim());

    // Update lab request with results
    let updatedLabRequest = existingLabRequest;

    // Add test results if any provided
    if (testResults.size > 0) {
      updatedLabRequest = updatedLabRequest.addMultipleTestResults(testResults);
    }

    // Update status if provided
    if (command.status) {
      const newStatus = LabStatus.fromString(command.status);
      updatedLabRequest = updatedLabRequest.updateStatus(newStatus);
    }

    // If date_taken is provided and status is Complete, set date taken
    if (command.date_taken && command.status === 'Complete') {
      updatedLabRequest = updatedLabRequest.completeWithResults(
        testResults,
        command.date_taken
      );
    }

    // Validate business invariants
    updatedLabRequest.validate();

    // Persist using repository
    const savedLabRequest = await this.laboratoryRepository.updateLabRequest(updatedLabRequest);

    return savedLabRequest;
  }
}