export interface UserDto {
  uid: string;
  id: number;
  email: string;
  nickname?: string;
  imageUrl?: string;
  country?: string;
  points?: number;
  createdAt: string;
  updatedAt: string;
}
