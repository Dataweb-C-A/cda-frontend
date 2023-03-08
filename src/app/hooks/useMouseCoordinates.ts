import { useState, useEffect, useCallback } from "react";
import { fromEvent } from "rxjs";
import { map, startWith } from "rxjs/operators";

type Coordinates = {
  x: number;
  y: number;
};

function useMouseCoordinates(initialCoordinates: Coordinates) {
  const [coordinates, setCoordinates] = useState(initialCoordinates);

  const updateCoordinates = useCallback(() => {
    const coordinates$ = fromEvent<MouseEvent>(document, "mousemove").pipe(
      map((event) => ({ x: event.clientX, y: event.clientY })),
      startWith(initialCoordinates)
    );

    const subscription = coordinates$.subscribe((coords) => {
      setCoordinates(coords);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialCoordinates]);

  useEffect(() => {
    const unsubscribe = updateCoordinates();
    return () => {
      unsubscribe();
    };
  }, [updateCoordinates]);

  return [coordinates, setCoordinates] as const;
}

export default useMouseCoordinates;
