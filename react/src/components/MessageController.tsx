import React, { useState } from 'react';
import { translate } from 'react-i18next';

interface Message {
  value: string;
  isServerError?: boolean;
}

interface Messages {
  info: Message[];
  error: Message[];
  alert: Message[];
}

const MessageController: React.FC = () => {
  const [messages, setMessages] = useState<Messages>({
    info: [],
    error: [],
    alert: []
  });

  const isInfoMessagePresent = () => messages.info.length > 0;
  const isErrorMessagePresent = () => messages.error.length > 0;
  const isAlertMessagePresent = () => messages.alert.length > 0;

  const getMessageText = (type: 'error' | 'alert') => {

    const messageArray = messages[type];
    if (messageArray && messageArray.length > 0) {
      return messageArray.map(message => message.value).join('\n');

    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      updatedMessages[type] = [];

    if (type === 'alert') {
      setMessages(prevMessages => ({
        ...prevMessages,
        alert: []
      }));
    }
  };
  };
    return '';
  };

  const hideMessage = (type: 'error' | 'alert') => {

    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      updatedMessages[type] = [];

    if (type === 'alert') {
      setMessages((prevMessages) => ({
        ...prevMessages,
        alert: []
      }));
    }
  };
  };

  const discardChanges = (type: 'alert') => {

    if (type === 'alert') {
      // Assuming discardChanges means clearing the alert messages
      setMessages((prevMessages) => ({
        ...prevMessages,
        alert: []
      }));
    }
  };

  return (
    <div className="messages">
      <ul>
        <li>
          {isInfoMessagePresent() && (
            <div className="message-container success-message-container">
              <div className="message-icon">
                <i className="fa fa-check-circle"></i>
              </div>
              <div className="message-text">
                {messages.info.map((info, index) => (
                  <div key={index}>{translate(info.value)}</div>
                ))}
              </div>
            </div>
          )}
        </li>
      </ul>

      <ul>
        <li>
          {isErrorMessagePresent() && (
            <div className="message-container error-message-container">
              <div className="message-text">
                <div className="types-for-errors error-message">
                  {messages.error.map((error, index) => (
                    <div key={index} className="msg">
                      {error.isServerError ? (
                        <div className="msg primary">{translate(error.value)}</div>
                      ) : (
                        <div>{translate(error.value)}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="button-wrapper fr clearfix">
                  <button type="button" onClick={() => getMessageText('error')} className="copy-btn">
                    {translate('MESSAGE_DIALOG_OPTION_COPY')}
                  </button>
                  <button type="button" onClick={() => hideMessage('error')} className="show-btn">
                    {translate('MESSAGE_DIALOG_OPTION_OKAY')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </li>
      </ul>

      <ul>

                      setMessages((prevMessages) => ({
                        ...prevMessages,
                        alert: prevMessages.alert.map((alert, index) => ({
                          ...alert,
                          isFocused: index === 0 ? true : alert.isFocused,
                        })),
                      }));
                    }}
          {isAlertMessagePresent() && (
            <div className="message-container error-message-container">
              <div className="message-text">
                <div className="types-for-errors error-message">
                  {messages.alert.map((alert, index) => (

                      setMessages((prevMessages) => ({
                        ...prevMessages,
                        alert: prevMessages.alert.map((alert, index) => ({
                          ...alert,
                          isFocused: index === 0 ? true : alert.isFocused,
                        })),
                      }));
                    }}
                    </div>
                  ))}

                      setMessages((prevMessages) => ({
                        ...prevMessages,
                        alert: prevMessages.alert.map((alert, index) => ({
                          ...alert,
                          isFocused: index === 0 ? true : alert.isFocused,
                        })),
                      }));
                    }}
                <div className="button-wrapper fr clearfix">
                  <button
                    type="button"
                    onClick={() => hideMessage('alert')}
                    className="review-btn"
                    onFocus={() => {

                      setMessages((prevMessages) => ({
                        ...prevMessages,
                        alert: prevMessages.alert.map((alert, index) => ({
                          ...alert,
                          isFocused: index === 0 ? true : alert.isFocused,
                        })),
                      }));
                    }}
                  >
                    {translate('MESSAGE_DIALOG_OPTION_REVIEW')}
                  </button>
                  <button type="button" onClick={() => discardChanges('alert')} className="discard-btn">
                    {translate('MESSAGE_DIALOG_OPTION_DISCARD')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default MessageController;
