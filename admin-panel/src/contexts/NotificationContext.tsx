import { OPEN_NOTIFICATION_EVENT_NAME } from '@/constants';
import { notification } from 'antd';
import React, { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export interface OpenNotificationEvent {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string;
  placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
}

const NotificationProvider = ({ children }: Props) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    // We use this approach to achieve the behavior:  outside component can call notification.open
    const handleOpenNotification = (event: CustomEvent<OpenNotificationEvent>) => {
      const { message, type, description, placement } = event.detail;
      api[type]({
        message,
        description,
        placement: placement || 'bottomLeft',
      });
    };

    window.addEventListener(OPEN_NOTIFICATION_EVENT_NAME as any, handleOpenNotification);

    return () => {
      window.removeEventListener(OPEN_NOTIFICATION_EVENT_NAME as any, handleOpenNotification);
    };
  }, []);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export const openNotification = (event: OpenNotificationEvent) => {
  window.dispatchEvent(new CustomEvent(OPEN_NOTIFICATION_EVENT_NAME, { detail: event }));
};

export default NotificationProvider;
