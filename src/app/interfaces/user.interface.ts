export interface User {
    isLoggedIn?: boolean;
    username: string | null;
    id: string | null;
    email: string | null;
    name: string | null;
    picture?:string | null;
    birthdate?:string | null;
    gender?:string | null;
    'custom:cpf'?: string | null;
    'custom:databaseUserRef'?: string | null;
  }
  