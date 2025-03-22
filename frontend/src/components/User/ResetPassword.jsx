import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  // const { token } = useParams();
  // const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // try {
    //   // const response = await axios.put(
    //   //   `http://localhost:4000/api/v1/password/reset/${token}`,
    //   //   { password: newPassword }
    //   );
    //   setSuccess(true);
    //   setError('');
    //   navigate('/login'); // Redirect to login page after successful reset
    // } catch (err) {
    //   setError(err.response?.data?.message || 'Failed to reset password');
    // }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Password reset successfully!</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;