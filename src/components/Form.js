import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { fetchCoins, expenseAction } from '../actions';
import Input from './Input';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.inputSelect = this.inputSelect.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  componentDidMount() {
    const { requestCoinsToState } = this.props;
    requestCoinsToState();
    this.renderTable();
  }

  handleClick() {
    const { addDispense, requestCoinsToState } = this.props;
    requestCoinsToState();
    addDispense(this.state);
    this.setState((prevState) => ({
      id: prevState.id + 1,
    }));
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      [name]: value,
    });
  }

  inputSelect() {
    const { method, tag } = this.state;
    return (
      <div>
        <label htmlFor="method">
          Método de pagamento:
          <select
            id="method"
            name="method"
            value={ method }
            onChange={ this.handleChange }
          >
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de crédito">Cartão de crédito</option>
            <option value="Cartão de débito">Cartão de débito</option>
          </select>
        </label>
        <label htmlFor="tag">
          Tag:
          <select id="tag" name="tag" value={ tag } onChange={ this.handleChange }>
            <option value="Alimentação">Alimentação</option>
            <option value="Lazer">Lazer</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Transporte">Transporte</option>
            <option value="Saúde">Saúde</option>
          </select>
        </label>
      </div>
    );
  }

  renderTable() {
    const { player } = this.props;
    return (
      <table>
        <tr>
          <th>Descrição</th>
          <th>Tag</th>
          <th>Método de pagamento</th>
          <th>Valor</th>
          <th>Moeda</th>
          <th>Câmbio utilizado</th>
          <th>Valor convertido</th>
          <th>Moeda de conversão</th>
          <th>Editar/Excluir</th>
        </tr>
      </table>
    );
  }

  render() {
    const { coins } = this.props;
    const { value, description, currency } = this.state;
    return (
      <div>
        <form>
          <Input
            type="text"
            id="value"
            name="value"
            placeHolder="Valor:"
            value={ value }
            handleChange={ this.handleChange }
          />
          <Input
            type="text"
            id="description"
            name="description"
            placeHolder="Descrição:"
            value={ description }
            handleChange={ this.handleChange }
          />
          <label htmlFor="currency">
            Moeda:
            <select
              id="currency"
              name="currency"
              value={ currency }
              onChange={ this.handleChange }
            >
              {coins.length > 0 ? coins.map((coin, index) => (
                <option key={ index }>{coin}</option>
              )) : null}
            </select>
          </label>
          {this.inputSelect()}
          <button type="button" onClick={ this.handleClick }>
            Adicionar despesa
          </button>
        </form>
        { this.renderTable() }
      </div>
    );
  }
}

Form.propTypes = {
  addDispense: PropTypes.func.isRequired,
  requestCoinsToState: PropTypes.func.isRequired,
  coins: PropTypes.arrayOf().isRequired,
  player: PropTypes.arrayOf().isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  addDispense: (state) => dispatch(expenseAction(state)),
  requestCoinsToState: () => dispatch(fetchCoins()),
});

const mapStateToProps = (state) => ({
  coins: state.wallet.currencies,
  player: state.wallet.expenses,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);
