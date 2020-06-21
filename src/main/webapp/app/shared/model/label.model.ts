import { ITicket } from 'app/shared/model/ticket.model';

export interface ILabel {
  id?: number;
  label?: string;
  tickets?: ITicket[];
}

export const defaultValue: Readonly<ILabel> = {};
