export type MessageRole = 'user' | 'bot';

export interface MessageButton {
  label: string;
  action: string;
}

export interface Message {
  role: MessageRole;
  content: string;
  createdAt: string;
  createdAtIso: string;
  buttons?: MessageButton[];
}

export type ChatStage =
  | 'initial'
  | 'listening'
  | 'summary_confirm'
  | 'summary_shown'
  | 'solution_confirm'
  | 'solution_shown';
