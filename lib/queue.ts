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
