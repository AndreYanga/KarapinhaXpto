export interface Servico {
  id: number;
  descricao: string;
  categoriaId: number | null;
  preco: number | null;
}

export interface ServicoResponse {
  dados: Servico[];
  mensagem: string;
  sucesso: boolean;
}
