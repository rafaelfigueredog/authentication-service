export interface HashServiceInterface {
  create(password: string): Promise<string>;
  verify(hash: string, password: string): Promise<boolean>;
}
