export class ExecutionFrequency {
  static throttle(func: (...args: any[]) => any, delay = 50) {
    let lastCall = 0;
    return function (...args: any[]) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        func(...args);
        lastCall = now;
      }
    };
  }
}
