export interface Application {
  _id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
  dateApplied: string;
  jdLink?: string;
  notes?: string;
  salaryRange?: string;
  skills?: string[];
  resumeSuggestions?: string[];
  location?: string;
  seniority?: string;
}

export type KanbanColumnType = {
  id: string;
  title: string;
  applications: Application[];
};
