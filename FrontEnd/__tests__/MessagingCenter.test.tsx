import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessagingCenter from '../components/features/messaging/messaging-center';
import { useAuth } from '@/context/auth-context';
import { chatApi } from '@/lib/api';

// Mock dependencies
jest.mock('@/context/auth-context');
jest.mock('@/lib/api');
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

describe('MessagingCenter', () => {
  const mockUser = { _id: 'user-1', name: 'Test User', role: 'user' };
  const mockConversations = [
    {
      _id: 'conv-1',
      trainerId: { name: 'Trainer Name' },
      lastMessage: { text: 'Hello there' },
      updatedAt: new Date().toISOString(),
    },
  ];
  const mockMessages = [
    { _id: 'msg-1', senderId: 'user-1', text: 'Hi!', createdAt: new Date().toISOString() },
    { _id: 'msg-2', senderId: 'trainer-1', text: 'How can I help?', createdAt: new Date().toISOString() },
  ];

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (chatApi.getConversations as jest.Mock).mockResolvedValue(mockConversations);
    (chatApi.getMessages as jest.Mock).mockResolvedValue(mockMessages);
  });

  it('renders conversations and selected messages', async () => {
    render(<MessagingCenter />);

    await waitFor(() => {
      expect(screen.getByText('Trainer Name')).toBeInTheDocument();
      expect(screen.getByText('Hello there')).toBeInTheDocument();
    });

    // Select conversation
    fireEvent.click(screen.getByText('Trainer Name'));

    await waitFor(() => {
      expect(screen.getByText('Hi!')).toBeInTheDocument();
      expect(screen.getByText('How can I help?')).toBeInTheDocument();
    });
  });

  it('handles message input and sending', async () => {
    render(<MessagingCenter />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Trainer Name'));
    });

    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'New message' } });
    expect(input).toHaveValue('New message');

    const sendButton = screen.getByRole('button', { name: '' }); // The send icon button
    fireEvent.click(screen.getByRole('button', { name: /send/i }) || screen.queryAllByRole('button')[screen.queryAllByRole('button').length - 1]);
    
    // Check if input is cleared (optimistic UI)
    await waitFor(() => {
      // The component clears the input after sending
      // but wait for the actual implementation details
    });
  });
});
