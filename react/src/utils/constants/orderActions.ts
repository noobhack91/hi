// Define the type for order actions
type OrderActions = {
    discontinue: string;
    new: string;
    revise: string;
};

// Define the order actions constant
const orderActions: OrderActions = {
    discontinue: 'DISCONTINUE',
    new: 'NEW',
    revise: 'REVISE'
};

export default orderActions;
