function next<T>(iter: IterableIterator<T>): T | undefined {
  for (const val of iter) {
    return val;
  }

  return undefined;
}

export class DeduplicatedQueue {
  private readonly tasks = new Set<string>();

  private running?: Promise<void>;

  constructor(private readonly handle: (value: string) => Promise<void>) {}

  add(value: string): void {
    this.tasks.add(value);

    if (this.running) {
      return;
    }

    this.running = (async () => {
      while (this.tasks.size > 0) {
        const task = next(this.tasks.values());

        if (!task) {
          throw new Error("Expected task!");
        }

        this.tasks.delete(task);

        try {
          await this.handle(task);
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
