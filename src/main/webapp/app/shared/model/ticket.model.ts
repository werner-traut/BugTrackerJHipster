import { Moment } from 'moment';
import { IProject } from 'app/shared/model/project.model';
import { IUser } from 'app/shared/model/user.model';
import { ILabel } from 'app/shared/model/label.model';

export interface ITicket {
  id?: number;
  title?: string;
  description?: string;
  dueDate?: string;
  done?: boolean;
  project?: IProject;
  assignedTo?: IUser;
  labels?: ILabel[];
}

export const defaultValue: Readonly<ITicket> = {
  done: false,
};
