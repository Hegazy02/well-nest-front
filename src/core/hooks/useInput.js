import { useEffect } from "react";
import { from, fromEvent, of } from "rxjs";
import { debounceTime, pluck, switchMap, catchError } from "rxjs/operators";
export function useInput(ref, fetch) {
  let result;
  useEffect(() => {
    if (!ref.current) return;
    console.log("ref", ref.current);

    const subscription = fromEvent(ref.current, "input")
      .pipe(
        pluck("target", "value"),
        debounceTime(1000),
        switchMap((query) => {
          try {
            result = fetch({ name: query });
            // Handle both Promise and non-Promise cases
            return result && typeof result.then === "function"
              ? from(result)
              : of(result);
          } catch (error) {
            console.error("input error:", error);
            return of(null); // Return empty observable on error
          }
        }),
        catchError((err) => {
          console.error("RxJS error:", err);
          return of(null);
        })
      )
      .subscribe({
        error: (err) => console.error("Subscription error:", err),
      });

    return () => subscription.unsubscribe();
  }, [fetch]);
  return [result];
}
