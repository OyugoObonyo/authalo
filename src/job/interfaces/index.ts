// TODO: Consider actor and target IDs?
export interface JobData {
  className: string;
  method: string;
  args?: string[];
}

export interface JobService {
  publish(): void;
  perform(): void;
}
