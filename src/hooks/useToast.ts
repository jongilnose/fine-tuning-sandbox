import { JSXElementConstructor, ReactElement, ReactFragment, ReactNode, ReactPortal } from 'react';
import { ToastContentProps, toast } from 'react-toastify';

export function useToast() {
  const showToast = (
    type = 'info',
    message:
      | string
      | number
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | ReactFragment
      | ReactPortal
      | ((props: ToastContentProps<unknown>) => ReactNode)
      | null
      | undefined,
    options = {},
  ) => {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warn':
        toast.warn(message, options);
        break;
      case 'info':
      default:
        toast.info(message, options);
        break;
    }
  };

  return showToast;
}
