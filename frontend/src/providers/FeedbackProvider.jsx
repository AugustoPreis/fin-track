import { createContext, useContext } from 'react';
import { App } from 'antd';

const FeedbackContext = createContext();

export default function FeedbackProvider(props) {
  const { message, notification, modal } = App.useApp();

  return (
    <FeedbackContext.Provider {...props}
      value={{
        message,
        notification,
        modal,
      }} />
  );
}


export function useFeedback() {
  return useContext(FeedbackContext);
}