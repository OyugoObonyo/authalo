export interface Job {
  className: string;
  method: string;
  args?: string[];
}

export interface JobService {
  publish(): void;
  perform(): void;
}
