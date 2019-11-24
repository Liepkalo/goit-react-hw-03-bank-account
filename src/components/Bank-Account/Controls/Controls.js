import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Controls.module.css';

export default class Controls extends Component {
  static propTypes = {
    onClickDeposit: PropTypes.func.isRequired,
    onClickWithdraw: PropTypes.func.isRequired,
  };

  state = {
    value: '',
  };

  handleChange = event => {
    this.setState({
      value: event.target.value,
    });
  };

  handleClickDeposit = () => {
    const value = Number(this.state.value);
    this.props.onClickDeposit(value);

    this.setState({
      value: '',
    });
  };

  handleClickWithdraw = () => {
    const value = Number(this.state.value);
    this.props.onClickWithdraw(value);

    this.setState({
      value: '',
    });
  };

  render() {
    const { value } = this.state;
    return (
      <section className={styles.controls}>
        <input
          type="number"
          className={styles.input}
          onChange={this.handleChange}
          value={value}
          placeholder="Enter amount ..."
        />
        <button
          type="button"
          className={styles.button}
          onClick={this.handleClickDeposit}
        >
          Deposit{' '}
        </button>{' '}
        <button
          type="button"
          className={styles.button}
          onClick={this.handleClickWithdraw}
        >
          Withdraw{' '}
        </button>{' '}
      </section>
    );
  }
}
