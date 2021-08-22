function next<T>(iter: IterableIterator<T>): T | undefined {
  for (const val of iter) {
    return val;
  }

  return undefined;
}

export class DeduplicatedQueue<T> {
  private readonly tasks = new Map<string, T>();

  private running?: Promise<void>;

  constructor(
    private readonly handle: (value: string, context: T) => Promise<void>
  ) {}

  waitUntilEmpty(): Promise<void> {
    console.log(`Waiting for ${this.tasks.size} to finish`);

    if (this.running) {
      return this.running;
    }

    return Promise.resolve();
  }

  add(value: string, task: T): void {
    this.tasks.set(value, task);

    if (this.running) {
      return;
    }

    this.running = (async () => {
      while (this.tasks.size > 0) {
        const task = next(this.tasks.entries());

        if (!task) {
          throw new Error("Expected task!");
        }

        const [key, context] = task;

        this.tasks.delete(key);

        try {
          await this.handle(key, context);
        } catch (e) {
          console.error("Handle function threw an error");
          console.error(e);
        }
      }

      this.running = undefined;
    })().catch((e) => {
      console.error("A top level error happened when running the promise");
      console.error(e);
      this.running = undefined;
      this.tasks.clear();
    });
  }
}

export class GroupedQueue<T> {
  private readonly tasks = new Map<string, T>();
  private readonly running = new Map<string, Promise<void>>();

  private readonly completeSubscriptions = new Set<() => void>();

  constructor(
    private readonly handle: (key: string, context: T) => Promise<void>
  ) {}

  private onFinished(callback: () => void): { disconnect: () => void } {
    this.completeSubscriptions.add(callback);
    return { disconnect: () => this.completeSubscriptions.delete(callback) };
  }

  waitUntilEmpty(): Promise<void> {
    if (this.running.size === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.onFinished(resolve);
    });
  }

  private finished(): void {
    if (this.running.size === 0) {
      this.completeSubscriptions.forEach((x) => x());
    }
  }

  add(key: string, task: T): void {
    this.tasks.set(key, task);

    if (this.running.has(key)) {
      return;
    }

    const running = (async () => {
      const task = this.tasks.get(key);
      this.tasks.delete(key);

      if (!task) {
        return;
      }

      while (true) {
        const task = this.tasks.get(key);
        this.tasks.delete(key);

        if (!task) {
          break;
        }

        try {
          await this.handle(key, task);
        } catch (e) {
          console.error("Running task failed with error");
          console.error(e);
        }
      }
    })().finally(() => {
      this.running.delete(key);
      this.finished();
    });

    this.running.set(key, running);
  }
}
