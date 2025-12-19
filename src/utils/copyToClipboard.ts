import copy from 'copy-to-clipboard';

interface CopyOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showFallbackPrompt?: boolean;
}

export const copyToClipboard = async (
  text: string,
  options: CopyOptions = {}
): Promise<boolean> => {
  const { onSuccess, onError, showFallbackPrompt = true } = options;

  try {
    const success = copy(text, {
      debug: false,
      message: 'Press #{key} to copy',
      format: 'text/plain',
    });

    if (success) {
      onSuccess?.();
      return true;
    }

    if (showFallbackPrompt) {
      await showManualCopyPrompt(text);
      onSuccess?.();
      return true;
    }

    throw new Error('复制失败');
  } catch (error) {
    const err = error instanceof Error ? error : new Error('复制失败');
    onError?.(err);
    return false;
  }
};

const showManualCopyPrompt = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const message = isMobile
      ? `请长按选择并复制以下内容：\n\n${text}`
      : `请按 Ctrl+C (Mac: Cmd+C) 复制以下内容：\n\n${text}`;

    if (window.confirm(message)) {
      resolve();
    } else {
      resolve();
    }
  });
};

export const isClipboardSupported = (): boolean => {
  return !!(navigator.clipboard && window.isSecureContext);
};

export const readFromClipboard = async (): Promise<string | null> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const text = await navigator.clipboard.readText();
      return text;
    }
    throw new Error('不支持读取剪贴板');
  } catch (error) {
    return null;
  }
};

export const copyObjectToClipboard = async (
  obj: any,
  options: CopyOptions = {}
): Promise<boolean> => {
  try {
    const jsonString = JSON.stringify(obj, null, 2);
    return await copyToClipboard(jsonString, options);
  } catch (error) {
    const err = error instanceof Error ? error : new Error('对象序列化失败');
    options.onError?.(err);
    return false;
  }
};

export const copyUrlToClipboard = async (
  url: string,
  options: CopyOptions = {}
): Promise<boolean> => {
  try {
    new URL(url);
    return await copyToClipboard(url, options);
  } catch (error) {
    const err = error instanceof Error ? error : new Error('无效的URL格式');
    options.onError?.(err);
    return false;
  }
};

export const simpleCopy = async (
  text: string,
  successMessage: string = '复制成功！'
): Promise<boolean> => {
  return await copyToClipboard(text, {
    onSuccess: () => {
    },
    onError: (error) => {
    }
  });
};