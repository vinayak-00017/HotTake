import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const PostCloseAlert = ({
  isAlertOpen,
  setIsAlertOpen,
  handleCancleClose,
  handleConfirmClose,
}: {
  isAlertOpen: boolean;
  handleCancleClose: () => void;
  handleConfirmClose: () => void;
  setIsAlertOpen: (open: boolean) => void;
}) => {
  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose the input content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancleClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmClose}>
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PostCloseAlert;
