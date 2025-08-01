import { injectable } from 'tsyringe';
import { User, IUserRepository } from '@nx-starter/domain';
import { UserMapper } from '@nx-starter/application-shared';
import { UserModel, IUserDocument } from './UserSchema';

/**
 * Mongoose implementation of IUserRepository
 * For MongoDB user persistence
 */
@injectable()
export class MongooseUserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    const userDocs = await UserModel.find().exec();
    return userDocs.map(doc => this.mapToUserDomain(doc));
  }

  async getById(id: string): Promise<User | undefined> {
    const userDoc = await UserModel.findById(id).exec();
    return userDoc ? this.mapToUserDomain(userDoc) : undefined;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const userDoc = await UserModel.findOne({ email: email.toLowerCase() }).exec();
    return userDoc ? this.mapToUserDomain(userDoc) : undefined;
  }

  async getByUsername(username: string): Promise<User | undefined> {
    const userDoc = await UserModel.findOne({ username: username.toLowerCase() }).exec();
    return userDoc ? this.mapToUserDomain(userDoc) : undefined;
  }

  async getByEmailOrUsername(identifier: string): Promise<User | undefined> {
    const userDoc = await UserModel.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() }
      ]
    }).exec();
    return userDoc ? this.mapToUserDomain(userDoc) : undefined;
  }

  async create(user: User): Promise<string> {
    const userDoc = new UserModel({
      _id: user.id,
      firstName: user.firstName.value,
      lastName: user.lastName.value,
      email: user.email.value,
      username: user.username.value,
      hashedPassword: user.hashedPassword.value,
      role: user.role.value,
      mobile: user.mobile?.value,
      createdAt: user.createdAt,
    });

    await userDoc.save();
    return user.id;
  }

  async update(id: string, changes: Partial<User>): Promise<void> {
    const updateData: Record<string, unknown> = {};

    if (changes.firstName !== undefined) {
      updateData.firstName = changes.firstName.value;
    }

    if (changes.lastName !== undefined) {
      updateData.lastName = changes.lastName.value;
    }

    if (changes.email !== undefined) {
      updateData.email = changes.email.value;
    }

    if (changes.username !== undefined) {
      updateData.username = changes.username.value;
    }

    if (changes.hashedPassword !== undefined) {
      updateData.hashedPassword = changes.hashedPassword.value;
    }

    if (changes.mobile !== undefined) {
      updateData.mobile = changes.mobile?.value;
    }

    if (Object.keys(updateData).length === 0) {
      return;
    }

    const result = await UserModel.updateOne({ _id: id }, updateData).exec();
    
    if (result.matchedCount === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const result = await UserModel.updateOne({ _id: id }, { hashedPassword }).exec();
    if (result.matchedCount === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email: email.toLowerCase() }).exec();
    return count > 0;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ username: username.toLowerCase() }).exec();
    return count > 0;
  }

  async generateUniqueUsername(baseUsername: string): Promise<string> {
    // Check if base username is available
    if (!(await this.existsByUsername(baseUsername))) {
      return baseUsername;
    }

    // Find unique username with incremental suffix
    let counter = 1;
    let candidateUsername = `${baseUsername}${counter}`;
    
    while (await this.existsByUsername(candidateUsername)) {
      counter++;
      candidateUsername = `${baseUsername}${counter}`;
      
      // Prevent infinite loops
      if (counter > 1000) {
        throw new Error('Unable to generate unique username');
      }
    }

    return candidateUsername;
  }

  private mapToUserDomain(doc: IUserDocument): User {
    return UserMapper.fromPlainObject({
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      username: doc.username,
      hashedPassword: doc.hashedPassword,
      role: doc.role,
      mobile: doc.mobile,
      createdAt: doc.createdAt,
    });
  }
}