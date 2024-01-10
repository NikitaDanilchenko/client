import React, { useState } from 'react'
import { Layout } from '../../components/Layout'
import { Card, Form, Row, Space, Typography } from 'antd'
import { CustomInput } from '../../components/custom-input'
import { PasswordInput } from '../../components/password-input/input'
import { CustomButton } from '../../components/custom-button'
import { Link, useNavigate } from 'react-router-dom'
import { Paths } from '../../paths'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/auth/authSlice'
import { useRegisterMutation } from '../../app/services/auth'
import { User } from '@prisma/client'
import { isErrorWithMessage } from '../../utils/is-error-with-message'
import { ErrorMessage } from '../../components/errorMessage'


type RegisterData = Omit<User, 'id'> & {confirmPassword: string}

export const Register = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [error, setError] = useState('');
  const [registerUser] = useRegisterMutation();

  const register = async (data: RegisterData) => {

    try {
      await registerUser(data).unwrap();

      navigate('/');
    } catch (err) {
      const maybyError = isErrorWithMessage(err);

      if(maybyError) {
        setError(err.data.message);
      } else {
        setError('Неизвестная ошибка');
      }
    }
  }
  return (
    <Layout>
       <Row align='middle' justify='center'>
        <Card title='Зарегистрируйтесь' style={{width: '30rem'}}>
          <Form onFinish={register}>
            <CustomInput
            name='name' 
            placeholder='Имя'
            />
            <CustomInput
            type='email'
            name='email' 
            placeholder='Email'
            />
            <PasswordInput
            name='password'
            placeholder='Пароль'
            />
            <PasswordInput
            name='confirmPassword'
            placeholder='Повторите пароль'
            />
            <CustomButton
            type='primary'
            htmlType='submit'
            >
              Зарегистрироваться
            </CustomButton>
          </Form>
          <Space direction='vertical' size='large'>
            <Typography.Text>
             Уже зарегистрированы? <Link to={Paths.login}>Войдите</Link>
            </Typography.Text>
            <ErrorMessage message={error}/>
          </Space>
        </Card>
       </Row>
    </Layout>
  )
}
