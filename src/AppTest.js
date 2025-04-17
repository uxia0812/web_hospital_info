import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Prettying website', () => {
  render(<App />);
  const linkElement = screen.getByText(/Hospitals Info/i);
  expect(linkElement).toBeInTheDocument();
});