// components/ErrorBoundary.jsx
import { Component } from 'react';
import { Typography } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Typography variant="h6" color="error" style={{ padding: '2rem' }}>
          Something went wrong. Please try again later.
        </Typography>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;