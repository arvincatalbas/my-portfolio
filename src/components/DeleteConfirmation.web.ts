import Swal from 'sweetalert2';

interface ConfirmOptions {
  title: string;
  text: string;
  isDark: boolean;
  onConfirm: () => void;
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
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
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
      });
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
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
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
      });
    }
  });
};

interface AlertOptions {
  title: string;
  text: string;
  isDark: boolean;
  confirmButtonColor?: string;
}

export const showAlert = ({ title, text, isDark, confirmButtonColor }: AlertOptions) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    confirmButtonColor: confirmButtonColor || '#00eeff',
    background: isDark ? '#323946' : '#FFFFFF',
    color: isDark ? '#FFFFFF' : '#1F2937',
  });
};

