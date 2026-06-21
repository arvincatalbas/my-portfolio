import Swal from 'sweetalert2';

interface ConfirmOptions {
  title: string;
  text: string;
  isDark: boolean;
  onConfirm: () => void | Promise<void>;
}

export const showDeleteConfirmation = ({ title, text, isDark, onConfirm }: ConfirmOptions) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    iconColor: '#EF4444',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: isDark ? '#4b5563' : '#9ca3af',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    background: isDark ? '#323946' : '#FFFFFF',
    color: isDark ? '#FFFFFF' : '#1F2937',
    scrollbarPadding: false,
    customClass: {
      popup: 'swal-premium-popup',
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait.',
          allowOutsideClick: false,
          showConfirmButton: false,
          background: isDark ? '#323946' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#1F2937',
          scrollbarPadding: false,
          customClass: {
            popup: 'swal-premium-popup',
          },
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await onConfirm();

        Swal.fire({
          title: 'Deleted!',
          text: 'Successfully deleted.',
          icon: 'success',
          iconColor: isDark ? '#00eeff' : '#00bcd4',
          confirmButtonColor: isDark ? '#00eeff' : '#00bcd4',
          background: isDark ? '#323946' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#1F2937',
          timer: 1500,
          showConfirmButton: false,
          scrollbarPadding: false,
          customClass: {
            popup: 'swal-premium-popup',
          }
        });
      } catch (err) {
        // Operation failed, error alert shown by onConfirm
      }
    }
  });
};

export const showArchiveConfirmation = ({ title, text, isDark, onConfirm }: ConfirmOptions) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    iconColor: isDark ? '#00eeff' : '#00bcd4',
    showCancelButton: true,
    confirmButtonColor: isDark ? '#00eeff' : '#00bcd4',
    cancelButtonColor: isDark ? '#4b5563' : '#9ca3af',
    confirmButtonText: 'Yes, archive it!',
    cancelButtonText: 'Cancel',
    background: isDark ? '#323946' : '#FFFFFF',
    color: isDark ? '#FFFFFF' : '#1F2937',
    scrollbarPadding: false,
    customClass: {
      popup: 'swal-premium-popup',
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Archiving...',
          text: 'Please wait.',
          allowOutsideClick: false,
          showConfirmButton: false,
          background: isDark ? '#323946' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#1F2937',
          scrollbarPadding: false,
          customClass: {
            popup: 'swal-premium-popup',
          },
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await onConfirm();

        Swal.fire({
          title: 'Archived!',
          text: 'Successfully archived.',
          icon: 'success',
          iconColor: isDark ? '#00eeff' : '#00bcd4',
          confirmButtonColor: isDark ? '#00eeff' : '#00bcd4',
          background: isDark ? '#323946' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#1F2937',
          timer: 1500,
          showConfirmButton: false,
          scrollbarPadding: false,
          customClass: {
            popup: 'swal-premium-popup',
          }
        });
      } catch (err) {
        // Operation failed, error alert shown by onConfirm
      }
    }
  });
};

interface AlertOptions {
  title: string;
  text: string;
  isDark: boolean;
  confirmButtonColor?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
}

export const showAlert = ({ title, text, isDark, confirmButtonColor, icon }: AlertOptions) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon || 'warning',
    confirmButtonColor: confirmButtonColor || '#00eeff',
    background: isDark ? '#323946' : '#FFFFFF',
    color: isDark ? '#FFFFFF' : '#1F2937',
    scrollbarPadding: false,
    customClass: {
      popup: 'swal-premium-popup',
    }
  });
};
