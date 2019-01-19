import { ApolloLink, Operation, Observable, FetchResult, NextLink } from 'apollo-link';
import { waitFor } from './wait';

export class OperationsLink extends ApolloLink {
  private requestedOperations: Operation[] = [];
  private completedOperations: Operation[] = [];
  private errorOperations: Operation[] = [];

  request(operation: Operation, forward: NextLink): Observable<FetchResult> | null {
    const observer = forward(operation);
    observer.subscribe({
      next: () => {
        this.requestedOperations.push(operation);
      },
      complete: () => {
        this.completedOperations.push(operation);
      },
      error: () => {
        this.errorOperations.push(operation);
      }
    });
    return observer;
  }

  getCompletedOperations() {
    return this.completedOperations;
  }

  getErrorOperations() {
    return this.errorOperations;
  }

  hasPendingOperations() {
    return (
      this.requestedOperations.length >
      this.completedOperations.length + this.errorOperations.length
    );
  }

  waitForPendingOperations(ms?: number) {
    return waitFor(() => !this.hasPendingOperations(), ms);
  }
}
