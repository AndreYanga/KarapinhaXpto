export interface RegisterRequest {
  nomeCompleto: string;
  email: string;
  telemovel: string;
  foto: File | string | null; // Permitir File, string ou null para foto
  bi: string;
  userName: string;
  password: string;
  perfilId: number;
  ativo: boolean;
  status: boolean;
}

export interface RegisterResponse {
  dados: boolean;
  mensagem: string;
  sucesso: boolean;
}

