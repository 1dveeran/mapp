export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface IDiagnosisPatientInformation {
  id: number;
  first_name: string;
  last_name: string;
  joining_date: string;
  sex: string;
  age: number;
  chief_compliant: string;
  past_dental_history: string;
}

export interface BasicListItemDataType {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
}
