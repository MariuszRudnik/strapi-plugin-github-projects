import { Button, Dialog } from "@strapi/design-system";
import { useRef } from "react";

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const buttonStretchStyle = { flex: 1, minWidth: 140, minHeight: 40 } as const;

const ConfirmationDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  const isConfirmingRef = useRef(false);

  const handleConfirm = () => {
    isConfirmingRef.current = true;
    onConfirm();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isConfirmingRef.current) {
      onCancel();
    }
    isConfirmingRef.current = false;
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content>
        <Dialog.Header variant="beta">{title}</Dialog.Header>
        <Dialog.Body>
          <Dialog.Description variant="epsilon" textColor="neutral800">
            {message}
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer direction="row" gap={3} width="100%" justifyContent="stretch">
          {/* @ts-expect-error Radix AlertDialog supports asChild; Strapi DS 2.2 types omit it */}
          <Dialog.Cancel asChild>
            <Button variant="tertiary" size="L" style={buttonStretchStyle}>
              Cancel
            </Button>
          </Dialog.Cancel>
          {/* @ts-expect-error Radix AlertDialog supports asChild; Strapi DS 2.2 types omit it */}
          <Dialog.Action asChild>
            <Button
              variant="danger"
              size="L"
              style={buttonStretchStyle}
              onClick={handleConfirm}
            >
              Delete
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ConfirmationDialog;
