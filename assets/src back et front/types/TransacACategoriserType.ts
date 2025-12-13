export interface TransactionACategoriserType{
    id_sesampayx_operation: number;
    operation_name: string;
    operation_type_name: string;
    amount: number;
    created_at: Date;
    id_transaction: number;
    // idCategorie?:number;
}

export interface OperationType{
    id_sesampayx_operation: number;
    operation_name: string;
}