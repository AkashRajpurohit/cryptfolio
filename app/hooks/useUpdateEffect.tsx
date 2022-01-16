import { DependencyList, EffectCallback, useEffect } from 'react';
import useIsFirstRender from './useIsFirstRender';

// This effect will run after every render but not when the component is first mounted.
const useUpdateEffect = (
  effect: EffectCallback,
  deps?: DependencyList | undefined
) => {
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (!isFirstRender) {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;
