import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses = [], onEdit, onDelete, onDuplicate, currencySymbol = 'Rs.', categories = [] }) => {
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
          onDuplicate={onDuplicate}
          currencySymbol={currencySymbol}
          categories={categories}
          {...expense}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
