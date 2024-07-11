// app/interfaces/auth.interface.ts
export interface Perfil {
  id: number;
  descricao: string;
}

export interface Dados {
  id: number;
  nomeCompleto: string;
  email: string;
  telemovel: string;
  foto: string;
  bi: string;
  userName: string;
  password: string;
  perfilId: number;
  perfil: Perfil;
  ativo: boolean;
  status: boolean;
}

export interface LoginResponse {
  dados: Dados;
  mensagem: string;
  sucesso: boolean;
}

export interface LoginRequest {
  userName: string;
  password: string;
}
