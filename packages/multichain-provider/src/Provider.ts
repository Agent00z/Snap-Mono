import {
  ChainId,
  ConnectArguments,
  RequestArguments,
  Session,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Event,
} from '@metamask/snaps-utils';

/* eslint-disable @typescript-eslint/naming-convention */
type ProviderEventMap = {
  session_event: (arg: { params: { event: Event; chainId: ChainId } }) => void;
  session_delete: () => void;
};
/* eslint-enable @typescript-eslint/naming-convention */

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface Provider {
  connect(args: ConnectArguments): Promise<{ approval(): Promise<Session> }>;
  request(args: { chainId: ChainId; request: RequestArguments }): Promise<any>;

  on<K extends keyof ProviderEventMap>(
    eventName: K,
    listener: ProviderEventMap[K],
  ): this;
  on(eventName: string, listener: (...args: unknown[]) => void): this;

  once<K extends keyof ProviderEventMap>(
    eventName: K,
    listener: ProviderEventMap[K],
  ): this;
  once(eventName: string, listener: (...args: unknown[]) => void): this;

  removeListener(
    eventName: string,
    listener: (...args: unknown[]) => void,
  ): this;
  removeAllListeners(eventName: string): this;
}
