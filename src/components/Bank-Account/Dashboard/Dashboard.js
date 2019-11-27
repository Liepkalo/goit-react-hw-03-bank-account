import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import Controls from '../Controls/Controls';
import Balance from '../Balance/Balance';
import TransactionHistory from '../TransactionHistory/TransactionHistory';
import styles from '../../../stylesBank.css';

export default class Dashboard extends Component {
  static propTypes = {
    inputTransactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
      }).isRequired,
    ),
  };

  static defaultProps = {
    inputTransactions: [],
  };

  state = {
    history: this.props.inputTransactions,
    balance: 0,
  };

  componentDidMount() {
    const inputItem = localStorage.getItem('transactions');
    if (inputItem !== null) {
      const item = JSON.parse(inputItem);
      this.setState({ ...item });
    }
  }

  componentDidUpdate(prevProp, prevState) {
    const { history } = this.state;
    if (prevState.history !== history) {
      localStorage.setItem('transactions', JSON.stringify(this.state));
    }
  }

  infoErrorInput = () => alert('Введите сумму для проведения операции!');

  infoErrorBalance = () =>
    alert('На счету недостаточно средств для проведения операции!');

  TotalFunds = () => {
    return this.state.history.reduce(
      (acc, transaction) => {
        return {
          ...acc,
          [transaction.type]: acc[transaction.type] + transaction.amount,
        };
      },
      {
        deposit: 0,
        withdraw: 0,
      },
    );
  };

  onClickButtonDeposit = amount => {
    const transaction = {
      id: shortid.generate(),
      type: 'deposit',
      amount: Number(amount),
      date: new Date().toLocaleString(),
    };
    if (amount === 0 || '') {
      this.infoErrorInput();
    } else if (amount > 0) {
      this.setState(state => ({
        history: [...state.history, transaction],
      }));

      this.setState(prevState => ({
        balance: Number(prevState.balance) + Number(amount),
      }));
    }
  };

  onClickButtonWithdraw = amount => {
    const transaction = {
      id: shortid.generate(),
      type: 'withdraw',
      amount: Number(amount),
      date: new Date().toLocaleString(),
    };
    if (amount > this.state.balance) {
      this.infoErrorBalance();
    } else if (amount === 0 || '') {
      this.infoErrorInput();
    } else if (amount > 0 && amount <= this.state.balance) {
      this.setState(prevState => ({
        balance: prevState.balance - amount,
      }));
      this.setState(state => ({
        history: [...state.history, transaction],
      }));
    }
  };

  render() {
    const { history, balance } = this.state;
    const funds = this.TotalFunds();

    return (
      <div className={styles.dashboard}>
        <Controls
          onClickDeposit={this.onClickButtonDeposit}
          onClickWithdraw={this.onClickButtonWithdraw}
        />{' '}
        <Balance
          balance={balance}
          income={funds.deposit}
          expense={funds.withdraw}
        />{' '}
        <TransactionHistory transactions={history} />{' '}
      </div>
    );
  }
}
