export type GenerateReportInput = {
  customer: {
    name: string;
    address: string;
    email?: string;
    phone: string;
  };
  service: {
    date: string;
    type: string;
    duration: number;
  };
  problem: {
    problem?: string;
    resolution?: string;
  };
  partsUsed: {
    name: string;
    quantity: number;
    price?: number;
  }[];
  signature: string;
};

export type ReportData = {
  id: string;
  name: string;
  address: string;
  email?: string;
  phone: string;
  signature?: string;
  service: {
    id: string;
    customer_id: string;
    date: string;
    type: string;
    duration: number;
  };
  problem: {
    id: string;
    customer_id: string;
    problem: string;
    resolution?: string;
  };
  partsUsed: {
    id: string;
    customer_id: string;
    name: string;
    quantity: number;
    price: number;
  };
  created_by_user_id?: string;
  created_at: string;
  updated_at?: string;
};

export type CustomerReportInput = {
  name: string;
  email?: string;
  phone: string;
  address: string;
  signature?: string;
  created_by_user_id?: string;
};

export type CustomerReport = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  created_by_user_id?: string;
  created_at: string;
  updated_at?: string;
};


export type ServiceReportInput = {
  customer_id: string;
  date: string;
  type: string;
  duration?: number;
  created_by_user_id?: string;
};

export type ServiceReport = {
  id: string;
  customer_id: string;
  date: string;
  type: string;
  duration: number;
  created_by_user_id?: string;
  created_at: string;
  updated_at?: string;
};

export type ProblemReportInput = {
  customer_id: string;
  problem: string;
  resolution?: string;
  created_by_user_id?: string;
};

export type ProblemReport = {
  id: string;
  customer_id: string;
  problem: string;
  resolution?: string;
  created_by_user_id?: string;
  created_at: string;
  updated_at?: string;
};

export type PartUsedReportInput = {
  customer_id: string;
  name: string;
  quantity: number;
  price: number;
  created_by_user_id?: string;
};

export type PartUsedReport = {
  id: string;
  customer_id: string;
  name: string;
  quantity: number;
  price: number;
  created_by_user_id?: string;
  created_at: string;
  updated_at?: string;
};

