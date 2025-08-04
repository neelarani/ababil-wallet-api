import { ClientSession, startSession } from 'mongoose';

export const rollback = (
  service: (session: ClientSession, ...args: Array<any>) => Promise<any>
) => {
  return async (...args: Array<any>) => {
    const session = await startSession();
    session.startTransaction();
    try {
      const result = await service(session, ...args);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  };
};
