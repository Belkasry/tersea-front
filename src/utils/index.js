export function getStatusColor(status) {
  switch (status) {
    case 'Active':
      return 'green';
    case 'Pending':
      return 'orange';
    case 'Inactive':
      return 'red';
    default:
      return 'grey';
  }
};

export function getHistoriqueType(historique) {
  switch (historique) {
    case 'sent_invite':
      return {color: 'orange', label: 'Sending invitation'};
    case 'cancel_invite':
      return {color: 'red', label: 'Canceling invitation'};
    case 'accept_invite':
      return {color: 'green', label: 'Accepting invitation'};
    case 'create_profile':
      return {color: 'green', label: 'Creating invitation'};
    default:
      return {color: 'grey', label: '-'};
  }
};
