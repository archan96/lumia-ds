/* istanbul ignore file */
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
};

export default meta;

export const BasicDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>Open dialog</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dialog title</DialogTitle>
        <DialogDescription>
          Short description to explain the context for this dialog.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 text-sm leading-6 text-foreground/90">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          facilisi. Pellentesque habitant morbi tristique senectus.
        </p>
        <p>
          Use the footer buttons to act or cancel. Click outside or press ESC to
          dismiss.
        </p>
      </div>
      <DialogFooter>
        <Button variant="secondary">Cancel</Button>
        <Button>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
