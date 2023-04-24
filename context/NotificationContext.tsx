import { Box, useToast } from '@chakra-ui/react';
import { createContext, ReactNode, useContext, useReducer } from 'react';

interface Notification {
  status: 'info' | 'error' | 'success';
  title: string;
  description: string;
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION' };

interface NotificationContextType {
  addNotification: (notification: Notification) => void;
  removeNotification: () => void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationContext = createContext<NotificationContextType>({
  addNotification: () => {},
  removeNotification: () => {},
});

const notificationReducer = (
  state: { notification: Notification | null },
  action: NotificationAction
) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return { notification: action.payload };
    case 'REMOVE_NOTIFICATION':
      return { notification: null };
    default:
      return state;
  }
};

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notification: null,
  });

  const toast = useToast();

  const addNotification = (notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    // Remove notification after 4 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION' });
    }, 4000);

    toast({
      title: notification.title,
      description: notification.description,
      status: notification.status,
      duration: 2000,
      isClosable: true,
      position: 'bottom-left',
    });
  };

  const removeNotification = () => {
    dispatch({ type: 'REMOVE_NOTIFICATION' });
  };

  return (
    <NotificationContext.Provider
      value={{ addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
