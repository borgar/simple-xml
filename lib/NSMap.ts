export class NSMap {
  uriToPre: Record<string, string> = {};
  preToUri: Record<string, string> = {};

  get (nsURI: string): string | undefined {
    return this.uriToPre[nsURI];
  }

  getByPrefix (nsPrefix: string): string | undefined {
    return this.preToUri[nsPrefix];
  }

  list (): [string, string][] {
    return Array.from(Object.entries(this.uriToPre));
  }

  add (nsURI: string, nsPrefix: string) {
    if ((nsURI in this.uriToPre) && (this.uriToPre[nsURI] !== nsPrefix)) {
      throw new Error(nsURI + ' allready has a different prefix');
    }
    if ((nsPrefix in this.preToUri) && (this.preToUri[nsPrefix] !== nsPrefix)) {
      throw new Error(nsPrefix + ' allready has a different URI');
    }
    this.uriToPre[nsURI] = nsPrefix;
    this.preToUri[nsPrefix] = nsURI;
  }
}
