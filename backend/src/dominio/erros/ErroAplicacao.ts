export class ErroAplicacao extends Error {
  status: number;
  detalhes?: unknown;

  constructor(mensagem: string, status = 400, detalhes?: unknown) {
    super(mensagem);
    this.status = status;
    this.detalhes = detalhes;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static naoEncontrado(mensagem = 'Recurso não encontrado', detalhes?: unknown) {
    return new ErroAplicacao(mensagem, 404, detalhes);
  }

  static validacao(mensagem = 'Dados inválidos', detalhes?: unknown) {
    return new ErroAplicacao(mensagem, 400, detalhes);
  }

  static conflito(mensagem = 'Conflito', detalhes?: unknown) {
    return new ErroAplicacao(mensagem, 409, detalhes);
  }

  toJSON() {
    return {
      mensagem: this.message,
      status: this.status,
      detalhes: this.detalhes
    };
  }
}

export function ehErroAplicacao(err: unknown): err is ErroAplicacao {
  return err instanceof ErroAplicacao;
}
