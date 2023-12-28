import { keyframes } from "@emotion/react";

export const bounce = keyframes({
  'from, 20%, 53%, 80%, to': { transform: 'translate3d(0, 0, 0)' },
  '40%, 43%': { transform: 'translate3d(0, -0.645rem, 0)' },
  '70%': { transform: 'translate3d(0, -0.535rem, 0)' },
  '90%': { transform: 'translate3d(0, -0.25rem, 0)' },
});