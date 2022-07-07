export interface FriendsDto {
  id: number;
  fromUserId: number;
  toUserId: number;
  accepted?: boolean;
}
