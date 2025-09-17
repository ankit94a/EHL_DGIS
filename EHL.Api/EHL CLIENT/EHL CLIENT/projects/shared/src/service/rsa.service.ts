import { Injectable } from '@angular/core';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class RSAService {

  constructor() { }

  encryptWithPublicKey(publicKeyXml: string, data: string): string {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyXml);
  const encrypted = publicKey.encrypt(data, 'RSAES-PKCS1-V1_5');
  return forge.util.encode64(encrypted);
}

xmlToPublicKeyPem(xml: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');

  const modulusBase64 = xmlDoc.getElementsByTagName('Modulus')[0].textContent!;
  const exponentBase64 = xmlDoc.getElementsByTagName('Exponent')[0].textContent!;

  const modulus = forge.util.createBuffer(forge.util.decode64(modulusBase64), 'raw');
  const exponent = forge.util.createBuffer(forge.util.decode64(exponentBase64), 'raw');

  const publicKey = forge.pki.setRsaPublicKey(
    new forge.jsbn.BigInteger(modulus.toHex(), 16),
    new forge.jsbn.BigInteger(exponent.toHex(), 16)
  );

  return forge.pki.publicKeyToPem(publicKey);
}
}
