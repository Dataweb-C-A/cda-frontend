import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderRadius: theme.radius.sm,
  },

  item: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : '#eef5f9',
    border: '1px solid transparent',
    position: 'relative',
    zIndex: 0,
    transition: 'transform 150ms ease',

    '&[data-active]': {
      transform: 'scale(1.005)',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#f6f9fa',
      boxShadow: theme.shadows.md,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
      borderRadius: theme.radius.md,
      zIndex: 1,
      
    },
  },

  chevron: {
    '&[data-rotate]': {
      transform: 'rotate(-180deg)',
    },
  },
}));
