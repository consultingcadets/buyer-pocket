// Shared application types — add domain models here as features are built

export type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
};
