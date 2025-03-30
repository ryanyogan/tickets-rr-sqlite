import { cloneElement, useCallback, useEffect, useState } from "react";
import { useFetcher, useNavigation } from "react-router";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface TriggerElementProps {
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}

type UseConfirmDialogProps = {
  title?: string;
  description?: string;
  action: string;
  trigger: React.ReactElement<TriggerElementProps>;
  cancelText?: string;
  confirmText?: string;
  variant?: "default" | "destructive";
  method?: "post" | "delete";
  onSuccess?: () => void;
  formData?: Record<string, string>;
};

type ConfirmDialogProps = {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cancelText: string;
  confirmText: string;
  variant: "default" | "destructive";
  onConfirm: () => void;
  isPending: boolean;
};

export function ConfirmDialog({
  title,
  description,
  open,
  onOpenChange,
  cancelText,
  confirmText,
  variant,
  onConfirm,
  isPending,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Loading..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useConfirmDialog({
  title = "Confirm Action",
  description = "Are you sure you want to continue with this action?",
  action,
  trigger,
  cancelText = "Cancel",
  confirmText = "Confirm",
  variant = "destructive",
  method = "post",
  onSuccess,
  formData = {},
}: UseConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isPending =
    fetcher.state !== "idle" ||
    navigation.state === "submitting" ||
    navigation.state === "loading";

  const handleConfirm = useCallback(() => {
    const formDataObj = new FormData();

    // Add all key-value pairs from formData
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    fetcher.submit(formDataObj, {
      method,
      action,
    });

    setOpen(false);
  }, [fetcher, action, method, formData]);

  // Handle success callback
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && onSuccess) {
      onSuccess();
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const dialogElement = (
    <ConfirmDialog
      title={title}
      description={description}
      open={open}
      onOpenChange={setOpen}
      cancelText={cancelText}
      confirmText={confirmText}
      variant={variant}
      onConfirm={handleConfirm}
      isPending={isPending}
    />
  );

  const triggerElement = cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (trigger.props.onClick) {
        trigger.props.onClick(e);
      }

      setOpen(true);
    },
  });

  return [triggerElement, dialogElement] as const;
}
