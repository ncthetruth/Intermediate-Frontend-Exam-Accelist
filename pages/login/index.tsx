import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useRouter } from 'next/router';
import { signOut, signIn, useSession } from 'next-auth/react';
import nProgress from 'nprogress';

const Login: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  if (session) {
    router.push('/');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/be/api/v1/Auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password, 
          phone:0,
        })
      });
  
      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleOidcSignIn = () => {
    setLoading(true);
    nProgress.start();
    signIn('oidc');
  };

  return (
    <div className="bg-gray-100 w-full h-screen flex justify-center items-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <Form.Item
            label="Email/User"
            name="email"
            rules={[{ required: true, message: 'Please input your email' }]}
          >
            <Input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input.Password className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center">
              Sign In
            </Button>
          </Form.Item>
        </Form>
        <div className="mt-4">
          <Button onClick={handleOidcSignIn} className="bg-blue-500 text-white hover:bg-blue-800 hover:text-white font-semibold focus:outline-none">
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
