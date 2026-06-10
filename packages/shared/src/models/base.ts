export interface BaseModel {
  id: string; // UUIDv7
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface SyncableModel extends BaseModel {
  syncedAt?: Date | null;
  version: number;
}
