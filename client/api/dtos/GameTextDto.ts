import { GameDto } from './GameDto';
import { TextDto } from './TextDto';

export type GameTextDto = GameDto & { text: TextDto };
