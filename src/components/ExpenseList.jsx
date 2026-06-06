import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses = [], onEdit, onDelete, currencySymbol = 'Rs.' }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted text-sm font-semibold">
        No transactions found matching criteria.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 -mx-4 md:mx-0">
      {expenses.map((expense, index) => (
        <ExpenseItem 
          key={expense.id} 
          index={index} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          currencySymbol={currencySymbol}
          {...expense} 
        />
      ))}
    </div>
  );
};

export default ExpenseList;
