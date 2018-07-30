import { notification } from 'antd';

// 报错提示
export function notifyError(messageInfo, title = 'Error') {
  const text = messageInfo && messageInfo.split(/\s+/g);
  const elements = [];
  for (const i in text) {
    if (text[i]) {
      const element = `<p key=${i}>${text[i]} </p>`;
      elements.push(element);
    }
  }
  notification.error({
    message: title,
    description: messageInfo,
    duration: 5,
    style: { width: 500, marginLeft: 335 - 500, overflowX: 'auto' },
  });
}

// 警告提示
export function notifyWarning(messageInfo, title = 'Warning') {
  notification.warning({
    message: title,
    description: messageInfo,
    duration: 0,
  });
}

// 信息提示
export function notifyInfo(messageInfo, title = 'Info') {
  notification.info({
    message: title,
    description: messageInfo,
  });
}

// 成功提示
export function notifySuccess(messageInfo, title = 'Success') {
  notification.success({
    message: title,
    description: messageInfo,
  });
}
