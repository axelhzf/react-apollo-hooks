import { ApolloLink, NextLink, FetchResult, Observable, Operation } from 'apollo-link';

type MockLinkResult = { success: any } | { error: Error } | undefined;
type MockLinkCallback = (props: { operation: Operation, index: number, data: any }) => MockLinkResult;

export class MockLink extends ApolloLink {
  private count = 0;
  private cb: MockLinkCallback | undefined;

  constructor() {
    super();
  }

  setMocks(cb: MockLinkCallback) {
    this.cb = cb;
  }

  clearMocks() {
    this.cb = undefined;
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> | null {
    const index = this.count;
    this.count += 1;
    return new Observable<FetchResult>(observer => {
      const f = forward(operation);
      f.subscribe({
        next: data => {
          if (!this.cb) return observer.next(data);
          const cbResult = this.cb({ operation, index, data });
          if (!cbResult) return observer.next(data);
          if ('success' in cbResult) return observer.next(cbResult.success);
          if ('error' in cbResult) return observer.error(cbResult.error);
        },
        error(errorValue: any): void {
          // tslint:disable-next-line:no-console
          console.log(errorValue);
        },
        complete(): void {
          observer.complete();
        }
      });
    });
  }
}
