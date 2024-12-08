export interface userData {
  username: string;
  email: string;
  password: string;
  fullname?: string;
}

export interface RequestType {
  status: string;
  message: string;
}

export enum RequestStatus { 
  ErrorSubmittingForm = 'There was an error while submitting the form. Please try',
  SuccesSubmittingForm = 'Registration data received successfully'
}