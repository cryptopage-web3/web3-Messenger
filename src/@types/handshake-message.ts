import { MessageType } from './message-type'

export type HandshakeMessage = {
  id?: number;
  sign?: string;
  status: string;//??
  type: MessageType.handshake;
  encryptionPublicKeyRequested: boolean;
  sender: string;
  receiver: string;
  senderEncryptionPublicKey: string;
  senderEthereumWalletAddress: string;
}
