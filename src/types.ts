export interface Account {
  id: string;
  code: string;
  description: string;
  account_group: string;
  is_monetary: number; // 1 ou 0
  parent_code: string | null;
  is_active?: number;
  created_at: string;
}

export interface Transaction {
  id?: string;
  account_code: string;
  amount: number;
  type: 'C' | 'D';
  transaction_date: string;
  description?: string | null;
}

export interface GroupSummary {
  account_group: string;
  total: number;
}

export interface AccountTreeNode extends Account {
  children: AccountTreeNode[];
}
