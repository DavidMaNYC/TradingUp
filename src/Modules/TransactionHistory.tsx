import TransactionList from "../Components/TransactionList";

interface ITransactionHistory {
  transactions: any[];
}

const TransactionHistory = (props: ITransactionHistory) => {
  const { transactions } = props;

  return <TransactionList transactions={transactions} />;
};

export default TransactionHistory;
