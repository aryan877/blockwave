import {
  Alert,
  AlertIcon,
  Box,
  CloseButton,
  Flex,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react';
import { createContext, ReactNode, useContext, useReducer } from 'react';

interface Notification {
  status: 'info' | 'error' | 'success';
  title: string;
  description?: string;
  autoClose?: boolean;
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

  const addNotification = (notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    // Remove notification after 4 seconds
    if (notification.autoClose) {
      setTimeout(() => {
        if (
          notification.status === 'success' ||
          notification.status === 'error'
        ) {
          dispatch({ type: 'REMOVE_NOTIFICATION' });
        }
      }, 4000);
    }
  };

  const removeNotification = () => {
    dispatch({ type: 'REMOVE_NOTIFICATION' });
  };

  const maxWidth = useBreakpointValue({ base: '100%', md: '50%' });

  return (
    <NotificationContext.Provider
      value={{ addNotification, removeNotification }}
    >
      {state.notification && (
        <Box
          position="fixed"
          bottom={4}
          left={4}
          zIndex={999}
          maxWidth={maxWidth}
        >
          <Alert
            status={state.notification.status}
            variant="solid"
            flexDirection="row"
            borderRadius="md"
            boxShadow="md"
            alignItems="flex-start"
          >
            {state.notification.status === 'info' ? (
              <Spinner size="sm" mr={2} />
            ) : (
              <AlertIcon />
            )}
            <Box>
              <Box fontWeight="bold">{state.notification.title}</Box>
              <Box>{state.notification.description}</Box>
            </Box>
            <Box ml={2}>
              <CloseButton size="sm" onClick={removeNotification} />
            </Box>
          </Alert>
        </Box>
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
