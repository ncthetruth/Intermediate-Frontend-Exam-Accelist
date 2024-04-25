import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Radio } from 'antd';
import { useRouter } from 'next/router';
import PopupContent from './PopupContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface RegisterFormProps {
  onRegisterError: (errorMessage: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterError }) => {
  const router = useRouter();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/be/api/v1/Auth/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        setRedirectToHome(true);
      }, 5000);
      form.resetFields();
    } catch (error) {
      console.error('Registration failed:', error);
      onRegisterError('Failed to register. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const disabledDate = (current: any) => {
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
    return current && current > minAgeDate;
  };

  const handleBack = () => {
    router.push('/');
  };

  if (redirectToHome) {
    router.push('/');
  }

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className=" mx-auto mt-4 p-8 bg-white rounded shadow-md"
        requiredMark="optional"
      >
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please input a valid email' }]}
          help="We'll never share your email with anyone else."
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Tanggal lahir"
          name="dateOfBirth"
          rules={[{ required: true, message: 'Please select your birthdate' }]}
          help="You must be at least 14 years old to register."
        >
          <DatePicker className="w-full" disabledDate={disabledDate} placeholder="Select your birthdate" />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please select your gender' }]}
        >
          <Radio.Group>
            <Radio value="M">Laki-laki</Radio>
            <Radio value="F">Perempuan</Radio>
            <Radio value="Other">Other</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input your address' }]}
        >
          <Input.TextArea maxLength={255} placeholder="Enter your address" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Please input your username' },
            { max: 20, message: 'Username must be at most 20 characters' },
          ]}
          help="Username must be unique and at most 20 characters."
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password' },
            { min: 8, max: 64, message: 'Password must be between 8 and 64 characters' },
          ]}
          help="Password must be at least 8 characters long."
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="w-full bg-blue-400">
            Register
          </Button>
        </Form.Item>
        <p className="text-sm font-light text-gray-800 dark:text-gray-600">Already have an account? 
        <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a></p>

      </Form>

      <PopupContent
        show={showSuccessPopup}
        message="Registration successful"
        warningMessage="Success"
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};

export default RegisterForm;
