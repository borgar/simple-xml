export class NSMap {
  private uriToPres: Record<string, string[]> = {};
  private uriToPre: Record<string, string> = {};
  private preToUri: Record<string, string> = {};

  get (nsURI: string): string | undefined {
    return this.uriToPre[nsURI];
  }

  getByPrefix (nsPrefix: string): string | undefined {
    return this.preToUri[nsPrefix];
  }

  list (): [string, string][] {
    const result: [string, string][] = [];
    for (const [ uri, prefixes ] of Object.entries(this.uriToPres)) {
      for (const prefix of prefixes) {
        result.push([ uri, prefix ]);
      }
    }
    return result;
  }

  add (nsURI: string, nsPrefix: string) {
    // A prefix can only point to one URI — collisions are an error.
    if ((nsPrefix in this.preToUri) && (this.preToUri[nsPrefix] !== nsURI)) {
      throw new Error(nsPrefix + ' already has a different URI');
    }
    // Registering the same pair twice is a no-op.
    if ((nsURI in this.uriToPres) && this.uriToPres[nsURI].includes(nsPrefix)) {
      return;
    }
    if (!(nsURI in this.uriToPres)) {
      this.uriToPres[nsURI] = [];
    }
    this.uriToPres[nsURI].push(nsPrefix);
    this.preToUri[nsPrefix] = nsURI;
    // Keep uriToPre pointing at the best prefix for fast get() lookups:
    // prefer any named prefix over the empty (default) one.
    if (!(nsURI in this.uriToPre) || (this.uriToPre[nsURI] === '' && nsPrefix !== '')) {
      this.uriToPre[nsURI] = nsPrefix;
    }
  }
}
