export interface IAcaoTarefa<TEntrada = any, TSaida = any> {
  execute(input: TEntrada): Promise<TSaida>;
}
