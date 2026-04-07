import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingForm } from '../components/features/bookings/booking-form';
import { toast } from 'sonner';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Radix UI components if they cause issues in JSDOM
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
}));

// Mock Select components for easier testing
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
}));

describe('BookingForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnOpenChange = jest.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the booking form correctly', () => {
    render(<BookingForm {...defaultProps} />);
    expect(screen.getByText('Book a Training Session')).toBeInTheDocument();
    expect(screen.getByText('Confirm Booking')).toBeInTheDocument();
  });

  it('shows validation errors when submitting an empty form', async () => {
    render(<BookingForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Confirm Booking'));

    await waitFor(() => {
      expect(screen.getByText('Please select a service')).toBeInTheDocument();
      expect(screen.getByText('Please select a professional caregiver')).toBeInTheDocument();
      expect(screen.getByText('Please select a date')).toBeInTheDocument();
      expect(screen.getByText('Please select a time')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    render(<BookingForm {...defaultProps} />);
    
    // Fill the form
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'Walking' } }); // Service
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'trainer-1' } }); // Trainer
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2026-12-31' } });
    fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: '10:00 AM' } }); // Time

    fireEvent.click(screen.getByText('Confirm Booking'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        service: 'Walking',
        trainerId: 'trainer-1',
        date: '2026-12-31',
        time: '10:00 AM',
      }));
      expect(toast.success).toHaveBeenCalledWith('Booking confirmed!');
    });
  });
});
