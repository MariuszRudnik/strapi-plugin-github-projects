import { Button, Dialog } from "@strapi/design-system";
import { useRef } from "react";

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

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
          <Dialog.Cancel asChild>
            <Button variant="tertiary" size="L" style={{ flex: 1, minWidth: 140, minHeight: 40 }}>
              Cancel
            </Button>
          </Dialog.Cancel>
          <Dialog.Action asChild>
            <Button
              variant="danger"
              size="L"
              style={{ flex: 1, minWidth: 140, minHeight: 40 }}
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
