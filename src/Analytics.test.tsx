import React from 'react';
import { render } from '@testing-library/react';
import Analytics from './Analytics';

test('renders learn react link', () => {
  const { getByText } = render(<Analytics />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
