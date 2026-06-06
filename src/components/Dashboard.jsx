import { useOutletContext, Link } from 'react-router-dom';
import Summary from './Summary';
import ExpenseChart from './ExpenseChart';
import ExpenseList from './ExpenseList';

const Dashboard = () => {
  const { expenses } = useOutletContext();

  return (
    <div className="space-y-8">
      <Summary expenses={expenses} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <ExpenseChart expenses={expenses} />
        </div>
        
        <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-border-main p-4 md:p-6 animate-fade-in-up hover:border-border-main transition-all duration-300" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-text-main">Recent Transactions</h2>
            <Link to="/transactions" className="text-primary text-sm font-medium hover:underline">View All</Link>
          </div>
          {/* Show only top 4 recent transactions on dashboard */}
          <ExpenseList expenses={expenses.slice(0, 4)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
