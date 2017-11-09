import Layout from '../components/layout';
import styledComponent from 'styled-components';
const styled = styledComponent;

const Login = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  transition: 0.3s all ease;
`;
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  width: 100%;
`;
const LoginStatus = styled.div`
  text-align: center;
  font-size: 13px;
  color: #ea8282;
  margin-bottom: 5px;
`;
const Input = styled.input`
  border: 1px solid #c9cccf;
  border-radius: 5px;
`;
const LoginInput = Input.extend`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  text-transform: lowercase;
`;
const Button = styled.button`
  cursor: pointer;
  border-radius: 5px;
  font-size: 18px;
  letter-spacing: -0.49px;
  border: none;
  padding: 10px;
`;
const ButtonPrimary = Button.extend`
  background: #1db379;
  color: #fbfbfa;
  min-width: 200px;
  :hover {
    box-shadow: 0px 1px 0px 0px #0e714b;
  }
`;

export default () => (
  <Layout>
    <div className="bg">
      <Login>
        <LoginForm method="POST" action="/login" id="login">
          <LoginStatus />
          <LoginInput
            id="username"
            type="text"
            name="name"
            placeholder="Имя пользователя"
          />
          <LoginInput
            id="password"
            type="password"
            name="password"
            placeholder="Пароль"
          />
          <ButtonPrimary type="submit">Войти</ButtonPrimary>
        </LoginForm>
      </Login>
      <div className="parrots parrots_login">
        <span>Уже отправлено</span>
        <span className="parrots__count" />
        <span className="parrots__word">шт.</span>
      </div>
      <div className="donate-text">
        <a href="/donate">Поддержать проект</a>
      </div>
    </div>
  </Layout>
);
